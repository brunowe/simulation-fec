# Cooling Schedule Explorer

An interactive front-end prototype that turns initial temperature, final
temperature, and cooling rate into a linear schedule with a
microstructure-inspired p5.js visualization.

> **Important:** this project is illustrative and non-predictive. It is not a
> materials-science or engineering model and does not calculate phase fractions,
> material properties, or physical grain growth.

## Why this project exists

The repository began as an early React and p5.js experiment. This rebuild turns
that mockup into a focused portfolio case: the inputs now drive a real, testable
calculation; the interface explains its limits; and the visualization is
responsive and accessible without pretending to be scientifically calibrated.

## What it does

- Validates initial temperature, final temperature, and cooling rate.
- Calculates a linear cooling schedule and its duration.
- Plots temperature over time in an accessible SVG chart.
- Lets the user play, pause, reset, or scrub through the schedule.
- Sends normalized progress to a deterministic p5.js pattern.
- Keeps the calculated physical duration separate from the short visual playback.
- Runs automated domain and interface tests in GitHub Actions.

The implemented relationship is intentionally simple:

```text
duration = (initialTemperature - finalTemperature) / coolingRate
T(t) = max(finalTemperature, initialTemperature - coolingRate × t)
```

## Tech stack

- React 19
- Vite 8
- p5.js 2 with `@p5-wrapper/react`
- Vitest and Testing Library
- GitHub Actions

## Run locally

Requirements: Node.js `24.14+`, plus Corepack/pnpm.

```bash
corepack enable
pnpm install
pnpm dev
```

Then open the local URL printed by Vite.

## Verify

```bash
pnpm test
pnpm build
```

The CI workflow runs both commands for every pull request.

## Architecture

```text
src/
├── App.jsx                         # Form, playback, and application state
├── components/
│   ├── CoolingChart.jsx            # Accessible SVG schedule
│   └── MicrostructureCanvas.jsx    # React-to-p5 adapter and visual sketch
├── domain/
│   ├── cooling.js                  # Pure validation and schedule math
│   └── cooling.test.js
├── test/setup.js
├── App.test.jsx
├── main.jsx
└── styles.css
```

The domain logic is independent of React and p5.js. This keeps the calculation
easy to test and makes the boundary between data and illustration explicit.

## Accessibility and interaction

- Inputs have persistent labels, units, and associated error messages.
- Invalid values use `aria-invalid` and `aria-describedby`.
- Status changes are announced through a polite live region.
- The curve and conceptual visualization have accessible names.
- Controls work by keyboard, and the layout adapts from mobile to desktop.
- The p5.js sketch redraws only when its input changes instead of looping at 60 FPS.

## Current limitations

- The schedule assumes a constant cooling rate.
- The visual pattern is an aesthetic mapping of normalized progress only.
- No alloy composition, CCT/TTT data, nucleation, diffusion, boundary mobility,
  phase transformation, or material-property data is modeled.
- There is no public deployment yet.

These constraints are deliberate: the current case demonstrates front-end
architecture and interaction design while keeping the scientific claim honest.

## Next steps

- Add a shareable URL for a validated configuration.
- Publish a static demo after the first release is reviewed.
- Add visual regression coverage for the responsive layouts.
- Only introduce a scientific model when its inputs, assumptions, and reference
  data can be documented and tested.

<details>
<summary>Resumo em português</summary>

O projeto transforma temperatura inicial, temperatura final e taxa de
resfriamento em uma curva linear interativa. A animação inspirada em
microestruturas é apenas conceitual: ela não prevê fases, propriedades do
material nem crescimento físico de grãos. O objetivo atual é demonstrar
arquitetura front-end, validação, acessibilidade, testes e integração entre
React e p5.js.

</details>

## License

No license has been selected for this repository yet.
