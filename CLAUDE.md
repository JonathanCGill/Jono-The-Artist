# CLAUDE.md

## Project Overview

This is the source for **jonothegill.com** (also known as "Jono, the Artist"), a static art portfolio site for Jonathan Gill. It is built with MkDocs using the Material theme, hosted on GitHub Pages. The site presents galleries of paintings (acrylic and watercolour), stories behind selected pieces, and personal essays.

There is no application code. The repository is content (Markdown, images), theme overrides (HTML/CSS), and a single GitHub Actions workflow that builds and deploys the site.

## Tech Stack

- **MkDocs** with the `mkdocs-material` theme
- Custom CSS in `docs/stylesheets/custom.css` (warm cream/brown/sienna palette)
- Theme overrides in `overrides/` (custom header partial, Google Analytics injection)
- Markdown extensions: `attr_list`, `md_in_html` (both required for the gallery / story / essay layouts to render)
- Search plugin disabled
- Deployed via `.github/workflows/deploy.yml` to GitHub Pages on push to `main`

## Repository Layout

```
.
├── mkdocs.yml              # Site config and nav
├── docs/                   # All site content
│   ├── index.md            # Home (hero, featured work, gallery previews)
│   ├── rurban.md           # Cityscapes and countryside gallery
│   ├── surreal.md          # Surrealist work gallery
│   ├── portraits.md        # Portrait gallery
│   ├── series.md           # Series collections (e.g. Aeromechanica)
│   ├── essays.md           # Essay index
│   ├── about.md            # About page
│   ├── essays/             # Individual essay Markdown files
│   ├── stories/            # Story pages (one folder per painting)
│   │   ├── index.md
│   │   └── <Painting Name>/index.md  # plus that painting's source photos
│   ├── acrylic/            # Acrylic painting JPGs
│   ├── watercolours/       # Watercolour JPGs
│   ├── photos/             # Site photos (e.g. logo)
│   ├── stylesheets/custom.css
│   ├── favicon.ico, favicon.png
├── overrides/
│   ├── main.html           # Adds Google Analytics tag
│   └── partials/header.html  # Custom header with always-visible site name
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

`mkdocs.yml` defines the nav. When adding a new top-level page or story, update the `nav:` block. Story sub-pages must be listed individually under `Stories:` to appear in the sidebar.

## Page Conventions

### Galleries (`rurban.md`, `surreal.md`, `portraits.md`, `series.md`)

Gallery pages use a recurring card pattern. Each card is a `div.gallery-card` inside a `div.gallery-grid` (or `div.gallery-grid.gallery-grid--three` for three-column layouts). The structure is:

```
<div class="gallery-card" markdown>

![Alt text](path/to/Image.jpg){ .gallery-img }

<div class="card-info" markdown>

**Painting Title**

Size · Medium · Surface
{ .card-medium }

Optional description.

[Read the story](stories/<Folder>/index.md){ .card-story-link }

</div>

</div>
```

The `markdown` attribute on each `<div>` is required for the inner Markdown to render (this is what `md_in_html` enables). Image paths use URL-encoded spaces (`%20`).

Every gallery page ends with the standard social-links block (Facebook, Instagram).

### Stories (`docs/stories/<Painting Name>/index.md`)

Story pages live in their own folder so the source photographs sit next to the page that uses them. Layout:

- H1 title (hidden by CSS but used as the MkDocs page heading)
- `<div class="story" markdown>` wrapper
- A leading `<div class="story-image">` showing the finished painting (with an `.image-label`)
- `<div class="story-images story-images--three">` grid of source photographs, each in a `<div class="story-image">` with an `.image-label`
- `<div class="story-text">` containing the narrative

All image paths in stories are relative to the story folder, not `docs/`.

### Essays (`docs/essays/*.md`)

Essays follow a strict structure (this matches the writing style guidance below):

1. H1 essay title (rendered by MkDocs as the page heading; the `.md-typeset h1` rule hides duplicate H1s in body content)
2. `<div class="essay" markdown>` wrapper
3. `<div class="essay-meta" markdown>` containing H2 essay title then H3 author and date, with no extra whitespace
4. Body using H2 section headings and prose paragraphs
5. Closing italic disclaimer: `*This is a personal essay. The views are my own.*`
6. Closing `</div>` for the essay wrapper

No horizontal rules, no border in the meta block, minimal whitespace between structural elements.

Add new essays to the `essay-list` on `essays.md` as an `essay-card` with title, author and date, and a one-line summary.

## Image Conventions

- Filenames are human-readable with spaces (e.g. `Cantabrian Mountains.jpg`). In Markdown, encode spaces as `%20`.
- Acrylic paintings live in `docs/acrylic/`, watercolours in `docs/watercolours/`. Site photos and the logo go in `docs/photos/`.
- Story-specific photographs live alongside the story's `index.md` in `docs/stories/<Painting Name>/`.
- Always include meaningful alt text for accessibility.

## CSS Conventions

`docs/stylesheets/custom.css` defines the entire visual system. Key classes:

- Layout: `.hero`, `.artist-statement`, `.featured-work`, `.gallery-preview` (`--three` variant)
- Galleries: `.gallery-grid` (`--three` variant), `.gallery-card`, `.card-info`, `.card-medium`, `.card-story-link`
- Stories: `.story`, `.story-images` (`--three` variant), `.story-image`, `.image-label`, `.story-text`, `.story-split`
- Essays: `.essay`, `.essay-meta`, `.essay-list`, `.essay-card`, `.essay-card-content`
- About: `.about-hero`, `.about-photo`, `.about-img`, `.about-text`
- Shared: `.social-links`, `.md-button`

Palette is set on `:root`: `--cream`, `--brown`, `--sienna`, plus three shadow variables. Reuse these rather than introducing new colours.

The site is centred on a desktop breakpoint of 960px. Most layouts collapse from multi-column to single-column at 700px and 480px. Test changes against both desktop and mobile.

## Theme Overrides

- `overrides/main.html` extends `base.html` purely to inject the Google Analytics gtag snippet. Do not remove unless analytics are being changed.
- `overrides/partials/header.html` replaces the default Material header so the "Jono, the Artist" wordmark always sits next to the logo. Search and repo source UI are deliberately omitted.

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

## Essay Page Structure

Essays use this structure:

1. H1: Essay title (used by MkDocs as the page heading)
2. `<div class="essay" markdown>` wrapper
3. `<div class="essay-meta" markdown>` containing H2 essay title then H3 author name and date, minimal whitespace
4. Essay body (H2 section headings, prose paragraphs)
5. Disclaimer in italics at the bottom: *This is a personal essay. The views are my own.*
6. Closing `</div>` for the essay wrapper

Minimise whitespace between structural elements. No horizontal rules. No border lines in the meta block.
