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

- **⚠️ Two legal items are still open. They are tracked HERE, not on the pages themselves** — the
  amber draft notices were removed once the content was complete, because internal caveats should not
  be visible to visitors (and the second one below would have publicly advertised a possible
  compliance gap). Do not let them get lost:
  1. **Have both pages reviewed by a lawyer.** They were written from what the site actually does and
     from company details supplied by the owner, but nobody qualified has checked them.
  2. **Decide whether an EU representative under Art. 27 GDPR is required.** A controller established
     outside the EU that offers goods or services to people in the EU generally must designate a
     representative inside the EU and name them in its privacy policy. If BlueGate sells into Germany
     or the EU this most likely applies, and the representative's name and address then belong in
     `privacy.html`. The policy is currently silent on the point — it makes no false claim, but the
     obligation does not go away by being unmentioned.
- **`privacy.html` describes the site as it is today.** If a contact form, booking tool, analytics or
  any embedded third-party service is ever added, that page has to be updated in the same commit.
- The nav's **Platform** and **Approach** links jump to sections on the landing page; **Contact** and
  both **Book a demo** buttons open a mail composer to `info@bluegateanalytics.com`. If a real
  contact form or booking link is wanted later, those are the four places to change.
