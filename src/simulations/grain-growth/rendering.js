import { MOORE_NEIGHBOR_OFFSETS } from "./engine/index.js";

export function isBoundaryCell(lattice, index, size) {
  const x = index % size;
  const y = Math.floor(index / size);
  const state = lattice[index];

  return MOORE_NEIGHBOR_OFFSETS.some(([dx, dy]) => {
    const neighborX = (x + dx + size) % size;
    const neighborY = (y + dy + size) % size;
    return lattice[neighborY * size + neighborX] !== state;
  });
}
