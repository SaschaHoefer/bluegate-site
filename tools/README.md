# Re-capturing the screenshots

The images on this site are real screenshots of AxiumOne, not mockups. `shoot.mjs` reproduces them, so a
UI change does not leave the site showing a version of the product that no longer exists.

```sh
cd tools
npm install
node shoot.mjs calendar      # or: all
```

It writes into the site root, ready to commit.

## What has to be running

The AxiumOne dev stack: the API on `:5073`, vite on `:5173`, and the `sql1` SQL container. The script signs
in as the demo tenant's operations user, so the dev database also needs the Meridian fixtures.

## Everything is the fictional tenant

Every screenshot is taken against **Meridian Industrial Group** — a fictional company with fictional
customers, showing the real (small) dev figures rather than inflated ones. No real customer has ever
appeared on this site and none should. If you stage data for a shot, stage it there.

## Staging the calendar day

The calendar shot needs a day with work on it, laid out across the three production lines. `2026-08-12` is
the staged day; if the dev database is rebuilt, plant it again:

```sql
SET QUOTED_IDENTIFIER ON;
WITH picked AS (
  SELECT Id, ROW_NUMBER() OVER (ORDER BY Id) AS rn
  FROM data.demo_orders
  WHERE IsDeleted = 0 AND BranchId = 5004 AND SlotStart IS NULL
),
slots AS (
  SELECT * FROM (VALUES
    (1,'L1','06:00','09:30'), (2,'L1','10:00','13:00'), (3,'L1','13:30','17:00'),
    (4,'L2','07:00','11:00'), (5,'L2','11:30','14:30'), (6,'L2','15:00','18:00'),
    (7,'L3','06:30','08:00'), (8,'L3','08:30','12:00'), (9,'L3','12:30','15:00'),
    (10,'L3','15:30','17:30')
  ) AS v(rn, line, s, e)
)
UPDATE d SET
  d.ProductionLine = sl.line,
  d.SlotStart = CAST('2026-08-12 ' + sl.s AS datetime2),
  d.SlotEnd   = CAST('2026-08-12 ' + sl.e AS datetime2)
FROM data.demo_orders d
JOIN picked k ON k.Id = d.Id
JOIN slots sl ON sl.rn = k.rn;
```

The calendar view itself is **Production schedule** (`app.CalendarViews` id 1005) on the demo Sales Orders
object, with `SlotStart`/`SlotEnd` as the times and `ProductionLine` as the lane.

The two multi-day fixtures (`SO-10345`, `SO-10346`) sit deliberately clear of the 12th, so this shot stays
a clean single-day schedule. Since AxiumOne v0.292.0 a continuing job does label itself — the later pieces
read `SO-10345 (continued)` and the heading stays pinned as you scroll — so including one is a choice about
how busy the image should look, not a rendering problem.

## Re-running always produces a diff

AxiumOne's status bar shows the wall clock, so two captures of the same screen are never byte-identical.
If you re-ran the script only to check it still works, `git checkout` the image rather than committing a
change that is purely a timestamp.

## If a shot goes wrong

- **"could not reach August 12, 2026"** — the fixture is gone; re-run the SQL above.
- **Tiles clipped at the top or bottom** — the grid scrolled to "now". The script scrolls it deliberately;
  if the calendar's markup changes, the scroller lookup in `calendar()` may need revisiting.
- **The PNG is 1200 wide instead of 2400** — `deviceScaleFactor` was lost. The site states `width`/`height`
  on every `<img>`, so a size change means updating `features.html` too.
