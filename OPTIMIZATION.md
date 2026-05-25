# Socunbohemio website optimization

Three-pass plan agreed with the user. All three passes are complete and verified locally.

Initial state (audit): live site loaded 26 MB of images, had a 404 on every subpage's favicon, the concerts page's hamburger menu was broken, and the codebase had a duplicate tree (`./` root vs `./firebase/`) with `firebase/` being the deployed copy. Full audit findings are in the conversation history.

---

## Pass A — bugs & quick wins (DONE)

Goal: fix anything broken in production + cheap correctness/SEO/a11y wins. Low risk.

### Fixed
- **Favicon 404 on every subpage** — `./res/favicon.jpeg` resolved to `/html/res/favicon.jpeg` (didn't exist). Changed to absolute `/res/favicon.jpeg` everywhere.
- **Concerts page hamburger menu broken** — Vue was mounting on `body#concerts2`, which made the inline `<script>` tags inside body part of the Vue template; Vue stripped them with a warning and `concerts2.js` ran *before* Vue re-rendered the DOM, so its event listeners attached to detached nodes. Fixed by wrapping the Vue-driven markup in a new `#concerts-app` div and moving both `<script>` blocks (the inline Vue init and `concerts2.js`) outside that mount root.
- **`concerts2.js` crashed on hamburger click** — referenced `document.getElementById('lletres')` (only exists on the lyrics page). Plus a `page.className = 'fade'` typo that should have been `page2.className`. Both fixed.
- **Concerts page "Concerts" menu link not highlighted** as active — every other page sets `style="color: white"` on the current link; added it on both menu copies of `concerts.html`.
- **Malformed Apple Music URL** on `contacte.html` (trailing `3`). Also replaced the 200-char Google search redirect URLs on every page with the direct `music.apple.com/es/artist/socunbohemio/1436806880`.
- **Stale contact meta description** — said `carles@vidarecords.org`, page actually shows `booking@vidarecords.org`. Synced.
- **`<html lang="en">` → `lang="ca"`** on all pages.
- **Canonical URL** — `http://www.socunbohemio.com` (mixed scheme, mixed www/apex) → consistent `https://socunbohemio.com/...` per page.
- **Empty stub** `firebase/html/noticies.html` deleted (not linked from anywhere).
- **Duplicate `class=` attribute typo** on lletres desktop menu (`class="menu_tab" class="sp"` — invalid HTML) fixed to `class="menu_tab sp"`.

### Added
- **OG / Twitter meta tags** on every page (`og:type`, `og:locale=ca_ES`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`, `twitter:site`). Social platforms now get proper previews when the site is shared.
- **Accessibility attributes**: `aria-label` on icon-only social links (Instagram/Twitter/YouTube/Spotify/Amazon/Apple) and on hamburger checkboxes (`aria-label="Obrir menú"`); `alt=""` on decorative `<img>`s; `alt="Vida Records"` on the logo; `aria-current="page"` on the active menu link.

### Touched
- Footer year bumped to `2026` on all pages (was a mix of 2023/2025).

### Known regression — see Pass C
The viewport meta was changed from non-standard `width=device-width, height=device-height` to the standards-compliant `width=device-width, initial-scale=1.0`. This **exposed pre-existing CSS overflow rules** (e.g., `.opacity { width: 110% }`, `#home-overlay { width: 110% }`) that the old non-standard form was silently masking by letting mobile Safari shrink-to-fit. With `initial-scale=1.0` the menu icon scrolls off the right edge on phones. **Reverted to the old form on the 5 pages I had changed**; `lletresiacords.html` was already on the modern form in the original code. Proper fix is to clean the CSS overflow (Pass C) and then re-enable `initial-scale=1.0` cleanly.

### Verified
All 6 pages (home + 5 subpages) loaded locally via Firebase emulator: 0 console errors, 0 favicon 404s, mobile hamburger toggles correctly on concerts page (previously broken).

---

## Pass B — performance (DONE)

Goal: massive payload reduction. This is where the user-visible win lives.

### Outcome
- **`firebase/` directory: 27 MB → 4.5 MB** (84% smaller on disk)
- **Home page payload (uncompressed, first paint): ~4 MB → ~582 KB** (85% smaller)
- Largest single asset is now `grup-horitzontal.webp` at 307 KB (was a 2.3 MB JPG)

### What changed

#### Images
- **Deleted 9 unreferenced JPGs** (~9.6 MB): `botiga.jpg`, `concerts.jpg`, `contacte.jpg`, `disc.jpg`, `home_bkg.jpg`, `lletres.jpg`, `projecte.jpg`, `roba.jpg`, `spotify_green.jpeg`.
- **Re-encoded the 7 used background photos to WebP** at quality 78 (Python + Pillow): `grup-horitzontal`, `grup-vertical`, `cartell`, `pluja`, `dibujo2`, `diibujo`, `micro`.
- **Mobile-sized `-sm.webp` variants** (max width 800 px, quality 72) for each photo so mobile devices don't download a 1920 px image. Per-page CSS picks the right one via `@media (max-width: 60rem)`.
- **`og-image.jpg`** added — 1200 px JPG at quality 82 (138 KB). Used for `og:image` meta because many social platforms still don't accept WebP.

#### Icons
- **`menu.png` (1.3 MB) and `close.png` (877 KB) replaced with `menu.svg` + `close.svg`** (~250 bytes each). HTML, JS, and CSS references updated everywhere. PNGs deleted.

#### Fonts
- **TTF → WOFF2** for AlteHaas Grotesk Bold and Regular (144 KB → 48 KB each, ~66% smaller). Required `brew install woff2`. TTFs deleted.
- **Deleted 3 unused HeyTiny TTFs** (`HeyTiny.ttf`, `HeyTinyBold.ttf`, `HeyTinyThin.ttf` — declared via `@font-face` but only present in fallback chains that never trigger because Reenie Beanie always loads).
- **Dropped `Homemade Apple`** from the Google Fonts URL — declared but not referenced anywhere.
- **`font-display: swap`** added to remaining `@font-face` declarations so text renders in a fallback while the WOFF2 loads.

#### CSS / font loading
- **`styles.css`** had the identical `@import` for Google Fonts and 4 `@font-face` declarations **repeated three times** (once per media-query block). Consolidated to a single block at the top of the file.
- **Removed the redundant `<link href=".../Karla...">`** from every page — that font was already covered by `styles.css`'s `@import`. Also removed the now-pointless `<link rel="preconnect">` tags on the same pages.
- **Material Symbols variable font dropped** from `lletresiacords.html`. The full variable font was being loaded just to render 32 copies of one "download" icon. Replaced each with a 110-byte inline SVG.
- **Fixed broken path** `../micro.jpg` (missing `res/`) in `concerts.css`.

#### Caching
- **`firebase.json`** (both at root and in `firebase/`) now sets `Cache-Control`:
  - `**/*.@(webp|jpg|jpeg|png|gif|svg|ico)` → `public, max-age=31536000, immutable`
  - `**/*.@(ttf|woff|woff2|otf)` → `public, max-age=31536000, immutable`
  - `**/*.@(css|js)` → `public, max-age=2592000` (30 days)
  - `**/*.html` → `public, max-age=300, must-revalidate` (5 min)

### Verified
Home + sobreelprojecte rendered locally at both desktop (1440×900) and mobile (390×844). 0 console errors. Cache headers confirmed via `curl -I` on `.webp`, `.woff2`, and `.css`.

---

## Pass C — code cleanup + viewport hotfix (DONE)

Goal: pay down duplication and structural debt masked by Pass A + B.

### Done

1. **CSS overflow fixed + `initial-scale=1.0` re-enabled** — Six `width: 110%` overlay rules (`.opacity` ×3 in `styles.css`, `#home-overlay`, `#project-overlay`, `#lletres-overlay`) replaced with `width: 100%`. Added `html, body { overflow-x: hidden }` as defense-in-depth. Viewport meta switched back to standards-compliant `width=device-width, initial-scale=1.0` on all 5 pages. Verified: mobile body scroll width ≤ viewport width.
2. **Tree flattened** — `firebase/` contents moved to repo root; old root tree (`./html`, `./js`, `./css`, `./res`, `./fonts`, `./index.html`) deleted. `firebase.json` now sets `"public": "."` with an expanded ignore list for docs/screenshots. `.gitignore` updated to keep `.DS_Store`, `.playwright-mcp/`, and dev screenshots out of git.
3. **`lletresiacords.html` deduplicated** — `#lletres1` / `#lletres2` collapsed into one markup block sharing the standard hamburger menu. Song list shipped once instead of twice. `lletres.css` cleaned of dead `#lletres_info2` and breakpoint-specific `display: none` rules.
4. **Per-page JS unified into one `main.js`** — handles fade-in and hamburger toggle for any page via class selectors (`.fade-target`, `.menu`, `.check`, `.barras`). Adds/removes `.is-open` class on the menu; sets `aria-expanded`. Deleted: `botiga.js`, `concerts2.js`, `contacte.js`, `lletresiacords.js`, `sobreelprojecte.js`. Kept: `main.js` (rewritten), `concerts.js` (now just Vue init), plus new `analytics.js`.
5. **`styles.css` consolidated** — 928 → 315 lines (66% reduction). Hoisted everything that was identical across the three media-query blocks (`body`, `p`, `.page`, `.opacity`, `.opacity2`, `.copyright`, `.check`, `.barras`, `.credits`, `.credits_txt`, `.vida`, social-button base styles, etc.) to the top of the file. Media queries now only contain genuine breakpoint differences (sizes, layout, hamburger visibility).
6. **Concerts data externalised** — moved hardcoded `concerts: [...]` array to `res/concerts.json`. New `concerts.js` fetches and mounts Vue (Vue itself kept per the chosen option).
7. **gtag externalised** — duplicated inline gtag block on every page replaced with `<script defer src=".../analytics.js">`. New `js/analytics.js` injects the gtag library and initialises `dataLayer`.
8. **CSS micro-issues fixed** — duplicate `overflow-y: hidden` declarations collapsed during consolidation; invalid `size: 50px` removed from three `.add_title` rules in `index.css`; redundant `.checker { background-image: url(/res/menu.svg) }` removed (the inner `<img>` already provides the icon); per-page `transition-duration/transition-property` fade rules removed (now handled globally by `.fade-target`).
9. **`sitemap.xml`** — all `lastmod` timestamps refreshed from 2023-03-17 to 2026-05-25.
10. **a11y + SEO** — `aria-expanded` toggled on the hamburger checkbox by `main.js`; `MusicGroup` JSON-LD added to the home page (`@type: MusicGroup`, links to all streaming platforms via `sameAs`).

### Verified

All 6 pages (home + 5 subpages) loaded locally via Firebase emulator at desktop (1440×900) and mobile (390×844). 0 console errors. Hamburger menu opens/closes correctly with dark backdrop and `aria-expanded` state. Concerts data fetched from JSON and rendered by Vue. Mobile `body.scrollWidth` ≤ viewport width (no horizontal overflow). JSON-LD parses as `MusicGroup`.

---

## Deploying

From the repo root:

```bash
firebase deploy --only hosting
```

`firebase.json` at root sets `"public": "."`, deploying the flat layout. Dev files (`*.md`, `*.code-workspace`, screenshots, etc.) are filtered via the `ignore` list at deploy time (the emulator does not honor `ignore`, but the deploy pipeline does).

## Local preview

```bash
firebase emulators:start --only hosting
```

Default port is 5000 (or 5001/5002 if taken). The Firebase Hosting emulator caches assets — when iterating on static files, kill and restart it to pick up file changes, or use `?nc=1` query strings to bypass the browser cache on navigation.
