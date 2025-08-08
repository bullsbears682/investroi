const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const MEM = {
  keys: new Map(), // apiKey -> { active, name, created, limitPerMinute }
  keyIndex: new Set(),
  usageTotal: new Map(), // apiKey -> number
  rateBuckets: new Map(), // apiKey+window -> count
};

const KEY_INDEX = 'api:keys:index';

async function upstashFetch(path, method = 'GET', body) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstash error ${res.status}: ${text}`);
  }
  return res.json();
}

async function getKeyRecord(apiKey) {
  if (hasUpstash) {
    const key = `api:keys:${apiKey}`;
    const r = await upstashFetch(`/get/${encodeURIComponent(key)}`);
    if (!r || r.result == null) return null;
    try {
      return JSON.parse(r.result);
    } catch {
      return null;
    }
  }
  return MEM.keys.get(apiKey) || null;
}

async function putKeyRecord(apiKey, record) {
  if (hasUpstash) {
    const key = `api:keys:${apiKey}`;
    await upstashFetch('/set', 'POST', { key, value: JSON.stringify(record) });
    await upstashFetch(`/sadd/${encodeURIComponent(KEY_INDEX)}/${encodeURIComponent(apiKey)}`);
    return true;
  }
  MEM.keys.set(apiKey, record);
  MEM.keyIndex.add(apiKey);
  return true;
}

async function deleteKeyRecord(apiKey) {
  if (hasUpstash) {
    const key = `api:keys:${apiKey}`;
    await upstashFetch(`/del/${encodeURIComponent(key)}`);
    await upstashFetch('/srem', 'POST', { key: KEY_INDEX, member: apiKey });
    return true;
  }
  MEM.keys.delete(apiKey);
  MEM.keyIndex.delete(apiKey);
  return true;
}

async function listKeys() {
  if (hasUpstash) {
    const r = await upstashFetch(`/smembers/${encodeURIComponent(KEY_INDEX)}`);
    const keys = Array.isArray(r.result) ? r.result : [];
    const out = [];
    for (const apiKey of keys) {
      const rec = await getKeyRecord(apiKey);
      if (rec) out.push({ apiKey, ...rec });
    }
    return out;
  }
  return Array.from(MEM.keyIndex).map((apiKey) => ({ apiKey, ...(MEM.keys.get(apiKey) || {}) }));
}

async function incrementUsage(apiKey) {
  if (hasUpstash) {
    const key = `api:usage_total:${apiKey}`;
    await upstashFetch(`/incr/${encodeURIComponent(key)}`);
    return true;
  }
  MEM.usageTotal.set(apiKey, (MEM.usageTotal.get(apiKey) || 0) + 1);
  return true;
}

async function rateLimitCheckAndIncr(apiKey, limitPerMinute) {
  const now = Date.now();
  const windowId = Math.floor(now / 60000); // minute window
  if (hasUpstash) {
    const key = `api:rate:${apiKey}:${windowId}`;
    const r = await upstashFetch(`/incr/${encodeURIComponent(key)}`);
    const count = Number(r.result || 0);
    if (count === 1) {
      // set TTL to 60s
      await upstashFetch(`/expire/${encodeURIComponent(key)}/60`);
    }
    return { allowed: count <= limitPerMinute, remaining: Math.max(0, limitPerMinute - count) };
  }
  const memKey = `${apiKey}:${windowId}`;
  const count = (MEM.rateBuckets.get(memKey) || 0) + 1;
  MEM.rateBuckets.set(memKey, count);
  return { allowed: count <= limitPerMinute, remaining: Math.max(0, limitPerMinute - count) };
}

module.exports = {
  getKeyRecord,
  putKeyRecord,
  deleteKeyRecord,
  listKeys,
  incrementUsage,
  rateLimitCheckAndIncr,
  hasUpstash,
};