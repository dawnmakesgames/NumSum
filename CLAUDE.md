# NumSum — project brief for Claude

## Overview
A cosy mobile-first browser puzzle game built in plain HTML/CSS/JS, no framework.
Players circle numbers in a grid so each row and column adds up to the target sum shown on the edges.
Built by a non-developer using Claude — no prior coding experience.

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
├── README.md           — public-facing project description
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
IMPORTANT: When uploading files to GitHub, double-check you're pasting the right file into the right slot — mix-ups (e.g. shop.js content in game.js) have happened and cause silent failures.

## Screens
- **Map** — level select with pagination, points display, profile/themes/companions icon buttons
- **Game** — the puzzle itself
- **Profile** — stats, companion picker, theme picker, shop CTAs
- **Shop — Themes** — buy regular and pride themes
- **Shop — Companions** — buy critter companions

## Navigation icons (top bar on map)
- Person silhouette → Profile
- Paint palette → Themes shop
- Paw print → Companions shop
All are clean SVG line icons — no emoji anywhere in the UI (owner strongly dislikes emoji)

## Screens
- **Map** — level select with pagination, points display, profile + shop icon buttons
- **Game** — the puzzle itself
- **Profile** — stats, companion picker, theme picker, shop CTAs
- **Shop** — buy themes, pride themes, companions

## Gameplay
- Tap cells to select/deselect numbers
- Selected numbers in each row/column must add up exactly to the target
- Labels turn green (or blue in colourblind mode) when exact, red (or orange) when over
- Completed rows/columns dim unselected cells
- Running totals shown as small corner numbers on labels
- Confetti explodes from the centre of the grid on puzzle complete

## Game modes
- **Lives** (heart icon) — 3 lives, lose one when row/col goes over target
- **Cosy** (leaf icon) — no lives, relaxed, earns half points
- Internal value is still `mode === 'free'` — only the label changed to "Cosy"

## Levels — 285 total
```
Warm-up    (levels   1–45):   3×3,  3 pages  — range [0,   45]
Classic    (levels  46–120):  4×4,  5 pages  — range [45,  120]  ← cosiest section, keep biggest
Challenge  (levels 121–150):  5×5,  2 pages  — range [120, 150]
Expert     (levels 151–270):  6×6,  8 pages  — range [150, 270]  ← very large, could trim later
Skill Issue(levels 271–285):  7×7,  1 page   — range [270, 285]
```
- Level 1 of each section always unlocked; rest unlock sequentially
- Solved levels can always be replayed
- Mix of hand-crafted (original 30) and generated levels
- All verified unique — no duplicate grids or solutions
- Duplicate checker: count solution: [ blocks, compare stringified grids and solutions
- Level generator script exists at /home/claude/generate_levels.js (run on Claude's server)
- Injection always creates a missing `}` at the boundary — always check for syntax errors after

## Points system
- 3×3: 10 pts base + 5/life  (cosy: 5 flat)
- 4×4: 20 pts base + 5/life  (cosy: 10 flat)
- 5×5: 35 pts base + 5/life  (cosy: 17 flat)
- 6×6: 55 pts base + 5/life  (cosy: 27 flat)
- 7×7: 80 pts base + 5/life  (cosy: 40 flat)
- Revive costs: 3×3=8, 4×4=15, 5×5=25, 6×6=40, 7×7=60 pts
- Points only awarded for improvement over previous best on replays
- Stars: 3=all lives, 2=two lives, 1=one life/revive/cosy mode

## Shop & inventory
All cosmetics optional. item types: 'theme', 'pride-theme', 'companion'
Save key: 'numsum_v03' — bump when default owned items change

### Themes (type: 'theme') — free by default
- Classic (theme-default), Accessible/colourblind (theme-colorblind) — free
- Dark (theme-dark), Dark Accessible (theme-dark-cb) — 35 pts each

### Pride themes (type: 'pride-theme') — 10 pts each, Rainbow 15 pts
All use verified official flag hex codes:
- Bi Pride / Bi Pride Dark       — #D60270, #9B4F96, #0038A8
- Trans Pride / Trans Pride Dark — #5BCEFA, #F5A9B8, #FFFFFF
- MLM Pride / MLM Pride Dark     — #078D70, #7BADE3, #3E1A78
- WLW Pride / WLW Pride Dark     — #D62900, #FF9B55, #A50062
- Rainbow                        — #E40303 #FF8C00 #FFED00 #008026 #004DFF #750787

### Companions (type: 'companion')
- Numby  (companion-numby)   — round ghost,  80 pts
- Bun    (companion-bun)     — rabbit,       100 pts
- Pip    (companion-pip)     — frog,         120 pts
- Lottie (companion-lottie)  — axolotl,      140 pts

All companions: idle float, row-done bounce, puzzle-solved wiggle + happy face.
Lottie is special: she uses a happy=true parameter on svgLarge() instead of CSS class
toggling, because SVG repaints were causing her eyes to disappear with the class approach.
celebrateCompanion() calls item.svgLarge(true) specifically for companion-lottie.
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
- theme-dark-cb adds both theme-dark and theme-colorblind
- Adding new themes: add CSS variables block + body.theme-X label overrides + shop item
- No changes needed to applyTheme for new themes (strips all, adds new)

## Confetti
- Canvas overlay, explodes from centre of #grid-wrap element
- Uses CSS variables for colours (accent, green, red, points-color, text)
- Automatically themed — pride themes get pride colours
- After canvas removed, calls celebrateCompanion() again to ensure happy face persists
- launchConfetti() in game.js
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

## Planned / discussed but not yet built
## Planned features (not yet built)
- Level generator already written (generate_levels.js) — run to add more levels
- PWA support (installable from browser, works offline)
- Daily puzzle (fixed level per calendar date, bonus points)
- More companions
- Ad integration hooks (optional rewarded ads for extra lives)
- Remove dev tools before public release
- Rebalance level counts (6×6 section is very large — 120 levels)
- Better local dev workflow (git push instead of copy-paste uploads)
- App store release via Capacitor (no code rewrite needed)

## Grid sizing (game.js gridSizing function)
- 3×3: label 52px, cell 72px, fonts 17/22/11
- 4×4: label 48px, cell 64px, fonts 16/20/10
- 5×5: label 40px, cell 52px, fonts 14/17/9
- 6×6: label 34px, cell 44px, fonts 13/15/8
- 7×7: label 30px, cell 38px, fonts 12/13/7

## Known quirks
- File upload mix-ups: owner uploads manually via GitHub web UI — easy to paste wrong file
- Level injection always misses closing } at section boundary — always syntax check after
- Lottie's eyes disappear if CSS class toggling used — must use svgLarge(true) approach
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
