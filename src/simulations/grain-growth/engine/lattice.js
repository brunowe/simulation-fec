export const MOORE_NEIGHBOR_OFFSETS = Object.freeze(
  [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ].map(Object.freeze),
);

export const UNIQUE_MOORE_BOND_OFFSETS = Object.freeze(
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
  ].map(Object.freeze),
);

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be an integer.`);
  }

  if (value < 1) {
    throw new RangeError(`${name} must be greater than zero.`);
  }
}

function assertCellIndex(index, size) {
  if (!Number.isInteger(index)) {
    throw new TypeError("Cell index must be an integer.");
  }

  if (index < 0 || index >= size * size) {
    throw new RangeError("Cell index is outside the lattice.");
  }
}

export function assertSquareLattice(lattice, size) {
  assertPositiveInteger(size, "size");

  const isIndexedCollection =
    Array.isArray(lattice) ||
    (ArrayBuffer.isView(lattice) && !(lattice instanceof DataView));

  if (!isIndexedCollection) {
    throw new TypeError("Lattice must be an array or typed array.");
  }

  if (lattice.length !== size * size) {
    throw new RangeError("Lattice length must equal size squared.");
  }
}

export function wrapCoordinate(coordinate, size) {
  assertPositiveInteger(size, "size");

  if (!Number.isInteger(coordinate)) {
    throw new TypeError("Coordinate must be an integer.");
  }

  return ((coordinate % size) + size) % size;
}

export function periodicIndex(x, y, size) {
  return wrapCoordinate(y, size) * size + wrapCoordinate(x, size);
}

export function getMooreNeighborIndex(index, size, neighborOffsetIndex) {
  assertPositiveInteger(size, "size");
  assertCellIndex(index, size);

  if (
    !Number.isInteger(neighborOffsetIndex) ||
    neighborOffsetIndex < 0 ||
    neighborOffsetIndex >= MOORE_NEIGHBOR_OFFSETS.length
  ) {
    throw new RangeError("Moore-neighbor offset index must be from 0 to 7.");
  }

  const x = index % size;
  const y = Math.floor(index / size);
  const [dx, dy] = MOORE_NEIGHBOR_OFFSETS[neighborOffsetIndex];

  return periodicIndex(x + dx, y + dy, size);
}

export function periodicDistanceSquared(x1, y1, x2, y2, size) {
  for (const [name, value] of Object.entries({ x1, y1, x2, y2 })) {
    if (!Number.isInteger(value)) {
      throw new TypeError(`${name} must be an integer.`);
    }
  }

  assertPositiveInteger(size, "size");

  const directX = Math.abs(wrapCoordinate(x1, size) - wrapCoordinate(x2, size));
  const directY = Math.abs(wrapCoordinate(y1, size) - wrapCoordinate(y2, size));
  const dx = Math.min(directX, size - directX);
  const dy = Math.min(directY, size - directY);

  return dx * dx + dy * dy;
}

function assertNuclei(nuclei, size) {
  if (!Array.isArray(nuclei) || nuclei.length === 0) {
    throw new TypeError("nuclei must be a non-empty array.");
  }

  const ids = new Set();
  const positions = new Set();

  for (const nucleus of nuclei) {
    if (nucleus === null || typeof nucleus !== "object") {
      throw new TypeError("Each nucleus must be an object.");
    }

    if (!Number.isInteger(nucleus.id) || nucleus.id < 1) {
      throw new RangeError("Each nucleus id must be a positive integer.");
    }

    if (
      !Number.isInteger(nucleus.x) ||
      !Number.isInteger(nucleus.y) ||
      nucleus.x < 0 ||
      nucleus.x >= size ||
      nucleus.y < 0 ||
      nucleus.y >= size
    ) {
      throw new RangeError("Nucleus coordinates must be inside the lattice.");
    }

    const position = nucleus.y * size + nucleus.x;
    if (ids.has(nucleus.id) || positions.has(position)) {
      throw new RangeError("Nucleus ids and positions must be unique.");
    }

    ids.add(nucleus.id);
    positions.add(position);
  }
}

export function generateNuclei(size, grainCount, random) {
  assertPositiveInteger(size, "size");
  assertPositiveInteger(grainCount, "grainCount");

  const cellCount = size * size;
  if (grainCount > cellCount) {
    throw new RangeError("grainCount cannot exceed the number of cells.");
  }

  if (random === null || typeof random?.nextInt !== "function") {
    throw new TypeError("random must expose a nextInt(maxExclusive) method.");
  }

  const availablePositions = new Uint32Array(cellCount);
  for (let index = 0; index < cellCount; index += 1) {
    availablePositions[index] = index;
  }

  const nuclei = [];
  for (let index = 0; index < grainCount; index += 1) {
    const selected = index + random.nextInt(cellCount - index);
    const position = availablePositions[selected];
    availablePositions[selected] = availablePositions[index];
    availablePositions[index] = position;

    nuclei.push(
      Object.freeze({
        id: index + 1,
        index: position,
        x: position % size,
        y: Math.floor(position / size),
      }),
    );
  }

  return Object.freeze(nuclei);
}

export function createVoronoiLattice(size, nuclei) {
  assertPositiveInteger(size, "size");
  assertNuclei(nuclei, size);

  const lattice = new Uint32Array(size * size);

  for (let index = 0; index < lattice.length; index += 1) {
    const x = index % size;
    const y = Math.floor(index / size);
    let closestDistance = Number.POSITIVE_INFINITY;
    let closestId = Number.POSITIVE_INFINITY;

    for (const nucleus of nuclei) {
      const directX = Math.abs(x - nucleus.x);
      const directY = Math.abs(y - nucleus.y);
      const dx = Math.min(directX, size - directX);
      const dy = Math.min(directY, size - directY);
      const distance = dx * dx + dy * dy;

      if (
        distance < closestDistance ||
        (distance === closestDistance && nucleus.id < closestId)
      ) {
        closestDistance = distance;
        closestId = nucleus.id;
      }
    }

    lattice[index] = closestId;
  }

  return lattice;
}

export function initializeVoronoiLattice(size, grainCount, random) {
  const nuclei = generateNuclei(size, grainCount, random);
  const lattice = createVoronoiLattice(size, nuclei);

  return Object.freeze({ lattice, nuclei });
}
