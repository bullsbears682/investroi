const { utils } = require('./_utils.js');
const store = require('./_keyStore.js');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: utils.corsHeaders() };

  // Basic auth: require an existing key (any) to manage keys; in demo accept no key
  const auth = await utils.validateAndRateLimit(event, 600);
  if (!auth.ok) {
    if (auth.status === 401) return utils.unauthorized('Invalid API key');
    if (auth.status === 429) return utils.tooMany(auth.remaining);
    return utils.unauthorized('Unauthorized');
  }

  const path = event.path || '';
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];

  if (event.httpMethod === 'GET') {
    const list = await store.listKeys();
    return utils.ok(list, auth.remaining);
  }

  if (event.httpMethod === 'POST') {
    const body = utils.parseBody(event);
    if (!body) return utils.badRequest('Invalid JSON');
    const apiKey = body.apiKey || `iw_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    const record = {
      active: true,
      name: body.name || 'API Key',
      created: Date.now(),
      limitPerMinute: typeof body.limitPerMinute === 'number' ? body.limitPerMinute : 120,
    };
    await store.putKeyRecord(apiKey, record);
    return utils.ok({ apiKey, ...record }, auth.remaining);
  }

  if (event.httpMethod === 'DELETE') {
    // DELETE /.netlify/functions/keys/:apiKey
    const apiKey = segments[segments.length - 1] !== 'keys' ? decodeURIComponent(last) : null;
    if (!apiKey) return utils.badRequest('Missing apiKey');
    await store.deleteKeyRecord(apiKey);
    return utils.ok({ deleted: true, apiKey }, auth.remaining);
  }

  return utils.methodNotAllowed();
};