const rateBuckets = new Map();
const WINDOW_MS = 60 * 1000;
const LIMIT_PER_WINDOW = 60;

function getClientIp(event) {
  const headers = event.headers || {};
  return (
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'] ||
    'unknown'
  );
}

function allowRate(event) {
  const ip = getClientIp(event);
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || [];
  const fresh = bucket.filter((ts) => now - ts < WINDOW_MS);
  if (fresh.length >= LIMIT_PER_WINDOW) return false;
  fresh.push(now);
  rateBuckets.set(ip, fresh);
  return true;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
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

function tooMany() {
  return json(429, { success: false, error: 'Rate limit exceeded' });
}

function ok(data) {
  return json(200, { success: true, data });
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

function validateApiKeyOrAllowDemo(key) {
  // For demo: accept if not provided; if provided, require iw_ prefix
  if (!key) return { ok: true, mode: 'demo' };
  if (/^iw_/.test(key)) return { ok: true, mode: 'key' };
  return { ok: false, mode: 'invalid' };
}

exports.utils = {
  allowRate,
  ok,
  badRequest,
  unauthorized,
  tooMany,
  methodNotAllowed,
  parseBody,
  extractApiKey,
  validateApiKeyOrAllowDemo,
  corsHeaders,
};