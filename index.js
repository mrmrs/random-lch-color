'use strict';

module.exports = function randomLCHColor(minLightness = 0, maxLightness = 100, minChroma = 0, maxChroma = 132, minHue = 0, maxHue = 360, returnObject = false) {
  const lightness = Math.floor(Math.random() * (maxLightness - minLightness + 1)) + minLightness;
  const chroma = Math.floor(Math.random() * (maxChroma - minChroma + 1)) + minChroma;
  const hue = Math.floor(Math.random() * (maxHue - minHue + 1)) + minHue;

  const color = `lch(${lightness}% ${chroma} ${hue})`;

  if (returnObject) {
    return {
      format: 'lch',
      value: color,
      channels: {
        lightness,
        chroma,
        hue
      }
    };
  }

  return color;
};
