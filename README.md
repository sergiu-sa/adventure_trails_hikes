# Adventure Trails Hikes

A responsive, accessible HTML / CSS / JS website for a fictional extreme-hiking outfitter, built as a semester exam project at Noroff (resit, year 1, 4th semester).

Live: <https://adventuretrailshikes.netlify.app/>

---

## Project Overview

This project demonstrates semantic HTML, modular CSS architecture, accessibility best practices, SEO, and responsive layouts. The original brief was HTML + CSS only; the resit version adds vanilla JavaScript for the first-visit intro, gallery lightbox, scroll progress, lazy-load, and CSS-only filter logic.

## Folder Structure

```plaintext
/
├── index.html
├── about.html
├── hikes.html
├── sustainability.html
├── gallery.html
├── contact.html
├── README.md
├── favicon.svg
├── favicon.ico         # 32px fallback for browsers without SVG favicons
├── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── _headers            # Netlify cache headers
├── fonts/              # self-hosted woff2 files + their OFL licences
├── images/
│   └── opt/            # resized AVIF/WebP hero photos
├── scripts/
│   └── main.js
└── styles/             # linked from each page in this order
    ├── variables.css
    ├── base.css
    ├── layout.css
    ├── components.css
    └── utilities.css
```

## Features

- Fully responsive (mobile, tablet, desktop)
- Modular CSS — design tokens, base, layout, components, utilities
- Semantic HTML5 + accessibility (skip link, focus rings, ARIA roles, prefers-reduced-motion)
- SEO: Open Graph and Twitter card meta, canonical URLs, sitemap, robots.txt, alt attributes, headings hierarchy
- Speed: self-hosted fonts with the heading font preloaded, stylesheets linked directly (no `@import` chain), hero photos as `<picture>` with AVIF/WebP and `fetchpriority="high"`, `loading="lazy"` below the first screen, hikes hover photos fetched on first hover
- First-visit intro with a cartographic radar-pulse motif (about 0.6 s, once per browser session, timed in CSS so it never blocks the page)
- Cross-fade between pages with the browser's built-in View Transitions (no library; other browsers navigate normally)
- Reduced motion respected: no intro, page fades, smooth scrolling, counters, parallax or scroll reveals
- Cross-page filtering on hikes (region) and gallery (category) — pure CSS via `:checked ~` sibling selectors
- Real Google Maps embed on contact, with brand-coloured Pin sticker overlay
- Lightbox gallery, page progress indicator, lazy-load, copy-to-clipboard, toast notifications
- Form validation with hazard-Pin error states reserved for accessibility signal

## Tech Stack

- HTML5
- Custom CSS with CSS variables, modular files
- Vanilla JavaScript (first-visit intro, lightbox, scroll/UX enhancements)
- No frameworks, no build step

---

## Design System

### Palette — Cartographic

A seven-colour palette inspired by the visual language of topographic maps. Every colour has a defined semantic job.

| Token | Hex | Role |
| --- | --- | --- |
| **Snow** | `#F0E8CE` | Primary light surface — paper / parchment background |
| **Ridge** | `#C79C4E` | Gold accent — contour shading, decorative lines, on-dark labels |
| **Slope** | `#8A6C3A` | Earth brown — borders, mono labels, mid-grade difficulty |
| **Forest** | `#3E5432` | Deep moss — primary action colour, calm/easy semantic, sustainability |
| **Depth** | `#1E3A5F` | Deep navy — featured-expedition slab, dusk-overlay on heroes |
| **Pin** | `#CC3D23` | The location-marker red — reserved for cartographic pins, stamps, T5 alpine, focus rings, errors, emergency |
| **Ink** | `#14110B` | Near-black — type, full-bleed slabs, footer |

The palette is used as a **functional cartographic system**, not as decoration. Forest leads action, Ridge appears on dark surfaces, Slope handles warm decorative roles, Depth is reserved for the "deep valley" feature slab, Pin is treated as the literal map pin and only appears in markers, stamps, the alpine-grade difficulty bar, and accessibility-critical states.

### Typography

- **Display**: [Archivo Black](https://fonts.google.com/specimen/Archivo+Black) — set uppercase, tight letter-spacing, used for H1, H2, H3, manifesto, numerals
- **Body**: [Geist](https://fonts.google.com/specimen/Geist) — clean, characterful sans-serif (replaces Inter, which felt generic)
- **Meta / data**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — used uppercase tracked for spec sheets, coordinates, time stamps, calendar months, technical labels

All three are served from `fonts/` (Latin subset, woff2, SIL Open Font Licence) rather than from Google's servers, which saves two cross-origin connections before the first heading can paint.

Headlines on every page (and major sections) are numbered with a `01 /` prefix integrated into the display family — the number is part of the type, not a separate meta-label above it (Direction C in the design log).

### Layout & Architecture

- Sharp full-bleed slabs (hero, manifesto, featured expedition, footer, marquee, departures strip)
- Hairline 1px Ink borders for everything else
- Tiled grid containers with rounded outer corners + `overflow: hidden` (regions bar, achievements grid, sustainability features, commitments list, method grid, timeline, giant-stat ledger, spec sheet, departures calendar)
- Isolated card grids with `gap` between cards (cards/dispatch/testimonials) — each card stands alone with full hairline frame + radius
- Asymmetric 70/30 splits (origin prose + metadata column on About; editorial blocks on home)
- Photo-led heroes with grain overlay + Forest dusk gradient at the bottom
- Cartographic first-visit intro: concentric contour rings (one per palette colour) pulsing outward from a Pin marker, brand wordmark in Ridge gold, "Plotting route…" status in mono

### Hero images

The heroes load from `images/opt/`, made from the originals in `images/` at 640, 1024 and 1600 px wide, plus the original's own width (never wider). On macOS:

```sh
sips -s format avif -s formatOptions 40 --resampleWidth 1024 images/about.jpg --out images/opt/about-1024.avif
cwebp -q 60 -m 6 -resize 1024 0 images/about.jpg -o images/opt/about-1024.webp
```

If a file comes out larger than its JPEG (`hero-home-1000.webp` did), lower the quality. Keep AVIF width and height even (use `-z <height> <width>` to round): `sips` tiles large AVIFs, and Chrome decodes a tiled AVIF with an odd height but never paints it (`hikes_1-2048.avif` at 2048×1365 showed no photo). Images are cached for a week (`_headers`), so a replaced photo can take that long to reach returning visitors.

---

## Deployment (via Netlify)

1. Push this folder to a GitHub repo.
2. Sign in to <https://netlify.com> and import the repo.
3. Publish directory: `/`
4. Click **Deploy**.

Live URL: <https://adventuretrailshikes.netlify.app/>
