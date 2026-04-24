// ── Store: all localStorage reads and writes ──────────────────
// Single source of truth for saved state.

const SAVE_KEY = 'numsum_v03';

const DEFAULT_STATE = {
  solved:          {},
  points:          0,
  ownedItems:      ['theme-default', 'theme-colorblind'],
  activeTheme:     'theme-default',
  activeCompanion: null
};

let _state = null;

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      _state = Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
      return;
    }
  } catch(e) {}
  _state = Object.assign({}, DEFAULT_STATE);
}

function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(_state)); } catch(e) {}
}

// ── Getters ──────────────────────────────────────────────────

function getPoints()          { return _state.points; }
function getOwnedItems()      { return _state.ownedItems; }
function getActiveTheme()     { return _state.activeTheme; }
function getActiveCompanion() { return _state.activeCompanion; }
function getSolvedLevels()    { return _state.solved; }

function isLevelSolved(i)     { return _state.solved[i] !== undefined; }
function getLevelStars(i)     { return _state.solved[i] || 0; }

function isItemOwned(id)      { return _state.ownedItems.includes(id); }

function isLevelUnlocked(i) {
  if (SECTION_STARTS.includes(i)) return true;
  return isLevelSolved(i - 1);
}

// ── Setters ──────────────────────────────────────────────────

function solveLevel(index, stars) {
  const existing = _state.solved[index] || 0;
  _state.solved[index] = Math.max(existing, stars);
  saveState();
}

function addPoints(amount) {
  _state.points = Math.max(0, _state.points + amount);
  saveState();
  refreshPointsDisplays();
}

function spendPoints(amount) {
  if (_state.points < amount) return false;
  _state.points -= amount;
  saveState();
  refreshPointsDisplays();
  return true;
}

function buyItem(id) {
  if (!_state.ownedItems.includes(id)) {
    _state.ownedItems.push(id);
    saveState();
  }
}

function setActiveTheme(id) {
  _state.activeTheme = id;
  saveState();
  applyTheme(id);
}

function setActiveCompanion(id) {
  _state.activeCompanion = id;
  saveState();
}

// ── Theme application ────────────────────────────────────────

function applyTheme(id) {
  document.body.classList.remove('theme-dark', 'theme-colorblind');
  if (id === 'theme-dark')        document.body.classList.add('theme-dark');
  if (id === 'theme-colorblind')  document.body.classList.add('theme-colorblind');
  if (id === 'theme-dark-cb') {
    document.body.classList.add('theme-dark');
    document.body.classList.add('theme-colorblind');
  }
}

// ── UI helpers ───────────────────────────────────────────────

function refreshPointsDisplays() {
  const pts = getPoints();
  document.querySelectorAll('#points-count, #shop-points-count').forEach(el => {
    el.textContent = pts;
  });
}

// ── Dev tools ────────────────────────────────────────────────

function devClear() {
  if (!confirm('Clear all saved progress?')) return;
  localStorage.removeItem(SAVE_KEY);
  loadState();
  applyTheme('theme-default');
  refreshPointsDisplays();
  renderMap();
}
