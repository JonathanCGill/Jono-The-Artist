# CLAUDE.md

## Project Overview

This is the source for **jonoart.co.za** ("Jono, the Artist"), a static art portfolio site for Jonathan Gill. It is built with MkDocs using the Material theme, hosted on GitHub Pages. The site presents the paintings and drawings (acrylic, Acryla gouache and watercolour), a gallery catalogue, stories behind selected pieces, and personal essays.

There is no application code. The repository is content (Markdown, images), theme overrides (HTML/CSS), and a single GitHub Actions workflow that builds and deploys the site.

## Tech Stack

- **MkDocs** with the `mkdocs-material` theme
- CSS in `docs/stylesheets/jono.css` (current design system) and `docs/stylesheets/custom.css` (older system, still used by stories, essays and About)
- Theme overrides in `overrides/` (custom header partial, full-bleed home template, Google Analytics injection)
- Markdown extensions: `attr_list`, `md_in_html` (both required for the gallery / story / essay layouts to render)
- Search plugin disabled
- Deployed via `.github/workflows/deploy.yml` to GitHub Pages on push to `main`

## Repository Layout

```
.
├── mkdocs.yml              # Site config and nav
├── docs/                   # All site content
│   ├── index.md            # Home (hero, Aeromechanica, Rurban, Parareal, stories, about)
│   ├── collection.md       # The full collection: everything not on the home page
│   ├── catalogue.md        # Gallery catalogue table (mirrors catalogue.csv)
│   ├── catalogue.csv       # Downloadable catalogue, must stay in sync with catalogue.md
│   ├── essays.md           # Essay index
│   ├── about.md            # About page
│   ├── essays/             # Individual essay Markdown files
│   ├── stories/            # Story pages (one folder per painting or series)
│   │   ├── index.md
│   │   └── <Painting Name>/index.md  # plus that painting's source photos
│   ├── acrylic/            # Acrylic painting JPGs
│   ├── watercolours/       # Watercolour JPGs
│   ├── Drawings/           # Ink and ink-and-watercolour drawing JPGs
│   ├── photos/             # Site photos (e.g. logo)
│   ├── stylesheets/
│   │   ├── jono.css        # The current design system (.jono-* classes)
│   │   └── custom.css      # Older system, still used by stories, essays and About
│   ├── favicon.ico, favicon.png
├── overrides/
│   ├── main.html           # Critical header CSS, preconnects, icons, OG tags, Google Analytics
│   ├── home.html           # Full-bleed template used by index/collection/catalogue
│   └── partials/
│       ├── header.html     # Custom header and section nav
│       └── logo.html       # Logo with real dimensions and meaningful alt text
└── .github/workflows/
    ├── deploy.yml          # Builds and deploys to GitHub Pages
    └── blank.yml           # Placeholder CI
```

## Build and Local Preview

```
pip install mkdocs-material
mkdocs serve     # live preview at http://127.0.0.1:8000
mkdocs build     # outputs to ./site (gitignored)
```

The deploy workflow runs `mkdocs build` and uploads `site/` to GitHub Pages. There are no tests or linters.

## Navigation

`mkdocs.yml` defines the nav. When adding a new top-level page, story or essay,
update the `nav:` block. Story and essay sub-pages must be listed individually to
appear in the sidebar.

The header in `overrides/partials/header.html` is the primary navigation and is
shown on every page. The home-template pages have no sidebar, so any page that is
not linked from the header or from home-page body content is unreachable for most
visitors. Check this when adding a page.

## The Catalogue

`docs/catalogue.md` (an HTML table) and `docs/catalogue.csv` (the download) hold the
same data and must be edited together: same refs, titles, mediums, supports, sizes,
years and notes. The `N works catalogued` count on the page must match the number of
rows. Every work shown on a gallery page should have a catalogue entry, and sizes
and years quoted on the gallery pages must match the catalogue. Where a detail has
not been recorded, leave it blank rather than guessing.

Works in the Know Where series carry their position in the `Notes` field and in the
matching description on the collection page ("The seventh Know Where work, the sixth
drawing"). The series is currently one painting and seven drawings. Adding to it
means updating the catalogue note, the collection-page description and the story at
`docs/stories/The-Road-to-Know-Where/index.md`, which states the count in its front
matter and its opening line.

## Page Conventions

Two layout systems coexist. Do not mix them on one page.

### Home-template pages (`index.md`, `collection.md`, `catalogue.md`)

These carry `template: home.html` in the front matter and are written as raw HTML
sections using the `.jono-*` classes from `jono.css`. They render full-bleed with no
sidebar. A typical work card is:

```html
<div class="jono-item">
  <div class="jono-frame"><img loading="lazy" decoding="async" src="/watercolours/Name.jpg" width="3279" height="2279" alt="Meaningful description"></div>
  <h3 class="jono-item__title">Title</h3>
  <p class="jono-item__spec jono-spec">A3 · Watercolour · 300gsm Hot Press · 2025</p>
  <p class="jono-item__desc">Optional one or two sentences.</p>
  <a class="jono-textlink" href="/stories/<Folder>/">Read the story →</a>
</div>
```

`width` and `height` must be the image's real pixel dimensions, not the paper or
canvas size. They reserve the correct aspect box and stop the page shifting as
images load. Every image on the site carries them, Markdown ones included: on a
Markdown page put them in the `attr_list` braces, as
`{ .story-img loading=lazy width="3279" height="2279" }`. Without them a lazy
image collapses to nothing until it loads and the page jumps. Grid wrappers are `.jono-row3`, `.jono-wc`, `.jono-squad__grid` and
`.jono-draw__grid`. Root-absolute paths (`/watercolours/...`) are correct here
because the site is served at a domain root.

Every page must have exactly one `<h1>`. On the home-template pages that is a
`<h1 class="jono-h2">` inside the intro block.

### Markdown pages (stories, essays, `about.md`, `essays.md`, `stories/index.md`)

These use the default Material template and the older `custom.css` classes
(`.gallery-grid`, `.gallery-card`, `.card-info`, `.card-medium`, `.story`,
`.essay`, `.about-hero`). The `markdown` attribute on each `<div>` is required for
the inner Markdown to render (this is what `md_in_html` enables).

### Stories (`docs/stories/<Painting Name>/index.md`)

Story pages live in their own folder so the source photographs sit next to the page
that uses them. Layout:

- H1 title (hidden by CSS but used as the MkDocs page heading)
- `<div class="story" markdown>` wrapper
- A leading `<div class="story-image">` showing the finished painting (with an `.image-label`)
- `<div class="story-images story-images--three">` grid of source photographs, each in a `<div class="story-image">` with an `.image-label`
- `<div class="story-text">` containing the narrative

All image paths in stories are relative to the story folder, not `docs/`. Link to
other pages with an explicit `index.md` target so MkDocs can resolve and validate
them.

### Essays (`docs/essays/*.md`)

Essays follow a strict structure (this matches the writing style guidance below):

1. H1 essay title (rendered by MkDocs as the page heading; the `.md-typeset h1` rule hides duplicate H1s in body content)
2. `<div class="essay" markdown>` wrapper
3. `<div class="essay-meta" markdown>` containing H2 essay title then H3 author and date, with no extra whitespace
4. Body using H2 section headings and prose paragraphs
5. Closing italic disclaimer: `*This is a personal essay. The views are my own.*`
6. Closing `</div>` for the essay wrapper

No horizontal rules, no border in the meta block, minimal whitespace between
structural elements. Keep the section count low: a section that restates an earlier
one should be merged into it, not kept for symmetry.

Add new essays to the `essay-list` on `essays.md` as an `essay-card` with title,
author and date, and a one-line summary, and add them to the `nav:` block.

### Front matter

Every page carries a `description:` in its front matter. This becomes the page's
meta description; without it the page falls back to the site-wide default and every
page ends up with an identical search snippet.

## Image Conventions

- Filenames are human-readable with spaces (e.g. `Cantabrian Mountains.jpg`). In Markdown, encode spaces as `%20`.
- Acrylic paintings live in `docs/acrylic/`, watercolours in `docs/watercolours/`, drawings in `docs/Drawings/`. Site photos and the logo go in `docs/photos/`.
- Place names in titles, alt text and filenames must be spelled correctly (Dunnet Head, Bilbao, Cafe 't Sluisje). Story folders keep their own copy of a painting, so a rename has to be applied in both places.
- Story-specific photographs live alongside the story's `index.md` in `docs/stories/<Painting Name>/`.
- Always include meaningful alt text for accessibility.

## CSS Conventions

`docs/stylesheets/jono.css` is the current design system and carries the home,
collection and catalogue pages. `docs/stylesheets/custom.css` is the older system
and still carries stories, essays, the essay index and About. Both load on every
page. Key classes:

- Home system: `.jono-hero`, `.jono-statement`, `.jono-series`, `.jono-aero`, `.jono-rurban`, `.jono-surreal`, `.jono-item`, `.jono-frame`, `.jono-spec`, `.jono-textlink`, `.jono-linkrow`, `.jono-catalog`, `.jono-cat-table`
- Stories: `.story`, `.story-images` (`--three` variant), `.story-image`, `.image-label`, `.story-text`
- Essays: `.essay`, `.essay-meta`, `.essay-list`, `.essay-card`, `.essay-card-content`
- Galleries (stories index): `.gallery-grid`, `.gallery-card`, `.card-info`, `.card-medium`
- About: `.about-hero`, `.about-photo`, `.about-img`, `.about-text`
- Shared: `.social-links`

`jono.css` sets its palette on `:root` with `--j-*` variables; `custom.css` uses
`--cream`, `--brown`, `--sienna`. Reuse these rather than introducing new colours.
Do not leave rules behind for markup you have deleted.

The site is centred on a desktop breakpoint of 960px. Most layouts collapse from
multi-column to single-column at 700px and 480px. Test changes against both desktop
and mobile.

## Theme Overrides

- `overrides/main.html` extends `base.html` to add the Open Graph and Twitter card
  tags, the apple-touch-icon, `preconnect` hints for the font and icon hosts, a
  small block of critical header CSS, and the Google Analytics gtag snippet.
  The critical CSS exists because `jono.css` is the last of eight render-blocking
  stylesheets and four of those are third-party, so without it the masthead can
  paint with default blue underlined links. Those rules are a copy of the ones in
  `jono.css` and must be changed in step with it.
- `overrides/partials/header.html` replaces the default Material header so the
  "Jono, the Artist" wordmark always sits next to the logo. Search and repo source
  UI are deliberately omitted. It is the primary navigation: the home-template
  pages have no sidebar, so a page missing from this nav is unreachable for most
  visitors.
- `overrides/partials/logo.html` exists only so the logo carries its real pixel
  dimensions and real alt text; the theme default supplies neither.

## Deployment and Branching

- The default branch is `main`. Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds with `mkdocs build` and publishes via `actions/deploy-pages@v4`.
- Feature work happens on a branch (typically `claude/<short-description>-<id>`) and is merged via PR. Do not push directly to `main`.
- Do not commit the `site/` directory. It is ignored.

## Writing Style: Jonathan Gill

First person, opinionated, practitioner voice. Write as someone who works in the field and has formed views through direct experience, not academic observation.

Tone is measured but direct. State positions clearly. Do not hedge excessively, but acknowledge counterpoints honestly and engage with them rather than dismissing them. Sceptical but not cynical. Confident but not dogmatic.

Sentences are mostly short to medium length. Use longer sentences sparingly and for effect, not as default. No em dashes. Use full stops, commas, colons, and parentheses for clause separation instead. No bullet points in prose. No exclamation marks. No emojis.

Do not use filler phrases like "It's worth noting," "It's important to remember," "Let's dive in," or "In today's world." Do not open with questions addressed to the reader. Do not use the word "landscape" outside of geography.

Concrete over abstract. Ground arguments in real examples from enterprise, governance, security, and financial services. Specific beats generic. If a point can be illustrated with something observed rather than something theorised, use the observation.

Maintain a single conceptual thread through any piece. Every section should advance the argument, not repeat it in different language. If two sections make the same point, merge or cut one.

Admit what you do not know. Admit when the counterargument is strong. Admit when you are implicated in the thing you are criticising. Self-awareness is a credibility signal, not a weakness.

Do not summarise at the end what was already said. End hard. The last line should land, not recap.

British English spelling throughout.
