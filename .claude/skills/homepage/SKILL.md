---
name: homepage
description: Guide for editing haonan-duan.github.io (academic personal site). Invoke when adding a publication, updating news, tweaking the colorful card design, or modifying the sidebar / palette / interactive features. Encodes the design system, architecture, and preferences established across the rebuild.
---

# Homepage maintenance guide

Academic personal site for Haonan Duan (robotics researcher, NVIDIA GEAR). Jekyll 3.9 + GitHub Pages, hand-written single-page layout with data-driven content. No theme inheritance — no Minimal Mistakes, jQuery, Font Awesome, or Susy.

## Design language

**Colorful card style.** Every section is its own rounded rectangle in a different colour. Playful and saturated in the accents, very light in the surfaces. Gradients, glow, hover lift, scroll reveal, emoji badges are all welcome.

> **Superseded:** an earlier iteration was a restrained Japanese-editorial design (和モダン — washi/sumi neutrals, hairline rules, `[01]` mono section prefixes, hexagonal avatar, "when in doubt pick restraint"). The user explicitly abandoned that direction on 2026-08-06. Do not reintroduce those cues.

### Palette

Ink and page (SCSS variables at the top of `_sass/_site.scss`):

| Token | Hex | Role |
|---|---|---|
| `$ink` | `#241f2e` | primary text |
| `$ink-2` | `#5d5570` | secondary |
| `$ink-3` | `#918aa5` | muted |
| `$page` | `#fbf9fe` | page background |

Card themes are **CSS custom properties**, set by one modifier class per card. Everything inside a card (title, badge, links, pills, hover glow) reads from these, so recolouring a section is a one-class change:

| Class | `--surface` | `--edge` | `--accent` | `--accent-ink` |
|---|---|---|---|---|
| `.card--coral` | `#fff4f0` | `#ffdbcf` | `#ee5d33` | `#b23a13` |
| `.card--amber` | `#fffaeb` | `#ffe7b4` | `#f0a91b` | `#9a5f03` |
| `.card--violet` | `#f7f4ff` | `#e4d9ff` | `#7b4ae2` | `#5a2bb8` |
| `.card--sky` | `#f0f8ff` | `#cce7ff` | `#2a97e0` | `#0d6399` |
| `.card--mint` | `#ecfbf4` | `#bfeed7` | `#17b06a` | `#097043` |
| `.card--pink` | `#fff2f9` | `#ffd6ea` | `#ec5fa8` | `#b52970` |

`--accent` is for decoration (dots, badges, rules); `--accent-ink` is the darker variant for text on the surface. `--glow` is the coloured shadow.

**Surfaces must stay very light.** Mid-saturation pastels were explicitly rejected as looking "土" (dowdy). Surfaces are the accent hue at very low chroma — tinted, not coloured-in.

**Background blobs are deliberately kept dimmer than the cards** (`opacity: .3`, `blur(110px)`). If you lighten the surfaces further, dim the blobs too — otherwise the background out-shouts the content.

### Other tokens

```scss
$bw-card:  3px;   // section card borders
$bw-inner: 2px;   // paper cards, emoji badges, count pills
$bw-rule:  2px;   // rules inside the profile card
$radius:   26px;  // card corner radius
```

**Type**: Inter stack for body, SF Mono stack for dates/counters. ⚠️ Inter is *declared but never loaded* — there is no `@font-face` or font link, so it silently falls back to the system font everywhere. Either self-host it or drop it from the stack; don't assume it renders.

## Preferences to respect

1. **Fancy and colourful is the goal.** Lean into colour, playfulness, micro-interactions.
2. **No rotation on gallery tiles.** Predates the redesign and was never explicitly revoked — confirm before adding tilt to paper cards. (A hover wiggle on the emoji badge is currently in, flagged to the user.)
3. **The user iterates live** against `http://127.0.0.1:4000` — prefer shipping a working version to describing one.
4. Verify visual changes by screenshotting (see *Checking your work*), not by reasoning about CSS.

## Repo structure

```
_config.yml                  # slim — site, author, 3 plugins (sitemap, redirect-from, jemoji)
_data/
  publications.yml           # paper entries (schema below)
  news.yml                   # news entries
  education.yml              # education entries
  experience.yml             # experience entries
_includes/
  profile-card.html          # sticky sidebar: portrait, name, bio, section nav, socials
  paper-card.html            # renders one publication card
  analytics.html             # ⚠️ references an undefined site.google_analytics_id — see Known issues
_layouts/default.html        # the only layout — hand-written HTML5
_pages/about.md              # the only content page; each section is a <section class="card card--x">
_sass/_site.scss             # the whole stylesheet
assets/
  css/main.scss              # one-liner: @import "site"
  js/site.js                 # all interactivity
images/                      # paper teasers + avatar + favicons
```

## Data schemas

### `_data/publications.yml`

```yaml
- title: "Full paper title"
  url: https://arxiv.org/abs/...   # main link
  image: Filename.png              # must exist in images/
  authors_html: "A, <strong>Haonan Duan</strong>, B"  # raw HTML; <strong> own name, <sup>*</sup> equal contrib
  venue: "IEEE Transactions on Robotics, 2024"   # full name — becomes the badge tooltip
  venue_tag: "T-RO 2024"                          # OPTIONAL short badge text; falls back to venue
  links:                           # OPTIONAL — if absent, one "Paper" link is shown
    - text: Project
      url: https://...
  wide: true                       # legacy, currently unused
```

Always set `venue_tag` for long venue names — the badge is a single pill and a full IEEE Transactions name eats an entire row.

Images render at their natural aspect, full card width, no cropping.

### `_data/news.yml`

```yaml
- date: "2025.11"
  body_html: 'One <a href="...">paper</a> got accepted by AAAI 2026.'
```

### `_data/education.yml` / `_data/experience.yml`

```yaml
# education: date / degree / org / where
# experience: date / role / org / current (true → pulsing "now" dot)
```

All four files are newest-first in file order. The `{{ ...size }}` count pills in the card headers update automatically.

## Common tasks

### Add a paper
1. Drop the teaser image into `images/`.
2. Append an entry to `_data/publications.yml`, including `venue_tag`.
3. Livereload picks it up.

### Add a news item
Prepend to `_data/news.yml`. The count pill re-counts itself.

### Add or reorder a section
Edit `_pages/about.md`. Each section is:

```html
<section class="card card--COLOUR reveal" id="slug">
  <header class="card__head">
    <h2 class="card__title"><span class="card__icon">EMOJI</span>Title</h2>
    <span class="card__chip">N items</span>   <!-- optional -->
  </header>
  ...
</section>
```

Then add a matching entry to `.profile__nav` in `_includes/profile-card.html` with a `data-dot` colour, and register that colour in the `$dots` map in `_sass/_site.scss`. The ⌘K palette and the scrollspy both read sections from the DOM, so they need no changes.

Headings must stay `<h2>` — the page has exactly one `<h1>` (the name in the profile card).

### Prose sections
Markdown inside a `<section>` needs a `<div markdown="1">` wrapper (kramdown). Keep the `<header>` outside it, or kramdown wraps the badge in a stray `<p>`.

### Tweak the palette
All theme values are the `@include theme(...)` lines near the top of `_sass/_site.scss`.

### Add/remove a social link
Edit `_includes/profile-card.html`. Icons are inline SVG. The ⌘K palette reads these links from the DOM, so it stays in sync automatically — don't hardcode URLs in JS.

## Feature inventory (`assets/js/site.js`)

Vanilla JS, no dependencies, deferred.

- **Command palette** — ⌘K / Ctrl-K / `/`. Sections and social links are read from the DOM. Arrow keys + Enter. Restores focus on close. Swaps the hint to `Ctrl K` on non-Mac.
- **Scroll reveal** — IntersectionObserver adds `.is-in` to `.reveal`. Scoped under `html.js` (set by an inline script in `<head>`) so content stays visible if JS never runs.
- **Back-to-top ring** — fixed bottom-right, gradient SVG progress ring, appears after 160px.
- **Scrollspy** — highlights the current section in the sidebar nav.
- **Visitor counter** — Abacus (`abacus.jasoncameron.dev`), populates `#visitor-count`, falls back to `—`.

All animations respect `prefers-reduced-motion`.

## Checking your work

The user iterates visually, so verify with a screenshot rather than reasoning about CSS:

```bash
curl -s --noproxy '*' http://127.0.0.1:4000/          # NOTE: --noproxy, a local Privoxy intercepts otherwise
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox --no-proxy-server --hide-scrollbars \
  --window-size=1400,1050 --virtual-time-budget=8000 \
  --screenshot=/tmp/shot.png http://127.0.0.1:4000/
```

Two gotchas:
- **A local Privoxy proxies `curl`** and returns 503 for localhost. Always pass `--noproxy '*'`.
- **Headless Chrome clamps the layout viewport to 500px minimum.** `--window-size=390` renders at 500 CSS px and crops, which looks like a horizontal-overflow bug but isn't. Test mobile at 500px and read it as "narrow", or use real device emulation.

Split tall screenshots with PIL to inspect sections.

## Build & serve

```bash
bundle exec jekyll serve --livereload --port 4000    # or: bash run_server.sh
bundle exec jekyll build --destination /tmp/out      # sanity check
```

### Ruby quirk
If system Ruby/bundler complains, the `Gemfile.lock` wants bundler 2.2.19:

```bash
gem install --user-install bundler:2.2.19
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
bundle _2.2.19_ <cmd>
```

## Deployment

GitHub Pages builds automatically on push to `main`. There are no GitHub Actions. Live at https://haonan-duan.github.io.

⚠️ **Nothing but site content belongs in this directory.** Jekyll copies unknown top-level folders into `_site` and `jekyll-sitemap` indexes them. In 2026-08 a scratch directory of private immigration documents was sitting here and was being written into `sitemap.xml`; it has been moved to `~/Documents/RUN/niw/`. If scratch work lands here again, move it out — or add it to **both** `.gitignore` and `_config.yml: exclude`.

## Known issues (open, not yet fixed)

- **Images are ~15 MB total, uncompressed.** `Dita.png` is 3.8 MB at 4048 px wide for a ~760 px slot; `haonan.png` is 2.5 MB at 1856² for a 118 px avatar. No WebP, no resizing, no `width`/`height` attributes (so there's layout shift). Resizing to 2× display width + WebP would cut it ~95%.
- **`_includes/analytics.html` fires an empty request** — `site.google_analytics_id` is undefined, so it renders `<script src="...gtag/js?id=">`. Configure an ID or delete the include.
- **Inter is declared but never loaded** (see *Type* above).
- **`README.md` is still the upstream AcadHomepage readme** — describes a Minimal Mistakes theme that no longer exists, documents the deleted Scholar workflow, and references `docs/screenshot.png` / `docs/README-zh.md` which aren't in the repo (broken images on the GitHub landing page). Needs a full rewrite.
- **`images/TCDS2024.png`** (1.3 MB) is referenced nowhere — either a dropped paper or a forgotten asset.
- **`images/site.webmanifest`** has empty `name`/`short_name`, a wrong icon path (`/android-chrome-192x192.png`, missing `/images/`), and a `theme_color` that disagrees with the layout's.
- **Content gaps**: no CV link; no undergrad in education; `site.description` is emoji-only, which is also the meta description and every link preview.

## Removed and why

- **Google Scholar citation pipeline** (2026-08) — `google_scholar_crawler/`, its GitHub Action, and `_includes/fetch_google_scholar_stats.html`. It had never worked: the `google-scholar-stats` branch was never created, the fetch URL was missing the owner segment, and no element on the page consumed the data. Don't reintroduce it without also adding the markup that displays the numbers. The `author.googlescholar` profile link is unrelated and still live.
- **Bio typewriter** — delayed the first paragraph by ~5 s and ignored `prefers-reduced-motion`. Replaced by scroll reveal.
- **Hover-only publication overlays** — titles were invisible until hover. Titles, authors, and venue are now always visible.

## Files you generally shouldn't touch

- `images/favicon*`, `images/apple-touch-icon.png` — favicon set.

## Before making larger changes

1. Check project memory at `~/.claude/projects/-Users-haonand-workspace-codes-haonan-duan-github-io/memory/MEMORY.md`.
2. For destructive/reformat work, commit first so there's a rewind point.
