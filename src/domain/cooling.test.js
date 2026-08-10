import { describe, expect, it } from "vitest";

import {
  calculateDurationSeconds,
  createCoolingCurve,
  temperatureAtProgress,
  validateCoolingConfig,
} from "./cooling";

const config = {
  coolingRate: 10,
  finalTemperature: 700,
  initialTemperature: 1200,
};

describe("cooling schedule domain", () => {
  it("calculates a linear schedule duration", () => {
    expect(calculateDurationSeconds(config)).toBe(50);
    expect(temperatureAtProgress(config, 0)).toBe(1200);
    expect(temperatureAtProgress(config, 0.5)).toBe(950);
    expect(temperatureAtProgress(config, 1)).toBe(700);
  });

  it("clamps progress outside the schedule", () => {
    expect(temperatureAtProgress(config, -1)).toBe(1200);
    expect(temperatureAtProgress(config, 3)).toBe(700);
  });

  it("creates a fixed-size monotonic curve with exact endpoints", () => {
    const curve = createCoolingCurve(config, 11);

    expect(curve).toHaveLength(11);
    expect(curve[0]).toMatchObject({ seconds: 0, temperature: 1200 });
    expect(curve.at(-1)).toMatchObject({ seconds: 50, temperature: 700 });
    expect(
      curve.every(
        (point, index) =>
          index === 0 || point.temperature <= curve[index - 1].temperature,
      ),
    ).toBe(true);
  });

  it("accepts decimal values", () => {
    const result = validateCoolingConfig({
      coolingRate: "2.5",
      finalTemperature: "700.5",
      initialTemperature: "900.5",
    });

    expect(result.ok).toBe(true);
    expect(calculateDurationSeconds(result.config)).toBe(80);
  });

  it.each([
    [{ coolingRate: "10", finalTemperature: "700", initialTemperature: "" }],
    [{ coolingRate: "0", finalTemperature: "700", initialTemperature: "900" }],
    [{ coolingRate: "-5", finalTemperature: "700", initialTemperature: "900" }],
    [{ coolingRate: "10", finalTemperature: "900", initialTemperature: "900" }],
    [{ coolingRate: "10", finalTemperature: "950", initialTemperature: "900" }],
  ])("rejects invalid configuration %#", (values) => {
    expect(validateCoolingConfig(values).ok).toBe(false);
  });
});
