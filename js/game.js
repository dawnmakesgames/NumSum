// ── Game logic ───────────────────────────────────────────────

let currentLevel = 0;
let lives        = 3;
let gameOver     = false;
let won          = false;
let mode         = 'lives';
let selected     = [];

// ── Setup ────────────────────────────────────────────────────

function startLevel(n) {
  currentLevel = n;
  showScreen('game');
  resetGame();
}

function setMode(m) {
  mode = m;
  document.getElementById('btn-lives').classList.toggle('active', m === 'lives');
  document.getElementById('btn-free').classList.toggle('active', m === 'free');
  resetGame();
}

function resetGame() {
  const size = LEVELS[currentLevel].size;
  lives    = 3;
  selected = Array.from({ length: size }, () => Array(size).fill(false));
  gameOver = false;
  won      = false;
  document.getElementById('win-screen').classList.remove('show');
  document.getElementById('gameover-screen').classList.remove('show');
  document.getElementById('reset-btn').style.display = 'block';
  document.getElementById('message').classList.remove('show');
  renderLives();
  renderCompanion();
  render();
}

function nextLevel() {
  if (currentLevel < LEVELS.length - 1) { currentLevel++; resetGame(); }
  else showScreen('map');
}

// ── Lives ────────────────────────────────────────────────────

function heartSVG(full) {
  return `<svg class="heart" viewBox="0 0 24 24" fill="${full ? '#D85A30' : 'var(--dim-text)'}" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`;
}

function renderLives() {
  const el = document.getElementById('lives-row');
  if (mode === 'free') { el.innerHTML = ''; return; }
  el.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div');
    d.innerHTML = heartSVG(i < lives);
    if (i >= lives) d.querySelector('svg').classList.add('lost');
    el.appendChild(d.firstChild);
  }
}

// ── Companion ────────────────────────────────────────────────

function renderCompanion() {
  const area = document.getElementById('companion-area');
  const companionId = getActiveCompanion();
  if (!companionId) {
    area.classList.remove('has-companion');
    area.innerHTML = '';
    return;
  }
  area.classList.add('has-companion');
  const item = SHOP_ITEMS.find(i => i.id === companionId);
  if (!item) return;
  area.innerHTML = `<div id="companion-svg">${item.svgLarge()}</div>`;
}

function celebrateCompanion() {
  const el = document.getElementById('companion-svg');
  if (!el) return;
  el.classList.remove('companion-celebrate');
  void el.offsetWidth;
  el.classList.add('companion-celebrate');
}

// ── Grid helpers ─────────────────────────────────────────────

function getRowSum(r) {
  const L = LEVELS[currentLevel];
  return selected[r].reduce((s, v, c) => s + (v ? L.grid[r][c] : 0), 0);
}

function getColSum(c) {
  const L = LEVELS[currentLevel];
  return L.grid.reduce((s, row, r) => s + (selected[r][c] ? row[c] : 0), 0);
}

function labelState(sum, target) {
  return sum === target ? 'exact' : sum > target ? 'over' : '';
}

function checkWin() {
  const L = LEVELS[currentLevel];
  return L.rowTargets.every((t, r) => getRowSum(r) === t)
      && L.colTargets.every((t, c) => getColSum(c) === t);
}

function calcStars() {
  if (mode === 'free') return 1;
  if (lives === 3) return 3;
  if (lives === 2) return 2;
  return 1;
}

function showMessage(txt) {
  const el = document.getElementById('message');
  el.textContent = txt;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2000);
}

// ── Grid sizing ──────────────────────────────────────────────

function gridSizing(size) {
  if (size === 3) return { labelPx: 52, cellPx: 72, labelFont: 17, cellFont: 22, subFont: 11 };
  if (size === 4) return { labelPx: 48, cellPx: 64, labelFont: 16, cellFont: 20, subFont: 10 };
                  return { labelPx: 40, cellPx: 52, labelFont: 14, cellFont: 17, subFont: 9  };
}

// ── Render grid ──────────────────────────────────────────────

function render() {
  const L    = LEVELS[currentLevel];
  const size = L.size;
  const sz   = gridSizing(size);

  document.getElementById('game-level-badge').textContent = `Level ${currentLevel + 1} · ${size}×${size}`;

  const rowDone = L.rowTargets.map((t, r) => getRowSum(r) === t);
  const colDone = L.colTargets.map((t, c) => getColSum(c) === t);

  const wrap = document.getElementById('grid-wrap');
  wrap.innerHTML = '';
  wrap.style.gridTemplateColumns = `${sz.labelPx}px repeat(${size}, 1fr)`;
  wrap.style.gridTemplateRows    = `${sz.labelPx}px repeat(${size}, ${sz.cellPx}px)`;

  // Corner
  const corner = document.createElement('div');
  corner.style.cssText = `width:${sz.labelPx}px;height:${sz.labelPx}px;`;
  wrap.appendChild(corner);

  // Column labels
  for (let c = 0; c < size; c++) {
    const cs  = getColSum(c);
    const st  = labelState(cs, L.colTargets[c]);
    const lbl = document.createElement('div');
    lbl.className = 'col-label' + (st ? ' ' + st : '');
    lbl.style.fontSize  = sz.labelFont + 'px';
    lbl.style.minHeight = sz.labelPx + 'px';
    lbl.textContent     = L.colTargets[c];
    if (cs > 0 && !won) {
      const s = document.createElement('span');
      s.className   = 'label-sub';
      s.style.fontSize = sz.subFont + 'px';
      s.textContent = cs;
      lbl.appendChild(s);
    }
    wrap.appendChild(lbl);
  }

  // Rows + cells
  for (let r = 0; r < size; r++) {
    const rs     = getRowSum(r);
    const rst    = labelState(rs, L.rowTargets[r]);
    const rowLbl = document.createElement('div');
    rowLbl.className = 'row-label' + (rst ? ' ' + rst : '');
    rowLbl.style.fontSize  = sz.labelFont + 'px';
    rowLbl.style.minHeight = sz.cellPx + 'px';
    rowLbl.textContent     = L.rowTargets[r];
    if (rs > 0 && !won) {
      const s = document.createElement('span');
      s.className   = 'label-sub';
      s.style.fontSize = sz.subFont + 'px';
      s.textContent = rs;
      rowLbl.appendChild(s);
    }
    wrap.appendChild(rowLbl);

    for (let c = 0; c < size; c++) {
      const rs2      = getRowSum(r);
      const cs2      = getColSum(c);
      const isSel    = selected[r][c];
      const isOver   = isSel && (rs2 > L.rowTargets[r] || cs2 > L.colTargets[c]);
      const isDimmed = !isSel && !won && (rowDone[r] || colDone[c]);

      let cls = 'cell';
      if (isSel)      cls += isOver    ? ' over-selected' : ' selected';
      else if (isDimmed) cls += ' dimmed';

      const cell = document.createElement('div');
      cell.className       = cls;
      cell.style.fontSize  = sz.cellFont + 'px';
      cell.style.minHeight = sz.cellPx + 'px';
      cell.textContent     = L.grid[r][c];

      if (!gameOver && !won) cell.addEventListener('click', () => toggleCell(r, c));
      wrap.appendChild(cell);
    }
  }
}

// ── Cell interaction ─────────────────────────────────────────

function toggleCell(r, c) {
  if (gameOver || won) return;
  const L = LEVELS[currentLevel];
  selected[r][c] = !selected[r][c];

  const rs = getRowSum(r);
  const cs = getColSum(c);

  if (selected[r][c] && (rs > L.rowTargets[r] || cs > L.colTargets[c]) && mode === 'lives') {
    lives--;
    renderLives();
    showMessage('Over the target — lost a life!');
    if (lives <= 0) {
      gameOver = true;
      const cost = REVIVE_COSTS[L.size];
      document.getElementById('revive-cost-display').textContent = cost;
      document.getElementById('revive-cost-label').textContent   = cost;
      const canAfford = getPoints() >= cost;
      document.getElementById('revive-btn').style.display = canAfford ? 'block' : 'none';
      document.getElementById('gameover-screen').classList.add('show');
      document.getElementById('reset-btn').style.display = 'none';
    }
  }

  if (!gameOver && checkWin()) {
    won = true;
    const stars  = calcStars();
    const base   = POINTS_PER_SIZE[L.size];
    const bonus  = lives * POINTS_PER_LIFE;
    const earned = mode === 'free' ? Math.floor(base * 0.5) : base + bonus;

    solveLevel(currentLevel, stars);
    addPoints(earned);
    celebrateCompanion();

    const isLast = currentLevel === LEVELS.length - 1;
    document.getElementById('win-sub').textContent = isLast
      ? 'You cleared all levels! 🏆'
      : `Level ${currentLevel + 1} complete! ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
    document.getElementById('points-earned-display').textContent = `+${earned} pts`;
    document.getElementById('next-btn').style.display = isLast ? 'none' : 'block';
    document.getElementById('win-screen').classList.add('show');
    document.getElementById('reset-btn').style.display = 'none';
  }

  render();
}

// ── Revive ───────────────────────────────────────────────────

function spendPointsRevive() {
  const cost = REVIVE_COSTS[LEVELS[currentLevel].size];
  if (!spendPoints(cost)) return;
  lives    = 1;
  gameOver = false;
  document.getElementById('gameover-screen').classList.remove('show');
  document.getElementById('reset-btn').style.display = 'block';
  renderLives();
  render();
}
