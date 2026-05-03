// All level definitions
// solution: 1 = selected (correct answer), 0 = not
// rowTargets and colTargets are computed automatically
// Level data lives in js/levels/*.js, loaded before this script.

const SECTIONS_WITH_LEVELS = [
  SECTION_WARMUP,
  SECTION_CLASSIC,
  SECTION_CHALLENGE,
  SECTION_EXPERT,
  SECTION_SKILLISSUE,
  SECTION_WTF
];

const LEVELS_RAW = SECTIONS_WITH_LEVELS.flatMap(s => s.levels);

const SECTIONS = SECTIONS_WITH_LEVELS.map(({ label, range, sizeLabel }) => ({ label, range, sizeLabel }));

const SECTION_STARTS = SECTIONS.map(s => s.range[0]);

// Points awarded per level size
const POINTS_PER_SIZE = { 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, wtf: 100 };
const POINTS_PER_LIFE = 5;
const REVIVE_COSTS    = { 3: 8,  4: 15, 5: 25, 6: 40, 7: 60, wtf: 50 };

function buildLevel(raw, index) {
  const size = raw.grid.length;
  const isWTF = index >= 795;
  const rowTargets = raw.grid.map((row, r) =>
    row.reduce((s, v, c) => s + (raw.solution[r][c] ? v : 0), 0)
  );
  const colTargets = Array.from({ length: size }, (_, c) =>
    raw.grid.reduce((s, row, r) => s + (raw.solution[r][c] ? row[c] : 0), 0)
  );
  return { grid: raw.grid, rowTargets, colTargets, size, isWTF };
}

const LEVELS = LEVELS_RAW.map((raw, i) => buildLevel(raw, i));
