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
  // Reset Numby to normal face
  const comp = document.getElementById('companion-svg');
  if (comp) comp.classList.remove('is-happy', 'companion-celebrate', 'companion-row-done');
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
  // Only skip re-render if the correct companion is already showing
  const existing = area.querySelector('#companion-svg');
  if (existing && existing.dataset.companionId === companionId) return;
  area.classList.add('has-companion');
  const item = SHOP_ITEMS.find(i => i.id === companionId);
  if (!item) return;
  area.innerHTML = `<div id="companion-svg" data-companion-id="${companionId}">${item.svgLarge()}</div>`;
}

function celebrateCompanion() {
  const el = document.getElementById('companion-svg');
  if (!el) return;
  el.classList.remove('companion-celebrate', 'companion-row-done');
  el.classList.add('is-happy');
  void el.offsetWidth;
  el.classList.add('companion-celebrate');
}

function rowDoneCompanion() {
  const el = document.getElementById('companion-svg');
  if (!el) return;
  if (el.classList.contains('companion-celebrate')) return;
  el.classList.remove('companion-row-done');
  void el.offsetWidth;
  el.classList.add('companion-row-done');
}

// ── Confetti ─────────────────────────────────────────────────

function launchConfetti() {
  const style  = getComputedStyle(document.body);
  const colors = [
    style.getPropertyValue('--accent').trim(),
    style.getPropertyValue('--green').trim(),
    style.getPropertyValue('--red').trim(),
    style.getPropertyValue('--points-color').trim(),
    style.getPropertyValue('--text').trim(),
  ].filter(Boolean);

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 999;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Explode from centre of the grid
  const grid = document.getElementById('grid-wrap');
  const rect  = grid ? grid.getBoundingClientRect() : null;
  const originX = rect ? rect.left + rect.width  / 2 : canvas.width  / 2;
  const originY = rect ? rect.top  + rect.height / 2 : canvas.height / 2;

  const PIECES = 130;
  const pieces = Array.from({ length: PIECES }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    return {
      x:      originX,
      y:      originY,
      w:      Math.random() * 8 + 4,
      h:      Math.random() * 4 + 3,
      color:  colors[Math.floor(Math.random() * colors.length)],
      rot:    Math.random() * Math.PI * 2,
      vx:     Math.cos(angle) * speed,
      vy:     Math.sin(angle) * speed,
      vr:     (Math.random() - 0.5) * 0.25,
      opacity: 1,
    };
  });

  let frame = 0;
  const DURATION  = 90;
  const fadeStart = DURATION * 0.45;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vx *= 0.97;
      p.vy  = p.vy * 0.97 + 0.3; // slight gravity
      p.rot += p.vr;
      if (frame > fadeStart) {
        p.opacity = Math.max(0, 1 - (frame - fadeStart) / (DURATION - fadeStart));
      }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.w > 9) {
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      } else {
        ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.fill();
      ctx.restore();
    });

    if (frame < DURATION) {
      requestAnimationFrame(tick);
    } else {
      document.body.removeChild(canvas);
      // Re-apply happy face in case repaint reset it
      const comp = document.getElementById('companion-svg');
      if (comp && won) comp.classList.add('is-happy');
    }
  }

  requestAnimationFrame(tick);
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
  if (size === 5) return { labelPx: 40, cellPx: 52, labelFont: 14, cellFont: 17, subFont: 9  };
                  return { labelPx: 34, cellPx: 44, labelFont: 13, cellFont: 15, subFont: 8  };
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

  // Nudge Numby when a row or column is freshly completed
  const rowJustDone = rs === L.rowTargets[r];
  const colJustDone = cs === L.colTargets[c];
  if ((rowJustDone || colJustDone) && !won) rowDoneCompanion();

  if (!gameOver && checkWin()) {
    won = true;
    const stars      = calcStars();
    const prevStars  = getLevelStars(currentLevel);
    const prevSolved = isLevelSolved(currentLevel);
    const base       = POINTS_PER_SIZE[L.size];
    const bonus      = lives * POINTS_PER_LIFE;
    const fullPoints = mode === 'free' ? Math.floor(base * 0.5) : base + bonus;

    // Only award points for improvement over previous best
    let earned = 0;
    if (!prevSolved) {
      // First time — full points
      earned = fullPoints;
    } else if (stars > prevStars) {
      // Beat previous best — award the difference
      const prevBonus    = prevStars * POINTS_PER_LIFE;
      const prevEarned   = mode === 'free' ? Math.floor(base * 0.5) : base + prevBonus;
      earned = Math.max(0, fullPoints - prevEarned);
    }
    // If stars <= prevStars and already solved: earned stays 0

    solveLevel(currentLevel, stars);
    if (earned > 0) addPoints(earned);
    celebrateCompanion();
    launchConfetti();

    const isLast = currentLevel === LEVELS.length - 1;
    document.getElementById('win-sub').textContent = isLast
      ? 'You cleared all levels! 🏆'
      : `Level ${currentLevel + 1} complete! ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
    document.getElementById('points-earned-display').textContent =
      earned > 0 ? `+${earned} pts` : stars > prevStars ? '+0 pts (new best!)' : 'No new points — already solved';
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
