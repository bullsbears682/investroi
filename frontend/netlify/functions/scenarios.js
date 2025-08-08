const { utils } = require('./_utils.js');
const store = require('./_scenarioStore.js');

function validateScenarioBody(body) {
  if (!body || typeof body !== 'object') return 'Invalid JSON';
  if (!body.name || typeof body.name !== 'string') return 'name is required';
  if (typeof body.parameters !== 'object' || body.parameters == null) return 'parameters object is required';
  return null;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: utils.corsHeaders() };
  }

  // Auth + per-key rate limit
  const auth = await utils.validateAndRateLimit(event);
  if (!auth.ok) {
    if (auth.status === 401) return utils.unauthorized('Invalid API key');
    if (auth.status === 429) return utils.tooMany(auth.remaining);
    return utils.unauthorized('Unauthorized');
  }

  const path = event.path || '';
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1];

  try {
    if (event.httpMethod === 'GET') {
      // GET /.netlify/functions/scenarios or /.netlify/functions/scenarios/:id
      const id = segments[segments.length - 1] !== 'scenarios' ? last : null;
      if (id) {
        const s = await store.getScenario(id);
        if (!s) return utils.badRequest('Not found');
        return utils.ok(s, auth.remaining);
      }
      const list = await store.listScenarios();
      return utils.ok(list, auth.remaining);
    }

    if (event.httpMethod === 'POST') {
      // Create
      const body = utils.parseBody(event);
      const err = validateScenarioBody(body);
      if (err) return utils.badRequest(err);
      const id = body.id || `sc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const record = { id, name: body.name, parameters: body.parameters, createdAt: Date.now(), updatedAt: Date.now() };
      await store.saveScenario(record);
      return utils.ok(record, auth.remaining);
    }

    if (event.httpMethod === 'PUT') {
      // Update /.netlify/functions/scenarios/:id
      const id = segments[segments.length - 1] !== 'scenarios' ? last : null;
      if (!id) return utils.badRequest('Missing id');
      const existing = await store.getScenario(id);
      if (!existing) return utils.badRequest('Not found');
      const body = utils.parseBody(event);
      if (!body) return utils.badRequest('Invalid JSON');
      const updated = {
        ...existing,
        ...(body.name ? { name: body.name } : {}),
        ...(body.parameters ? { parameters: body.parameters } : {}),
        updatedAt: Date.now(),
      };
      await store.saveScenario(updated);
      return utils.ok(updated, auth.remaining);
    }

    if (event.httpMethod === 'DELETE') {
      // Delete /.netlify/functions/scenarios/:id
      const id = segments[segments.length - 1] !== 'scenarios' ? last : null;
      if (!id) return utils.badRequest('Missing id');
      await store.deleteScenario(id);
      return utils.ok({ deleted: true, id }, auth.remaining);
    }

    return utils.methodNotAllowed();
  } catch (e) {
    return utils.badRequest(e.message || 'Error processing request');
  }
};