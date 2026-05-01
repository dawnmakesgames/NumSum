// ════════════════════════════════════════════════════════════════
// STORE
// The single source of truth for everything that gets saved.
// All reading from and writing to the browser's localStorage
// goes through this file. No other file touches localStorage.
//
// What gets saved:
//   solved          — which levels have been completed, and their star rating
//   points          — the player's current point total
//   ownedItems      — IDs of themes/companions the player has bought
//   activeTheme     — which theme is currently applied
//   activeCompanion — which companion is currently showing (or null)
// ════════════════════════════════════════════════════════════════

// The localStorage key. If you change the default owned items, bump
// this to 'numsum_v04' etc. so returning players get a fresh state
// instead of inheriting stale data.
const SAVE_KEY = 'numsum_v03';

// What a brand new player's save looks like.
// Classic and Accessible themes are free and owned by everyone.
const DEFAULT_STATE = {
  solved:          {},
  points:          0,
  ownedItems:      ['theme-default', 'theme-colorblind'],
  activeTheme:     'theme-default',
  activeCompanion: null
};

let _state = null;

// Loads saved data from localStorage. If nothing is saved yet (new
// player), or the data is corrupted, falls back to DEFAULT_STATE.
function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      // Merge saved data on top of defaults so any new fields are present
      _state = Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
      return;
    }
  } catch(e) {}
  _state = Object.assign({}, DEFAULT_STATE);
}

// Writes the current state to localStorage.
// Called automatically whenever something changes.
function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(_state)); } catch(e) {}
}


// ── Getters ──────────────────────────────────────────────────
// Read-only access to the current state. Other files use these
// instead of touching _state directly.

function getPoints()          { return _state.points; }
function getOwnedItems()      { return _state.ownedItems; }
function getActiveTheme()     { return _state.activeTheme; }
function getActiveCompanion() { return _state.activeCompanion; }
function getSolvedLevels()    { return _state.solved; }

// Returns true if level i has been completed at least once
function isLevelSolved(i)     { return _state.solved[i] !== undefined; }

// Returns the star rating (1–3) for a solved level, or 0 if unsolved
function getLevelStars(i)     { return _state.solved[i] || 0; }

function isItemOwned(id)      { return _state.ownedItems.includes(id); }

// A level is unlocked if it's the first in its section, or the
// previous level has been solved.
function isLevelUnlocked(i) {
  if (SECTION_STARTS.includes(i)) return true;
  return isLevelSolved(i - 1);
}


// ── Setters ──────────────────────────────────────────────────
// All state changes go through here so saving always happens.

// Records a level as solved. Only upgrades stars — never reduces them.
function solveLevel(index, stars) {
  const existing = _state.solved[index] || 0;
  _state.solved[index] = Math.max(existing, stars);
  saveState();
}

// Adds points to the player's total. Can't go below 0.
function addPoints(amount) {
  _state.points = Math.max(0, _state.points + amount);
  saveState();
  refreshPointsDisplays();
}

// Deducts points. Returns false (and does nothing) if the player
// can't afford it — the caller should check this.
function spendPoints(amount) {
  if (_state.points < amount) return false;
  _state.points -= amount;
  saveState();
  refreshPointsDisplays();
  return true;
}

// Adds an item to the player's owned list (if not already there)
function buyItem(id) {
  if (!_state.ownedItems.includes(id)) {
    _state.ownedItems.push(id);
    saveState();
  }
}

// Sets the active theme, saves, and applies the CSS class to <body>
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

// Applies a theme by swapping the theme-* class on <body>.
// Strips all existing theme classes first so nothing stacks up.
// theme-dark-cb is a special case — it needs both theme-dark and
// theme-colorblind active at the same time to work correctly.
function applyTheme(id) {
  document.body.className = document.body.className
    .replace(/\btheme-\S+/g, '').trim();
  if (id && id !== 'theme-default') {
    document.body.classList.add(id);
  }
  if (id === 'theme-dark-cb') {
    document.body.classList.add('theme-dark');
    document.body.classList.add('theme-colorblind');
  }
}


// ── UI helpers ───────────────────────────────────────────────

// Updates every points counter visible on screen at once.
// Called after points change so all displays stay in sync.
function refreshPointsDisplays() {
  const pts = getPoints();
  document.querySelectorAll(
    '#points-count, #points-count-game, #shop-themes-points-count, #shop-companions-points-count'
  ).forEach(el => { el.textContent = pts; });
}


// ── Dev tools ────────────────────────────────────────────────
// To be removed before public release.

// Wipes all saved progress after a confirmation prompt.
function devClear() {
  if (!confirm('Clear all saved progress?')) return;
  localStorage.removeItem(SAVE_KEY);
  loadState();
  applyTheme('theme-default');
  refreshPointsDisplays();
  renderMap();
}
