import { describe, expect, it } from "vitest";

import {
  createVoronoiLattice,
  generateNuclei,
  getMooreNeighborIndex,
  initializeVoronoiLattice,
  periodicDistanceSquared,
  periodicIndex,
  wrapCoordinate,
} from "./lattice.js";
import { createSeededRandom } from "./prng.js";

describe("periodic square lattice", () => {
  it("wraps coordinates on every side", () => {
    expect(wrapCoordinate(-1, 5)).toBe(4);
    expect(wrapCoordinate(5, 5)).toBe(0);
    expect(wrapCoordinate(11, 5)).toBe(1);
    expect(periodicIndex(-1, -1, 4)).toBe(15);
    expect(periodicIndex(4, 4, 4)).toBe(0);
  });

  it("wraps Moore neighbors across corners", () => {
    expect(getMooreNeighborIndex(0, 4, 0)).toBe(15);
    expect(getMooreNeighborIndex(0, 4, 1)).toBe(12);
    expect(getMooreNeighborIndex(0, 4, 3)).toBe(3);
    expect(getMooreNeighborIndex(15, 4, 7)).toBe(0);
  });

  it("uses toroidal distance", () => {
    expect(periodicDistanceSquared(0, 0, 4, 0, 5)).toBe(1);
    expect(periodicDistanceSquared(0, 0, 4, 4, 5)).toBe(2);
    expect(periodicDistanceSquared(0, 0, 2, 2, 5)).toBe(8);
  });
});

describe("seeded Voronoi initialization", () => {
  it("samples unique nucleus cells without replacement", () => {
    const nuclei = generateNuclei(8, 32, createSeededRandom(99));

    expect(new Set(nuclei.map(({ index }) => index))).toHaveProperty(
      "size",
      32,
    );
    expect(nuclei.map(({ id }) => id)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    );
  });

  it("creates the exact requested number of active grains", () => {
    const { lattice, nuclei } = initializeVoronoiLattice(
      16,
      27,
      createSeededRandom(1234),
    );

    expect(lattice).toBeInstanceOf(Uint32Array);
    expect(lattice).toHaveLength(16 * 16);
    expect(new Set(lattice).size).toBe(27);
    expect(new Set(lattice)).toEqual(
      new Set(Array.from({ length: 27 }, (_, index) => index + 1)),
    );
    expect(
      nuclei.every((nucleus) => lattice[nucleus.index] === nucleus.id),
    ).toBe(true);
  });

  it("is deterministic for a fixed seed", () => {
    const first = initializeVoronoiLattice(
      12,
      18,
      createSeededRandom(321),
    );
    const second = initializeVoronoiLattice(
      12,
      18,
      createSeededRandom(321),
    );

    expect(first.nuclei).toEqual(second.nuclei);
    expect(first.lattice).toEqual(second.lattice);
  });

  it("changes the nuclei and lattice for a different seed", () => {
    const first = initializeVoronoiLattice(
      12,
      18,
      createSeededRandom(321),
    );
    const second = initializeVoronoiLattice(
      12,
      18,
      createSeededRandom(322),
    );

    expect(first.nuclei).not.toEqual(second.nuclei);
    expect(first.lattice).not.toEqual(second.lattice);
  });

  it("assigns cells by periodic nearest-nucleus distance", () => {
    const lattice = createVoronoiLattice(5, [
      { id: 1, x: 0, y: 2 },
      { id: 2, x: 2, y: 2 },
    ]);

    expect(lattice[2 * 5 + 4]).toBe(1);
    expect(lattice[2 * 5 + 2]).toBe(2);
  });

  it("breaks equal-distance ties by lower grain id", () => {
    const lattice = createVoronoiLattice(5, [
      { id: 9, x: 1, y: 2 },
      { id: 3, x: 3, y: 2 },
    ]);

    expect(lattice[2 * 5 + 2]).toBe(3);
  });

  it("supports one nucleus per cell while retaining every id", () => {
    const { lattice } = initializeVoronoiLattice(
      4,
      16,
      createSeededRandom(7),
    );

    expect(new Set(lattice).size).toBe(16);
  });

  it("rejects impossible and duplicate nucleus specifications", () => {
    expect(() => generateNuclei(4, 17, createSeededRandom(1))).toThrow();
    expect(() => generateNuclei(4, 2, null)).toThrow();
    expect(() =>
      createVoronoiLattice(4, [
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 0, y: 0 },
      ]),
    ).toThrow(/unique/i);
  });
});
