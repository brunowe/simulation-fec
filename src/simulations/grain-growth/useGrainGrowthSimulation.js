import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createGrainGrowthEngine,
  DEFAULT_CONFIG,
  validateConfig,
} from "./engine/index.js";

export const DEFAULT_SPEED = 6;
export const SPEED_OPTIONS = Object.freeze([1, 3, 6, 12]);

function configsMatch(a, b) {
  return (
    a.size === b.size &&
    a.initialGrains === b.initialGrains &&
    a.seed === b.seed &&
    a.effectiveTemperature === b.effectiveTemperature
  );
}

export function useGrainGrowthSimulation() {
  const [initialEngine] = useState(() => createGrainGrowthEngine(DEFAULT_CONFIG));
  const engineRef = useRef(initialEngine);
  const [snapshot, setSnapshot] = useState(() => initialEngine.snapshot());
  const [draftConfig, setDraftConfig] = useState(DEFAULT_CONFIG);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Ready. Start the model or advance one sweep.",
  );
  const animationFrameRef = useRef(null);
  const lastSweepAtRef = useRef(0);

  const hasPendingConfig = useMemo(
    () => !configsMatch(draftConfig, snapshot.config),
    [draftConfig, snapshot.config],
  );

  const publish = useCallback(() => {
    setSnapshot(engineRef.current.snapshot());
  }, []);

  useEffect(() => {
    if (!isRunning) {
      lastSweepAtRef.current = 0;
      return undefined;
    }

    let cancelled = false;
    const minimumInterval = 1000 / speed;

    function tick(timestamp) {
      if (cancelled) return;

      if (
        lastSweepAtRef.current === 0 ||
        timestamp - lastSweepAtRef.current >= minimumInterval
      ) {
        engineRef.current.sweep();
        publish();
        lastSweepAtRef.current = timestamp;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    }

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, publish, speed]);

  const toggleRunning = useCallback(() => {
    setIsRunning((running) => {
      const next = !running;
      if (next) setHasStarted(true);
      setStatusMessage(
        next
          ? `Running at ${speed} ${speed === 1 ? "sweep" : "sweeps"} per second.`
          : "Paused. The current lattice state is preserved.",
      );
      return next;
    });
  }, [speed]);

  const updateSpeed = useCallback(
    (nextSpeed) => {
      if (!SPEED_OPTIONS.includes(nextSpeed)) return;

      setSpeed(nextSpeed);
      if (isRunning) {
        setStatusMessage(
          `Running at ${nextSpeed} ${nextSpeed === 1 ? "sweep" : "sweeps"} per second.`,
        );
      }
    },
    [isRunning],
  );

  const step = useCallback(() => {
    setIsRunning(false);
    setHasStarted(true);
    engineRef.current.sweep();
    publish();
    setStatusMessage("Advanced exactly one Monte Carlo sweep.");
  }, [publish]);

  const restart = useCallback(
    (nextConfig = draftConfig) => {
      try {
        const validated = validateConfig(nextConfig);
        setIsRunning(false);
        setHasStarted(false);
        engineRef.current = createGrainGrowthEngine(validated);
        setDraftConfig(validated);
        setSnapshot(engineRef.current.snapshot());
        setStatusMessage(
          `Restarted a ${validated.size} × ${validated.size} lattice with seed ${validated.seed}.`,
        );
        return true;
      } catch (error) {
        setIsRunning(false);
        setStatusMessage(error.message);
        return false;
      }
    },
    [draftConfig],
  );

  const restoreDefaults = useCallback(() => {
    setSpeed(DEFAULT_SPEED);
    restart(DEFAULT_CONFIG);
    setStatusMessage("Default parameters restored and the lattice reinitialized.");
  }, [restart]);

  const updateDraft = useCallback((name, rawValue) => {
    const value = Number(rawValue);
    setDraftConfig((current) => {
      const next = { ...current, [name]: value };

      if (name === "size") {
        next.initialGrains = Math.min(next.initialGrains, value * value);
      }

      return next;
    });
  }, []);

  return {
    draftConfig,
    hasStarted,
    hasPendingConfig,
    isRunning,
    restart,
    restoreDefaults,
    setSpeed: updateSpeed,
    snapshot,
    speed,
    statusMessage,
    step,
    toggleRunning,
    updateDraft,
  };
}
