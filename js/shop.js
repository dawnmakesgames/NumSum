// ── Shop item definitions ────────────────────────────────────

const SHOP_ITEMS = [

  // ── Themes ──────────────────────────────────────────────────
  {
    id:       'theme-default',
    type:     'theme',
    name:     'Classic',
    desc:     'The original warm look',
    price:    0,
    preview() {
      return `<div class="theme-swatch" style="background:#F7F5F0;border-color:#E2DDD6;">
        <div class="swatch-dot" style="background:#1D9E75"></div>
        <div class="swatch-dot" style="background:#534AB7"></div>
        <div class="swatch-dot" style="background:#E24B4A"></div>
      </div>`;
    }
  },
  {
    id:       'theme-dark',
    type:     'theme',
    name:     'Dark',
    desc:     'Easy on the eyes',
    price:    0,
    preview() {
      return `<div class="theme-swatch" style="background:#1C1917;border-color:#44403C;">
        <div class="swatch-dot" style="background:#34D399"></div>
        <div class="swatch-dot" style="background:#818CF8"></div>
        <div class="swatch-dot" style="background:#F87171"></div>
      </div>`;
    }
  },
  {
    id:       'theme-colorblind',
    type:     'theme',
    name:     'Accessible',
    desc:     'Blue & orange instead of green & red',
    price:    0,
    preview() {
      return `<div class="theme-swatch" style="background:#F7F5F0;border-color:#E2DDD6;">
        <div class="swatch-dot" style="background:#0EA5E9"></div>
        <div class="swatch-dot" style="background:#534AB7"></div>
        <div class="swatch-dot" style="background:#F97316"></div>
      </div>`;
    }
  },

  // ── Companions ──────────────────────────────────────────────
  {
    id:    'companion-numby',
    type:  'companion',
    name:  'Numby',
    desc:  'A cheerful little ghost who loves numbers',
    price: 80,
    svgSmall() { return numbySmallSVG(); },
    svgLarge() { return numbyLargeSVG(); },
    preview() { return numbySmallSVG(); }
  }
];

// ── Numby SVG ────────────────────────────────────────────────
// A round ghost-like critter, drawn in CSS variables so it
// adapts to all themes automatically

function numbySmallSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${numbySVGPaths(28, 28, 0.7)}
  </svg>`;
}

function numbyLargeSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${numbySVGPaths(28, 28, 1)}
  </svg>`;
}

function numbySVGPaths(cx, cy, scale) {
  const s = scale;
  // Body — round top, wavy bottom tail
  return `
    <g transform="translate(${cx}, ${cy}) scale(${s})">
      <!-- body -->
      <path d="M0,-22 C12,-22 20,-14 20,-4 L20,14 C20,14 15,10 10,14 C5,18 0,14 0,14 C0,14 -5,18 -10,14 C-15,10 -20,14 -20,14 L-20,-4 C-20,-14 -12,-22 0,-22 Z"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <!-- left eye -->
      <circle cx="-7" cy="-6" r="4" fill="var(--text)"/>
      <circle cx="-6" cy="-7" r="1.5" fill="var(--surface)"/>
      <!-- right eye -->
      <circle cx="7" cy="-6" r="4" fill="var(--text)"/>
      <circle cx="8" cy="-7" r="1.5" fill="var(--surface)"/>
      <!-- smile -->
      <path d="M-5,2 Q0,7 5,2" stroke="var(--text)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <!-- cheeks -->
      <ellipse cx="-11" cy="0" rx="3" ry="2" fill="var(--red)" opacity="0.3"/>
      <ellipse cx="11"  cy="0" rx="3" ry="2" fill="var(--red)" opacity="0.3"/>
    </g>
  `;
}

// ── Shop screen rendering ────────────────────────────────────

function renderShop() {
  document.getElementById('shop-points-count').textContent = getPoints();

  const content = document.getElementById('shop-content');
  content.innerHTML = '';

  // Themes section
  const themeLabel = document.createElement('div');
  themeLabel.className = 'shop-section-label';
  themeLabel.textContent = 'Themes';
  content.appendChild(themeLabel);

  const themeGrid = document.createElement('div');
  themeGrid.className = 'shop-grid';
  SHOP_ITEMS.filter(i => i.type === 'theme').forEach(item => {
    themeGrid.appendChild(makeShopItemEl(item));
  });
  content.appendChild(themeGrid);

  // Companions section
  const compLabel = document.createElement('div');
  compLabel.className = 'shop-section-label';
  compLabel.textContent = 'Companions';
  content.appendChild(compLabel);

  const compGrid = document.createElement('div');
  compGrid.className = 'shop-grid';
  SHOP_ITEMS.filter(i => i.type === 'companion').forEach(item => {
    compGrid.appendChild(makeShopItemEl(item));
  });
  content.appendChild(compGrid);
}

function makeShopItemEl(item) {
  const el       = document.createElement('div');
  const owned    = isItemOwned(item.id);
  const isActive = item.type === 'theme'
    ? getActiveTheme() === item.id
    : getActiveCompanion() === item.id;
  const canAfford = getPoints() >= item.price;

  el.className = 'shop-item' +
    (owned    ? ' owned'       : '') +
    (isActive ? ' active-item' : '') +
    (!owned && !canAfford ? ' locked-item' : '');

  // Preview
  const preview = document.createElement('div');
  preview.className = 'shop-item-preview';
  preview.innerHTML = item.preview();
  el.appendChild(preview);

  // Name
  const name = document.createElement('div');
  name.className   = 'shop-item-name';
  name.textContent = item.name;
  el.appendChild(name);

  // Desc
  const desc = document.createElement('div');
  desc.className   = 'shop-item-desc';
  desc.textContent = item.desc;
  el.appendChild(desc);

  // Price / status badge
  const badge = document.createElement('div');
  badge.className = 'shop-item-price';
  if (isActive) {
    badge.textContent = 'Active';
    badge.classList.add('equipped');
  } else if (owned) {
    badge.textContent = 'Equip';
    badge.classList.add('owned');
  } else if (item.price === 0) {
    badge.textContent = 'Free';
    badge.classList.add('free');
  } else {
    badge.textContent = `⭐ ${item.price}`;
    if (!canAfford) badge.style.opacity = '0.5';
  }
  el.appendChild(badge);

  // Click handler
  if (owned) {
    el.addEventListener('click', () => equipItem(item));
  } else if (canAfford) {
    el.addEventListener('click', () => buyItem_shop(item));
  }

  return el;
}

function buyItem_shop(item) {
  if (!spendPoints(item.price)) return;
  buyItem(item.id);
  equipItem(item);
  renderShop();
}

function equipItem(item) {
  if (item.type === 'theme') {
    setActiveTheme(item.id);
  } else if (item.type === 'companion') {
    const current = getActiveCompanion();
    setActiveCompanion(current === item.id ? null : item.id);
  }
  renderShop();
}
