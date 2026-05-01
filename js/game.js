// ════════════════════════════════════════════════════════════════
// GAME
// Core puzzle logic — starting levels, rendering the grid,
// handling taps, tracking lives, and detecting wins.
// ════════════════════════════════════════════════════════════════

// ── Game state ───────────────────────────────────────────────
// These variables track what's happening in the current puzzle.

let currentLevel = 0;      // Index of the level being played (0-based)
let lives        = 3;      // Lives remaining (only used in Lives mode)
let gameOver     = false;  // True when all lives are lost
let won          = false;  // True when the puzzle is solved
let mode         = 'lives'; // 'lives' or 'free' (Cosy mode)
let selected     = [];     // 2D array of booleans — which cells the player has tapped


// ── Setup ────────────────────────────────────────────────────

// Called when the player taps a level dot on the map.
// Switches to the game screen and starts the level fresh.
function startLevel(n) {
  currentLevel = n;
  showScreen('game');
  resetGame();
}

// Called when the player taps Lives or Cosy mode button.
// Switches mode and restarts the current puzzle.
function setMode(m) {
  mode = m;
  document.getElementById('btn-lives').classList.toggle('active', m === 'lives');
  document.getElementById('btn-free').classList.toggle('active', m === 'free');
  resetGame();
}

// Resets everything for a fresh attempt at the current level —
// clears selections, resets lives, hides win/game over screens,
// and resets the companion back to its normal face.
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
  const comp = document.getElementById('companion-svg');
  if (comp) comp.classList.remove('is-happy', 'companion-celebrate', 'companion-row-done');
  renderLives();
  renderCompanion();
  render();
}

// Advances to the next level, or goes back to the map if on the last one.
function nextLevel() {
  if (currentLevel < LEVELS.length - 1) { currentLevel++; resetGame(); }
  else showScreen('map');
}


// ── Lives ────────────────────────────────────────────────────

// Returns the SVG markup for a heart icon.
// full=true = filled (life remaining), full=false = empty (life lost).
function heartSVG(full) {
  return `<svg class="heart" viewBox="0 0 24 24" fill="${full ? '#D85A30' : 'var(--dim-text)'}" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`;
}

// Redraws the heart row above the grid.
// In Cosy mode the hearts are hidden entirely.
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

// Draws the active companion above the grid.
// Does nothing if no companion is selected.
// Skips re-rendering if the right companion is already showing.
function renderCompanion() {
  const area = document.getElementById('companion-area');
  const companionId = getActiveCompanion();
  if (!companionId) {
    area.classList.remove('has-companion');
    area.innerHTML = '';
    return;
  }
  const existing = area.querySelector('#companion-svg');
  if (existing && existing.dataset.companionId === companionId) return;
  area.classList.add('has-companion');
  const item = SHOP_ITEMS.find(i => i.id === companionId);
  if (!item) return;
  area.innerHTML = `<div id="companion-svg" data-companion-id="${companionId}">${item.svgLarge()}</div>`;
}

// Switches the companion to its happy face and plays the wiggle animation.
// Called when the puzzle is solved.
// Lottie is a special case — her happy face is baked into the SVG via
// svgLarge(true) rather than toggled with a CSS class, because CSS class
// toggling caused a repaint that made her eyes disappear.
function celebrateCompanion() {
  const area = document.getElementById('companion-area');
  const companionId = getActiveCompanion();
  if (!companionId || !area) return;
  const item = SHOP_ITEMS.find(i => i.id === companionId);
  if (!item) return;
  const svg = companionId === 'companion-lottie'
    ? item.svgLarge(true)
    : item.svgLarge();
  area.innerHTML = `<div id="companion-svg" data-companion-id="${companionId}" class="is-happy companion-celebrate">${svg}</div>`;
}

// Plays a quick bounce animation on the companion when a row or
// column is freshly completed. Won't interrupt the win celebration.
function rowDoneCompanion() {
  const el = document.getElementById('companion-svg');
  if (!el) return;
  if (el.classList.contains('companion-celebrate')) return;
  el.classList.remove('companion-row-done');
  void el.offsetWidth; // forces a reflow so the animation restarts cleanly
  el.classList.add('companion-row-done');
}


// ── Confetti ─────────────────────────────────────────────────

// Explodes confetti from the centre of the grid when the puzzle is solved.
// Uses a canvas overlay so it floats above everything else.
// Colours are pulled from CSS variables so they match the active theme.
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

  // Explode from the centre of the puzzle grid
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
  const DURATION  = 90;  // total animation frames (~1.5s at 60fps)
  const fadeStart = DURATION * 0.45; // pieces start fading halfway through

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    pieces.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vx *= 0.97;           // slight air resistance
      p.vy  = p.vy * 0.97 + 0.3; // gravity
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
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); // big pieces are circles
      } else {
        ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h); // small pieces are rectangles
      }
      ctx.fill();
      ctx.restore();
    });

    if (frame < DURATION) {
      requestAnimationFrame(tick);
    } else {
      document.body.removeChild(canvas);
      // Re-trigger happy face in case the canvas removal caused a repaint
      if (won) celebrateCompanion();
    }
  }

  requestAnimationFrame(tick);
}


// ── Grid helpers ─────────────────────────────────────────────

// Returns the sum of all selected cells in row r
function getRowSum(r) {
  const L = LEVELS[currentLevel];
  return selected[r].reduce((s, v, c) => s + (v ? L.grid[r][c] : 0), 0);
}

// Returns the sum of all selected cells in column c
function getColSum(c) {
  const L = LEVELS[currentLevel];
  return L.grid.reduce((s, row, r) => s + (selected[r][c] ? row[c] : 0), 0);
}

// Returns 'exact' if the sum hits the target, 'over' if it exceeds it,
// or '' if it's still under. Used to colour the row/column labels.
function labelState(sum, target) {
  return sum === target ? 'exact' : sum > target ? 'over' : '';
}

// Returns true when every row and every column hits its exact target.
function checkWin() {
  const L = LEVELS[currentLevel];
  return L.rowTargets.every((t, r) => getRowSum(r) === t)
      && L.colTargets.every((t, c) => getColSum(c) === t);
}

// Calculates the star rating for the current solve.
// Cosy mode always gives 1 star. Lives mode: 3 stars for no losses,
// 2 for one loss, 1 for two losses or a revive.
function calcStars() {
  if (mode === 'free') return 1;
  if (lives === 3) return 3;
  if (lives === 2) return 2;
  return 1;
}

// Shows a temporary message (e.g. "Over the target — lost a life!")
// that fades out after 2 seconds.
function showMessage(txt) {
  const el = document.getElementById('message');
  el.textContent = txt;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2000);
}


// ── Grid sizing ──────────────────────────────────────────────

// Returns pixel sizes for labels and cells based on grid size.
// WTF levels use slightly larger cells because numbers go up to 25
// (two digits) rather than the usual 1–9.
function gridSizing(size, isWTF) {
  if (isWTF && size === 3) return { labelPx: 60, cellPx: 80, labelFont: 17, cellFont: 20, subFont: 11 };
  if (isWTF && size === 4) return { labelPx: 54, cellPx: 68, labelFont: 16, cellFont: 18, subFont: 10 };
  if (isWTF && size === 5) return { labelPx: 46, cellPx: 56, labelFont: 14, cellFont: 16, subFont: 9  };
  if (size === 3) return { labelPx: 52, cellPx: 72, labelFont: 17, cellFont: 22, subFont: 11 };
  if (size === 4) return { labelPx: 48, cellPx: 64, labelFont: 16, cellFont: 20, subFont: 10 };
  if (size === 5) return { labelPx: 40, cellPx: 52, labelFont: 14, cellFont: 17, subFont: 9  };
  if (size === 6) return { labelPx: 34, cellPx: 44, labelFont: 13, cellFont: 15, subFont: 8  };
                  return { labelPx: 30, cellPx: 38, labelFont: 12, cellFont: 13, subFont: 7  };
}


// ── Render grid ──────────────────────────────────────────────

// Redraws the entire puzzle grid. Called after every cell tap.
// Builds a CSS grid with one label column + N cell columns,
// and one label row + N cell rows.
function render() {
  const L    = LEVELS[currentLevel];
  const size = L.size;
  const sz   = gridSizing(size, L.isWTF);

  // Update the level badge in the top bar
  document.getElementById('game-level-badge').textContent = L.isWTF
    ? `Level ${currentLevel + 1} · WTF`
    : `Level ${currentLevel + 1} · ${size}×${size}`;

  // Pre-compute which rows/cols are already hitting their target
  // (used to dim unselected cells in completed rows/cols)
  const rowDone = L.rowTargets.map((t, r) => getRowSum(r) === t);
  const colDone = L.colTargets.map((t, c) => getColSum(c) === t);

  const wrap = document.getElementById('grid-wrap');
  wrap.innerHTML = '';
  wrap.style.gridTemplateColumns = `${sz.labelPx}px repeat(${size}, 1fr)`;
  wrap.style.gridTemplateRows    = `${sz.labelPx}px repeat(${size}, ${sz.cellPx}px)`;

  // Top-left corner cell (empty spacer)
  const corner = document.createElement('div');
  corner.style.cssText = `width:${sz.labelPx}px;height:${sz.labelPx}px;`;
  wrap.appendChild(corner);

  // Column target labels (top row)
  for (let c = 0; c < size; c++) {
    const cs  = getColSum(c);
    const st  = labelState(cs, L.colTargets[c]);
    const lbl = document.createElement('div');
    lbl.className = 'col-label' + (st ? ' ' + st : '');
    lbl.style.fontSize  = sz.labelFont + 'px';
    lbl.style.minHeight = sz.labelPx + 'px';
    lbl.textContent     = L.colTargets[c]; // the target number
    // Show the running total as a small subscript (hidden once puzzle is won)
    if (cs > 0 && !won) {
      const s = document.createElement('span');
      s.className   = 'label-sub';
      s.style.fontSize = sz.subFont + 'px';
      s.textContent = cs;
      lbl.appendChild(s);
    }
    wrap.appendChild(lbl);
  }

  // Each row: row label on the left, then the cells
  for (let r = 0; r < size; r++) {
    const rs     = getRowSum(r);
    const rst    = labelState(rs, L.rowTargets[r]);
    const rowLbl = document.createElement('div');
    rowLbl.className = 'row-label' + (rst ? ' ' + rst : '');
    rowLbl.style.fontSize  = sz.labelFont + 'px';
    rowLbl.style.minHeight = sz.cellPx + 'px';
    rowLbl.textContent     = L.rowTargets[r]; // the target number
    // Running total subscript
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
      // Over = this cell is selected but pushes the row or col over its target
      const isOver   = isSel && (rs2 > L.rowTargets[r] || cs2 > L.colTargets[c]);
      // Dimmed = unselected cell in a row/col that's already complete
      const isDimmed = !isSel && !won && (rowDone[r] || colDone[c]);

      let cls = 'cell';
      if (isSel)         cls += isOver ? ' over-selected' : ' selected';
      else if (isDimmed) cls += ' dimmed';

      const cell = document.createElement('div');
      cell.className       = cls;
      cell.style.fontSize  = sz.cellFont + 'px';
      cell.style.minHeight = sz.cellPx + 'px';
      cell.textContent     = L.grid[r][c];

      // Only attach click handlers while the puzzle is still in progress
      if (!gameOver && !won) cell.addEventListener('click', () => toggleCell(r, c));
      wrap.appendChild(cell);
    }
  }
}


// ── Cell interaction ─────────────────────────────────────────

// Called when the player taps a cell. Toggles it selected/deselected,
// checks if a life should be lost, checks for win, then redraws.
function toggleCell(r, c) {
  if (gameOver || won) return;
  const L = LEVELS[currentLevel];
  selected[r][c] = !selected[r][c];

  const rs = getRowSum(r);
  const cs = getColSum(c);

  // In Lives mode: lose a life if selecting this cell pushes a row or col over its target
  if (selected[r][c] && (rs > L.rowTargets[r] || cs > L.colTargets[c]) && mode === 'lives') {
    lives--;
    renderLives();
    showMessage('Over the target — lost a life!');
    if (lives <= 0) {
      gameOver = true;
      const cost = REVIVE_COSTS[L.size];
      document.getElementById('revive-cost-display').textContent = cost;
      document.getElementById('revive-cost-label').textContent   = cost;
      // Only show the Revive button if the player can afford it
      const canAfford = getPoints() >= cost;
      document.getElementById('revive-btn').style.display = canAfford ? 'block' : 'none';
      document.getElementById('gameover-screen').classList.add('show');
      document.getElementById('reset-btn').style.display = 'none';
    }
  }

  // Bounce the companion when a row or column is freshly completed
  const rowJustDone = rs === L.rowTargets[r];
  const colJustDone = cs === L.colTargets[c];
  if ((rowJustDone || colJustDone) && !won) rowDoneCompanion();

  // Check for a win
  if (!gameOver && checkWin()) {
    won = true;
    const stars      = calcStars();
    const prevStars  = getLevelStars(currentLevel);
    const prevSolved = isLevelSolved(currentLevel);
    const sizeKey    = L.isWTF ? 'wtf' : L.size;
    const base       = POINTS_PER_SIZE[sizeKey];
    const bonus      = lives * POINTS_PER_LIFE;
    const fullPoints = mode === 'free' ? Math.floor(base * 0.5) : base + bonus;

    // Points are only awarded for improvement over the player's previous best.
    // Replaying a level you've already 3-starred earns nothing.
    let earned = 0;
    if (!prevSolved) {
      earned = fullPoints; // first time solving — full points
    } else if (stars > prevStars) {
      // Beat previous best — award the difference only
      const prevBonus  = prevStars * POINTS_PER_LIFE;
      const prevEarned = mode === 'free' ? Math.floor(base * 0.5) : base + prevBonus;
      earned = Math.max(0, fullPoints - prevEarned);
    }

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

// Spends points to revive with 1 life after running out.
// The revive button is only shown if the player can afford it,
// but we double-check here just in case.
function spendPointsRevive() {
  const L    = LEVELS[currentLevel];
  const cost = REVIVE_COSTS[L.isWTF ? 'wtf' : L.size];
  if (!spendPoints(cost)) return;
  lives    = 1;
  gameOver = false;
  document.getElementById('gameover-screen').classList.remove('show');
  document.getElementById('reset-btn').style.display = 'block';
  renderLives();
  render();
}
