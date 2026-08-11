import { assertSquareLattice } from "./lattice.js";
import { calculateTotalEnergy } from "./potts.js";

export function calculateGrainAreas(lattice, size) {
  assertSquareLattice(lattice, size);
  const areas = new Map();

  for (const grainId of lattice) {
    areas.set(grainId, (areas.get(grainId) ?? 0) + 1);
  }

  return areas;
}

export function calculateUnlikeBondFraction(lattice, size) {
  assertSquareLattice(lattice, size);

  // Four forward Moore bonds per cell count every undirected bond once.
  return calculateTotalEnergy(lattice, size) / (4 * lattice.length);
}

export function calculateMeanEquivalentDiameter(lattice, size) {
  const areas = calculateGrainAreas(lattice, size);
  let diameterSum = 0;

  for (const area of areas.values()) {
    diameterSum += 2 * Math.sqrt(area / Math.PI);
  }

  return diameterSum / areas.size;
}

export function calculateMetrics(lattice, size) {
  const areas = calculateGrainAreas(lattice, size);
  const activeGrains = areas.size;
  let diameterSum = 0;

  for (const area of areas.values()) {
    diameterSum += 2 * Math.sqrt(area / Math.PI);
  }

  return Object.freeze({
    activeGrains,
    meanEquivalentDiameter: diameterSum / activeGrains,
    meanGrainArea: lattice.length / activeGrains,
    unlikeBondFraction: calculateTotalEnergy(lattice, size) / (4 * lattice.length),
  });
}
