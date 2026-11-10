import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';

import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import './style.css';

// Header on every numbered slide, in the style of the RIT GCCIS course decks: logo on the left,
// section progress and page number on the right. A slide with data-section starts that section.
// The header is built into each slide (not the viewport) so it also appears in the PDF export.
function addHeaders() {
  const slides = [...document.querySelectorAll('.reveal .slides > section')]
    .filter((s) => s.getAttribute('data-visibility') !== 'hidden');
  const names = [];
  const counts = {};
  let current = null;
  const sectionOf = slides.map((slide) => {
    const name = slide.getAttribute('data-section');
    if (name) { current = name; names.push(name); }
    if (current && !slide.hasAttribute('data-no-number')) counts[current] = (counts[current] || 0) + 1;
    return current;
  });
  const seen = {};
  slides.forEach((slide, i) => {
    const name = sectionOf[i];
    if (!name || slide.hasAttribute('data-no-number')) return;
    seen[name] = (seen[name] || 0) + 1;
    const here = names.indexOf(name);

    // Shrink the original content (all but the notes) so the header fits above it.
    const body = document.createElement('div');
    body.className = 'body';
    [...slide.children].filter((el) => !el.matches('aside.notes')).forEach((el) => body.appendChild(el));
    slide.prepend(body);

    const secs = names.map((n, k) => {
      const state = k < here ? 'done' : k === here ? 'now' : '';
      const fill = k < here ? 100 : k === here ? (100 * seen[name]) / counts[name] : 0;
      return `<div class="sec ${state}"><span>${n}</span><i style="--fill:${fill}%"></i></div>`;
    }).join('');
    const hdr = document.createElement('div');
    hdr.className = 'hdr';
    hdr.innerHTML = `<img src="${import.meta.env.BASE_URL}figures/rit-gccis.png" alt=""><div class="rule-l"></div>`
      + `<div class="secs">${secs}</div><p class="num">${i + 1}</p><div class="rule-r"></div>`;
    slide.prepend(hdr);
  });
}
addHeaders();

// Same canvas as the original Keynote/PowerPoint deck: 1920 x 1080, so 1px = 1pt there.
const deck = new Reveal({
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.1,
  center: false,
  hash: true,
  transition: 'none',
  backgroundTransition: 'none',
  controls: false,
  progress: false,
  // Page numbers live in the slide header (addHeaders).
  slideNumber: false,
  pdfSeparateFragments: false,
  plugins: [Notes],
});

deck.initialize();

// Handy for debugging in the browser console during `npm run dev`.
if (import.meta.env.DEV) window.deck = deck;
