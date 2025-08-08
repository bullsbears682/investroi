const rateBuckets = new Map();
const WINDOW_MS = 60 * 1000;
const LIMIT_PER_WINDOW = 60;

const keyStore = require('./_keyStore.js');

function getClientIp(event) {
  const headers = event.headers || {};
  return (
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'] ||
    'unknown'
  );
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...(extraHeaders || {}) },
    body: JSON.stringify(body),
  };
}

function methodNotAllowed() {
  return json(405, { success: false, error: 'Method Not Allowed' });
}

function badRequest(message) {
  return json(400, { success: false, error: message || 'Bad Request' });
}

function unauthorized(message) {
  return json(401, { success: false, error: message || 'Unauthorized' });
}

function tooMany(remaining) {
  return json(429, { success: false, error: 'Rate limit exceeded' }, remaining != null ? { 'X-RateLimit-Remaining': String(remaining) } : undefined);
}

function ok(data, remaining) {
  return json(200, { success: true, data }, remaining != null ? { 'X-RateLimit-Remaining': String(remaining) } : undefined);
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
}

function extractApiKey(event) {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1];
  }
  return null;
}

async function validateAndRateLimit(event, defaultLimit = LIMIT_PER_WINDOW) {
  const key = extractApiKey(event);

  // Demo mode: no key provided, allow but apply IP-based limit
  if (!key) {
    const ip = getClientIp(event);
    const now = Date.now();
    const bucket = rateBuckets.get(ip) || [];
    const fresh = bucket.filter((ts) => now - ts < WINDOW_MS);
    if (fresh.length >= defaultLimit) return { ok: false, status: 429, remaining: 0 };
    fresh.push(now);
    rateBuckets.set(ip, fresh);
    return { ok: true, mode: 'demo', remaining: defaultLimit - fresh.length };
  }

  // With key: validate against store; if missing in store, accept iw_ prefix in demo mode
  const record = await keyStore.getKeyRecord(key);
  if (!record) {
    if (!/^iw_/.test(key)) return { ok: false, status: 401 };
    // treat as demo key
    const rl = await keyStore.rateLimitCheckAndIncr(key, defaultLimit);
    if (!rl.allowed) return { ok: false, status: 429, remaining: rl.remaining };
    await keyStore.incrementUsage(key);
    return { ok: true, mode: 'demo-key', remaining: rl.remaining };
  }

  if (record.active === false) return { ok: false, status: 401 };
  const perMinute = typeof record.limitPerMinute === 'number' ? record.limitPerMinute : defaultLimit;
  const rl = await keyStore.rateLimitCheckAndIncr(key, perMinute);
  if (!rl.allowed) return { ok: false, status: 429, remaining: rl.remaining };
  await keyStore.incrementUsage(key);
  return { ok: true, mode: 'key', remaining: rl.remaining };
}

exports.utils = {
  ok,
  badRequest,
  unauthorized,
  tooMany,
  methodNotAllowed,
  parseBody,
  extractApiKey,
  validateAndRateLimit,
  corsHeaders,
};