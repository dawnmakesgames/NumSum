// ── App entry point ──────────────────────────────────────────
// Handles screen routing and app initialisation.

const SCREENS = ['map', 'game', 'profile', 'shop'];

function showScreen(name) {
  SCREENS.forEach(s => {
    document.getElementById(`screen-${s}`).classList.toggle('active', s === name);
  });

  // Run screen-specific setup when showing
  if (name === 'map')     renderMap();
  if (name === 'profile') renderProfile();
  if (name === 'shop')    renderShop();
}

// ── Boot ─────────────────────────────────────────────────────

(function init() {
  loadState();
  applyTheme(getActiveTheme());
  refreshPointsDisplays();
  showScreen('map');
})();
