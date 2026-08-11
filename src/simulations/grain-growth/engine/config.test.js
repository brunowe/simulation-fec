import { describe, expect, it } from "vitest";

import {
  CONFIG_LIMITS,
  DEFAULT_CONFIG,
  validateConfig,
} from "./config.js";

describe("grain-growth configuration", () => {
  it("provides a valid, immutable default configuration", () => {
    const config = validateConfig();

    expect(config).toEqual(DEFAULT_CONFIG);
    expect(Object.isFrozen(config)).toBe(true);
  });

  it("merges partial input with defaults", () => {
    expect(validateConfig({ seed: 42 })).toEqual({
      ...DEFAULT_CONFIG,
      seed: 42,
    });
  });

  it("accepts all documented boundary values", () => {
    expect(
      validateConfig({
        effectiveTemperature: CONFIG_LIMITS.effectiveTemperature.max,
        initialGrains: CONFIG_LIMITS.initialGrains.max,
        seed: CONFIG_LIMITS.seed.max,
        size: 32,
      }),
    ).toMatchObject({
      effectiveTemperature: 10,
      initialGrains: 1024,
      seed: 0xffffffff,
      size: 32,
    });

    expect(
      validateConfig({
        effectiveTemperature: 0,
        initialGrains: 1,
        seed: 0,
        size: CONFIG_LIMITS.size.min,
      }),
    ).toBeDefined();
  });

  it.each([
    null,
    [],
    "invalid",
  ])("rejects a non-object configuration: %j", (value) => {
    expect(() => validateConfig(value)).toThrow(TypeError);
  });

  it.each([
    ["size", 3],
    ["size", 257],
    ["size", 12.5],
    ["initialGrains", 0],
    ["initialGrains", 1025],
    ["initialGrains", 2.5],
    ["seed", -1],
    ["seed", 0x100000000],
    ["seed", 1.5],
    ["effectiveTemperature", -0.01],
    ["effectiveTemperature", 10.01],
    ["effectiveTemperature", Number.POSITIVE_INFINITY],
  ])("rejects invalid %s=%s", (field, value) => {
    expect(() => validateConfig({ [field]: value })).toThrow();
  });

  it("does not permit more initial grains than cells", () => {
    expect(() =>
      validateConfig({ initialGrains: 17, size: 4 }),
    ).toThrow(/number of lattice cells/i);
  });
});
