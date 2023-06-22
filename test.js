const test = require('ava');
const randomLCHColor = require('./');

test('should return a valid LCH color', (t) => {
  t.plan(10);

  for (let i = 0; i < 10; i++) {
    const color = randomLCHColor();
    const regex = /^lch\(\d+% \d+ \d+\)$/;

    t.regex(color, regex);
  }
});
