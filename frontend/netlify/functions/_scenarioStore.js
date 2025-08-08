const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const MEM = {
  scenarios: new Map(), // id -> scenario
  order: [], // ids
};

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

const IDS_KEY = 'api:scenarios:ids';
function scenarioKey(id) { return `api:scenarios:${id}`; }

async function listScenarios() {
  if (hasUpstash) {
    const r = await upstashFetch(`/smembers/${encodeURIComponent(IDS_KEY)}`);
    const ids = Array.isArray(r.result) ? r.result : [];
    const items = [];
    for (const id of ids) {
      const got = await upstashFetch(`/get/${encodeURIComponent(scenarioKey(id))}`);
      if (got && got.result) {
        try { items.push(JSON.parse(got.result)); } catch {}
      }
    }
    return items;
  }
  return MEM.order.map((id) => MEM.scenarios.get(id)).filter(Boolean);
}

async function getScenario(id) {
  if (hasUpstash) {
    const got = await upstashFetch(`/get/${encodeURIComponent(scenarioKey(id))}`);
    if (!got || got.result == null) return null;
    try { return JSON.parse(got.result); } catch { return null; }
  }
  return MEM.scenarios.get(id) || null;
}

async function saveScenario(s) {
  if (hasUpstash) {
    await upstashFetch('/set', 'POST', { key: scenarioKey(s.id), value: JSON.stringify(s) });
    await upstashFetch(`/sadd/${encodeURIComponent(IDS_KEY)}/${encodeURIComponent(s.id)}`);
    return true;
  }
  if (!MEM.scenarios.has(s.id)) MEM.order.push(s.id);
  MEM.scenarios.set(s.id, s);
  return true;
}

async function deleteScenario(id) {
  if (hasUpstash) {
    await upstashFetch(`/del/${encodeURIComponent(scenarioKey(id))}`);
    // Upstash lacks SREM via GET path; use POST generic
    await upstashFetch('/srem', 'POST', { key: IDS_KEY, member: id });
    return true;
  }
  MEM.scenarios.delete(id);
  MEM.order = MEM.order.filter((x) => x !== id);
  return true;
}

module.exports = {
  listScenarios,
  getScenario,
  saveScenario,
  deleteScenario,
  hasUpstash,
};