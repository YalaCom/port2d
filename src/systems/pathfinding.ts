export type Grid = number[][];

interface Node { x: number; y: number; g: number; h: number; f: number; }

const DIRS8 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const parentStore = new Map<string, { x: number; y: number }>();
const key = (x: number, y: number) => x + "," + y;

function heur(ax: number, ay: number, bx: number, by: number) {
  const dx = Math.abs(ax - bx);
  const dy = Math.abs(ay - by);
  return Math.max(dx, dy) + Math.min(dx, dy) * 0.41;
}

export function nearestWalkable(grid: Grid, x: number, y: number): { x: number; y: number } | null {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  if (y >= 0 && y < h && x >= 0 && x < w && grid[y][x] === 0) return { x, y };
  for (let r = 1; r <= 6; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const nx = x + dx, ny = y + dy;
        if (ny >= 0 && ny < h && nx >= 0 && nx < w && grid[ny][nx] === 0) return { x: nx, y: ny };
      }
    }
  }
  return null;
}

export function findPath(grid: Grid, sx: number, sy: number, tx: number, ty: number): { x: number; y: number }[] {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  if (sx < 0 || sy < 0 || tx < 0 || ty < 0 || sx >= w || tx >= w || sy >= h || ty >= h) return [];
  if (grid[sy][sx] > 0) return [];
  let endX = tx, endY = ty;
  if (grid[ty][tx] > 0) {
    const near = nearestWalkable(grid, tx, ty);
    if (!near) return [];
    endX = near.x; endY = near.y;
  }
  if (sx === endX && sy === endY) return [{ x: sx, y: sy }];
  parentStore.clear();
  const open: Node[] = [];
  const openMap = new Map<string, Node>();
  const closed = new Set<string>();
  const start: Node = { x: sx, y: sy, g: 0, h: heur(sx, sy, endX, endY), f: 0 };
  start.f = start.g + start.h;
  open.push(start);
  openMap.set(key(sx, sy), start);
  while (open.length) {
    let best = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[best].f) best = i;
    const cur = open.splice(best, 1)[0];
    openMap.delete(key(cur.x, cur.y));
    closed.add(key(cur.x, cur.y));
    if (cur.x === endX && cur.y === endY) {
      const path: { x: number; y: number }[] = [{ x: cur.x, y: cur.y }];
      let cx = cur.x, cy = cur.y;
      while (!(cx === sx && cy === sy)) {
        const p = parentStore.get(key(cx, cy));
        if (!p) break;
        cx = p.x; cy = p.y;
        path.push({ x: cx, y: cy });
      }
      path.reverse();
      return path;
    }
    for (const [dx, dy] of DIRS8) {
      const nx = cur.x + dx, ny = cur.y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (grid[ny][nx] > 0) continue;
      if (dx !== 0 && dy !== 0 && (grid[cur.y][nx] > 0 || grid[ny][cur.x] > 0)) continue;
      const k = key(nx, ny);
      if (closed.has(k)) continue;
      const g = cur.g + (dx !== 0 && dy !== 0 ? 1.41 : 1);
      const exist = openMap.get(k);
      if (!exist || g < exist.g) {
        const node: Node = { x: nx, y: ny, g, h: heur(nx, ny, endX, endY), f: 0 };
        node.f = node.g + node.h;
        parentStore.set(k, { x: cur.x, y: cur.y });
        if (!exist) { open.push(node); openMap.set(k, node); }
        else { exist.g = g; exist.f = node.f; }
      }
    }
  }
  return [];
}

export function clearPathCache() { parentStore.clear(); }
