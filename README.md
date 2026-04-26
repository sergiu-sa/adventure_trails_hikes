# Adventure Trails Hikes

A responsive, accessible HTML / CSS / JS website for a fictional extreme-hiking outfitter, built as a semester exam project at Noroff (resit, year 1, 4th semester).

Live: <https://adventuretrailshikes.netlify.app/>

---

## Project Overview

This project demonstrates semantic HTML, modular CSS architecture, accessibility best practices, SEO, and responsive layouts. The original brief was HTML + CSS only; the resit version adds vanilla JavaScript for the page loader, page transitions, gallery lightbox, scroll progress, lazy-load, and CSS-only filter logic.

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
├── images/
├── scripts/
│   └── main.js
└── styles/
    ├── variables.css
    ├── base.css
    ├── layout.css
    ├── components.css
    ├── utilities.css
    └── main.css
```

## Features

- Fully responsive (mobile, tablet, desktop)
- Modular CSS — design tokens, base, layout, components, utilities
- Semantic HTML5 + accessibility (skip link, focus rings, ARIA roles, prefers-reduced-motion)
- SEO: Open Graph meta, alt attributes, headings hierarchy
- Page loader with cartographic radar-pulse motif (visible on every page until window.load)
- Smooth page transitions between internal links
- Cross-page filtering on hikes (region) and gallery (category) — pure CSS via `:checked ~` sibling selectors
- Real Google Maps embed on contact, with brand-coloured Pin sticker overlay
- Lightbox gallery, page progress indicator, lazy-load, copy-to-clipboard, toast notifications
- Form validation with hazard-Pin error states reserved for accessibility signal

## Tech Stack

- HTML5
- Custom CSS with CSS variables, modular files
- Vanilla JavaScript (page loader, transitions, lightbox, scroll/UX enhancements)
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

Headlines on every page (and major sections) are numbered with a `01 /` prefix integrated into the display family — the number is part of the type, not a separate meta-label above it (Direction C in the design log).

### Layout & Architecture

- Sharp full-bleed slabs (hero, manifesto, featured expedition, footer, marquee, departures strip)
- Hairline 1px Ink borders for everything else
- Tiled grid containers with rounded outer corners + `overflow: hidden` (regions bar, achievements grid, sustainability features, commitments list, method grid, timeline, giant-stat ledger, spec sheet, departures calendar)
- Isolated card grids with `gap` between cards (cards/dispatch/testimonials) — each card stands alone with full hairline frame + radius
- Asymmetric 70/30 splits (origin prose + metadata column on About; editorial blocks on home)
- Photo-led heroes with grain overlay + Forest dusk gradient at the bottom
- Cartographic page loader: concentric contour rings (one per palette colour) pulsing outward from a Pin marker, brand wordmark in Ridge gold, "Plotting route…" status in mono

---

## Deployment (via Netlify)

1. Push this folder to a GitHub repo.
2. Sign in to <https://netlify.com> and import the repo.
3. Publish directory: `/`
4. Click **Deploy**.

Live URL: <https://adventuretrailshikes.netlify.app/>
