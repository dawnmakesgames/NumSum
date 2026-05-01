// ════════════════════════════════════════════════════════════════
// MAP SCREEN
// Builds and renders the level select screen.
// Levels are grouped into sections (Warm-up, Classic, etc.) and
// split across pages of 15. This file handles the dots, section
// labels, and the ← · · → pagination controls.
// ════════════════════════════════════════════════════════════════

// Maximum number of levels shown per page, per section
const PAGE_SIZE = 15;

// Remembers which page each section is on. Stored as { sectionIndex: pageNumber }.
// Not saved to localStorage — resets each time the app loads.
const sectionPages = {};

// Called by app.js whenever the map screen is shown.
// Refreshes the points display and rebuilds the map.
function renderMap() {
  refreshPointsDisplays();

  // On first load, find the right page to start on for each section
  // (the one containing the earliest unsolved unlocked level)
  SECTIONS.forEach((sec, si) => {
    if (sectionPages[si] === undefined) {
      sectionPages[si] = 0;
    }
    sectionPages[si] = getEarliestActivePage(si);
  });

  buildMap();
}

// Figures out which page to auto-scroll to for a given section.
// Scans pages in order and returns the first one that has an
// unlocked-but-unsolved level on it. If everything is solved,
// stays on the current page.
function getEarliestActivePage(si) {
  const { range } = SECTIONS[si];
  const totalInSection = range[1] - range[0];
  const totalPages = Math.ceil(totalInSection / PAGE_SIZE);
  const current = sectionPages[si] || 0;

  for (let p = 0; p < totalPages; p++) {
    const start = range[0] + p * PAGE_SIZE;
    const end   = Math.min(range[0] + (p + 1) * PAGE_SIZE, range[1]);
    for (let i = start; i < end; i++) {
      if (isLevelUnlocked(i) && !isLevelSolved(i)) return p;
    }
  }
  // All levels in this section are solved — stay on the current page
  return current;
}

// Clears and rebuilds the entire level map from scratch.
// Called on first load and whenever a page arrow is tapped.
function buildMap() {
  const map = document.getElementById('level-map');
  map.innerHTML = '';

  SECTIONS.forEach(({ label, range, sizeLabel }, si) => {
    const totalInSection = range[1] - range[0];
    const totalPages     = Math.ceil(totalInSection / PAGE_SIZE);
    const currentPage    = sectionPages[si];

    // Section heading (e.g. "Warm-up — 3×3")
    const secLabel = document.createElement('div');
    secLabel.className   = 'map-section-label';
    secLabel.textContent = label;
    map.appendChild(secLabel);

    // The grid of level dots for the current page
    const section = document.createElement('div');
    section.className = 'map-section';

    const start = range[0] + currentPage * PAGE_SIZE;
    const end   = Math.min(range[0] + (currentPage + 1) * PAGE_SIZE, range[1]);
    for (let i = start; i < end; i++) {
      section.appendChild(makeLevelDot(i, sizeLabel));
    }
    map.appendChild(section);

    // Pagination row — only shown if the section has more than one page
    if (totalPages > 1) {
      map.appendChild(makePagination(si, currentPage, totalPages));
    }
  });
}

// Builds the ← · · → pagination row for a section.
// si = section index, currentPage = which page is active, totalPages = how many pages exist
function makePagination(si, currentPage, totalPages) {
  const row = document.createElement('div');
  row.className = 'pagination-row';

  // ← previous page arrow
  const prev = document.createElement('button');
  prev.className   = 'page-arrow';
  prev.textContent = '←';
  prev.disabled    = currentPage === 0; // disabled on the first page
  prev.addEventListener('click', () => {
    sectionPages[si] = currentPage - 1;
    buildMap();
  });
  row.appendChild(prev);

  // Dot indicators — one dot per page, current page shown as a wider pill
  const dots = document.createElement('div');
  dots.className = 'page-dots';
  for (let p = 0; p < totalPages; p++) {
    const dot = document.createElement('div');
    dot.className = 'page-dot' + (p === currentPage ? ' active' : '');
    dot.addEventListener('click', () => {
      sectionPages[si] = p;
      buildMap();
    });
    dots.appendChild(dot);
  }
  row.appendChild(dots);

  // → next page arrow
  const next = document.createElement('button');
  next.className   = 'page-arrow';
  next.textContent = '→';
  next.disabled    = currentPage === totalPages - 1; // disabled on the last page
  next.addEventListener('click', () => {
    sectionPages[si] = currentPage + 1;
    buildMap();
  });
  row.appendChild(next);

  return row;
}

// Creates a single level dot element.
// i = the level index in the LEVELS array, sizeLabel = e.g. "4×4"
function makeLevelDot(i, sizeLabel) {
  const dot      = document.createElement('div');
  const solved   = isLevelSolved(i);
  const unlocked = isLevelUnlocked(i);
  const stars    = getLevelStars(i);

  // Locked levels show a lock icon and aren't clickable
  if (!unlocked) {
    dot.className   = 'lvl-dot locked';
    dot.textContent = '🔒';
    return dot;
  }

  // Solved = green tint, unsolved unlocked = accent colour (the "up next" style)
  dot.className = 'lvl-dot' + (solved ? ' solved' : ' next');

  // Level number (e.g. "42")
  const num = document.createElement('div');
  num.className   = 'dot-num';
  num.textContent = i + 1; // levels are 0-indexed internally, 1-indexed for display
  dot.appendChild(num);

  // Grid size label (e.g. "4×4")
  const sz = document.createElement('div');
  sz.className   = 'dot-size';
  sz.textContent = sizeLabel;
  dot.appendChild(sz);

  // Star rating — only shown on solved levels (e.g. ★★☆)
  if (solved && stars > 0) {
    const starsEl = document.createElement('div');
    starsEl.className   = 'dot-stars';
    starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    dot.appendChild(starsEl);
  }

  // Tapping the dot starts that level
  dot.addEventListener('click', () => startLevel(i));
  return dot;
}
