# bluegateanalytics.com

The BlueGate Analytics marketing site — a single static page, served by GitHub Pages at
**www.bluegateanalytics.com**.

## What's here

| File | Why |
|---|---|
| `index.html` | The landing page. |
| `imprint.html`, `privacy.html` | Provider identification and privacy policy, linked from every footer. |
| `legal.css` | Shared document styling for those two pages. |
| `fonts/`, `fonts.css` | Inter and Red Hat Display, **self-hosted**. Do not swap these back to the Google Fonts CDN: embedding them from `fonts.googleapis.com` sends every visitor's IP to Google, which is the single most-litigated detail on EU-facing sites, and `privacy.html` currently states that the site contacts no third parties. |
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

- **The legal pages are drafts and say so, in amber boxes that are hard to miss on purpose.** Three
  details are missing from the imprint (phone number, the responsible individual, the Indiana entity
  ID) and one decision is open in the privacy policy (whether an EU representative under Art. 27
  GDPR is needed). Both should be reviewed by a lawyer before you rely on them. Remove the amber
  boxes once they are settled.
- **`privacy.html` describes the site as it is today.** If a contact form, booking tool, analytics or
  any embedded third-party service is ever added, that page has to be updated in the same commit.
- The nav's **Platform** and **Approach** links jump to sections on the landing page; **Contact** and
  both **Book a demo** buttons open a mail composer to `info@bluegateanalytics.com`. If a real
  contact form or booking link is wanted later, those are the four places to change.
