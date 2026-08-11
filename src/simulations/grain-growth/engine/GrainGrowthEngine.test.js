import { describe, expect, it } from "vitest";

import {
  GrainGrowthEngine,
  createGrainGrowthEngine,
  getMooreNeighborIndex,
} from "./index.js";

const TEST_CONFIG = Object.freeze({
  effectiveTemperature: 0.2,
  initialGrains: 12,
  seed: 12345,
  size: 12,
});

describe("GrainGrowthEngine", () => {
  it("initializes with the exact active grain count", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const snapshot = engine.snapshot();

    expect(engine).toBeInstanceOf(GrainGrowthEngine);
    expect(snapshot.lattice).toHaveLength(TEST_CONFIG.size ** 2);
    expect(snapshot.metrics.activeGrains).toBe(TEST_CONFIG.initialGrains);
    expect(snapshot.nuclei).toHaveLength(TEST_CONFIG.initialGrains);
    expect(
      snapshot.nuclei.every(
        (nucleus) => snapshot.lattice[nucleus.index] === nucleus.id,
      ),
    ).toBe(true);
    expect(snapshot.counters).toEqual({
      acceptedAttempts: 0,
      attempts: 0,
      changedCells: 0,
      rejectedAttempts: 0,
      sweeps: 0,
    });
  });

  it("is fully deterministic for the same seed and operations", () => {
    const first = createGrainGrowthEngine(TEST_CONFIG);
    const second = createGrainGrowthEngine(TEST_CONFIG);

    first.runSweeps(5);
    second.runSweeps(5);

    expect(first.snapshot()).toEqual(second.snapshot());
  });

  it("starts and evolves differently with another seed", () => {
    const first = createGrainGrowthEngine(TEST_CONFIG);
    const second = createGrainGrowthEngine({ ...TEST_CONFIG, seed: 12346 });

    expect(first.snapshot().lattice).not.toEqual(second.snapshot().lattice);
    first.sweep();
    second.sweep();
    expect(first.snapshot().lattice).not.toEqual(second.snapshot().lattice);
  });

  it("selects a random cell and one of its eight periodic neighbors", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const before = engine.snapshot().lattice;
    const update = engine.attempt();
    const validSourceIndices = Array.from({ length: 8 }, (_, offset) =>
      getMooreNeighborIndex(update.cellIndex, TEST_CONFIG.size, offset),
    );

    expect(validSourceIndices).toContain(update.sourceIndex);
    expect(update.candidateState).toBe(before[update.sourceIndex]);
    expect(engine.lattice[update.cellIndex]).toBe(update.nextState);
    expect(engine.counters.attempts).toBe(1);
  });

  it("defines one sweep as exactly one attempt per lattice cell", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const first = engine.sweep();

    expect(first.attempts).toBe(TEST_CONFIG.size ** 2);
    expect(first.counters.attempts).toBe(TEST_CONFIG.size ** 2);
    expect(first.counters.sweeps).toBe(1);

    const second = engine.step();
    expect(second.attempts).toBe(TEST_CONFIG.size ** 2);
    expect(second.counters.attempts).toBe(2 * TEST_CONFIG.size ** 2);
    expect(second.counters.sweeps).toBe(2);
  });

  it("tracks attempts, acceptance, rejection, and actual changes separately", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    engine.runAttempts(75);
    const counters = engine.counters;

    expect(counters.attempts).toBe(75);
    expect(counters.acceptedAttempts + counters.rejectedAttempts).toBe(75);
    expect(counters.changedCells).toBeLessThanOrEqual(
      counters.acceptedAttempts,
    );
    expect(counters.sweeps).toBe(0);
  });

  it("runs an exact requested number of sweeps", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const summaries = engine.runSweeps(3);

    expect(summaries).toHaveLength(3);
    expect(engine.counters.sweeps).toBe(3);
    expect(engine.counters.attempts).toBe(3 * TEST_CONFIG.size ** 2);
  });

  it("reports metrics for its current state", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const initial = engine.metrics();
    engine.sweep();
    const evolved = engine.metrics();

    expect(initial.activeGrains).toBe(TEST_CONFIG.initialGrains);
    expect(evolved.activeGrains).toBeLessThanOrEqual(initial.activeGrains);
    expect(evolved.meanGrainArea).toBe(
      TEST_CONFIG.size ** 2 / evolved.activeGrains,
    );
    expect(evolved.unlikeBondFraction).toBeGreaterThanOrEqual(0);
    expect(evolved.unlikeBondFraction).toBeLessThanOrEqual(1);
  });

  it("returns an isolated lattice copy in snapshots", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const snapshot = engine.snapshot();
    const original = engine.lattice[0];

    snapshot.lattice[0] = original + 1000;
    expect(engine.lattice[0]).toBe(original);
  });

  it("reset reproduces the seeded initial state and clears counters", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const initial = engine.snapshot();
    engine.runSweeps(2);
    const reset = engine.reset();

    expect(reset.lattice).toEqual(initial.lattice);
    expect(reset.nuclei).toEqual(initial.nuclei);
    expect(reset.randomState).toBe(initial.randomState);
    expect(reset.counters).toEqual(initial.counters);
  });

  it("can reset with validated partial configuration overrides", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    const reset = engine.reset({ initialGrains: 8, seed: 999 });

    expect(reset.config).toMatchObject({
      ...TEST_CONFIG,
      initialGrains: 8,
      seed: 999,
    });
    expect(reset.metrics.activeGrains).toBe(8);
  });

  it("can change dimensionless effective temperature without resetting", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);
    engine.runAttempts(10);
    const counters = engine.counters;

    expect(engine.setEffectiveTemperature(0)).toBe(0);
    expect(engine.config.effectiveTemperature).toBe(0);
    expect(engine.counters).toEqual(counters);
    expect(() => engine.setEffectiveTemperature(-1)).toThrow();
  });

  it("rejects invalid operation counts and reset parameters", () => {
    const engine = createGrainGrowthEngine(TEST_CONFIG);

    expect(() => engine.runAttempts(-1)).toThrow();
    expect(() => engine.runAttempts(1.5)).toThrow();
    expect(() => engine.runSweeps(-1)).toThrow();
    expect(() => engine.reset(null)).toThrow();
    expect(() => engine.reset({ initialGrains: 0 })).toThrow();
  });

  it("rejects unsafe constructor parameters", () => {
    expect(() =>
      createGrainGrowthEngine({ ...TEST_CONFIG, size: 300 }),
    ).toThrow();
    expect(() =>
      createGrainGrowthEngine({ ...TEST_CONFIG, seed: 1.2 }),
    ).toThrow();
    expect(() =>
      createGrainGrowthEngine({
        ...TEST_CONFIG,
        effectiveTemperature: Number.NaN,
      }),
    ).toThrow();
  });
});
