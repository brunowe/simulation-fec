export const CONFIG_LIMITS = Object.freeze({
  effectiveTemperature: Object.freeze({ max: 10, min: 0 }),
  initialGrains: Object.freeze({ max: 1024, min: 1 }),
  seed: Object.freeze({ max: 0xffffffff, min: 0 }),
  size: Object.freeze({ max: 256, min: 4 }),
});

export const DEFAULT_CONFIG = Object.freeze({
  effectiveTemperature: 0.1,
  initialGrains: 64,
  seed: 2025,
  size: 96,
});

function assertPlainObject(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new TypeError("Grain-growth configuration must be an object.");
  }
}

function assertIntegerInRange(name, value, { min, max }) {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be an integer.`);
  }

  if (value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
}

function assertFiniteInRange(name, value, { min, max }) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }

  if (value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
}

export function validateConfig(input = {}) {
  assertPlainObject(input);

  const config = { ...DEFAULT_CONFIG, ...input };

  assertIntegerInRange("size", config.size, CONFIG_LIMITS.size);
  assertIntegerInRange(
    "initialGrains",
    config.initialGrains,
    CONFIG_LIMITS.initialGrains,
  );
  assertIntegerInRange("seed", config.seed, CONFIG_LIMITS.seed);
  assertFiniteInRange(
    "effectiveTemperature",
    config.effectiveTemperature,
    CONFIG_LIMITS.effectiveTemperature,
  );

  if (config.initialGrains > config.size * config.size) {
    throw new RangeError(
      "initialGrains cannot exceed the number of lattice cells.",
    );
  }

  return Object.freeze(config);
}
