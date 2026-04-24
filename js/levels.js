// All level definitions
// solution: 1 = selected (correct answer), 0 = not
// rowTargets and colTargets are computed automatically

const LEVELS_RAW = [

  // ── 3×3 warm-up ────────────────────────────────
  {
    grid: [[3,7,2],[5,1,8],[4,6,9]],
    solution: [[1,0,0],[0,1,0],[0,0,1]]
  },
  {
    grid: [[4,2,7],[1,8,3],[6,5,2]],
    solution: [[1,0,1],[0,1,0],[1,0,0]]
  },
  {
    grid: [[5,3,8],[2,7,4],[9,1,6]],
    solution: [[1,1,0],[0,1,1],[1,0,1]]
  },

  // ── 4×4 classic ────────────────────────────────
  {
    grid: [[5,1,3,2],[4,4,1,8],[4,6,1,3],[5,7,7,1]],
    solution: [[0,1,0,1],[1,0,1,0],[0,1,0,1],[1,0,0,1]]
  },
  {
    grid: [[3,8,2,6],[5,1,9,4],[7,3,5,2],[2,6,1,8]],
    solution: [[1,0,1,0],[0,1,0,1],[1,1,0,0],[0,0,1,1]]
  },
  {
    grid: [[4,2,7,1],[6,5,3,8],[1,9,2,4],[3,1,8,5]],
    solution: [[1,1,0,1],[0,1,1,1],[1,0,1,0],[1,1,1,0]]
  },

  // ── 5×5 challenge ──────────────────────────────
  {
    grid: [[3,7,2,8,4],[6,1,9,3,5],[2,5,4,7,1],[8,3,6,1,9],[4,9,1,5,2]],
    solution: [[1,0,0,1,0],[0,1,0,0,1],[0,0,1,1,0],[1,0,1,0,0],[0,1,0,0,1]]
  },
  {
    grid: [[5,2,8,1,6],[3,7,4,9,2],[1,6,3,5,8],[9,4,7,2,3],[2,8,1,6,4]],
    solution: [[1,0,1,0,0],[0,1,0,1,0],[1,0,0,1,1],[0,1,1,0,1],[1,1,0,0,0]]
  },
  {
    grid: [[7,3,9,2,5],[4,8,1,6,3],[2,5,7,4,9],[6,1,3,8,2],[9,4,5,1,7]],
    solution: [[1,0,1,0,1],[0,1,0,1,0],[1,1,0,0,1],[0,0,1,1,0],[1,0,1,0,0]]
  }
];

// Section definitions
const SECTIONS = [
  { label: 'Warm-up — 3×3',   range: [0, 3], sizeLabel: '3×3' },
  { label: 'Classic — 4×4',   range: [3, 6], sizeLabel: '4×4' },
  { label: 'Challenge — 5×5', range: [6, 9], sizeLabel: '5×5' }
];

// First level of each section — always unlocked
const SECTION_STARTS = SECTIONS.map(s => s.range[0]);

// Points awarded per level size
const POINTS_PER_SIZE = { 3: 10, 4: 20, 5: 35 };
const POINTS_PER_LIFE = 5;
const REVIVE_COSTS    = { 3: 8,  4: 15, 5: 25 };

function buildLevel(raw) {
  const size = raw.grid.length;
  const rowTargets = raw.grid.map((row, r) =>
    row.reduce((s, v, c) => s + (raw.solution[r][c] ? v : 0), 0)
  );
  const colTargets = Array.from({ length: size }, (_, c) =>
    raw.grid.reduce((s, row, r) => s + (raw.solution[r][c] ? row[c] : 0), 0)
  );
  return { grid: raw.grid, rowTargets, colTargets, size };
}

const LEVELS = LEVELS_RAW.map(buildLevel);
