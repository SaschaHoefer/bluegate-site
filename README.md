# bluegateanalytics.com

The BlueGate Analytics marketing site — a single static page, served by GitHub Pages at
**www.bluegateanalytics.com**.

## What's here

| File | Why |
|---|---|
| `index.html` | The whole site. One file, no build step, no dependencies. |
| `CNAME` | The custom domain. GitHub Pages reads this — deleting it reverts the site to `saschahoefer.github.io/bluegate-site`. |
| `.nojekyll` | Tells Pages to serve the files as-is instead of running them through Jekyll. |

## Deploying

Push to `main`. GitHub Pages republishes within a minute or so; there is nothing to build.

## Editing

`index.html` is plain HTML with inline styles, converted from the *BlueGate Analytics Brand Kit*
design canvas. The design was drawn on a fixed 1280px artboard, so the desktop rendering is kept
exactly as designed and a small responsive layer at the top of the `<style>` block overrides only
what breaks on a narrow screen (gutters, the two multi-column bands, the hero headline, the nav).
Change the design in the artboard first if the layout itself needs to move.

## Still to do

- **Replace the `[ AxiumOne screenshot ]` placeholder** in the "Meet AxiumOne" band with a real
  screenshot. There is a comment in the markup with the exact `<img>` tag to drop in. Use a clean
  tenant with presentable data — not the dev database.
- The nav's **Platform** and **Approach** links jump to sections on this page; **Contact** and both
  **Book a demo** buttons open a mail composer to `info@bluegateanalytics.com`. If a real contact
  form or booking link is wanted later, those are the four places to change.
