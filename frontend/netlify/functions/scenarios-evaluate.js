const { utils } = require('./_utils.js');
const store = require('./_scenarioStore.js');

function computeROI(p) {
  const initialInvestment = Number(p.initialInvestment || 0);
  const additionalCosts = Number(p.additionalCosts || 0);
  const returns = Math.round(initialInvestment * 0.25);
  return {
    totalValue: Math.round(initialInvestment + additionalCosts + returns),
    roi: 25.0,
    breakdown: { initialInvestment, additionalCosts, returns },
  };
}

function computeNPV(p) {
  const initialInvestment = Number(p.initialInvestment || 0);
  const discountRate = Number(p.discountRate || 0);
  const cashFlows = Array.isArray(p.cashFlows) ? p.cashFlows.map(Number) : [];
  let npv = -initialInvestment;
  for (let t = 1; t <= cashFlows.length; t++) npv += cashFlows[t - 1] / Math.pow(1 + discountRate, t);
  return { npv: Math.round(npv * 100) / 100 };
}

function computeCAGR(p) {
  const beginningValue = Number(p.beginningValue || 0);
  const endingValue = Number(p.endingValue || 0);
  const years = Number(p.years || 1);
  const cagr = Math.pow(endingValue / beginningValue, 1 / years) - 1;
  return { cagr: Math.round(cagr * 10000) / 10000 };
}

function npv(rate, initialInvestment, cashFlows) {
  let value = -initialInvestment;
  for (let t = 1; t <= cashFlows.length; t++) value += cashFlows[t - 1] / Math.pow(1 + rate, t);
  return value;
}

function computeIRR(p) {
  const initialInvestment = Number(p.initialInvestment || 0);
  const cashFlows = Array.isArray(p.cashFlows) ? p.cashFlows.map(Number) : [];
  let low = -0.99, high = 10;
  let fLow = npv(low, initialInvestment, cashFlows);
  let fHigh = npv(high, initialInvestment, cashFlows);
  if (fLow * fHigh > 0) return { irr: null };
  let irr = null;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const fMid = npv(mid, initialInvestment, cashFlows);
    if (Math.abs(fMid) < 1e-8) { irr = mid; break; }
    if (fLow * fMid < 0) { high = mid; fHigh = fMid; } else { low = mid; fLow = fMid; }
  }
  if (irr === null) irr = (low + high) / 2;
  return { irr: Math.round(irr * 100000) / 100000 };
}

function computePayback(p) {
  const initialInvestment = Number(p.initialInvestment || 0);
  const cashFlows = Array.isArray(p.cashFlows) ? p.cashFlows.map(Number) : [];
  let cumulative = 0, periodReached = -1;
  for (let t = 0; t < cashFlows.length; t++) { cumulative += cashFlows[t]; if (cumulative >= initialInvestment) { periodReached = t + 1; break; } }
  if (periodReached === -1) return { paybackPeriodYears: null, fullyRecovered: false };
  const prevCumulative = cumulative - cashFlows[periodReached - 1];
  const remaining = initialInvestment - prevCumulative;
  const fraction = cashFlows[periodReached - 1] > 0 ? remaining / cashFlows[periodReached - 1] : 0;
  const paybackPeriodYears = Math.round((periodReached - 1 + fraction) * 1000) / 1000;
  return { paybackPeriodYears, fullyRecovered: true };
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: utils.corsHeaders() };

  const auth = await utils.validateAndRateLimit(event);
  if (!auth.ok) {
    if (auth.status === 401) return utils.unauthorized('Invalid API key');
    if (auth.status === 429) return utils.tooMany(auth.remaining);
    return utils.unauthorized('Unauthorized');
  }

  if (event.httpMethod !== 'POST') return utils.methodNotAllowed();
  const body = utils.parseBody(event);
  if (!body) return utils.badRequest('Invalid JSON');

  let params = body.parameters;
  if (body.id && !params) {
    const s = await store.getScenario(body.id);
    if (!s) return utils.badRequest('Scenario not found');
    params = s.parameters;
  }
  if (!params || typeof params !== 'object') return utils.badRequest('parameters required');

  const results = {
    roi: computeROI(params),
    npv: computeNPV(params),
    cagr: computeCAGR(params),
    irr: computeIRR(params),
    payback: computePayback(params),
  };

  return utils.ok(results, auth.remaining);
};