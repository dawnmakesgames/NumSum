# NumSum — project brief for Claude

## Overview
A cosy mobile-first browser puzzle game built in plain HTML/CSS/JS, no framework.
Players circle numbers in a grid so each row and column adds up to the target sum shown on the edges.

## Links
- Repo:       https://github.com/dawnmakesgames/NumSum
- Live game:  https://dawnmakesgames.github.io/NumSum
- Dev branch: https://github.com/dawnmakesgames/NumSum/tree/dev
- v0.1 release: https://github.com/dawnmakesgames/NumSum/releases/tag/v0.1
- v0.2 release: https://github.com/dawnmakesgames/NumSum/releases/tag/v0.2

## Current version: 0.2
- main branch = stable v0.2
- dev branch  = work in progress for v0.3
- Workflow: build on dev → test → pull request → merge to main → create release tag

## File structure
```
NumSum/
├── index.html          — app shell, loads all scripts and styles
├── CLAUDE.md           — this file
├── css/
│   └── style.css       — all styling, theme variables, animations
└── js/
    ├── levels.js       — all level data + section definitions + point values
    ├── store.js        — all localStorage reads/writes, theme application
    ├── game.js         — core game logic, grid rendering, cell interaction
    ├── map.js          — level map screen with pagination
    ├── player.js       — profile/inventory screen + pickers
    ├── shop.js         — shop screen, item definitions, critter SVGs
    └── app.js          — screen routing, app initialisation
```

Note: must be served from a web server. Opening index.html locally breaks script loading.

## Screens
- **Map** — level select with pagination, points display, profile + shop icon buttons
- **Game** — the puzzle itself
- **Profile** — stats, companion picker, theme picker, shop CTAs
- **Shop** — buy themes, pride themes, companions

## Gameplay
- Tap cells to select/deselect numbers
- Selected numbers in each row/column must add up exactly to the target
- Labels turn green when exact, red when over
- Completed rows/columns dim unselected cells
- Running totals shown as small corner numbers on labels

## Game modes
- Lives mode: 3 lives, lose one when row/col goes over target
- Free mode: no lives, relaxed, earns half points

## Levels
- 150 total across 3 sections:
  - Warm-up   (levels   1–45):  3×3 grid, 3 pages of 15
  - Classic   (levels  46–120): 4×4 grid, 5 pages of 15
  - Challenge (levels 121–150): 5×5 grid, 2 pages of 15
- Level 1 of each section always unlocked; rest unlock sequentially on completion
- Solved levels can always be replayed
- Mix of hand-crafted (original 30) and generated levels
- All verified unique — no duplicate grids or solutions
- Duplicate checker: parse solution blocks from levels.js and compare

## Pagination
- Max 15 levels per page per section
- Arrow buttons + dot indicators below each section grid
- Auto-advances to page containing earliest unsolved unlocked level on load
- Page state stored in sectionPages object in map.js (not persisted)

## Points system
- 3×3: 10 pts base + 5 per life remaining (free mode: 5 pts flat)
- 4×4: 20 pts base + 5 per life remaining (free mode: 10 pts flat)
- 5×5: 35 pts base + 5 per life remaining (free mode: 17 pts flat)
- Revive costs: 3×3 = 8 pts, 4×4 = 15 pts, 5×5 = 25 pts

## Star ratings
- 3 stars: all 3 lives remaining
- 2 stars: 2 lives remaining
- 1 star:  1 life, revived, or free mode
- Shown on level map dots

## Shop & inventory
All cosmetics optional, game always finishable without spending.
Saved in localStorage. item types: 'theme', 'pride-theme', 'companion'

### Themes (type: 'theme') — free to own by default
- Classic         (theme-default)    — warm off-white, free
- Accessible      (theme-colorblind) — blue/orange feedback, free
- Dark            (theme-dark)       — dark brown tones, 35 pts
- Dark Accessible (theme-dark-cb)    — dark + blue/orange, 35 pts

### Pride themes (type: 'pride-theme') — 10 pts each, rainbow 15 pts
All use verified official flag hex codes.
- Bi Pride        (theme-bi)         — #D60270 pink, #9B4F96 purple, #0038A8 blue
- Bi Pride Dark   (theme-bi-dark)
- Trans Pride     (theme-trans)      — #5BCEFA blue, #F5A9B8 pink, #FFFFFF white
- Trans Pride Dark(theme-trans-dark)
- MLM Pride       (theme-mlm)        — #078D70 green, #7BADE3 blue, #3E1A78 purple
- MLM Pride Dark  (theme-mlm-dark)
- WLW Pride       (theme-wlw)        — #D62900 orange, #FF9B55 light orange, #A50062 dark rose
- WLW Pride Dark  (theme-wlw-dark)
- Rainbow         (theme-rainbow)    — #E40303 #FF8C00 #FFED00 #008026 #004DFF #750787

### Companions (type: 'companion')
- Numby (companion-numby) — round ghost, 80 pts
- Bun   (companion-bun)   — rabbit with tall ears, 100 pts
- Pip   (companion-pip)   — wide squat frog, 120 pts

All companions:
- Idle float animation (CSS, translateY, 3s loop)
- Row/col complete: quick bounce (companion-row-done class)
- Puzzle solved: wiggle + star eyes + open smile (companion-celebrate + is-happy classes)
- Happy face resets on game restart
- Drawn as inline SVG in shop.js — no image files needed
- Face states use .numby-normal / .numby-happy CSS classes (shared across all critters)

## Themes system
- CSS variables on :root, overridden per body class (e.g. body.theme-dark)
- applyTheme(id) strips all theme-* classes and adds the new one
- theme-dark-cb is a special case: adds both theme-dark and theme-colorblind
- Target row/col labels have per-theme solid background colours
- exact/over states (green/red) use high-specificity selectors to override label backgrounds

## Persistence
- localStorage key: 'numsum_v03'
- Saves: solved levels + stars, points, owned items, active theme, active companion
- Per-device only, no account sync
- Bump SAVE_KEY when default owned items change (to avoid stale data)

## Dev tools
- "Clear all progress" button at bottom of level map
- TO BE REMOVED before v1.0

## Planned features (not yet built)
- Level generator already written (generate_levels.js) — run to add more levels
- PWA support (installable from browser, works offline)
- Daily puzzle (fixed level per calendar date, bonus points)
- More companions
- Ad integration hooks (optional rewarded ads for extra lives)
- Remove dev tools before public release
- Audio/sound effects
- App store release via Capacitor (no code rewrite needed)

## Tech notes
- No framework, no build step, no npm — plain HTML/CSS/JS only
- Grid layout dynamic — works for any NxN size
- Level targets computed from solution arrays (always valid by construction)
- Duplicate checker: count solution: [ blocks, compare stringified grids and solutions
- applyTheme is future-proof: strip all theme-* classes, add new one. No changes needed for new themes.
- Future app store path: wrap with Capacitor

## How to work on this
1. Make changes on dev branch
2. Test via GitHub Pages pointed at dev
3. When ready: pull request dev → main → merge
4. Create release tag on main
5. Update this CLAUDE.md
