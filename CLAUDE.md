# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Official website for the Catalan musical project **Socunbohemio** (https://socunbohemio.com). Pure static site — HTML, CSS, vanilla JS, with Vue 3 loaded from a CDN on one page only (concerts). No build step, no package manager, no tests, no linter. All page copy is in Catalan.

Hosted on Firebase Hosting. Project ID is `socunbohemio-8c18c` (see `.firebaserc`).

## Common commands

```bash
# Local preview (serves the firebase/ directory, the same content that gets deployed)
firebase emulators:start --only hosting
# or
firebase serve --only hosting

# Deploy to production (from repo root)
firebase deploy --only hosting
```

Both `firebase.json` (root) and `firebase/firebase.json` declare `"public": "firebase"`, so deploy from the repo root.

## Repo layout — the important gotcha

There are **two parallel copies** of the site:

- **Root tree** — `index.html`, `html/`, `js/`, `css/`, `res/`, `fonts/`.
- **`firebase/` tree** — `firebase/index.html`, `firebase/html/`, `firebase/js/`, `firebase/css/`, `firebase/res/`, `firebase/fonts/`, plus `firebase/sitemap.xml` and `firebase/404.html`.

Firebase Hosting serves **only the `firebase/` tree**. The root tree is older/source-of-truth-in-name-only and has drifted from the deployed copy — files with the same name are not identical (e.g. `index.html` vs `firebase/index.html`, `html/concerts.html` vs `firebase/html/concerts.html`).

**Rule of thumb:** when making a change that needs to ship, edit the file under `firebase/`. If you also want the root tree to reflect the change, mirror it explicitly — don't assume it's automatic. Before editing, `diff` the two copies of the file you're about to touch so you don't accidentally revert a live edit.

## Page structure

Each top-level page is a self-contained HTML file under `firebase/html/` with a matching CSS file under `firebase/css/` and a matching JS file under `firebase/js/`:

- `index.html` (root of the firebase tree) — landing page, links to streaming/social
- `sobreelprojecte.html` — about
- `concerts.html` — upcoming shows (Vue-powered, see below)
- `botiga.html` — shop
- `lletresiacords.html` — lyrics & chords
- `contacte.html` — contact
- `noticies.html` — news
- `404.html` — Firebase Hosting 404

`css/styles.css` is the shared base; each page also pulls its page-specific stylesheet. Each page's JS file is small and does two things only: a fade-in on `DOMContentLoaded` and a hamburger-menu toggle keyed to that page's specific element IDs (`menu0`, `check0`, `barras0`, etc. — IDs differ per page, which is why each page has its own JS).

## Concerts page — the only non-trivial JS

`firebase/html/concerts.html` is the exception to "pure static." It loads Vue 3 from `unpkg.com/vue@3.0.11/dist/vue.global.js` and mounts an app on `#concerts2`. **The concert list is hardcoded inline at the bottom of the HTML file** (a `concerts: [...]` array inside `Vue.createApp({ data() { ... } })`). To add or remove shows, edit that array directly in the HTML — there is no external data file.

`firebase/js/concerts.js` and `firebase/js/concerts2.js` handle the page's fade-in and menu toggle only; they don't touch the concert data.

## Analytics

Every page embeds Google Analytics gtag (`G-B3HPPDSQHQ`) inline in `<head>`. Keep it in sync if you copy/clone a page template.

## Conventions worth knowing

- All paths inside `firebase/html/*.html` are relative and prefixed with `../` (e.g. `../css/styles.css`, `../res/menu.png`, `../js/foo.js`). The root `index.html` and `firebase/index.html` use non-prefixed paths because they sit one level up.
- Catalan copy throughout — keep new strings in Catalan unless the user says otherwise.
- The footer year is hardcoded per page (some pages still say `© Socunbohemio, 2023.`, others `2025.`) — check before bumping.
