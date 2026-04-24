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
    id:       'theme-colorblind',
    type:     'theme',
    name:     'Accessible',
    desc:     'Blue & orange — free for everyone',
    price:    0,
    preview() {
      return `<div class="theme-swatch" style="background:#F7F5F0;border-color:#E2DDD6;">
        <div class="swatch-dot" style="background:#0EA5E9"></div>
        <div class="swatch-dot" style="background:#534AB7"></div>
        <div class="swatch-dot" style="background:#F97316"></div>
      </div>`;
    }
  },
  {
    id:       'theme-dark',
    type:     'theme',
    name:     'Dark',
    desc:     'Easy on the eyes at night',
    price:    35,
    preview() {
      return `<div class="theme-swatch" style="background:#1C1917;border-color:#44403C;">
        <div class="swatch-dot" style="background:#34D399"></div>
        <div class="swatch-dot" style="background:#818CF8"></div>
        <div class="swatch-dot" style="background:#F87171"></div>
      </div>`;
    }
  },
  {
    id:       'theme-dark-cb',
    type:     'theme',
    name:     'Dark Accessible',
    desc:     'Dark mode with blue & orange',
    price:    35,
    preview() {
      return `<div class="theme-swatch" style="background:#1C1917;border-color:#44403C;">
        <div class="swatch-dot" style="background:#38BDF8"></div>
        <div class="swatch-dot" style="background:#818CF8"></div>
        <div class="swatch-dot" style="background:#FB923C"></div>
      </div>`;
    }
  },

  {
    id:       'theme-bi',
    type:     'pride-theme',
    name:     'Bi Pride',
    desc:     'Pink, purple & blue',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#FDF0F7;border-color:#F0B8D8;">
        <div class="swatch-dot" style="background:#D60270"></div>
        <div class="swatch-dot" style="background:#9B4F96"></div>
        <div class="swatch-dot" style="background:#0038A8"></div>
      </div>`;
    }
  },
  {
    id:       'theme-bi-dark',
    type:     'pride-theme',
    name:     'Bi Pride Dark',
    desc:     'Dark bi pride',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#1A0D18;border-color:#5C2A58;">
        <div class="swatch-dot" style="background:#F060A8"></div>
        <div class="swatch-dot" style="background:#C07ABB"></div>
        <div class="swatch-dot" style="background:#6B9FE8"></div>
      </div>`;
    }
  },
  {
    id:       'theme-trans',
    type:     'pride-theme',
    name:     'Trans Pride',
    desc:     'Light blue, pink & white',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#F0FAFF;border-color:#B8E8FA;">
        <div class="swatch-dot" style="background:#5BCEFA"></div>
        <div class="swatch-dot" style="background:#F5A9B8"></div>
        <div class="swatch-dot" style="background:#DDDDDD"></div>
      </div>`;
    }
  },
  {
    id:       'theme-trans-dark',
    type:     'pride-theme',
    name:     'Trans Pride Dark',
    desc:     'Dark trans pride',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#0A1520;border-color:#1A3A50;">
        <div class="swatch-dot" style="background:#5BCEFA"></div>
        <div class="swatch-dot" style="background:#F5A9B8"></div>
        <div class="swatch-dot" style="background:#AAAAAA"></div>
      </div>`;
    }
  },
  {
    id:       'theme-mlm',
    type:     'pride-theme',
    name:     'MLM Pride',
    desc:     'Green, white, blue & purple',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#F0FBF7;border-color:#A0DEC4;">
        <div class="swatch-dot" style="background:#078D70"></div>
        <div class="swatch-dot" style="background:#7BADE3"></div>
        <div class="swatch-dot" style="background:#3E1A78"></div>
      </div>`;
    }
  },
  {
    id:       'theme-mlm-dark',
    type:     'pride-theme',
    name:     'MLM Pride Dark',
    desc:     'Dark MLM pride',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#061410;border-color:#0A3028;">
        <div class="swatch-dot" style="background:#26CEAA"></div>
        <div class="swatch-dot" style="background:#7BADE3"></div>
        <div class="swatch-dot" style="background:#7B5ABB"></div>
      </div>`;
    }
  },
  {
    id:       'theme-wlw',
    type:     'pride-theme',
    name:     'WLW Pride',
    desc:     'Orange, white & pink',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#FFF8F0;border-color:#FFCCA0;">
        <div class="swatch-dot" style="background:#D62900"></div>
        <div class="swatch-dot" style="background:#FF9B55"></div>
        <div class="swatch-dot" style="background:#A50062"></div>
      </div>`;
    }
  },
  {
    id:       'theme-wlw-dark',
    type:     'pride-theme',
    name:     'WLW Pride Dark',
    desc:     'Dark WLW pride',
    price:    10,
    preview() {
      return `<div class="theme-swatch" style="background:#1A0800;border-color:#4A1800;">
        <div class="swatch-dot" style="background:#FF6633"></div>
        <div class="swatch-dot" style="background:#FF9B55"></div>
        <div class="swatch-dot" style="background:#D461A6"></div>
      </div>`;
    }
  },
  {
    id:       'theme-rainbow',
    type:     'pride-theme',
    name:     'Rainbow',
    desc:     'For everyone 🌈',
    price:    15,
    preview() {
      return `<div class="theme-swatch" style="background:#FAFAFA;border-color:#E0E0E0;gap:1px;padding:4px;">
        <div class="swatch-dot" style="background:#E40303;width:7px;height:7px;"></div>
        <div class="swatch-dot" style="background:#FF8C00;width:7px;height:7px;"></div>
        <div class="swatch-dot" style="background:#FFED00;width:7px;height:7px;"></div>
        <div class="swatch-dot" style="background:#008026;width:7px;height:7px;"></div>
        <div class="swatch-dot" style="background:#004DFF;width:7px;height:7px;"></div>
        <div class="swatch-dot" style="background:#750787;width:7px;height:7px;"></div>
      </div>`;
    }
  },
  {
    id:    'companion-numby',
    type:  'companion',
    name:  'Numby',
    desc:  'A cheerful little ghost who loves numbers',
    price: 80,
    svgSmall() { return numbySmallSVG(); },
    svgLarge() { return numbyLargeSVG(); },
    preview() { return numbySmallSVG(); }
  },
  {
    id:    'companion-bun',
    type:  'companion',
    name:  'Bun',
    desc:  'A soft little rabbit with very big ears',
    price: 100,
    svgSmall() { return bunSmallSVG(); },
    svgLarge() { return bunLargeSVG(); },
    preview() { return bunSmallSVG(); }
  },
  {
    id:    'companion-pip',
    type:  'companion',
    name:  'Pip',
    desc:  'A round little frog who sits very still',
    price: 120,
    svgSmall() { return pipSmallSVG(); },
    svgLarge() { return pipLargeSVG(); },
    preview() { return pipSmallSVG(); }
  },
  {
    id:    'companion-lottie',
    type:  'companion',
    name:  'Lottie',
    desc:  'A pink axolotl with very fancy gills',
    price: 140,
    svgSmall() { return lottieSmallSVG(); },
    svgLarge() { return lottieLargeSVG(); },
    preview() { return lottieSmallSVG(); }
  }
];

// ── Numby SVG ────────────────────────────────────────────────

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
  return `
    <g transform="translate(${cx}, ${cy}) scale(${s})">
      <path d="M0,-22 C12,-22 20,-14 20,-4 L20,14 C20,14 15,10 10,14 C5,18 0,14 0,14 C0,14 -5,18 -10,14 C-15,10 -20,14 -20,14 L-20,-4 C-20,-14 -12,-22 0,-22 Z"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <g class="numby-normal">
        <circle cx="-7" cy="-6" r="4" fill="var(--text)"/>
        <circle cx="-6" cy="-7" r="1.5" fill="var(--surface)"/>
        <circle cx="7" cy="-6" r="4" fill="var(--text)"/>
        <circle cx="8" cy="-7" r="1.5" fill="var(--surface)"/>
        <path d="M-5,2 Q0,7 5,2" stroke="var(--text)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </g>
      <g class="numby-happy">
        <text x="-7" y="-2" text-anchor="middle" font-size="10" fill="var(--text)">★</text>
        <text x="7"  y="-2" text-anchor="middle" font-size="10" fill="var(--text)">★</text>
        <path d="M-7,4 Q0,12 7,4" stroke="var(--text)" stroke-width="2" stroke-linecap="round" fill="var(--green-light)"/>
      </g>
      <ellipse cx="-11" cy="0" rx="3" ry="2" fill="var(--red)" opacity="0.3"/>
      <ellipse cx="11"  cy="0" rx="3" ry="2" fill="var(--red)" opacity="0.3"/>
    </g>
  `;
}

// ── Bun SVG ──────────────────────────────────────────────────

function bunSmallSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${bunSVGPaths(28, 30, 0.7)}
  </svg>`;
}

function bunLargeSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${bunSVGPaths(28, 30, 1)}
  </svg>`;
}

function bunSVGPaths(cx, cy, scale) {
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale})">
      <!-- left ear -->
      <ellipse cx="-8" cy="-28" rx="4" ry="10"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <ellipse cx="-8" cy="-28" rx="2" ry="7" fill="var(--red)" opacity="0.25"/>
      <!-- right ear -->
      <ellipse cx="8" cy="-28" rx="4" ry="10"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <ellipse cx="8" cy="-28" rx="2" ry="7" fill="var(--red)" opacity="0.25"/>
      <!-- body -->
      <ellipse cx="0" cy="0" rx="18" ry="16"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <!-- tail -->
      <circle cx="0" cy="14" r="5"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
      <!-- normal face -->
      <g class="numby-normal">
        <circle cx="-6" cy="-3" r="3.5" fill="var(--text)"/>
        <circle cx="-5" cy="-4" r="1.2" fill="var(--surface)"/>
        <circle cx="6"  cy="-3" r="3.5" fill="var(--text)"/>
        <circle cx="7"  cy="-4" r="1.2" fill="var(--surface)"/>
        <!-- little nose -->
        <ellipse cx="0" cy="3" rx="2" ry="1.2" fill="var(--red)" opacity="0.5"/>
        <!-- mouth -->
        <path d="M-3,5 Q0,8 3,5" stroke="var(--text)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
      </g>
      <!-- happy face -->
      <g class="numby-happy">
        <text x="-6" y="1" text-anchor="middle" font-size="9" fill="var(--text)">★</text>
        <text x="6"  y="1" text-anchor="middle" font-size="9" fill="var(--text)">★</text>
        <ellipse cx="0" cy="3" rx="2" ry="1.2" fill="var(--red)" opacity="0.5"/>
        <path d="M-5,6 Q0,12 5,6" stroke="var(--text)" stroke-width="2" stroke-linecap="round" fill="var(--green-light)"/>
      </g>
      <!-- cheeks -->
      <ellipse cx="-12" cy="2" rx="3" ry="2" fill="var(--red)" opacity="0.2"/>
      <ellipse cx="12"  cy="2" rx="3" ry="2" fill="var(--red)" opacity="0.2"/>
    </g>
  `;
}

// ── Pip SVG ──────────────────────────────────────────────────

function pipSmallSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${pipSVGPaths(28, 30, 0.7)}
  </svg>`;
}

function pipLargeSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${pipSVGPaths(28, 30, 1)}
  </svg>`;
}

function pipSVGPaths(cx, cy, scale) {
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale})">
      <!-- body — wide and squat -->
      <ellipse cx="0" cy="2" rx="20" ry="15"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <!-- belly patch -->
      <ellipse cx="0" cy="5" rx="12" ry="9" fill="var(--bg)" opacity="0.6"/>
      <!-- left eye bump -->
      <circle cx="-9" cy="-12" r="6"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <!-- right eye bump -->
      <circle cx="9" cy="-12" r="6"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/>
      <!-- left foot -->
      <ellipse cx="-14" cy="14" rx="6" ry="3"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
      <!-- right foot -->
      <ellipse cx="14" cy="14" rx="6" ry="3"
        fill="var(--surface)" stroke="var(--border)" stroke-width="1"/>
      <!-- normal face -->
      <g class="numby-normal">
        <circle cx="-9" cy="-12" r="3.5" fill="var(--text)"/>
        <circle cx="-8" cy="-13" r="1.2" fill="var(--surface)"/>
        <circle cx="9"  cy="-12" r="3.5" fill="var(--text)"/>
        <circle cx="10" cy="-13" r="1.2" fill="var(--surface)"/>
        <!-- wide frog mouth -->
        <path d="M-8,6 Q0,10 8,6" stroke="var(--text)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </g>
      <!-- happy face -->
      <g class="numby-happy">
        <text x="-9" y="-8" text-anchor="middle" font-size="9" fill="var(--text)">★</text>
        <text x="9"  y="-8" text-anchor="middle" font-size="9" fill="var(--text)">★</text>
        <!-- big frog grin -->
        <path d="M-10,5 Q0,14 10,5" stroke="var(--text)" stroke-width="2" stroke-linecap="round" fill="var(--green-light)"/>
      </g>
      <!-- cheeks -->
      <ellipse cx="-14" cy="4" rx="3" ry="2" fill="var(--red)" opacity="0.2"/>
      <ellipse cx="14"  cy="4" rx="3" ry="2" fill="var(--red)" opacity="0.2"/>
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

  // Pride themes section
  const prideLabel = document.createElement('div');
  prideLabel.className = 'shop-section-label';
  prideLabel.textContent = 'Pride Themes 🏳️‍🌈';
  content.appendChild(prideLabel);

  const prideGrid = document.createElement('div');
  prideGrid.className = 'shop-grid';
  SHOP_ITEMS.filter(i => i.type === 'pride-theme').forEach(item => {
    prideGrid.appendChild(makeShopItemEl(item));
  });
  content.appendChild(prideGrid);

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
  const isActive = (item.type === 'theme' || item.type === 'pride-theme')
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
  if (item.type === 'theme' || item.type === 'pride-theme') {
    setActiveTheme(item.id);
  } else if (item.type === 'companion') {
    const current = getActiveCompanion();
    setActiveCompanion(current === item.id ? null : item.id);
  }
  renderShop();
}

// ── Lottie SVG ───────────────────────────────────────────────

function lottieSmallSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${lottieSVGPaths(28, 30, 0.65)}
  </svg>`;
}

function lottieLargeSVG() {
  return `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    ${lottieSVGPaths(28, 30, 0.9)}
  </svg>`;
}

function gillFeather(x1, y1, x2, y2, bx, by) {
  const dx = x2 - x1, dy = y2 - y1;
  const steps = 3;
  let lines = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F5A9B8" stroke-width="1.8" stroke-linecap="round"/>`;
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const mx = x1 + dx * t, my = y1 + dy * t;
    const len = 4;
    lines += `<line x1="${mx}" y1="${my}" x2="${mx + bx * len * (1 - t * 0.4)}" y2="${my + by * len * (1 - t * 0.4)}" stroke="#F5A9B8" stroke-width="1" stroke-linecap="round"/>`;
    lines += `<line x1="${mx}" y1="${my}" x2="${mx - bx * len * 0.6 * (1 - t * 0.4)}" y2="${my - by * len * 0.6 * (1 - t * 0.4)}" stroke="#F5A9B8" stroke-width="1" stroke-linecap="round"/>`;
  }
  return lines;
}

function lottieSVGPaths(cx, cy, scale) {
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale})">
      ${gillFeather(-26, -6, -38, -18,  0.7, -0.7)}
      ${gillFeather(-27,  1, -44,   1,  0,    1  )}
      ${gillFeather(-26,  8, -38,  19, -0.7, -0.7)}
      ${gillFeather( 26, -6,  38, -18, -0.7, -0.7)}
      ${gillFeather( 27,  1,  44,   1,  0,    1  )}
      ${gillFeather( 26,  8,  38,  19,  0.7, -0.7)}
      <ellipse cx="0" cy="2" rx="26" ry="22" fill="#FDDDE6" stroke="#F0B0C0" stroke-width="1.5"/>
      <ellipse cx="0" cy="7" rx="15" ry="12" fill="#FFF0F5" opacity="0.7"/>
      <g class="numby-normal">
        <circle cx="-10" cy="-5" r="5.5" fill="var(--text)"/>
        <circle cx="-8"  cy="-7" r="2"   fill="var(--surface)"/>
        <circle cx="10"  cy="-5" r="5.5" fill="var(--text)"/>
        <circle cx="12"  cy="-7" r="2"   fill="var(--surface)"/>
        <path d="M-6,6 Q0,11 6,6" stroke="#C07080" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </g>
      <g class="numby-happy">
        <text x="-10" y="0" text-anchor="middle" font-size="11" fill="var(--text)">★</text>
        <text x="10"  y="0" text-anchor="middle" font-size="11" fill="var(--text)">★</text>
        <path d="M-8,6 Q0,15 8,6" stroke="#C07080" stroke-width="2" stroke-linecap="round" fill="#FFF0F5"/>
      </g>
      <ellipse cx="-15" cy="4" rx="4" ry="3" fill="#F5A9B8" opacity="0.5"/>
      <ellipse cx="15"  cy="4" rx="4" ry="3" fill="#F5A9B8" opacity="0.5"/>
      <ellipse cx="0" cy="22" rx="8" ry="4" fill="#FDDDE6" stroke="#F0B0C0" stroke-width="1"/>
    </g>
  `;
}
