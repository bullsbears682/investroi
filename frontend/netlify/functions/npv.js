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

  const initialInvestment = Number(body.initialInvestment || 0);
  const discountRate = Number(body.discountRate || 0);
  const cashFlows = Array.isArray(body.cashFlows) ? body.cashFlows.map(Number) : [];

  if (initialInvestment < 0) return utils.badRequest('initialInvestment must be >= 0');
  if (!Number.isFinite(discountRate) || discountRate <= -1) return utils.badRequest('discountRate must be > -1');
  if (!cashFlows.every((x) => Number.isFinite(x))) return utils.badRequest('cashFlows must be numbers');

  let npv = -initialInvestment;
  for (let t = 1; t <= cashFlows.length; t++) {
    npv += cashFlows[t - 1] / Math.pow(1 + discountRate, t);
  }

  return utils.ok({
    npv: Math.round(npv * 100) / 100,
    inputs: { initialInvestment, discountRate, cashFlows },
    meta: { authMode: auth.mode, function: 'npv', servedBy: 'netlify' },
  });
};