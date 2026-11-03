# CLAUDE.md

## Project Overview

This is the source for **jonoart.co.za** ("Jono, the Artist"), a static art portfolio site for Jonathan Gill. It is built with MkDocs using the Material theme, hosted on GitHub Pages. The site presents the paintings and drawings (acrylic, Acryla gouache and watercolour), a gallery catalogue, stories behind selected pieces, and personal essays.

There is no application code. The repository is content (Markdown, images), theme overrides (HTML/CSS), and a single GitHub Actions workflow that builds and deploys the site.

## Tech Stack

- **MkDocs** with the `mkdocs-material` theme
- CSS in `docs/stylesheets/site.css` (the current Modernist system: tokens, header, footer, home, series, story), `docs/stylesheets/jono.css` (older blueprint system, still used by collection and catalogue) and `docs/stylesheets/custom.css` (oldest system, still used by most stories, essays and About)
- One small script, `docs/javascripts/viewer.js`, for the full-screen viewer on the series pages
- Theme overrides in `overrides/` (custom header partial, full-bleed home template, series template, Google Analytics injection)
- Markdown extensions: `attr_list`, `md_in_html` (both required for the gallery / story / essay layouts to render)
- Search plugin disabled
- Deployed via `.github/workflows/deploy.yml` to GitHub Pages on push to `main`

## Repository Layout

```
.
├── mkdocs.yml              # Site config and nav
├── docs/                   # All site content
│   ├── index.md            # Home (hero, statement, series doors, stories, banner)
│   ├── series/             # One page per series; works listed in front matter
│   │   └── rurban.md, parareal.md, watercolour.md, aeromechanica.md
│   ├── collection.md       # The full collection: everything not on a series page
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
│   ├── javascripts/
│   │   └── viewer.js       # Full-screen viewer for the series pages
│   ├── stylesheets/
│   │   ├── site.css        # The current Modernist system (.m-* classes)
│   │   ├── jono.css        # Older blueprint system (.jono-*): collection, catalogue
│   │   └── custom.css      # Oldest system, still used by stories, essays and About
│   ├── favicon.ico, favicon.png
├── overrides/
│   ├── main.html           # Critical header CSS, preconnects, icons, OG tags, Google Analytics
│   ├── home.html           # Full-bleed template: index, collection, catalogue, The Last Holiday story
│   ├── series.html         # Series template: ruled works grid + viewer, driven by front matter
│   └── partials/
│       ├── header.html     # "Jono" + series, Stories, About nav
│       └── logo.html       # Logo with real dimensions and meaningful alt text
└── .github/workflows/
    └── deploy.yml          # Builds and deploys to GitHub Pages
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

## Series Pages

`docs/series/<key>.md` carry `template: series.html` and no body. Everything
is in the front matter: `name`, `blurb`, `next` (`{ name, url }`, in the order
Rurban → Parareal → Watercolour → Aeromechanica → Rurban) and a `works` list.
Each work has `title`, `slug` (the viewer's URL hash, unique per page), `src`
(root-absolute, encoded), `w` and `h` (real pixel dimensions), `alt`, `meta`
(size · medium · support · year, taken from the catalogue) and optional
`note` and `story` (root-absolute story URL; the viewer shows "Read the
story" only when it is set). The works count on the page is computed, but the
counts on the home-page series doors are typed by hand and must be updated
when a series changes. Aeromechanica is deliberately left off the home-page
doors and reached from the header only.

## The Catalogue

`docs/catalogue.md` (an HTML table) and `docs/catalogue.csv` (the download) hold the
same data and must be edited together: same refs, titles, mediums, supports, sizes,
years and notes. The `N works catalogued` count on the page must match the number of
rows. Every work shown on a gallery or series page should have a catalogue entry, and sizes
and years quoted on the gallery pages must match the catalogue. Where a detail has
not been recorded, leave it blank rather than guessing.

Works in the Know Where series carry their position in the `Notes` field and in the
matching description on the collection page ("The seventh Know Where work, the sixth
drawing"). The series is currently three paintings and seven drawings. Adding to it
means updating the catalogue note, the collection-page description and the story at
`docs/stories/The-Road-to-Know-Where/index.md`, which states the count in its front
matter and its opening line.

## Page Conventions

Two layout systems coexist. Do not mix them on one page.

### Modernist pages (`index.md`, `series/*.md`, `stories/The Last Holiday/index.md`)

The home page and The Last Holiday story carry `template: home.html` and are
raw HTML wrapped in a single `<div class="m">`, using the `.m-*` classes from
`site.css`. Rules of the system: Archivo only, zero border-radius, structure
from 2px `--color-divider` rules, everything flush left, accent red only for the
current nav item, kicker labels and the red banner. Paintings are always shown
in full colour; only the reference photograph on a story page is greyscale.
The Last Holiday is the template for converting the other stories: kicker and
giant title with standfirst, the painting on a surface band, reference photo
beside the text, a three-cell details grid, a closing line, the "This painting
is an original" banner and the two ruled "more" links.

### Blueprint pages (`collection.md`, `catalogue.md`)

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
`.jono-draw__grid`. Cards inside the dark `.jono-draw__grid` use
`.jono-item__frame` instead of `.jono-frame`, which is the same frame on a dark
ground. Root-absolute paths (`/watercolours/...`) are correct here
because the site is served at a domain root.

Every page must have exactly one `<h1>`. On the blueprint pages that is a
`<h1 class="jono-h2">` inside the intro block; on the Modernist pages it is the
statement heading (home) or the `.m-display` title (series, story).

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

`docs/stylesheets/site.css` is the current design system and carries the
header, footer, home, series pages, viewer and The Last Holiday story.
`docs/stylesheets/jono.css` is the older blueprint system and carries the
collection and catalogue pages. `docs/stylesheets/custom.css` is the oldest
and still carries the other stories, essays, the essay index and About. All
three load on every page, in that order reversed (custom, jono, site). Key classes:

- Modernist system: `.m`, `.m-header`, `.m-footer`, `.m-wrap`, `.m-rule`, `.m-kicker`, `.m-display`, `.m-lead`, `.m-h2`, `.m-head`, `.m-caption`, `.m-banner` (`--story`), `.m-button`, `.m-cells`, `.m-door`, `.m-storylist`, `.m-works`, `.m-work`, `.m-viewer`, `.m-plate`, `.m-story-body`, `.m-ref`, `.m-prose`, `.m-details`, `.m-closing`, `.m-more__cell`
- Blueprint system: `.jono-rurban`, `.jono-surreal`, `.jono-intro`, `.jono-item`, `.jono-frame`, `.jono-row3`, `.jono-spec`, `.jono-textlink`, `.jono-catalog`, `.jono-cat-table`
- Stories: `.story`, `.story-images` (`--three` variant), `.story-image`, `.image-label`, `.story-text`
- Essays: `.essay`, `.essay-meta`, `.essay-list`, `.essay-card`, `.essay-card-content`
- Galleries (stories index): `.gallery-grid`, `.gallery-card`, `.card-info`, `.card-medium`
- About: `.about-hero`, `.about-photo`, `.about-img`, `.about-text`
- Shared: `.social-links`

`site.css` sets the Modernist tokens on `:root` (`--color-bg`, `--color-surface`,
`--color-text`, `--color-accent` and its 600/700 shades, `--color-divider`,
`--color-neutral-*`, `--shadow-md`, `--font-body`, `--m-gutter`); `jono.css`
uses `--j-*` variables; `custom.css` uses `--cream`, `--brown`, `--sienna`.
`site.css` loads last and owns `body`, `.md-main`, `.md-container`, the header
and the footer; `jono.css` keeps the sidebar and `.md-main__inner` layout rules.
Put page-chrome rules in `site.css` rather than duplicating them. Reuse these
colours rather than introducing new ones. Material's own font loading is off
(`font: false`); Archivo comes from the Google Fonts link in `extra_css`.
Do not leave rules behind for markup you have deleted.

Modernist pages sit in a 1600px container with `clamp()` gutters and
`auto-fit`/`auto-fill` grids, so they need no breakpoints. Blueprint and
Markdown pages sit in 1280px. `jono.css` breaks at 860px, 700px and 560px,
`custom.css` at 960px, 700px and 480px. Test
changes against both desktop and mobile.

## Theme Overrides

- `overrides/main.html` extends `base.html` to add the Open Graph and Twitter card
  tags, the apple-touch-icon, `preconnect` hints for the font and icon hosts, a
  small block of critical header CSS, and the Google Analytics gtag snippet.
  The critical CSS exists because `site.css` is the last of several
  render-blocking stylesheets and some are third-party, so without it the
  masthead can paint with default blue underlined links. Those rules are a copy
  of the header rules in `site.css` and must be changed in step with it. The
  same file holds the site footer.
- `overrides/partials/header.html` replaces the default Material header with
  "Jono" and the nav: the four series, Stories and About, with the current one
  marked `aria-current` (accent red). Search and repo source UI are deliberately
  omitted. It is the primary navigation alongside the footer links (Collection,
  Catalogue, Essays, Instagram, Facebook): the full-bleed pages have no sidebar,
  so a page in neither is unreachable for most visitors.
- `overrides/series.html` renders a series page from its front matter and loads
  `javascripts/viewer.js`. The viewer: Esc closes, arrow keys and swipes step
  (wrapping), a backdrop click closes, focus is trapped and restored, and the
  open work's `slug` is kept in the URL hash so it can be shared.
- `overrides/partials/logo.html` is currently unused (the header no longer shows
  the logo) but is kept so the theme default never emits a logo without
  dimensions or alt text.

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
