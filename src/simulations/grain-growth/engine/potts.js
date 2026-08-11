import {
  MOORE_NEIGHBOR_OFFSETS,
  UNIQUE_MOORE_BOND_OFFSETS,
  assertSquareLattice,
} from "./lattice.js";

function assertCellIndex(index, lattice) {
  if (!Number.isInteger(index)) {
    throw new TypeError("Cell index must be an integer.");
  }

  if (index < 0 || index >= lattice.length) {
    throw new RangeError("Cell index is outside the lattice.");
  }
}

function assertEffectiveTemperature(effectiveTemperature) {
  if (!Number.isFinite(effectiveTemperature)) {
    throw new TypeError("Effective temperature must be a finite number.");
  }

  if (effectiveTemperature < 0) {
    throw new RangeError("Effective temperature cannot be negative.");
  }
}

function neighborIndex(x, y, dx, dy, size) {
  let neighborX = x + dx;
  let neighborY = y + dy;

  if (neighborX < 0) neighborX += size;
  if (neighborX >= size) neighborX -= size;
  if (neighborY < 0) neighborY += size;
  if (neighborY >= size) neighborY -= size;

  return neighborY * size + neighborX;
}

export function calculateLocalEnergy(lattice, size, cellIndex, state) {
  assertSquareLattice(lattice, size);
  assertCellIndex(cellIndex, lattice);

  const candidateState = state ?? lattice[cellIndex];
  const x = cellIndex % size;
  const y = Math.floor(cellIndex / size);
  let energy = 0;

  for (const [dx, dy] of MOORE_NEIGHBOR_OFFSETS) {
    const adjacentIndex = neighborIndex(x, y, dx, dy, size);
    if (lattice[adjacentIndex] !== candidateState) energy += 1;
  }

  return energy;
}

export function calculateTotalEnergy(lattice, size) {
  assertSquareLattice(lattice, size);
  let energy = 0;

  for (let cellIndex = 0; cellIndex < lattice.length; cellIndex += 1) {
    const x = cellIndex % size;
    const y = Math.floor(cellIndex / size);

    for (const [dx, dy] of UNIQUE_MOORE_BOND_OFFSETS) {
      const adjacentIndex = neighborIndex(x, y, dx, dy, size);
      if (lattice[adjacentIndex] !== lattice[cellIndex]) energy += 1;
    }
  }

  return energy;
}

export function calculateDeltaEnergy(
  lattice,
  size,
  cellIndex,
  candidateState,
) {
  assertSquareLattice(lattice, size);
  assertCellIndex(cellIndex, lattice);

  const currentState = lattice[cellIndex];
  if (candidateState === currentState) return 0;

  const x = cellIndex % size;
  const y = Math.floor(cellIndex / size);
  let currentEnergy = 0;
  let candidateEnergy = 0;

  for (const [dx, dy] of MOORE_NEIGHBOR_OFFSETS) {
    const adjacentState = lattice[neighborIndex(x, y, dx, dy, size)];
    if (adjacentState !== currentState) currentEnergy += 1;
    if (adjacentState !== candidateState) candidateEnergy += 1;
  }

  return candidateEnergy - currentEnergy;
}

export function metropolisAcceptanceProbability(
  deltaEnergy,
  effectiveTemperature,
) {
  if (!Number.isFinite(deltaEnergy)) {
    throw new TypeError("Delta energy must be a finite number.");
  }

  assertEffectiveTemperature(effectiveTemperature);

  if (deltaEnergy <= 0) return 1;
  if (effectiveTemperature === 0) return 0;

  return Math.exp(-deltaEnergy / effectiveTemperature);
}

export function shouldAcceptMove(
  deltaEnergy,
  effectiveTemperature,
  randomValue,
) {
  const probability = metropolisAcceptanceProbability(
    deltaEnergy,
    effectiveTemperature,
  );

  if (probability === 1) return true;
  if (probability === 0) return false;

  if (
    !Number.isFinite(randomValue) ||
    randomValue < 0 ||
    randomValue >= 1
  ) {
    throw new RangeError("randomValue must be in the interval [0, 1). ");
  }

  return randomValue < probability;
}

export function evaluateUpdate(
  lattice,
  size,
  cellIndex,
  sourceIndex,
  effectiveTemperature,
  randomValue,
) {
  assertSquareLattice(lattice, size);
  assertCellIndex(cellIndex, lattice);
  assertCellIndex(sourceIndex, lattice);

  const previousState = lattice[cellIndex];
  const candidateState = lattice[sourceIndex];
  const deltaEnergy = calculateDeltaEnergy(
    lattice,
    size,
    cellIndex,
    candidateState,
  );
  const accepted = shouldAcceptMove(
    deltaEnergy,
    effectiveTemperature,
    randomValue,
  );

  return Object.freeze({
    accepted,
    candidateState,
    cellIndex,
    changed: accepted && candidateState !== previousState,
    deltaEnergy,
    nextState: accepted ? candidateState : previousState,
    previousState,
    sourceIndex,
  });
}

export function applyUpdateInPlace(lattice, update) {
  if (update === null || typeof update !== "object") {
    throw new TypeError("update must be an evaluated update object.");
  }

  assertCellIndex(update.cellIndex, lattice);

  if (update.changed) {
    lattice[update.cellIndex] = update.nextState;
  }

  return lattice;
}
