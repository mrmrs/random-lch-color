'use strict';

module.exports = function randomLCHColor(
  minL = 0, maxL = 100,
  minC = 0, maxC = 132,
  minH = 0, maxH = 360,
  minAlpha, maxAlpha,
  useObjectExport = false
) {
  const includeAlpha = minAlpha !== undefined || maxAlpha !== undefined;
  const alphaLow = minAlpha ?? 0;
  const alphaHigh = maxAlpha ?? 1;

  validateRange('lightness', minL, maxL);
  validateRange('chroma', minC, maxC);
  validateRange('hue', minH, maxH);
  if (includeAlpha) validateRange('alpha', alphaLow, alphaHigh);

  const lightness = pickAtPrecision(minL, maxL);
  const chroma = pickAtPrecision(minC, maxC);
  const hue = pickAtPrecision(minH, maxH);
  const alpha = includeAlpha ? pickTwoDecimal(alphaLow, alphaHigh) : null;

  if (useObjectExport) {
    const result = { lightness, chroma, hue };
    if (includeAlpha) result.alpha = alpha;
    return result;
  }

  const lStr = formatPercentOrNumber(lightness, minL, maxL);
  const cStr = formatPlainNumber(chroma);
  const hStr = formatPlainNumber(hue);

  if (!includeAlpha) {
    return `lch(${lStr} ${cStr} ${hStr})`;
  }
  const alphaStr = formatPercentOrNumber(alpha, alphaLow, alphaHigh);
  return `lch(${lStr} ${cStr} ${hStr} / ${alphaStr})`;
};

function pickAtPrecision(min, max) {
  if (Number.isInteger(min) && Number.isInteger(max)) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return pickTwoDecimal(min, max);
}

function pickTwoDecimal(min, max) {
  const minBucket = Math.round(min * 100);
  const maxBucket = Math.round(max * 100);
  const bucket = Math.floor(Math.random() * (maxBucket - minBucket + 1)) + minBucket;
  return bucket / 100;
}

function formatPercentOrNumber(value, min, max) {
  if (min > 1 || max > 1) {
    if (Number.isInteger(value)) {
      return `${value}%`;
    }
    return `${value.toFixed(2)}%`;
  }
  return value.toFixed(2);
}

function formatPlainNumber(value) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

function validateRange(channel, min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError(`${channel} range must use finite numbers`);
  }
  if (min > max) {
    throw new RangeError(`${channel} minimum must be less than or equal to maximum`);
  }
}
