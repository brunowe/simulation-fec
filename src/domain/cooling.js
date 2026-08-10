export const DEFAULT_FORM_VALUES = Object.freeze({
  initialTemperature: "900",
  finalTemperature: "700",
  coolingRate: "10",
});

function parseRequiredNumber(value) {
  if (typeof value === "string" && value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

export function validateCoolingConfig(values) {
  const config = {
    initialTemperature: parseRequiredNumber(values.initialTemperature),
    finalTemperature: parseRequiredNumber(values.finalTemperature),
    coolingRate: parseRequiredNumber(values.coolingRate),
  };
  const errors = {};

  if (!Number.isFinite(config.initialTemperature)) {
    errors.initialTemperature = "Enter a valid initial temperature.";
  }

  if (!Number.isFinite(config.finalTemperature)) {
    errors.finalTemperature = "Enter a valid final temperature.";
  }

  if (
    Number.isFinite(config.initialTemperature) &&
    config.initialTemperature < -273.15
  ) {
    errors.initialTemperature = "Temperature cannot be below absolute zero.";
  }

  if (
    Number.isFinite(config.finalTemperature) &&
    config.finalTemperature < -273.15
  ) {
    errors.finalTemperature = "Temperature cannot be below absolute zero.";
  }

  if (!Number.isFinite(config.coolingRate) || config.coolingRate <= 0) {
    errors.coolingRate = "Cooling rate must be greater than zero.";
  }

  if (
    Number.isFinite(config.initialTemperature) &&
    Number.isFinite(config.finalTemperature) &&
    config.initialTemperature <= config.finalTemperature
  ) {
    errors.finalTemperature =
      "Final temperature must be lower than the initial temperature.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, ok: false };
  }

  return { config, errors: {}, ok: true };
}

export function calculateDurationSeconds(config) {
  return (
    (config.initialTemperature - config.finalTemperature) /
    config.coolingRate
  );
}

export function temperatureAtProgress(config, progress) {
  const boundedProgress = Math.min(1, Math.max(0, progress));
  const temperatureRange =
    config.initialTemperature - config.finalTemperature;

  return config.initialTemperature - temperatureRange * boundedProgress;
}

export function createCoolingCurve(config, sampleCount = 32) {
  const durationSeconds = calculateDurationSeconds(config);
  const safeSampleCount = Math.max(2, Math.floor(sampleCount));

  return Array.from({ length: safeSampleCount }, (_, index) => {
    const progress = index / (safeSampleCount - 1);

    return {
      progress,
      seconds: durationSeconds * progress,
      temperature: temperatureAtProgress(config, progress),
    };
  });
}

export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${Number(seconds.toFixed(1))} s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return remainingSeconds === 0
    ? `${minutes} min`
    : `${minutes} min ${remainingSeconds} s`;
}
