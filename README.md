# random-lch-color

Generate a random LCH color.

## Installation

```bash
npm install --save random-lch-color
```

## Usage

`randomLCHColor` returns a random LCH color as a CSS `lch()` string by default. Pass `useObjectExport` as the final argument to get the raw numeric channels instead.

```javascript
const randomLCHColor = require('random-lch-color');

randomLCHColor(); // => lch(50% 100 100)
randomLCHColor(0, 100, 0, 132, 0, 360, 0, 1); // => lch(82% 120 204 / 0.62)
randomLCHColor(0, 100, 0, 132, 0, 360, 0, 1, true);
// => { lightness: 49, chroma: 87, hue: 290, alpha: 0.62 }
```

## API

```javascript
randomLCHColor(
  minL, maxL,
  minC, maxC,
  minH, maxH,
  minAlpha, maxAlpha,
  useObjectExport
);
```

All arguments are optional.

| Argument | Default | Description |
| --- | ---: | --- |
| `minL` | `0` | Minimum lightness (`0..100`). |
| `maxL` | `100` | Maximum lightness. |
| `minC` | `0` | Minimum chroma. CIE LCH chroma typically spans `0..150` for sRGB and up to ~`230` for wide-gamut colors. |
| `maxC` | `132` | Maximum chroma. |
| `minH` | `0` | Minimum hue in degrees. |
| `maxH` | `360` | Maximum hue in degrees. |
| `minAlpha` | — | Minimum alpha. Alpha is omitted unless supplied. |
| `maxAlpha` | — | Maximum alpha. Alpha is omitted unless supplied. |
| `useObjectExport` | `false` | Return an object of raw numeric channels instead of a CSS string. |

When `min` and `max` are both integers (the defaults), channels are picked uniformly from the inclusive integer range and emitted as whole numbers. When a non-integer bound is supplied, the channel is bucketed to two decimal places.

Lightness above `1` is emitted as a percentage (`50%`). Alpha is always emitted as a two-decimal number, since CSS LCH alpha is conventionally `0..1` rather than `0%..100%`.

When `useObjectExport` is `true`, channels come back as raw numbers, and `alpha` is omitted from the object when no alpha range was supplied.

Every supplied range value must be a finite number, and every minimum must be less than or equal to its maximum. Invalid ranges throw `TypeError` or `RangeError` before any randomness is generated.

## Acknowledgements

Inspired by [random-hex-color by John Otander](http://github.com/johno/random-hex-color) which is repackaged from a [post by Paul Irish](http://www.paulirish.com/2009/random-hex-color-code-snippets/).

## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted for generative doings by Adam Morse ([@mrmrs_](https://twitter.com/mrmrs_)).

***

