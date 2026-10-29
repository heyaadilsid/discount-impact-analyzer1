// Financial Calculation Engine

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const CURRENCY_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095
};

export function formatCurrency(amount, currency = 'INR', showSign = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return '—';
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  
  // Format with thousands separator
  const formatted = absVal.toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

  if (isNegative) {
    return `- ${symbol}${formatted}`;
  }
  if (showSign && amount > 0) {
    return `+ ${symbol}${formatted}`;
  }
  return `${symbol}${formatted}`;
}

export function formatPercent(value, showSign = false, digits = 1) {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  const num = Number(value);
  const formatted = Math.abs(num).toFixed(digits);
  if (num < 0) {
    return `-${formatted}%`;
  }
  if (showSign && num > 0) {
    return `+${formatted}%`;
  }
  return `${formatted}%`;
}

// Calculate complete financial ledger
export function calculateAnalysis({
  basePrice = 1000,
  cost = 600,
  baseVolume = 100,
  discountPercent = 10,
  volumeUpliftPercent = 35
}) {
  const p0 = Number(basePrice) || 0;
  const c = Number(cost) || 0;
  const v0 = Number(baseVolume) || 0;
  const dPct = Number(discountPercent) || 0;
  const liftPct = Number(volumeUpliftPercent) || 0;

  // Baseline
  const baselineUnitMargin = p0 - c;
  const baselineMarginPercent = p0 > 0 ? (baselineUnitMargin / p0) * 100 : 0;
  const baselineGrossRevenue = p0 * v0;
  const baselineCOGS = c * v0;
  const baselineGrossProfit = baselineUnitMargin * v0;

  // Promo
  const promoUnitPrice = p0 * (1 - dPct / 100);
  const promoUnitMargin = promoUnitPrice - c;
  const promoMarginPercent = promoUnitPrice > 0 ? (promoUnitMargin / promoUnitPrice) * 100 : 0;
  const promoVolume = Math.round(v0 * (1 + liftPct / 100));
  const promoGrossRevenue = promoUnitPrice * promoVolume;
  const promoCOGS = c * promoVolume;
  const promoGrossProfit = promoUnitMargin * promoVolume;

  // Variances
  const priceDelta = promoUnitPrice - p0;
  const priceDeltaPct = p0 > 0 ? (priceDelta / p0) * 100 : 0;
  
  const unitMarginDelta = promoUnitMargin - baselineUnitMargin;
  const unitMarginDeltaPct = baselineUnitMargin > 0 ? (unitMarginDelta / baselineUnitMargin) * 100 : 0;

  const volumeDelta = promoVolume - v0;
  const volumeDeltaPct = liftPct;

  const revenueDelta = promoGrossRevenue - baselineGrossRevenue;
  const revenueDeltaPct = baselineGrossRevenue > 0 ? (revenueDelta / baselineGrossRevenue) * 100 : 0;

  const cogsDelta = promoCOGS - baselineCOGS;
  const cogsDeltaPct = baselineCOGS > 0 ? (cogsDelta / baselineCOGS) * 100 : 0;

  const grossProfitDelta = promoGrossProfit - baselineGrossProfit;
  const grossProfitDeltaPct = baselineGrossProfit > 0 ? (grossProfitDelta / baselineGrossProfit) * 100 : 0;

  const marginShiftPts = promoMarginPercent - baselineMarginPercent;

  // Break-even analysis
  // To keep baseline gross profit: promoUnitMargin * BreakEvenVolume = baselineGrossProfit
  let breakEvenVolume = 0;
  let requiredVolumeLiftPct = 0;
  let isMarginPositive = promoUnitMargin > 0;

  if (isMarginPositive) {
    breakEvenVolume = Math.ceil(baselineGrossProfit / promoUnitMargin);
    requiredVolumeLiftPct = v0 > 0 ? ((breakEvenVolume - v0) / v0) * 100 : 0;
  } else {
    breakEvenVolume = Infinity;
    requiredVolumeLiftPct = Infinity;
  }

  // Risk Classification
  let riskClassification = 'Sustainable';
  let riskBadgeType = 'sustainable';
  let riskDescription = 'Gross profit is protected or expanding under current modeled assumptions.';

  if (!isMarginPositive) {
    riskClassification = 'Floor Breached';
    riskBadgeType = 'alert';
    riskDescription = 'Selling price is lower than unit landed cost (COGS). Every unit loses money.';
  } else if (requiredVolumeLiftPct > 100 || promoVolume < breakEvenVolume * 0.7) {
    riskClassification = 'Margin Dilution Alert';
    riskBadgeType = 'alert';
    riskDescription = 'Requires unrealistic volume expansion (>100% lift) to protect baseline profit.';
  } else if (promoVolume < breakEvenVolume) {
    riskClassification = 'High Lift Needed';
    riskBadgeType = 'warning';
    riskDescription = 'Modeled volume falls below break-even threshold. Profit will erode without greater lift.';
  }

  return {
    basePrice: p0,
    cost: c,
    baseVolume: v0,
    discountPercent: dPct,
    volumeUpliftPercent: liftPct,

    // Baseline
    baselineUnitMargin,
    baselineMarginPercent,
    baselineGrossRevenue,
    baselineCOGS,
    baselineGrossProfit,

    // Promo
    promoUnitPrice,
    promoUnitMargin,
    promoMarginPercent,
    promoVolume,
    promoGrossRevenue,
    promoCOGS,
    promoGrossProfit,

    // Variances
    priceDelta,
    priceDeltaPct,
    unitMarginDelta,
    unitMarginDeltaPct,
    volumeDelta,
    volumeDeltaPct,
    revenueDelta,
    revenueDeltaPct,
    cogsDelta,
    cogsDeltaPct,
    grossProfitDelta,
    grossProfitDeltaPct,
    marginShiftPts,

    // Break-even
    breakEvenVolume,
    requiredVolumeLiftPct,
    isMarginPositive,
    volumeBuffer: promoVolume - breakEvenVolume,

    // Risk
    riskClassification,
    riskBadgeType,
    riskDescription
  };
}
