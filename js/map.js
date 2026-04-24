// ── Level map screen ─────────────────────────────────────────

const PAGE_SIZE = 15;

// Track current page per section index
const sectionPages = {};

function renderMap() {
  refreshPointsDisplays();

  // Initialise pages if not set, and auto-advance to earliest unplayed page
  SECTIONS.forEach((sec, si) => {
    if (sectionPages[si] === undefined) {
      sectionPages[si] = 0;
    }
    sectionPages[si] = getEarliestActivePage(si);
  });

  buildMap();
}

// Returns the page containing the earliest unlocked-but-unsolved level,
// or the last page if all solved. Falls back to current page if already set.
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
  // All solved — stay on current page
  return current;
}

function buildMap() {
  const map = document.getElementById('level-map');
  map.innerHTML = '';

  SECTIONS.forEach(({ label, range, sizeLabel }, si) => {
    const totalInSection = range[1] - range[0];
    const totalPages     = Math.ceil(totalInSection / PAGE_SIZE);
    const currentPage    = sectionPages[si];

    // Section label
    const secLabel = document.createElement('div');
    secLabel.className   = 'map-section-label';
    secLabel.textContent = label;
    map.appendChild(secLabel);

    // Level dot grid for current page
    const section = document.createElement('div');
    section.className = 'map-section';

    const start = range[0] + currentPage * PAGE_SIZE;
    const end   = Math.min(range[0] + (currentPage + 1) * PAGE_SIZE, range[1]);
    for (let i = start; i < end; i++) {
      section.appendChild(makeLevelDot(i, sizeLabel));
    }
    map.appendChild(section);

    // Pagination controls — only show if more than one page
    if (totalPages > 1) {
      map.appendChild(makePagination(si, currentPage, totalPages));
    }
  });
}

function makePagination(si, currentPage, totalPages) {
  const row = document.createElement('div');
  row.className = 'pagination-row';

  // ← prev arrow
  const prev = document.createElement('button');
  prev.className   = 'page-arrow';
  prev.textContent = '←';
  prev.disabled    = currentPage === 0;
  prev.addEventListener('click', () => {
    sectionPages[si] = currentPage - 1;
    buildMap();
  });
  row.appendChild(prev);

  // Page dots
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

  // → next arrow
  const next = document.createElement('button');
  next.className   = 'page-arrow';
  next.textContent = '→';
  next.disabled    = currentPage === totalPages - 1;
  next.addEventListener('click', () => {
    sectionPages[si] = currentPage + 1;
    buildMap();
  });
  row.appendChild(next);

  return row;
}

function makeLevelDot(i, sizeLabel) {
  const dot      = document.createElement('div');
  const solved   = isLevelSolved(i);
  const unlocked = isLevelUnlocked(i);
  const stars    = getLevelStars(i);

  if (!unlocked) {
    dot.className   = 'lvl-dot locked';
    dot.textContent = '🔒';
    return dot;
  }

  dot.className = 'lvl-dot' + (solved ? ' solved' : ' next');

  const num = document.createElement('div');
  num.className   = 'dot-num';
  num.textContent = i + 1;
  dot.appendChild(num);

  const sz = document.createElement('div');
  sz.className   = 'dot-size';
  sz.textContent = sizeLabel;
  dot.appendChild(sz);

  if (solved && stars > 0) {
    const starsEl = document.createElement('div');
    starsEl.className   = 'dot-stars';
    starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    dot.appendChild(starsEl);
  }

  dot.addEventListener('click', () => startLevel(i));
  return dot;
}
