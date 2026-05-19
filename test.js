'use strict';

const test = require('ava').default;
const randomLCHColor = require('./');

test('returns a valid LCH color with integer channels by default', (t) => {
  for (let i = 0; i < 20; i++) {
    const color = randomLCHColor();
    t.regex(color, /^lch\(\d+% \d+ \d+\)$/);
  }
});

test.serial('honors integer ranges with max-inclusive sampling', (t) => {
  withRandomValues([0.9999, 0.9999, 0.9999], () => {
    t.is(randomLCHColor(0, 100, 0, 132, 0, 360), 'lch(100% 132 360)');
  });

  withRandomValues([0, 0, 0], () => {
    t.is(randomLCHColor(0, 100, 0, 132, 0, 360), 'lch(0% 0 0)');
  });
});

test.serial('omits alpha when no alpha range is supplied', (t) => {
  withRandomValues([0.5, 0.5, 0.5], () => {
    t.is(randomLCHColor(0, 100, 0, 132, 180, 180), 'lch(50% 66 180)');
  });

  withRandomValues([0.5, 0.5, 0.5, 0.5], () => {
    t.is(randomLCHColor(0, 100, 0, 132, 180, 180, 0, 1), 'lch(50% 66 180 / 0.50)');
  });
});

test('treats undefined alpha arguments as omission', (t) => {
  const result = randomLCHColor(0, 100, 0, 132, 0, 360, undefined, undefined);
  t.notRegex(result, / \/ /);
});

test('returns numeric channels when useObjectExport is true', (t) => {
  const color = randomLCHColor(0, 100, 0, 132, 0, 360, 0, 1, true);

  t.is(typeof color.lightness, 'number');
  t.is(typeof color.chroma, 'number');
  t.is(typeof color.hue, 'number');
  t.is(typeof color.alpha, 'number');
  t.true(color.lightness >= 0 && color.lightness <= 100);
  t.true(color.chroma >= 0 && color.chroma <= 132);
  t.true(color.hue >= 0 && color.hue <= 360);
  t.true(color.alpha >= 0 && color.alpha <= 1);
});

test('omits alpha from object output when not requested', (t) => {
  const color = randomLCHColor(0, 100, 0, 132, 0, 360, undefined, undefined, true);
  t.false('alpha' in color);
});

test('accepts decimal ranges and emits two-decimal channels', (t) => {
  for (let i = 0; i < 20; i++) {
    const color = randomLCHColor(0.5, 99.5, 0.5, 131.5, 0.5, 359.5);
    t.regex(color, /^lch\(\d+(?:\.\d{2})?% \d+(?:\.\d{2})? \d+(?:\.\d{2})?\)$/);
  }
});

test.serial('validates ranges before generating any random values', (t) => {
  const originalRandom = Math.random;
  let calls = 0;
  Math.random = () => {
    calls++;
    return 0.5;
  };

  try {
    t.throws(() => randomLCHColor(0, 100, 0, 132, 360, 0), {
      instanceOf: RangeError,
      message: 'hue minimum must be less than or equal to maximum'
    });
  } finally {
    Math.random = originalRandom;
  }

  t.is(calls, 0);
});

test('validates range values', (t) => {
  t.throws(() => randomLCHColor(Number.NaN), {
    instanceOf: TypeError,
    message: 'lightness range must use finite numbers'
  });

  t.throws(() => randomLCHColor(100, 0), {
    instanceOf: RangeError,
    message: 'lightness minimum must be less than or equal to maximum'
  });

  t.throws(() => randomLCHColor(0, 100, 0, 132, 0, 360, 2, 1), {
    instanceOf: RangeError,
    message: 'alpha minimum must be less than or equal to maximum'
  });

  t.throws(() => randomLCHColor(0, 100, 0, 132, 0, 360, -0.1, 1), {
    instanceOf: RangeError,
    message: 'alpha range must be between 0 and 1'
  });

  t.throws(() => randomLCHColor(0, 100, 0, 132, 0, 360, 0, 1.1), {
    instanceOf: RangeError,
    message: 'alpha range must be between 0 and 1'
  });
});

function withRandomValues(values, run) {
  const originalRandom = Math.random;
  let index = 0;

  Math.random = () => values[index++];

  try {
    run();
  } finally {
    Math.random = originalRandom;
  }
}
