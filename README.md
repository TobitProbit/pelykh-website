# pelykh-website

The site at [pelykh.co](https://pelykh.co): **The One-Surname Theatre**. Six letters with googly eyes
stand on a small stage and sing. Hold a letter and it sings; drag up for a higher note, sideways for a
different vowel. "Start the concert" has them perform *Shchedryk* (Mykola Leontovych, 1916, public domain).
Switching to Ukrainian changes their costumes to П Е Л И Х and sends K on paid leave.

## What is where

| Path | What it is |
| --- | --- |
| `index.html` | The page: markup, styles and the playbill |
| `assets/app.js` | Built script (three.js scene + voices). Generated, do not edit |
| `assets/fonts/` | Rubik Mono One and Cormorant Garamond, self-hosted |
| `src/main.js` | The stage: letters, lights, curtains, roses, tomatoes |
| `src/voice.js` | The singing (Web Audio formant synthesis) and the score |
| `src/copy.js` | Every word on the page, in English and Ukrainian |
| `src/glyphs.js` | Letter outlines, generated from the font by `src/gen-glyphs.mjs` |
| `archive/` | Earlier versions of the home page, kept for history |
| `valuation-course/` | The Young Investor's Guide: six interactive missions. Plain HTML and JS, no build step; all course text is in `app.js` |
| `french-course/` | Separate mini-site |

## Changing things

Text changes: edit `src/copy.js`. Anything in `src/` needs a rebuild:

```
npm install
npm run build
```

Then commit `assets/app.js` along with your change. GitHub Pages serves the repository as it is;
there is no build step on the server.

## History

- `archive/2025-pelykh-was-here/` – the original page: a photograph of a carved table, in two languages.
- `archive/2026-mountain-table/` – an interactive mountain scene with a table visitors could carve.
- `archive/valuation-course-2025/` – the first edition of the valuation course (six long-read modules).

## Credits

three.js (MIT). Rubik Mono One and Cormorant Garamond (SIL Open Font License 1.1).
