# Ivilin Stoianov — personal research website

A responsive, buildless static website. Upload the files directly to GitHub Pages or Aruba. No package manager, server runtime, database, external fonts, analytics, or CDN is required.

## Preview

Open `index.html` directly, or serve this directory:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. Stop the server with Ctrl+C.

## GitHub Pages

Place `index.html`, `styles.css`, `script.js`, `assets/`, `.nojekyll`, `robots.txt`, and `sitemap.xml` in the root of the `stoianov.github.io` repository. In the repository's Pages settings, select deployment from the branch and root directory that contain these files. No build is required. This produces https://stoianov.github.io/.

## Aruba

Upload the same files to the document root configured for your Aruba hosting account using its file manager or FTP/SFTP. Keep `assets/` beside `index.html`. The site needs only static file hosting and works on Linux or Windows hosting. The contact link opens the visitor's email application; it needs no PHP mail configuration.

The metadata currently treats **https://stoianov.github.io/** as the primary address, as requested. If Aruba becomes the primary address, update the canonical URL, `og:url`, JSON-LD URL in `index.html`, and URLs in `robots.txt` and `sitemap.xml`. An Aruba-hosted duplicate can retain the GitHub canonical if GitHub Pages remains primary.

## Editing

- Text, profile links, projects, and publications: `index.html`. Content is available without JavaScript.
- Colors, typography, layouts, reduced-motion and print styles: `styles.css`.
- Topic filters and the conceptual SVG network: `script.js`.
- Publication categories: each paper's `data-topics` attribute (`inference`, `perception`, or `neural`).

The diagram is a stylized brain drawn in SVG, not an anatomical model or scientific simulation. Its outline, folds, nodes, and connections expand and contract together with a CSS breathing animation. A bounded pool of signal dots follows randomly selected connections using native browser animations. With frontal regions at the top and sensory regions at the bottom of this conceptual diagram, downward predictions are terracotta and upward prediction errors are blue. Exactly horizontal connections do not carry directional signals. Arrow strokes, arrowheads, labels, the legend, and moving dots share the same colors, controlled by `--prediction-color` and `--error-color` in `.model-figure` in `styles.css`. A single timer schedules signals roughly twice per second; there is no JavaScript animation frame loop. Breathing and signals pause when the diagram leaves the viewport, the tab is hidden, or the visitor pauses motion. Reduced-motion preferences disable animation. There are no live profile requests, tracking, or third-party resources.

Adjust breathing speed with `--breath-duration` and depth with the scale in `@keyframes breathe` in `styles.css`. Adjust signal frequency, travel time, and the maximum concurrent signals in `signalSettings` near the top of `script.js`.

## Content sources and editorial notes

Compiled November 2026 from:

- [CNR–ISTC institutional profile](https://www.istc.cnr.it/it/user/12544): name, senior researcher role, affiliation, email, address, research interests, selected publications, and project roles.
- [Google Scholar](https://scholar.google.it/citations?user=hCI3cnYAAAAJ): linked as the full publication destination. Automated access was blocked, so no citation counts or h-index are claimed.
- [ORCID](https://orcid.org/0000-0003-0642-259X): supplied identity link, also confirmed in the PLOS author record. The profile itself required JavaScript and its full record was not retrieved.
- [Communications Biology, 2026](https://www.nature.com/articles/s42003-026-10878-6): publisher search record confirmed title, authors, and publication year of the parietal cortex article.
- [PLOS Computational Biology, 2025](https://doi.org/10.1371/journal.pcbi.1013180): title, authors, publication year.
- [MAIA at CNR](https://www.istc.cnr.it/it/content/maia-multifunctional-adaptive-and-interactive-ai-system-acting-multiple-contexts) and [CORDIS](https://cordis.europa.eu/project/id/951910): project description and 2021–2024 period shown by CNR. The site does not claim it is currently ongoing.

PACE is labeled by its funding call, PRIN 2017; no unverified start/end dates are shown. Publications are a curated selection, not a complete or automatically updated bibliography. Review profile details periodically against institutional records.
