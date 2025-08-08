const { utils } = require('./_utils.js');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: utils.corsHeaders() };
  }
  if (event.httpMethod !== 'POST') return utils.methodNotAllowed();
  if (!utils.allowRate(event)) return utils.tooMany();

  const key = utils.extractApiKey(event);
  const auth = utils.validateApiKeyOrAllowDemo(key);
  if (!auth.ok) return utils.unauthorized('Invalid API key');

  const body = utils.parseBody(event);
  if (!body) return utils.badRequest('Invalid JSON');

  const beginningValue = Number(body.beginningValue || 0);
  const endingValue = Number(body.endingValue || 0);
  const years = Number(body.years || 1);

  if (beginningValue <= 0 || endingValue <= 0 || years <= 0) {
    return utils.badRequest('beginningValue, endingValue, and years must be > 0');
  }

  const cagr = Math.pow(endingValue / beginningValue, 1 / years) - 1;

  return utils.ok({
    cagr: Math.round(cagr * 10000) / 10000,
    inputs: { beginningValue, endingValue, years },
    meta: { authMode: auth.mode, function: 'cagr', servedBy: 'netlify' },
  });
};