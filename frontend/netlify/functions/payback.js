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
  const cashFlows = Array.isArray(body.cashFlows) ? body.cashFlows.map(Number) : [];

  if (initialInvestment <= 0) return utils.badRequest('initialInvestment must be > 0');
  if (!cashFlows.length) return utils.badRequest('cashFlows must be a non-empty array');
  if (!cashFlows.every((x) => Number.isFinite(x))) return utils.badRequest('cashFlows must be numbers');

  let cumulative = 0;
  let periodReached = -1;
  for (let t = 0; t < cashFlows.length; t++) {
    cumulative += cashFlows[t];
    if (cumulative >= initialInvestment) {
      periodReached = t + 1; // periods start at 1
      break;
    }
  }

  if (periodReached === -1) {
    return utils.ok({
      paybackPeriodYears: null,
      fullyRecovered: false,
      inputs: { initialInvestment, cashFlows },
      meta: { authMode: auth.mode, function: 'payback', servedBy: 'netlify' },
    });
  }

  const prevCumulative = cumulative - cashFlows[periodReached - 1];
  const remaining = initialInvestment - prevCumulative;
  const fraction = cashFlows[periodReached - 1] > 0 ? remaining / cashFlows[periodReached - 1] : 0;
  const paybackPeriodYears = Math.round((periodReached - 1 + fraction) * 1000) / 1000;

  return utils.ok({
    paybackPeriodYears,
    fullyRecovered: true,
    inputs: { initialInvestment, cashFlows },
    meta: { authMode: auth.mode, function: 'payback', servedBy: 'netlify' },
  });
};