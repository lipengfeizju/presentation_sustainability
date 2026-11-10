# Sustainable computing talk (reveal.js)

"Better Metrics for Sustainable AI Systems: From efficient inference to useful intelligence under resource constraints". The deck has 20 slides: a cover, 17 main slides and 2 backup slides. It is a discussion talk for systems faculty who are new to sustainability.

- Framing (slides 2–4): what to optimize as AI scales, energy vs. carbon (a teaching example, not paper data),
  and operational vs. embodied carbon (EcoServe Fig. 1, left).
- SIGMETRICS (slides 5–7): facts from the 2026 Call for Papers (scope, tracks, three deadlines, POMACS,
  outcomes), a map of research entry points (with a thumbnail of each example paper), and eight
  sustainability papers from the 2026 accepted list (checked 2026-11-10), each shown with a figure. The five
  papers not in Zotero (traffic-flow carbon, LLM multi-request workflows, Minos, Green Bin Packing, Online
  Smoothed Demand Management) come from their public arXiv / Oxford PDFs; the Green Bin Packing card is
  an SVG sketch of the model, not a paper figure.
- Case studies (slides 8–13): GreenCache (Fig. 8a), HealthServe (Figs. 3–4), WaterWise (Fig. 3a),
  carbon accounting for LLM serving (Fig. 1), PD power-aware provisioning (Fig. 1), GreenLLM (HTML diagram
  redrawn from the paper text) and LLM-PowerTrace (Fig. 2b).
- New metrics (slides 14–15): four questions for a useful new metric (each with an evidence thumbnail);
  three kinds of "new" and how to report them.
- Next steps (slides 16–18): research directions A/B/C (A is a conceptual SVG sketch), a first prototype,
  and the discussion question.
- Backup (slides 19–20): likely questions and the reading list.
- Paper figures are cropped from the PDFs in the Zotero collection `System → computing_knobs`; each
  slide's footnote names the paper and figure number.
- Speaker notes come from `../Sustainability_SIGMETRICS_Talk.md` (English script plus 中文提示); the
  slides on SIGMETRICS facts, accepted papers and kinds of "new" have new notes.
- Look follows the `presentation_water/big-pipe-slides` deck: an HTML title slide (RIT GCCIS logo, orange
  bracket frame), and on every numbered slide a header built in `src/main.js` with the logo, the section
  progress bar (sections start at slides marked `data-section`) and the page number. Slide content is
  scaled to 92% to make room for the header.
- Footnotes on every slide are HTML (`<p class="src">` in `index.html`, styled in `src/style.css`).

## Setup

Node.js lives in the conda env `slides`:

```bash
conda activate slides
npm install
npm run dev        # opens http://localhost:5173
```

## Presenting

| Key | Action |
|---|---|
| `S` | Speaker view (notes, timer, next slide) |
| `F` | Fullscreen |
| `O` / `Esc` | Slide overview |
| `B` | Black screen |

No transitions or build animations.

## Export

- PDF: `npm run pdf` → `slides.pdf` (uses the installed Google Chrome)
- Static site: `npm run build` → `dist/`
- Screenshots for layout checks: `npm run shots -- http://localhost:5173/ shots` → `shots/slide-NN.png`
  (needs `npm run dev` running)

## Files

- `index.html` – all slides and speaker notes
- `src/style.css` – theme matching the water deck
- `src/main.js` – reveal.js setup and slide header (same as the water deck)
- `public/figures/` – figures cropped from the Zotero PDFs and the SIGMETRICS 2026 papers, and the RIT logo
- `scripts/export-pdf.mjs`, `scripts/screenshots.mjs` – PDF export and screenshots
