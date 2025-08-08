const { utils } = require('./_utils.js');

function npv(rate, initialInvestment, cashFlows) {
  let value = -initialInvestment;
  for (let t = 1; t <= cashFlows.length; t++) {
    value += cashFlows[t - 1] / Math.pow(1 + rate, t);
  }
  return value;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: utils.corsHeaders() };
  }
  if (event.httpMethod !== 'POST') return utils.methodNotAllowed();
  const auth = await utils.validateAndRateLimit(event);
  if (!auth.ok) {
    if (auth.status === 401) return utils.unauthorized('Invalid API key');
    if (auth.status === 429) return utils.tooMany(auth.remaining);
    return utils.unauthorized('Unauthorized');
  }

  const body = utils.parseBody(event);
  if (!body) return utils.badRequest('Invalid JSON');

  const initialInvestment = Number(body.initialInvestment || 0);
  const cashFlows = Array.isArray(body.cashFlows) ? body.cashFlows.map(Number) : [];

  if (initialInvestment <= 0) return utils.badRequest('initialInvestment must be > 0');
  if (!cashFlows.length) return utils.badRequest('cashFlows must be a non-empty array');
  if (!cashFlows.every((x) => Number.isFinite(x))) return utils.badRequest('cashFlows must be numbers');

  // Bisection method for IRR in range (-0.99, 10)
  let low = -0.99;
  let high = 10;
  let fLow = npv(low, initialInvestment, cashFlows);
  let fHigh = npv(high, initialInvestment, cashFlows);

  if (isNaN(fLow) || isNaN(fHigh)) return utils.badRequest('Invalid inputs produced NaN');
  if (fLow * fHigh > 0) {
    return utils.badRequest('IRR cannot be determined (no sign change in NPV over search range)');
  }

  let irr = null;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const fMid = npv(mid, initialInvestment, cashFlows);
    if (Math.abs(fMid) < 1e-8) {
      irr = mid;
      break;
    }
    if (fLow * fMid < 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }
  if (irr === null) irr = (low + high) / 2;

  return utils.ok({
    irr: Math.round(irr * 100000) / 100000,
    inputs: { initialInvestment, cashFlows },
    meta: { authMode: auth.mode, function: 'irr', servedBy: 'netlify' },
  }, auth.remaining);
};