import { validateConfig } from "./config.js";
import {
  getMooreNeighborIndex,
  initializeVoronoiLattice,
} from "./lattice.js";
import { calculateMetrics } from "./metrics.js";
import { evaluateUpdate, applyUpdateInPlace } from "./potts.js";
import { createSeededRandom } from "./prng.js";

function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be an integer.`);
  }

  if (value < 0) {
    throw new RangeError(`${name} cannot be negative.`);
  }
}

function assertConfigOverrides(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new TypeError("Configuration overrides must be an object.");
  }
}

export class GrainGrowthEngine {
  #acceptedAttempts = 0;
  #attempts = 0;
  #changedCells = 0;
  #config;
  #lattice;
  #nuclei;
  #random;
  #sweeps = 0;

  constructor(config = {}) {
    this.reset(config);
  }

  get config() {
    return this.#config;
  }

  // Treat this view as read-only; snapshot() returns an isolated copy.
  get lattice() {
    return this.#lattice;
  }

  get size() {
    return this.#config.size;
  }

  get counters() {
    return Object.freeze({
      acceptedAttempts: this.#acceptedAttempts,
      attempts: this.#attempts,
      changedCells: this.#changedCells,
      rejectedAttempts: this.#attempts - this.#acceptedAttempts,
      sweeps: this.#sweeps,
    });
  }

  attempt() {
    const cellIndex = this.#random.nextInt(this.#lattice.length);
    const neighborOffsetIndex = this.#random.nextInt(8);
    const sourceIndex = getMooreNeighborIndex(
      cellIndex,
      this.#config.size,
      neighborOffsetIndex,
    );
    const update = evaluateUpdate(
      this.#lattice,
      this.#config.size,
      cellIndex,
      sourceIndex,
      this.#config.effectiveTemperature,
      this.#random.next(),
    );

    applyUpdateInPlace(this.#lattice, update);
    this.#attempts += 1;
    if (update.accepted) this.#acceptedAttempts += 1;
    if (update.changed) this.#changedCells += 1;

    return Object.freeze({
      ...update,
      attempt: this.#attempts,
      neighborOffsetIndex,
    });
  }

  runAttempts(attemptCount) {
    assertNonNegativeInteger(attemptCount, "attemptCount");
    const before = this.counters;

    for (let attempt = 0; attempt < attemptCount; attempt += 1) {
      this.attempt();
    }

    return Object.freeze({
      acceptedAttempts: this.#acceptedAttempts - before.acceptedAttempts,
      attempts: attemptCount,
      changedCells: this.#changedCells - before.changedCells,
      counters: this.counters,
    });
  }

  sweep() {
    const summary = this.runAttempts(this.#lattice.length);
    this.#sweeps += 1;

    return Object.freeze({
      ...summary,
      counters: this.counters,
      sweep: this.#sweeps,
    });
  }

  step() {
    return this.sweep();
  }

  runSweeps(sweepCount = 1) {
    assertNonNegativeInteger(sweepCount, "sweepCount");
    const summaries = [];

    for (let sweep = 0; sweep < sweepCount; sweep += 1) {
      summaries.push(this.sweep());
    }

    return summaries;
  }

  metrics() {
    return calculateMetrics(this.#lattice, this.#config.size);
  }

  setEffectiveTemperature(effectiveTemperature) {
    this.#config = validateConfig({
      ...this.#config,
      effectiveTemperature,
    });

    return this.#config.effectiveTemperature;
  }

  snapshot() {
    return Object.freeze({
      config: this.#config,
      counters: this.counters,
      lattice: this.#lattice.slice(),
      metrics: this.metrics(),
      nuclei: this.#nuclei,
      randomState: this.#random.getState(),
    });
  }

  reset(overrides) {
    let input;

    if (overrides === undefined) {
      input = this.#config ?? {};
    } else {
      assertConfigOverrides(overrides);
      input = this.#config ? { ...this.#config, ...overrides } : overrides;
    }

    const config = validateConfig(input);
    const random = createSeededRandom(config.seed);
    const { lattice, nuclei } = initializeVoronoiLattice(
      config.size,
      config.initialGrains,
      random,
    );

    this.#config = config;
    this.#random = random;
    this.#lattice = lattice;
    this.#nuclei = nuclei;
    this.#attempts = 0;
    this.#acceptedAttempts = 0;
    this.#changedCells = 0;
    this.#sweeps = 0;

    return this.snapshot();
  }
}

export function createGrainGrowthEngine(config) {
  return new GrainGrowthEngine(config);
}
