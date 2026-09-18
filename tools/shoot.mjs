// Re-captures the AxiumOne screenshots used on this site.
//
//   cd tools && npm install && node shoot.mjs [dashboard|order|calendar|all]
//
// Output lands beside the site's existing images, ready to commit.
//
// ── What has to be true before running ────────────────────────────────────────────────────────────────
//   · The AxiumOne dev stack is up: API on :5073, vite on :5173, SQL in the `sql1` container.
//   · The dev database still has the MERIDIAN demo tenant and its staged fixtures (see STAGING below).
//
// ── Why the shots look the way they do ────────────────────────────────────────────────────────────────
// Everything is captured at 1200 CSS pixels with deviceScaleFactor 2, so each PNG is 2400 wide and stays
// sharp on a retina display while the page declares a sensible CSS size. The site states width/height on
// every <img> so the page does not jump as they load — if you change the viewport here, update those too.
//
// ⚠️ STAGING, and why it is not accidental. Every shot uses the FICTIONAL Meridian Industrial Group tenant:
// fictional company, fictional customers, and the real (small) dev numbers rather than inflated ones. No
// real customer has ever appeared in a screenshot on this site, and none should. The calendar shot needs a
// day with work on it — see `stageCalendarDay` in this folder's README for the SQL that plants one.
//
// ⚠️ The calendar grid scrolls to "now" by itself, which clips the first tile's label and cuts the last one
// off at the bottom. The shot therefore scrolls it deliberately, so the schedule reads as a planned day
// rather than an accident of when the screenshot was taken.

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const APP = 'http://localhost:5173';
const OUT = new URL('../', import.meta.url).pathname;   // the site root, beside index.html

// The demo tenant's operations user. Dev-only credentials for a fictional tenant; nothing here reaches
// production, and production passwords are deliberately not recorded anywhere in this repository.
const USER = 'omar.haddad@meridian.example';
const PASS = 'Meridian#2027';

/** The day the calendar fixture is staged on. Change here and in the staging SQL together. */
const CALENDAR_DAY = 'August 12, 2026';

const want = (process.argv[2] ?? 'all').toLowerCase();
const shots = {
  calendar: { file: 'axiumone-calendar.png', height: 900, go: calendar },
};

// Playwright downloads its own Chromium. If a compatible build is already cached from another project,
// point at it rather than pulling another 150MB — harmless when absent, since launch() then uses its own.
const cached = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/` +
               'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const launch = existsSync(cached) ? { executablePath: cached } : {};

const browser = await chromium.launch(launch);

for (const [name, shot] of Object.entries(shots)) {
  if (want !== 'all' && want !== name) continue;
  const page = await browser.newPage({
    viewport: { width: 1200, height: shot.height },
    deviceScaleFactor: 2,
  });
  await signIn(page);
  await shot.go(page);
  await page.screenshot({ path: OUT + shot.file });
  console.log(`wrote ${shot.file}`);
  await page.close();
}
await browser.close();

/** Email-first sign-in: the password field only appears once home-realm discovery has answered. */
async function signIn(page) {
  await page.goto(`${APP}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(USER);
  await page.getByRole('button', { name: 'Continue' }).first().click();
  await page.getByLabel('Password').waitFor({ state: 'visible' });
  await page.getByLabel('Password').fill(PASS);
  await page.getByRole('button', { name: 'Continue' }).first().click();
  await page.waitForURL(`${APP}/`, { timeout: 20000 });
  await page.waitForTimeout(2500);
}

async function calendar(page) {
  await page.goto(`${APP}/calendar`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Day' }).first().click();
  await page.waitForTimeout(1500);

  // The date controls are chevrons with no accessible name, so they are found by their icon.
  const next = page.locator('button:has(svg[data-testid="ChevronRightIcon"])').first();
  const prev = page.locator('button:has(svg[data-testid="ChevronLeftIcon"])').first();
  const heading = () => page.locator('text=/\\w+day, \\w+ \\d+, \\d{4}/').first().textContent();

  let at = await heading();
  const back = new Date(at.split(', ').slice(1).join(', ')) > new Date(CALENDAR_DAY);
  for (let i = 0; i < 60 && !at.includes(CALENDAR_DAY); i++) {
    await (back ? prev : next).click();
    await page.waitForTimeout(220);
    at = await heading();
  }
  if (!at.includes(CALENDAR_DAY)) {
    throw new Error(`could not reach ${CALENDAR_DAY} — stopped at "${at.trim()}". ` +
                    'Is the fixture still staged? See README.md.');
  }
  await page.waitForTimeout(2000);

  // Compose the day: put the start of the shift at the top of the grid. See the note at the top of this
  // file — left alone, the container scrolls to "now" and the schedule reads as an accident.
  await page.evaluate(() => {
    const scroller = [...document.querySelectorAll('div')]
      .filter((d) => d.scrollHeight > d.clientHeight + 40 && d.clientHeight > 200)
      .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    if (!scroller) return;
    scroller.scrollTop = (scroller.scrollHeight / 24) * 5.6;   // just above 06:00
  });
  await page.waitForTimeout(1200);
}
