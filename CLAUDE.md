# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academic personal homepage for Haonan Duan (robotics researcher), built on the AcadHomepage template (forked from RayeRen/acad-homepage.github.io). Hosted on GitHub Pages at haonan-duan.github.io.

## Tech Stack

- **Static Site Generator**: Jekyll 3.9.0 (via GitHub Pages gem)
- **CSS**: SASS/SCSS, based on Minimal Mistakes theme by Michael Rose
- **JS**: jQuery 1.12.4 with plugins (magnific-popup, greedy-navigation, smooth-scroll)
- **Automation**: Python (scholarly library) for Google Scholar citation crawling

## Development Commands

```bash
# Install dependencies
bundle install

# Run local dev server with live reload
bash run_server.sh
# Or directly:
bundle exec jekyll serve -l

# Site available at http://127.0.0.1:4000
```

## Architecture

- **`_pages/about.md`** — The main (and only) content page. Contains all sections: About Me, News, Publications, Educations, Experiences. This is where most content edits happen.
- **`_config.yml`** — Site-wide configuration: author info, social links, plugins, timezone (Asia/Shanghai).
- **`_includes/`** — HTML partials (author-profile, masthead, head, sidebar, scripts, SEO, analytics, scholar stats fetcher).
- **`_layouts/default.html`** — Single layout wrapping all pages; uses a "compress" layout for HTML minification.
- **`_sass/`** — SCSS files. Custom styles for paper-box, badge, and visitor-map are appended in `assets/css/main.scss`.
- **`_data/navigation.yml`** — Main menu links (anchor links within the single page).
- **`images/`** — Profile photo (`haonan.png`), paper preview images, favicons.
- **`google_scholar_crawler/`** — Python script (`main.py`) that fetches citation data via `scholarly`. Runs daily via GitHub Actions (`.github/workflows/google_scholar_crawler.yaml`), commits results to `google-scholar-stats` branch.

## Key Patterns

- The site is essentially a **single-page layout** — `_pages/about.md` renders all content, and navigation links are in-page anchors.
- Publications use a custom `paper-box` HTML/CSS component defined inline in `about.md` with styling in `assets/css/main.scss`.
- MathJax is loaded via `_includes/head/custom.html` for rendering equations.
- Google Scholar stats are fetched client-side from the `google-scholar-stats` branch JSON files via `_includes/fetch_google_scholar_stats.html`.
