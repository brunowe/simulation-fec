import { describe, expect, it } from "vitest";

import {
  calculateGrainAreas,
  calculateMeanEquivalentDiameter,
  calculateMetrics,
  calculateUnlikeBondFraction,
} from "./metrics.js";

describe("grain-growth metrics", () => {
  it("reports uniform-lattice metrics in lattice units", () => {
    const lattice = new Uint32Array(16).fill(7);
    const metrics = calculateMetrics(lattice, 4);

    expect(metrics).toEqual({
      activeGrains: 1,
      meanEquivalentDiameter: 2 * Math.sqrt(16 / Math.PI),
      meanGrainArea: 16,
      unlikeBondFraction: 0,
    });
  });

  it("counts distinct active labels and their areas", () => {
    const lattice = Uint32Array.from([
      1, 1, 1,
      1, 2, 1,
      1, 1, 1,
    ]);

    expect(calculateGrainAreas(lattice, 3)).toEqual(
      new Map([
        [1, 8],
        [2, 1],
      ]),
    );
    expect(calculateMetrics(lattice, 3).activeGrains).toBe(2);
    expect(calculateMetrics(lattice, 3).meanGrainArea).toBe(4.5);
  });

  it("normalizes unique unlike Moore bonds without double counting", () => {
    const lattice = Uint32Array.from([
      1, 1, 1,
      1, 2, 1,
      1, 1, 1,
    ]);

    expect(calculateUnlikeBondFraction(lattice, 3)).toBe(8 / (4 * 9));
    expect(calculateMetrics(lattice, 3).unlikeBondFraction).toBe(2 / 9);
  });

  it("uses the arithmetic mean of per-grain equivalent-circle diameters", () => {
    const lattice = Uint32Array.from([
      1, 1, 1,
      1, 2, 1,
      1, 1, 1,
    ]);
    const expected =
      (2 * Math.sqrt(8 / Math.PI) + 2 * Math.sqrt(1 / Math.PI)) / 2;

    expect(calculateMeanEquivalentDiameter(lattice, 3)).toBeCloseTo(expected);
    expect(calculateMetrics(lattice, 3).meanEquivalentDiameter).toBeCloseTo(
      expected,
    );
    expect(expected).not.toBeCloseTo(2 * Math.sqrt(4.5 / Math.PI));
  });

  it("rejects a lattice whose dimensions do not match", () => {
    expect(() => calculateMetrics(new Uint32Array(8), 3)).toThrow(
      /size squared/i,
    );
  });
});
