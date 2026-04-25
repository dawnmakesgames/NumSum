// ── App entry point ──────────────────────────────────────────
// Handles screen routing and app initialisation.

const SCREENS = ['map', 'game', 'profile', 'shop-themes', 'shop-companions'];

function showScreen(name) {
  SCREENS.forEach(s => {
    document.getElementById(`screen-${s}`).classList.toggle('active', s === name);
  });

  if (name === 'map')               renderMap();
  if (name === 'profile')           renderProfile();
  if (name === 'shop-themes')       renderThemeShop();
  if (name === 'shop-companions')   renderCompanionShop();
}

// ── Boot ─────────────────────────────────────────────────────

(function init() {
  loadState();
  applyTheme(getActiveTheme());
  refreshPointsDisplays();
  showScreen('map');
})();
