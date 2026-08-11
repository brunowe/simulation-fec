import { describe, expect, it } from "vitest";

import {
  applyUpdateInPlace,
  calculateDeltaEnergy,
  calculateLocalEnergy,
  calculateTotalEnergy,
  evaluateUpdate,
  metropolisAcceptanceProbability,
  shouldAcceptMove,
} from "./potts.js";

describe("equal-boundary-energy Moore Hamiltonian", () => {
  it("has zero energy for a uniform periodic lattice", () => {
    const lattice = new Uint32Array(16).fill(1);

    expect(calculateLocalEnergy(lattice, 4, 0)).toBe(0);
    expect(calculateTotalEnergy(lattice, 4)).toBe(0);
  });

  it("counts every unlike undirected Moore bond once", () => {
    const lattice = new Uint32Array(9).fill(1);
    lattice[4] = 2;

    expect(calculateLocalEnergy(lattice, 3, 4)).toBe(8);
    expect(calculateTotalEnergy(lattice, 3)).toBe(8);
  });

  it("includes neighbors reached across periodic boundaries", () => {
    const lattice = new Uint32Array(16).fill(1);
    lattice[15] = 2;

    expect(calculateLocalEnergy(lattice, 4, 0)).toBe(1);
  });

  it("calculates energy changes from only the eight incident bonds", () => {
    const uniform = new Uint32Array(9).fill(1);
    expect(calculateDeltaEnergy(uniform, 3, 4, 2)).toBe(8);

    const isolated = uniform.slice();
    isolated[4] = 2;
    expect(calculateDeltaEnergy(isolated, 3, 4, 1)).toBe(-8);
    expect(calculateDeltaEnergy(isolated, 3, 4, 2)).toBe(0);
  });

  it("matches a full-Hamiltonian recomputation", () => {
    const lattice = Uint32Array.from([
      1, 1, 2, 2,
      1, 1, 2, 2,
      3, 3, 2, 2,
      3, 3, 3, 2,
    ]);
    const cellIndex = 5;
    const candidateState = 3;
    const energyBefore = calculateTotalEnergy(lattice, 4);
    const deltaEnergy = calculateDeltaEnergy(
      lattice,
      4,
      cellIndex,
      candidateState,
    );
    const changed = lattice.slice();
    changed[cellIndex] = candidateState;

    expect(calculateTotalEnergy(changed, 4) - energyBefore).toBe(deltaEnergy);
  });
});

describe("Metropolis rule", () => {
  it("always accepts neutral and downhill changes", () => {
    expect(metropolisAcceptanceProbability(-2, 0)).toBe(1);
    expect(metropolisAcceptanceProbability(0, 0)).toBe(1);
    expect(shouldAcceptMove(-1, 0)).toBe(true);
    expect(shouldAcceptMove(0, 5)).toBe(true);
  });

  it("rejects every uphill change at zero effective temperature", () => {
    expect(metropolisAcceptanceProbability(1, 0)).toBe(0);
    expect(shouldAcceptMove(1, 0)).toBe(false);
  });

  it("uses exp(-deltaEnergy / effectiveTemperature) for uphill changes", () => {
    const probability = Math.exp(-2 / 0.5);

    expect(metropolisAcceptanceProbability(2, 0.5)).toBeCloseTo(probability);
    expect(shouldAcceptMove(2, 0.5, probability / 2)).toBe(true);
    expect(shouldAcceptMove(2, 0.5, probability)).toBe(false);
  });

  it("rejects invalid energy, temperature, and required random values", () => {
    expect(() => metropolisAcceptanceProbability(Number.NaN, 1)).toThrow();
    expect(() => metropolisAcceptanceProbability(1, -1)).toThrow();
    expect(() => metropolisAcceptanceProbability(1, Infinity)).toThrow();
    expect(() => shouldAcceptMove(1, 1)).toThrow();
    expect(() => shouldAcceptMove(1, 1, 1)).toThrow();
  });
});

describe("neighbor-state updates", () => {
  it("evaluates a downhill neighbor adoption without mutating input", () => {
    const lattice = new Uint32Array(9).fill(1);
    lattice[4] = 2;
    const before = lattice.slice();
    const update = evaluateUpdate(lattice, 3, 4, 1, 0);

    expect(update).toMatchObject({
      accepted: true,
      candidateState: 1,
      changed: true,
      deltaEnergy: -8,
      nextState: 1,
      previousState: 2,
    });
    expect(lattice).toEqual(before);

    applyUpdateInPlace(lattice, update);
    expect(lattice[4]).toBe(1);
  });

  it("leaves the lattice unchanged when an uphill adoption is rejected", () => {
    const lattice = new Uint32Array(9).fill(1);
    lattice[0] = 2;
    const update = evaluateUpdate(lattice, 3, 4, 0, 0);

    expect(update.deltaEnergy).toBeGreaterThan(0);
    expect(update).toMatchObject({ accepted: false, changed: false });
    applyUpdateInPlace(lattice, update);
    expect(lattice[4]).toBe(1);
  });

  it("records same-state proposals as accepted no-ops", () => {
    const lattice = new Uint32Array(9).fill(4);
    const update = evaluateUpdate(lattice, 3, 4, 0, 0);

    expect(update).toMatchObject({
      accepted: true,
      changed: false,
      deltaEnergy: 0,
      nextState: 4,
    });
  });
});
