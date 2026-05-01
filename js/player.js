// ════════════════════════════════════════════════════════════════
// PROFILE SCREEN
// Shows the player's stats and lets them manage their equipped
// companion and active theme. Also links through to the shop.
//
// Everything here is built fresh each time the screen is shown —
// there's no persistent HTML for profile content, it's all created
// in JavaScript so it always reflects the latest saved state.
// ════════════════════════════════════════════════════════════════


// Clears and rebuilds the whole profile screen from scratch.
// Called by app.js whenever the player navigates to this screen.
function renderProfile() {
  const content = document.getElementById('profile-content');
  content.innerHTML = '';

  // ── Stats section ─────────────────────────────────────────────
  // Four stat cards in a 2×2 grid: points, levels solved,
  // 3-star clears, and how many levels are still left to do.

  const statsLabel = document.createElement('div');
  statsLabel.className   = 'profile-section-label';
  statsLabel.textContent = 'Stats';
  content.appendChild(statsLabel);

  const solved      = Object.keys(getSolvedLevels()).length;
  const totalLevels = LEVELS.length;
  const threeStars  = Object.values(getSolvedLevels()).filter(s => s === 3).length;

  const statGrid = document.createElement('div');
  statGrid.className = 'stat-grid';
  statGrid.appendChild(makeStatCard('Points', getPoints(), true));
  statGrid.appendChild(makeStatCard('Solved', `${solved} / ${totalLevels}`));
  statGrid.appendChild(makeStatCard('3-star clears', threeStars));
  statGrid.appendChild(makeStatCard('Levels left', totalLevels - solved));
  content.appendChild(statGrid);

  // ── Companion section ─────────────────────────────────────────
  // Shows the currently equipped companion (or a placeholder if
  // none is equipped). Tapping opens the companion picker sheet.

  const compLabel = document.createElement('div');
  compLabel.className   = 'profile-section-label';
  compLabel.textContent = 'Companion';
  content.appendChild(compLabel);

  const companionId   = getActiveCompanion();
  const companionItem = SHOP_ITEMS.find(i => i.id === companionId);
  const compTile      = document.createElement('div');
  compTile.className  = 'inventory-tile';

  if (companionItem) {
    // Player has a companion equipped — show its name, picture, and description
    compTile.innerHTML = `
      <div style="width:48px;height:48px;flex-shrink:0;">${companionItem.svgLarge()}</div>
      <div class="inventory-tile-info">
        <div class="inventory-tile-name">${companionItem.name}</div>
        <div class="inventory-tile-desc">${companionItem.desc}</div>
      </div>
      <div class="inventory-tile-arrow">›</div>
    `;
  } else {
    // No companion equipped — show a ghost placeholder and an invitation to pick one
    compTile.innerHTML = `
      <div style="width:48px;height:48px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:28px;">👻</div>
      <div class="inventory-tile-info">
        <div class="inventory-tile-name">No companion</div>
        <div class="inventory-tile-desc">Tap to choose one</div>
      </div>
      <div class="inventory-tile-arrow">›</div>
    `;
  }

  compTile.addEventListener('click', () => openCompanionPicker());
  content.appendChild(compTile);

  // Link to the companions shop — wording changes depending on whether
  // the player already owns any companions
  const ownedCompanions = SHOP_ITEMS.filter(i => i.type === 'companion' && isItemOwned(i.id));
  content.appendChild(makeShopCTA(
    ownedCompanions.length === 0
      ? 'Get a companion in the shop'
      : 'Browse more companions',
    'shop-companions'
  ));

  // ── Theme section ─────────────────────────────────────────────
  // Shows the currently active theme. Tapping opens the theme
  // picker sheet so the player can switch between owned themes.

  const themeLabel = document.createElement('div');
  themeLabel.className   = 'profile-section-label';
  themeLabel.textContent = 'Theme';
  content.appendChild(themeLabel);

  const activeThemeId = getActiveTheme();
  const themeItem     = SHOP_ITEMS.find(i => i.id === activeThemeId);
  const themeTile     = document.createElement('div');
  themeTile.className = 'inventory-tile';

  if (themeItem) {
    // Show the theme's colour swatch, name, and description
    themeTile.innerHTML = `
      <div class="shop-item-preview" style="flex-shrink:0;">${themeItem.preview()}</div>
      <div class="inventory-tile-info">
        <div class="inventory-tile-name">${themeItem.name}</div>
        <div class="inventory-tile-desc">${themeItem.desc}</div>
      </div>
      <div class="inventory-tile-arrow">›</div>
    `;
  }

  themeTile.addEventListener('click', () => openThemePicker());
  content.appendChild(themeTile);

  // Only show the "browse themes" CTA if there are still themes left to buy
  const allThemes     = SHOP_ITEMS.filter(i => i.type === 'theme' || i.type === 'pride-theme');
  const ownedThemes   = allThemes.filter(i => isItemOwned(i.id));
  const unownedThemes = allThemes.filter(i => !isItemOwned(i.id));
  if (unownedThemes.length > 0) {
    content.appendChild(makeShopCTA(
      ownedThemes.length <= 2 ? 'Get more themes in the shop' : 'Browse more themes',
      'shop-themes'
    ));
  }
}


// ════════════════════════════════════════════════════════════════
// COMPANION PICKER
// A bottom sheet that slides up when the player taps the companion
// tile. Lists every companion they own, plus a "None" option.
// ════════════════════════════════════════════════════════════════

function openCompanionPicker() {
  // Only show companions the player actually owns
  const owned  = SHOP_ITEMS.filter(i => i.type === 'companion' && isItemOwned(i.id));
  const active = getActiveCompanion();

  // Semi-transparent backdrop — tapping it dismisses the sheet
  const overlay = document.createElement('div');
  overlay.className = 'picker-overlay';

  // The white card that slides up from the bottom
  const sheet = document.createElement('div');
  sheet.className = 'picker-sheet';

  const title = document.createElement('div');
  title.className   = 'picker-title';
  title.textContent = 'Choose a companion';
  sheet.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'picker-grid';

  // "None" option — lets the player unequip their companion
  const noneEl = document.createElement('div');
  noneEl.className = 'picker-none' + (active === null ? ' active-item' : '');
  noneEl.innerHTML = `<div style="font-size:24px;">✕</div><div>None</div>`;
  noneEl.addEventListener('click', () => {
    setActiveCompanion(null);
    document.body.removeChild(overlay);
    renderProfile();
  });
  grid.appendChild(noneEl);

  // One tile per owned companion — tapping equips it (or unequips if it's already active)
  owned.forEach(item => {
    const el = document.createElement('div');
    el.className = 'picker-item' + (item.id === active ? ' active-item' : '');
    el.innerHTML = `
      <div style="width:48px;height:48px;">${item.svgLarge()}</div>
      <div class="picker-item-name">${item.name}</div>
    `;
    el.addEventListener('click', () => {
      setActiveCompanion(item.id === active ? null : item.id);
      document.body.removeChild(overlay);
      renderProfile();
    });
    grid.appendChild(el);
  });

  sheet.appendChild(grid);

  // If the player has no companions at all, show a helpful hint instead
  if (owned.length === 0) {
    const hint = document.createElement('div');
    hint.style.cssText = 'text-align:center;font-size:13px;color:var(--text-muted);padding:8px 0;';
    hint.textContent   = 'No companions yet — visit the shop!';
    sheet.appendChild(hint);
  }

  const cancel = document.createElement('button');
  cancel.className   = 'picker-cancel';
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', () => document.body.removeChild(overlay));
  sheet.appendChild(cancel);

  overlay.appendChild(sheet);
  // Tapping outside the sheet also closes it
  overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}


// ════════════════════════════════════════════════════════════════
// THEME PICKER
// Same bottom-sheet pattern as the companion picker, but for
// switching between owned themes.
// ════════════════════════════════════════════════════════════════

function openThemePicker() {
  // Only show themes the player actually owns
  const owned  = SHOP_ITEMS.filter(i => (i.type === 'theme' || i.type === 'pride-theme') && isItemOwned(i.id));
  const active = getActiveTheme();

  const overlay = document.createElement('div');
  overlay.className = 'picker-overlay';

  const sheet = document.createElement('div');
  sheet.className = 'picker-sheet';

  const title = document.createElement('div');
  title.className   = 'picker-title';
  title.textContent = 'Choose a theme';
  sheet.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'picker-grid';

  // One tile per owned theme — shows the colour swatch and name
  owned.forEach(item => {
    const el = document.createElement('div');
    el.className = 'picker-item' + (item.id === active ? ' active-item' : '');
    el.innerHTML = `
      <div class="shop-item-preview">${item.preview()}</div>
      <div class="picker-item-name">${item.name}</div>
    `;
    el.addEventListener('click', () => {
      setActiveTheme(item.id);       // applies the theme immediately
      document.body.removeChild(overlay);
      renderProfile();
    });
    grid.appendChild(el);
  });

  sheet.appendChild(grid);

  const cancel = document.createElement('button');
  cancel.className   = 'picker-cancel';
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', () => document.body.removeChild(overlay));
  sheet.appendChild(cancel);

  overlay.appendChild(sheet);
  overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}


// ════════════════════════════════════════════════════════════════
// HELPER BUILDERS
// Small utility functions for creating reusable UI pieces.
// ════════════════════════════════════════════════════════════════

// Creates a button that links to the shop with a bag icon and a label.
// Used at the bottom of the companion and theme sections to nudge
// the player toward buying more.
function makeShopCTA(label, screen) {
  const btn = document.createElement('button');
  btn.className = 'shop-cta-btn';
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    ${label}
  `;
  btn.addEventListener('click', () => showScreen(screen));
  return btn;
}

// Creates a single stat card: a label on top, a value below.
// isPoints=true adds an accent colour to the value (for the points card).
function makeStatCard(label, value, isPoints = false) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.innerHTML = `
    <div class="stat-label">${label}</div>
    <div class="stat-value${isPoints ? ' points' : ''}">${value}</div>
  `;
  return card;
}
