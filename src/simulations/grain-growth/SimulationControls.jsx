import { CONFIG_LIMITS } from "./engine/index.js";
import { SPEED_OPTIONS } from "./useGrainGrowthSimulation";

function RangeField({ label, max, min, name, onChange, step = 1, unit, value }) {
  return (
    <label className="parameter-field" htmlFor={name}>
      <span className="parameter-field__label">
        <span>{label}</span>
        <output htmlFor={name}>
          {value}{unit ? <small>{unit}</small> : null}
        </output>
      </span>
      <input
        id={name}
        max={max}
        min={min}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        step={step}
        type="range"
        value={value}
      />
      <span aria-hidden="true" className="parameter-field__bounds">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  );
}

export function SimulationControls({ simulation }) {
  const {
    draftConfig,
    hasPendingConfig,
    hasStarted,
    isRunning,
    restart,
    restoreDefaults,
    setSpeed,
    speed,
    statusMessage,
    step,
    toggleRunning,
    updateDraft,
  } = simulation;
  const runLabel = isRunning
    ? "Pause"
    : hasStarted
      ? "Continue"
      : "Start";

  return (
    <aside aria-labelledby="controls-title" className="simulation-controls">
      <div className="panel-heading">
        <h2 id="controls-title">Model controls</h2>
        <span className={hasPendingConfig ? "pending-label" : "interaction-label"}>
          {hasPendingConfig ? "Restart to apply" : "Interactive"}
        </span>
      </div>

      <div className="parameter-stack">
        <fieldset className="control-cluster">
          <legend>Initialization</legend>
          <div className="control-grid">
            <RangeField
              label="Grid size"
              max={192}
              min={32}
              name="size"
              onChange={updateDraft}
              step={16}
              unit="²"
              value={draftConfig.size}
            />
            <RangeField
              label="Initial grains"
              max={Math.min(256, draftConfig.size * draftConfig.size)}
              min={8}
              name="initialGrains"
              onChange={updateDraft}
              step={4}
              value={draftConfig.initialGrains}
            />
            <label className="number-field" htmlFor="seed">
              <span>Random seed</span>
              <input
                id="seed"
                inputMode="numeric"
                max={CONFIG_LIMITS.seed.max}
                min={CONFIG_LIMITS.seed.min}
                name="seed"
                onChange={(event) => updateDraft("seed", event.target.value)}
                step="1"
                type="number"
                value={draftConfig.seed}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="control-cluster">
          <legend>Dynamics</legend>
          <div className="control-grid">
            <RangeField
              label="Effective noise"
              max={2}
              min={CONFIG_LIMITS.effectiveTemperature.min}
              name="effectiveTemperature"
              onChange={updateDraft}
              step={0.05}
              unit=" θ"
              value={draftConfig.effectiveTemperature}
            />
            <label className="select-field" htmlFor="simulation-speed">
              <span>Animation speed</span>
              <select
                id="simulation-speed"
                onChange={(event) => setSpeed(Number(event.target.value))}
                value={speed}
              >
                {SPEED_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} {option === 1 ? "sweep" : "sweeps"} / second
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
      </div>

      <div className="control-actions">
        <button className="control-button control-button--primary" onClick={toggleRunning} type="button">
          {runLabel}
          <span aria-hidden="true">{isRunning ? "Ⅱ" : "▶"}</span>
        </button>
        <button className="control-button" onClick={step} type="button">
          Step <span aria-hidden="true">+1</span>
        </button>
        <button className="control-button" onClick={() => restart()} type="button">
          Restart <span aria-hidden="true">↺</span>
        </button>
        <button className="control-button control-button--quiet" onClick={restoreDefaults} type="button">
          Restore defaults
        </button>
      </div>

      <p aria-live="polite" className="simulation-status">
        <span aria-hidden="true" /> {statusMessage}
      </p>
      <p className="control-note">
        Grid, grain, seed, and noise changes are applied on restart. Speed changes apply immediately.
      </p>
    </aside>
  );
}
