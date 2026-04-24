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

  // ── Active companion ───────────────────────────────────────
  const compLabel = document.createElement('div');
  compLabel.className   = 'profile-section-label';
  compLabel.textContent = 'Companion';
  content.appendChild(compLabel);

  const companionId = getActiveCompanion();
  if (companionId) {
    const item = SHOP_ITEMS.find(i => i.id === companionId);
    if (item) {
      const preview = document.createElement('div');
      preview.className = 'companion-preview';
      preview.innerHTML = `
        ${item.svgLarge()}
        <div class="companion-info">
          <div class="companion-name">${item.name}</div>
          <div class="companion-desc">${item.desc}</div>
        </div>
      `;
      content.appendChild(preview);
    }
  } else {
    const none = document.createElement('div');
    none.className   = 'no-companion';
    none.textContent = 'No companion yet — visit the shop!';
    none.style.marginBottom = '8px';
    content.appendChild(none);
  }

  // ── Active theme ───────────────────────────────────────────
  const themeLabel = document.createElement('div');
  themeLabel.className   = 'profile-section-label';
  themeLabel.textContent = 'Active Theme';
  content.appendChild(themeLabel);

  const activeThemeId = getActiveTheme();
  const themeItem     = SHOP_ITEMS.find(i => i.id === activeThemeId);
  if (themeItem) {
    const themeRow = document.createElement('div');
    themeRow.className = 'companion-preview';
    themeRow.innerHTML = `
      <div class="shop-item-preview">${themeItem.preview()}</div>
      <div class="companion-info">
        <div class="companion-name">${themeItem.name}</div>
        <div class="companion-desc">${themeItem.desc}</div>
      </div>
    `;
    content.appendChild(themeRow);
  }

  // ── Shop button ────────────────────────────────────────────
  const shopBtn = document.createElement('button');
  shopBtn.className   = 'btn btn-primary';
  shopBtn.style.marginTop = '20px';
  shopBtn.textContent = 'Open shop';
  shopBtn.addEventListener('click', () => {
    renderShop();
    showScreen('shop');
  });
  content.appendChild(shopBtn);
}

function makeStatCard(label, value, isPoints = false) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.innerHTML = `
    <div class="stat-label">${label}</div>
    <div class="stat-value${isPoints ? ' points' : ''}">${value}</div>
  `;
  return card;
}
