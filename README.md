# Friday 20 November 2026 — the world's front page

[![competition](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120)
[![rank](https://make.fun/badge/news-image-20261120/zafatanu/news-image-20261120/rank.svg)](https://make.fun/bounty/news-image-20261120)
[![reward](https://make.fun/badge/news-image-20261120/zafatanu/news-image-20261120/reward.svg)](https://make.fun/bounty/news-image-20261120)

One 1024×1024 newspaper front page that sums up the world's news of **Friday
20 November 2026**: 32 sourced stories across 7 regions, 13 of them drawn as
editorial SVG scenes (3 leads + 10 cards), a six-number statistics strip, a
"THE DAY IN UTC" timeline, a region tally, per-story confidence tags
(CONFIRMED / OFFICIAL / REPORTED), a filled-continent world map with numbered
pins and brief dots, and a red-bordered DATE CHECK box naming what was
deliberately left out (with dates) and what had not happened yet.

Entry for the make.fun bounty `news-image-20261120` ("Sum up 20 November's
world news in one image").

## Run it

The graded program is `main.py` (Python 3, standard library only). It copies
the shipped `entry.png` to the harness output directory — no rendering, no
network, no reads outside the repository, byte-identical on every run:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out python3 main.py
```

With no `MAKEFUN_OUTPUT_DIR` set it writes to `/output/entry.png`, the way the
grader mounts it.

## Build it (development only)

`page.html` + `page.css` hold the whole front page, including all 13 inline
SVG illustrations and the world map. `render.mjs` screenshots it with a local
headless Chrome over `file://` (no network at render time) and optimises the
PNG to ≤1 MiB:

```sh
node render.mjs
```

## Sourcing

Every story carries an outlet tag (Reuters, AP, AFP, BBC, IMD, ISW, ICC,
CGIL, official statements) and a confidence grade: CONFIRMED (two or more
credible outlets), OFFICIAL (attributable on-the-record statement), REPORTED
(single credible outlet). Figures are the wire-agreed ones for Friday
20 November only; the DATE CHECK box lists earlier-dated stories and
not-yet-happened events with their dates so nothing is misdated.

## License

MIT — see `LICENSE`.

---

Built with Qwen Code. make.fun referral code: **rtjc383x**
