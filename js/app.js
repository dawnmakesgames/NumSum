// ════════════════════════════════════════════════════════════════
// APP
// The entry point for the whole game. Handles two things:
//
//   1. Screen routing — only one screen is visible at a time.
//      showScreen() swaps which screen has the 'active' class and
//      calls the right render function for that screen.
//
//   2. Boot sequence — runs once when the page first loads.
//      Loads saved data, validates the saved theme (in case a theme
//      was removed since the last time the player played), applies
//      the theme, and shows the level map.
//
// This file is loaded last so it can safely call functions from
// all the other files (levels, store, game, map, player, shop).
// ════════════════════════════════════════════════════════════════


// All screen IDs — used to find the right <div> and toggle its 'active' class.
// The actual element IDs in index.html are 'screen-map', 'screen-game', etc.
const SCREENS = ['map', 'game', 'profile', 'shop-themes', 'shop-companions'];

// Switches to the named screen. Hides all other screens, shows this one,
// and calls whichever render function that screen needs to build its content.
function showScreen(name) {
  SCREENS.forEach(s => {
    document.getElementById(`screen-${s}`).classList.toggle('active', s === name);
  });

  // Each screen has its own render function that rebuilds the content fresh.
  // The game screen is the exception — it's built by startLevel() when a
  // level dot is tapped, so it doesn't need a render call here.
  if (name === 'map')             renderMap();
  if (name === 'profile')         renderProfile();
  if (name === 'shop-themes')     renderThemeShop();
  if (name === 'shop-companions') renderCompanionShop();
}


// ── Boot sequence ─────────────────────────────────────────────
// Runs automatically when the page loads (it's an IIFE —
// Immediately Invoked Function Expression — so it calls itself).

(function init() {
  // Load the player's saved data from localStorage (points, solved
  // levels, owned items, active theme and companion)
  loadState();

  // Safety check: if the saved theme no longer exists in the shop
  // (e.g. because it was removed in a game update), fall back to
  // the default Classic theme so nothing is broken
  const savedTheme = getActiveTheme();
  const validTheme = SHOP_ITEMS.some(item => item.id === savedTheme);
  if (!validTheme) setActiveTheme('theme-default');

  // Apply the active theme's CSS class to <body> right away so the
  // correct colours are visible before anything else renders
  applyTheme(getActiveTheme());

  // Set the points counter in the top bar to the correct value
  refreshPointsDisplays();

  // Show the level select screen — this is what the player sees first
  showScreen('map');
})();
