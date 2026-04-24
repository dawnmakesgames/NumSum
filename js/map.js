// ── Level map screen ─────────────────────────────────────────

function renderMap() {
  refreshPointsDisplays();

  const map = document.getElementById('level-map');
  map.innerHTML = '';

  SECTIONS.forEach(({ label, range, sizeLabel }) => {
    const secLabel = document.createElement('div');
    secLabel.className   = 'map-section-label';
    secLabel.textContent = label;
    map.appendChild(secLabel);

    const section = document.createElement('div');
    section.className = 'map-section';

    for (let i = range[0]; i < range[1]; i++) {
      section.appendChild(makeLevelDot(i, sizeLabel));
    }
    map.appendChild(section);
  });
}

function makeLevelDot(i, sizeLabel) {
  const dot     = document.createElement('div');
  const solved  = isLevelSolved(i);
  const unlocked = isLevelUnlocked(i);
  const stars   = getLevelStars(i);

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
