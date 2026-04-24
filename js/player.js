// ── Profile screen ───────────────────────────────────────────

function renderProfile() {
  const content = document.getElementById('profile-content');
  content.innerHTML = '';

  // ── Stats ──────────────────────────────────────────────────
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

  // ── Companion ──────────────────────────────────────────────
  const compLabel = document.createElement('div');
  compLabel.className   = 'profile-section-label';
  compLabel.textContent = 'Companion';
  content.appendChild(compLabel);

  const companionId   = getActiveCompanion();
  const companionItem = SHOP_ITEMS.find(i => i.id === companionId);
  const compTile      = document.createElement('div');
  compTile.className  = 'inventory-tile';

  if (companionItem) {
    compTile.innerHTML = `
      <div style="width:48px;height:48px;flex-shrink:0;">${companionItem.svgLarge()}</div>
      <div class="inventory-tile-info">
        <div class="inventory-tile-name">${companionItem.name}</div>
        <div class="inventory-tile-desc">${companionItem.desc}</div>
      </div>
      <div class="inventory-tile-arrow">›</div>
    `;
  } else {
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

  // ── Theme ──────────────────────────────────────────────────
  const themeLabel = document.createElement('div');
  themeLabel.className   = 'profile-section-label';
  themeLabel.textContent = 'Theme';
  content.appendChild(themeLabel);

  const activeThemeId = getActiveTheme();
  const themeItem     = SHOP_ITEMS.find(i => i.id === activeThemeId);
  const themeTile     = document.createElement('div');
  themeTile.className = 'inventory-tile';

  if (themeItem) {
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
}

// ── Companion picker ─────────────────────────────────────────

function openCompanionPicker() {
  const owned  = SHOP_ITEMS.filter(i => i.type === 'companion' && isItemOwned(i.id));
  const active = getActiveCompanion();

  const overlay = document.createElement('div');
  overlay.className = 'picker-overlay';

  const sheet = document.createElement('div');
  sheet.className = 'picker-sheet';

  const title = document.createElement('div');
  title.className   = 'picker-title';
  title.textContent = 'Choose a companion';
  sheet.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'picker-grid';

  // None option
  const noneEl = document.createElement('div');
  noneEl.className = 'picker-none' + (active === null ? ' active-item' : '');
  noneEl.innerHTML = `<div style="font-size:24px;">✕</div><div>None</div>`;
  noneEl.addEventListener('click', () => {
    setActiveCompanion(null);
    document.body.removeChild(overlay);
    renderProfile();
  });
  grid.appendChild(noneEl);

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
  overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
}

// ── Theme picker ─────────────────────────────────────────────

function openThemePicker() {
  const owned  = SHOP_ITEMS.filter(i => i.type === 'theme' && isItemOwned(i.id));
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

  owned.forEach(item => {
    const el = document.createElement('div');
    el.className = 'picker-item' + (item.id === active ? ' active-item' : '');
    el.innerHTML = `
      <div class="shop-item-preview">${item.preview()}</div>
      <div class="picker-item-name">${item.name}</div>
    `;
    el.addEventListener('click', () => {
      setActiveTheme(item.id);
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

// ── Stat card helper ─────────────────────────────────────────

function makeStatCard(label, value, isPoints = false) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.innerHTML = `
    <div class="stat-label">${label}</div>
    <div class="stat-value${isPoints ? ' points' : ''}">${value}</div>
  `;
  return card;
}
