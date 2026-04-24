# NumSum — project brief for Claude

## Overview
A cosy mobile-first browser puzzle game built in plain HTML/CSS/JS, no framework.
Players circle numbers in a grid so each row and column adds up to the target sum shown on the edges.

## Links
- Repo:       https://github.com/dawnmakesgames/NumSum
- Live game:  https://dawnmakesgames.github.io/NumSum
- Dev branch: https://github.com/dawnmakesgames/NumSum/tree/dev
- v0.1 release: https://github.com/dawnmakesgames/NumSum/releases/tag/v0.1

## Current version: 0.2 (on dev branch, not yet merged to main)
- main branch = v0.1, single index.html, 9 levels (behind dev)
- dev branch  = v0.2, multi-file structure, 30 levels
- Next step: merge dev → main when v0.2 is confirmed stable

## File structure (v0.2, on dev branch)
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
    ├── map.js          — level map screen rendering
    ├── player.js       — profile/inventory screen rendering
    ├── shop.js         — shop screen, item definitions, Numby SVG
    └── app.js          — screen routing, app initialisation
```

Note: files must be served from a web server (GitHub Pages).
Opening index.html directly as a local file will break script loading.

## Gameplay
- Tap cells to select/deselect numbers
- Selected numbers in each row/column must add up exactly to the target
- Row/column labels turn green when exact, red when over
- Completed rows/columns dim unselected cells to help focus
- Running totals shown as small numbers in label corners

## Game modes
- Lives mode: 3 lives, lose one when a row/col goes over the target
- Free mode:  no lives, relaxed play, earns half points

## Levels
- 30 total, split into 3 sections:
  - Warm-up   (levels  1–9):  3×3 grid
  - Classic   (levels 10–24): 4×4 grid
  - Challenge (levels 25–30): 5×5 grid
- Level 1 of each section is always unlocked (free entry point per category)
- Within each section, levels unlock sequentially on completion
- Solved levels can always be replayed
- All levels are hand-crafted with unique grids AND unique solutions
- A duplicate checker script exists — ask Claude to run it when adding levels

## Points system
- Earned on level completion:
  - 3×3: 10 pts base + 5 per life remaining (free mode: 5 pts flat)
  - 4×4: 20 pts base + 5 per life remaining (free mode: 10 pts flat)
  - 5×5: 35 pts base + 5 per life remaining (free mode: 17 pts flat)
- Revive costs (spend points instead of restarting):
  - 3×3:  8 pts
  - 4×4: 15 pts
  - 5×5: 25 pts

## Star ratings
- 3 stars: finish with all 3 lives
- 2 stars: finish with 2 lives
- 1 star:  finish with 1 life or via revive, or free mode
- Shown on level map dots after solving

## Shop & inventory
- Points spent on cosmetics, all optional, game always finishable without spending
- Items saved in localStorage
- Current shop items:
  - Themes (all free):
    - Classic       (theme-default)    — warm off-white, green/red feedback
    - Dark          (theme-dark)       — dark brown tones, adapted colours
    - Accessible    (theme-colorblind) — blue/orange instead of green/red
  - Companions (80 pts):
    - Numby (companion-numby) — a round ghost-like SVG critter
      - Idle: gentle float animation (CSS, translateY, 3s loop)
      - Row/col complete: quick bounce (companion-row-done class)
      - Puzzle solved: full wiggle celebration (companion-celebrate class)
      - Drawn entirely in code in shop.js — no image file needed

## Persistence
- All progress saved in localStorage under key 'numsum_v02'
- Saves: solved levels + star ratings, points total, owned items,
         active theme, active companion
- Per-device only, no account sync

## Dev tools
- "Clear all progress" button at bottom of level map
- TO BE REMOVED before v1.0 / app store submission

## Planned features (not yet built)
- Level generator script (for scaling to 100s of levels)
- PWA support (installable from browser, works offline)
- Daily puzzle (fixed level per calendar date, bonus points)
- More companions in the shop
- Ad integration hooks (optional rewarded ads for extra lives)
- Remove dev tools before public release
- Merge dev → main (next immediate step)

## Tech notes
- No framework, no build step, no npm — plain HTML/CSS/JS only
- localStorage is the only persistence layer
- Themes are CSS variable swaps via body classes (theme-dark, theme-colorblind)
- Grid layout is fully dynamic — works for 3×3, 4×4, 5×5, extendable to any NxN
- Level targets are computed from solution arrays, never hardcoded
  (puzzles are always valid by construction)
- Future app store path: wrap with Capacitor (no code rewrite needed)

## How to deploy
- Edit files on dev branch
- GitHub Pages serves from whichever branch is set in Settings → Pages
- Switch Pages to dev for testing, back to main to publish
- Merge dev → main via Pull Request when ready to release
