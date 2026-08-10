import { useEffect, useMemo, useState } from "react";

import { CoolingChart } from "./components/CoolingChart";
import { MicrostructureCanvas } from "./components/MicrostructureCanvas";
import {
  calculateDurationSeconds,
  createCoolingCurve,
  DEFAULT_FORM_VALUES,
  formatDuration,
  temperatureAtProgress,
  validateCoolingConfig,
} from "./domain/cooling";

const INITIAL_CONFIG = validateCoolingConfig(DEFAULT_FORM_VALUES).config;

function NumberField({ error, label, name, onChange, suffix, value }) {
  const descriptionId = `${name}-description`;
  const errorId = `${name}-error`;

  return (
    <label className="field" htmlFor={name}>
      <span className="field-label">{label}</span>
      <span className={`field-control ${error ? "field-control-error" : ""}`}>
        <input
          aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ""}`}
          aria-invalid={Boolean(error)}
          id={name}
          inputMode="decimal"
          name={name}
          onChange={onChange}
          step="any"
          type="number"
          value={value}
        />
        <span aria-hidden="true">{suffix}</span>
      </span>
      <span className="sr-only" id={descriptionId}>
        Enter a numeric value in {suffix}.
      </span>
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Metric({ label, suffix, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>
        {value}
        {suffix ? <small>{suffix}</small> : null}
      </strong>
    </div>
  );
}

export default function App() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Adjust the inputs, then run the schedule.",
  );
  const durationSeconds = useMemo(
    () => calculateDurationSeconds(config),
    [config],
  );
  const curve = useMemo(
    () => createCoolingCurve(config),
    [config],
  );
  const currentTemperature = temperatureAtProgress(config, progress);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setProgress((currentProgress) => {
        const nextProgress = Math.min(1, currentProgress + 0.006);

        if (nextProgress === 1) {
          setIsRunning(false);
          setStatusMessage("Schedule complete. You can replay or change the inputs.");
        }

        return nextProgress;
      });
    }, 50);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = validateCoolingConfig(formValues);

    if (!result.ok) {
      setErrors(result.errors);
      setIsRunning(false);
      setStatusMessage("Check the highlighted fields before running the schedule.");
      return;
    }

    const nextDuration = calculateDurationSeconds(result.config);
    setConfig(result.config);
    setErrors({});
    setProgress(0);
    setIsRunning(true);
    setStatusMessage(
      `Running a ${formatDuration(nextDuration)} linear cooling schedule.`,
    );
  }

  function togglePlayback() {
    if (progress === 1) {
      setProgress(0);
      setIsRunning(true);
      setStatusMessage("Replaying the current schedule.");
      return;
    }

    setIsRunning((currentValue) => !currentValue);
    setStatusMessage(isRunning ? "Schedule paused." : "Schedule resumed.");
  }

  function resetPlayback() {
    setIsRunning(false);
    setProgress(0);
    setStatusMessage("Schedule reset to its initial temperature.");
  }

  function handleProgressChange(event) {
    setIsRunning(false);
    setProgress(Number(event.target.value));
    setStatusMessage("Schedule position changed manually.");
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">React + p5.js interactive prototype</p>
          <h1>Cooling Schedule Explorer</h1>
          <p className="hero-copy">
            Turn three process inputs into a clear linear cooling curve and a
            microstructure-inspired visual pattern.
          </p>
        </div>
        <div className="hero-status">
          <span aria-hidden="true" className="status-dot" />
          Interactive model
        </div>
      </header>

      <aside className="disclaimer" role="note">
        <strong>Scope:</strong> this is an educational front-end prototype, not
        a predictive materials model. It does not calculate phases, material
        properties, or physical grain growth.
      </aside>

      <section aria-label="Cooling schedule workspace" className="workspace">
        <form className="control-panel" noValidate onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="section-kicker">01 · Configure</p>
              <h2>Process inputs</h2>
            </div>
            <span className="section-number">3 values</span>
          </div>

          <div className="fields-grid">
            <NumberField
              error={errors.initialTemperature}
              label="Initial temperature"
              name="initialTemperature"
              onChange={handleInputChange}
              suffix="°C"
              value={formValues.initialTemperature}
            />
            <NumberField
              error={errors.finalTemperature}
              label="Final temperature"
              name="finalTemperature"
              onChange={handleInputChange}
              suffix="°C"
              value={formValues.finalTemperature}
            />
            <NumberField
              error={errors.coolingRate}
              label="Cooling rate"
              name="coolingRate"
              onChange={handleInputChange}
              suffix="°C/s"
              value={formValues.coolingRate}
            />
          </div>

          <button className="primary-button" type="submit">
            <span>Run schedule</span>
            <span aria-hidden="true">↗</span>
          </button>

          <p aria-live="polite" className="status-message">
            {statusMessage}
          </p>

          <div className="metrics-grid">
            <Metric
              label="Current"
              suffix="°C"
              value={Math.round(currentTemperature)}
            />
            <Metric
              label="Duration"
              value={formatDuration(durationSeconds)}
            />
            <Metric
              label="Progress"
              suffix="%"
              value={Math.round(progress * 100)}
            />
          </div>
        </form>

        <section aria-labelledby="visualization-title" className="visual-panel">
          <div className="section-heading visual-heading">
            <div>
              <p className="section-kicker">02 · Explore</p>
              <h2 id="visualization-title">Visual output</h2>
            </div>
            <span className="temperature-readout">
              {Math.round(currentTemperature)}°C
            </span>
          </div>

          <MicrostructureCanvas progress={progress} />

          <div className="playback-controls">
            <button
              className="secondary-button"
              onClick={togglePlayback}
              type="button"
            >
              {isRunning ? "Pause" : progress === 1 ? "Replay" : "Play"}
            </button>
            <label className="progress-control" htmlFor="schedule-progress">
              <span className="sr-only">Schedule progress</span>
              <input
                id="schedule-progress"
                max="1"
                min="0"
                onChange={handleProgressChange}
                step="0.01"
                type="range"
                value={progress}
              />
            </label>
            <button
              className="text-button"
              onClick={resetPlayback}
              type="button"
            >
              Reset
            </button>
          </div>
        </section>
      </section>

      <section aria-labelledby="curve-title" className="chart-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">03 · Read the curve</p>
            <h2 id="curve-title">Temperature over time</h2>
          </div>
          <p className="formula">
            T(t) = max(T<sub>f</sub>, T<sub>i</sub> − r · t)
          </p>
        </div>
        <CoolingChart
          config={config}
          curve={curve}
          durationSeconds={durationSeconds}
          progress={progress}
        />
      </section>

      <footer className="footer">
        <p>Built as a transparent, testable front-end case study.</p>
        <a href="https://github.com/brunowe/simulation-fec">
          View source on GitHub <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  );
}
