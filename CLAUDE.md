# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**For anything beyond a one-line edit, use the `homepage` skill** (`.claude/skills/homepage/SKILL.md`) — it carries the design system, data schemas, screenshot workflow, and the list of known open issues.

## Project Overview

Academic personal homepage for Haonan Duan (robotics researcher, NVIDIA GEAR). Hosted on GitHub Pages at haonan-duan.github.io. Originally forked from the AcadHomepage template, but the theme has since been stripped entirely — the layout, stylesheet, and JS are all hand-written.

## Tech Stack

- **Static site generator**: Jekyll 3.9 (via the `github-pages` gem)
- **CSS**: one hand-written SCSS file, `_sass/_site.scss`. No Minimal Mistakes, no Susy.
- **JS**: one vanilla file, `assets/js/site.js`. No jQuery, no plugins, no Font Awesome.
- **No GitHub Actions.** Deployment is a plain GitHub Pages build on push to `main`.

## Development Commands

```bash
bundle install                                       # dependencies
bundle exec jekyll serve --livereload --port 4000    # dev server (or: bash run_server.sh)
bundle exec jekyll build --destination /tmp/out      # sanity check

# Site at http://127.0.0.1:4000
# NOTE: a local Privoxy intercepts curl — use `curl --noproxy '*'` to reach it.
```

## Architecture

- **`_pages/about.md`** — the only content page. Each section is a `<section class="card card--COLOUR">` block; prose inside needs a `<div markdown="1">` wrapper.
- **`_data/`** — all content lives here: `publications.yml`, `news.yml`, `education.yml`, `experience.yml`. Newest-first in file order.
- **`_includes/`** — `profile-card.html` (sidebar) and `paper-card.html` (one publication).
- **`_layouts/default.html`** — the single layout.
- **`_sass/_site.scss`** — the whole stylesheet, imported by the one-line `assets/css/main.scss`.
- **`images/`** — profile photo, paper teasers, favicons.

## Key Patterns

- **Single-page layout.** All content renders from `_pages/about.md`; nav links are in-page anchors.
- **Card design.** Every section is a rounded rectangle in its own colour. Themes are CSS custom properties (`--surface`, `--edge`, `--accent`, `--accent-ink`, `--glow`) set by one modifier class per card, so recolouring a section is a one-class change. See the skill for the palette table.
- **Content is data-driven.** Adding a paper or news item means editing YAML, not markup. The count pills in card headers derive from `.size`.
- **The ⌘K palette and scrollspy read sections and social links from the DOM** — don't hardcode URLs in JS.
- **Exactly one `<h1>`** (the name in the profile card); section headings are `<h2>`.

## Important

Nothing but site content belongs in this directory. Jekyll copies unknown top-level folders into `_site`, and `jekyll-sitemap` indexes them into `sitemap.xml`. Scratch work goes elsewhere, or into **both** `.gitignore` and `_config.yml: exclude`.
