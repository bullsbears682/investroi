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
  const additionalCosts = Number(body.additionalCosts || 0);
  const countryCode = (body.countryCode || 'US').toString();

  if (initialInvestment < 0 || additionalCosts < 0) {
    return utils.badRequest('Values must be non-negative');
  }

  // Simple ROI demo: assume 25% return on initial investment
  const returns = Math.round(initialInvestment * 0.25);
  const totalValue = Math.round(initialInvestment + additionalCosts + returns);
  const roi = 25.0;

  return utils.ok({
    totalValue,
    roi,
    breakdown: {
      initialInvestment,
      additionalCosts,
      returns,
    },
    meta: {
      countryCode,
      authMode: auth.mode,
      function: 'roi',
      servedBy: 'netlify',
    },
  });
};