---
name: homepage
description: Guide for editing haonan-duan.github.io (academic personal site). Invoke when adding a publication, updating news, tweaking the wa-modern design, or modifying the gallery / sidebar / features. Encodes the design principles, architecture, and preferences established across the rebuild.
---

# Homepage maintenance guide

Academic personal site for Haonan Duan (robotics researcher, NVIDIA GEAR). Built on Jekyll 3.9 + GitHub Pages. The site was rebuilt from the Minimal Mistakes fork into a hand-written single-page layout ("wa-modern" — 和モダン) with a data-driven publications gallery.

## Design language

**Aesthetic**: restrained Japanese editorial — ma (negative space), kanso (simplicity), shibui (understated beauty). Axis-aligned, hairline rules, warm neutrals, one indigo accent. *Not* flashy — the site avoids neon/gradients/cursor effects even though a recent iteration borrowed three small flourishes from a reference site (hexagonal avatar halo, `[01]` section prefixes, subtle glitch on the name).

**Palette** (all defined as SCSS variables at top of `_sass/_wa.scss`):

| Token | Hex | Role |
|---|---|---|
| `$kinari` | `#f7f4ec` | 生成り — page background |
| `$washi` | `#fbfaf5` | card/surface |
| `$sumi` | `#1f1d1a` | 墨 — primary ink |
| `$sumi-2` | `#6b655c` | secondary text / link icon strokes |
| `$sumi-3` | `#a39c8f` | muted / tertiary |
| `$hairline` | `#d9d3c5` | default rule/border |
| `$hairline-dark` | `#8b8376` | hover border |
| `$ai` | `#2d4a6b` | 藍 — indigo accent for links, counters, glitch |
| `$ai-dark` | `#1e3754` | link hover |

**Type**: Inter stack (system fallbacks) for body; SF Mono stack for dates, counters, `[01]` prefixes, visitor count. No Google Fonts imported.

## Preferences to respect (established across sessions)

1. **Modesty, not over-showing.** Avoid features that amplify individual papers (hover-video, per-paper citation badges, stars, etc.). Prefer site-level features over per-paper ornamentation. See `~/.claude/projects/-Users-haonand-workspace-codes-haonan-duan-github-io/memory/feedback_site_tone.md`.

2. **No rotation on gallery tiles.** Chaos/disorder in the gallery comes from translate, margin, or size variance — never `rotate()`. Even 1–2° tilts are rejected. See `feedback_no_rotation.md` in memory.

3. **Japanese aesthetic cues**, not Japanese kitsch. No hanko seals, no faux ink brushes, no literal kanji glyphs unless the user asks. See `user_design_taste.md`.

4. When in doubt between "more signal" and "more restraint," pick restraint.

## Repo structure

```
_config.yml                  # slim — site, author, 3 plugins (sitemap, redirect-from, jemoji)
_data/
  publications.yml           # paper entries (see schema below)
  news.yml                   # news entries
_includes/
  author-sidebar.html        # portrait + name + SVG social icons + ⌘K hint
  paper-box.html             # renders one gallery tile from a pub entry
  fetch_google_scholar_stats.html  # vanilla-JS citation fetcher (dormant: needs hooks)
  analytics.html             # placeholder for analytics snippet
_layouts/default.html        # the only layout — hand-written HTML5, ~55 lines
_pages/about.md              # the only content page; all sections live here
_sass/_wa.scss               # the whole stylesheet (reset + layout + components + features)
assets/
  css/main.scss              # one-liner: @import "wa"
  js/wa.js                   # all interactivity (see feature inventory)
images/                      # paper teasers + avatar + favicons
google_scholar_crawler/      # Python script; runs daily via .github/workflows/
```

No Minimal Mistakes theme, no jQuery, no Font Awesome, no Susy grid — all stripped during the rebuild.

## Data schemas

### `_data/publications.yml` — one entry per paper

```yaml
- title: "Full paper title"
  url: https://arxiv.org/abs/...   # main link (arxiv/DOI/project)
  image: Filename.png              # must exist in images/
  wide: true                       # OPTIONAL — set true if W:H >= 2.0
                                   # wide tiles span both columns in the gallery
  authors_html: "A, <strong>Haonan Duan</strong>, B"  # raw HTML; <strong> for own name, <sup>*</sup> for equal contribution
  venue: "ICCV, 2025"
  links:                           # OPTIONAL — if absent, a default "Paper ↗" link appears
    - text: Project
      url: https://...
    - text: Video
      url: https://...
```

**Aspect-ratio rule**: measure image W:H. If ≥ 2.0 → add `wide: true`. Non-wide tiles get forced `aspect-ratio: 3/2` with `object-fit: cover` so paired tiles match heights (cropping is minimal, ~1.5–3%).

Check an image's aspect:
```bash
sips -g pixelWidth -g pixelHeight images/YourPaper.png
```

### `_data/news.yml` — one entry per news item

```yaml
- date: "2025.11"
  body_html: 'One <a href="...">paper</a> got accepted by AAAI 2026.'
```

Dates render in SF Mono via the article's `<em>` timeline CSS. Newest first in file order.

## Common tasks

### Add a paper
1. Drop the teaser image into `images/`.
2. Append an entry to `_data/publications.yml` (use existing entries as template).
3. Set `wide: true` if aspect W:H ≥ 2.0.
4. Rebuild: livereload picks it up; or `bundle exec jekyll build`.

### Add a news item
Prepend to `_data/news.yml` (newest first). The `body_html` field takes one `<a>` tag if you want a link.

### Reorder or rename sections
Edit `_pages/about.md`. Section headings use `# Name` (kramdown h1). The `[01]` prefix is auto-counted from `counter-reset: wa-section` on `.wa-article` and `counter-increment` on `h1`. Reordering sections auto-re-sequences numbers.

Current sections: `News`, `Publications`, `Education`, `Experience`. Intro text above first heading becomes the bio.

### Tweak the palette
All colors live as SCSS variables at the top of `_sass/_wa.scss`. Change them in one place.

### Add/remove a sidebar social link
Edit `_includes/author-sidebar.html`. Icons are inline SVG (no font dependency) — copy an existing `<li>` block, swap the SVG path. Sidebar reads `site.author.<field>` from `_config.yml`.

## Feature inventory (`assets/js/wa.js`)

All vanilla JS, no dependencies. Loaded deferred.

- **Command palette**: ⌘K / Ctrl-K / `/` opens a fuzzy jump-to-section + copy-email + quick-links overlay. Arrow keys + Enter navigate. Email copy uses `navigator.clipboard`.
- **Scroll gear**: bottom-right SVG gear that rotates with scroll progress (0°→360°). Clickable, returns to `#about-me`. Appears after scrolling ~120px.
- **Bio typewriter**: types out the first bio paragraph once per session on first visit (sessionStorage flag `wa-typed`). Skips on viewports <700px wide and on bodies >400 chars.
- **Visitor counter**: fetches from Abacus (`abacus.jasoncameron.dev/hit/haonan-duan-github-io/homepage`). Bumps on load, populates `#wa-visitor-count` in the footer. Falls back to `—` on failure.

All animations respect `prefers-reduced-motion`.

## Sidebar "borrowed flourishes"

Three elements adapted from a reference site (wangjingbo1219.github.io), recolored to the wa palette:

- **Hexagonal avatar** — `clip-path: polygon(50% 0%, 100% 25%, ...)`. Rotating conic-gradient halo in indigo + muted vermilion + sumi tones (12s cycle). Floating animation (4px, 6s).
- **`[01]` section prefixes** — SF Mono, `$ai` indigo, `decimal-leading-zero` via CSS counter. Auto-re-sequences if sections are reordered.
- **Name glitch** — brief chromatic-aberration burst on `.wa-sidebar__name` every 7s (93–97% of keyframe), indigo + muted vermilion instead of the reference's neon cyan+pink.

These live in `_sass/_wa.scss` as `@keyframes wa-portrait-float`, `wa-portrait-ring`, `wa-glitch`.

## Build & serve

```bash
# One-time: install gems locally (see Ruby quirk below)
bundle config set --local path 'vendor/bundle'
bundle _2.2.19_ install

# Dev server with livereload
bundle _2.2.19_ exec jekyll serve --livereload --port 4000

# Or: bash run_server.sh
```

Site runs at http://127.0.0.1:4000.

### Ruby quirk
System Ruby on macOS is 2.6 with bundler 1.17.2. The `Gemfile.lock` requires bundler 2.2.19. Install it user-local:

```bash
gem install --user-install bundler:2.2.19
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
bundle _2.2.19_ <cmd>
```

## Deployment

GitHub Pages builds automatically on push to `main`. The `.github/workflows/google_scholar_crawler.yaml` runs daily at 08:00 UTC and commits citation stats to a separate `google-scholar-stats` branch — don't delete that branch.

Live at https://haonan-duan.github.io.

## Files you generally shouldn't touch

- `.github/workflows/google_scholar_crawler.yaml` — working, daily cron.
- `_includes/fetch_google_scholar_stats.html` — dormant but correct; ready if citation hooks are added to markup later.
- `images/favicon*`, `images/apple-touch-icon.png`, `images/site.webmanifest` — favicon set.
- `google_scholar_crawler/` — Python for the workflow.

## Before making larger changes

1. Check project memory at `~/.claude/projects/-Users-haonand-workspace-codes-haonan-duan-github-io/memory/MEMORY.md` for established preferences.
2. If proposing a visible change, describe it and ask before implementing — the user prefers short proposals with a clear recommendation, not pre-built solutions.
3. For destructive/reformat work, commit the current state first so there's a rewind point (the rebuild checkpoint is commit `280904a`).
