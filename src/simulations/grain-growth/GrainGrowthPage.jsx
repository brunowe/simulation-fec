import { Link } from "react-router-dom";

import { getProjectBySlug } from "../../catalog/projects";
import { PageShell } from "../../components/PageShell";
import { StatusBadge } from "../../components/StatusBadge";
import {
  grainGrowthReferences,
  modelAlgorithm,
  modelAssumptions,
  modelLimitations,
  modelParameters,
} from "../../content/grainGrowth";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { GrainCanvas } from "./GrainCanvas";
import { SimulationControls } from "./SimulationControls";
import { useGrainGrowthSimulation } from "./useGrainGrowthSimulation";
import "./grain-growth.css";

const project = getProjectBySlug("grain-growth");

function Metric({ label, note, value }) {
  return (
    <div className="simulation-metric">
      <dt>{label}</dt>
      <dd>
        <strong>{value}</strong>
        <small>{note}</small>
      </dd>
    </div>
  );
}

function BoundaryEnergyEquation() {
  return (
    <math
      aria-label="H equals J times the sum over undirected neighboring pairs of one minus the Kronecker delta of their labels. Epsilon equals H divided by J."
      className="method-equation"
      display="block"
    >
      <semantics>
        <mrow>
          <mi>H</mi>
          <mo>=</mo>
          <mi>J</mi>
          <munder>
            <mo>∑</mo>
            <mrow>
              <mo>⟨</mo>
              <mi>i</mi>
              <mo>,</mo>
              <mi>j</mi>
              <mo>⟩</mo>
            </mrow>
          </munder>
          <mo>(</mo>
          <mn>1</mn>
          <mo>-</mo>
          <msub>
            <mi>δ</mi>
            <mrow>
              <msub>
                <mi>q</mi>
                <mi>i</mi>
              </msub>
              <msub>
                <mi>q</mi>
                <mi>j</mi>
              </msub>
            </mrow>
          </msub>
          <mo>)</mo>
          <mo>;</mo>
          <mi>ε</mi>
          <mo>=</mo>
          <mfrac>
            <mi>H</mi>
            <mi>J</mi>
          </mfrac>
        </mrow>
        <annotation encoding="application/x-tex">
          {"H=J\\sum_{\\langle i,j\\rangle}(1-\\delta_{q_iq_j}); \\epsilon=H/J"}
        </annotation>
      </semantics>
    </math>
  );
}

function AcceptanceEquation() {
  return (
    <math
      aria-label="Acceptance probability is one for nonpositive delta epsilon, exponential negative delta epsilon over theta for positive delta epsilon and positive theta, and zero for uphill moves when theta is zero."
      className="method-equation method-equation--cases"
      display="block"
    >
      <semantics>
        <mrow>
          <msub>
            <mi>P</mi>
            <mi>acc</mi>
          </msub>
          <mo>=</mo>
          <mo>{"{"}</mo>
          <mtable>
            <mtr>
              <mtd><mn>1</mn></mtd>
              <mtd><mtext>if </mtext><mi>Δε</mi><mo>≤</mo><mn>0</mn></mtd>
            </mtr>
            <mtr>
              <mtd>
                <mi>exp</mi>
                <mo>(</mo>
                <mfrac><mrow><mo>-</mo><mi>Δε</mi></mrow><mi>θ</mi></mfrac>
                <mo>)</mo>
              </mtd>
              <mtd>
                <mtext>if </mtext><mi>Δε</mi><mo>&gt;</mo><mn>0</mn>
                <mtext> and </mtext><mi>θ</mi><mo>&gt;</mo><mn>0</mn>
              </mtd>
            </mtr>
            <mtr>
              <mtd><mn>0</mn></mtd>
              <mtd>
                <mtext>if </mtext><mi>Δε</mi><mo>&gt;</mo><mn>0</mn>
                <mtext> and </mtext><mi>θ</mi><mo>=</mo><mn>0</mn>
              </mtd>
            </mtr>
          </mtable>
        </mrow>
        <annotation encoding="application/x-tex">
          {"P_{\\mathrm{acc}}=1 \\text{ if } \\Delta\\epsilon\\leq0; \\exp(-\\Delta\\epsilon/\\theta) \\text{ if } \\Delta\\epsilon>0,\\theta>0; 0 \\text{ otherwise}"}
        </annotation>
      </semantics>
    </math>
  );
}

function AboutModel() {
  return (
    <section aria-labelledby="scientific-basis-title" className="scientific-section" id="method">
      <div className="scientific-heading">
        <h2 id="scientific-basis-title">Scientific basis</h2>
        <p>
          This experiment uses a simplified two-dimensional, neighbor-copy
          Monte Carlo Potts variant. Categorical labels occupy a periodic
          lattice and evolve toward fewer unlike-neighbor bonds, producing a
          qualitative picture of grain growth and coarsening.
        </p>
      </div>

      <div className="method-grid">
        <article className="method-block">
          <h3>Boundary energy</h3>
          <p>
            A pair of Moore neighbors contributes one dimensionless energy
            unit when their labels differ. The Kronecker delta δ is one for
            equal labels and zero otherwise; each undirected bond is counted
            once. The engine uses ε = ℋ/J, the dimensionless unlike-bond
            count, with J as the energy unit.
          </p>
          <BoundaryEnergyEquation />
        </article>

        <article className="method-block">
          <h3>Update and acceptance</h3>
          <p>
            A random site proposes copying one random neighbor. Moves that do
            not increase local energy are accepted. Uphill moves use a
            Metropolis-shaped probability controlled by dimensionless
            effective noise θ.
          </p>
          <AcceptanceEquation />
        </article>
      </div>

      <dl className="method-facts">
        <div>
          <dt>One sweep</dt>
          <dd>
            Exactly L² attempted updates, sampled with replacement. A sweep is
            algorithmic time, not a physical second.
          </dd>
        </div>
        <div>
          <dt>Initialization</dt>
          <dd>
            Distinct seeded nuclei generate a periodic Voronoi tessellation.
            It creates exactly the requested number of initial labels and is
            reproducible, but it does not simulate nucleation.
          </dd>
        </div>
      </dl>

      <details className="disclosure" id="algorithm">
        <summary>Algorithm - one Monte Carlo sweep</summary>
        <ol className="algorithm-list">
          {modelAlgorithm.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </details>

      <details className="disclosure" id="parameters">
        <summary>Parameters and units</summary>
        <div
          aria-label="Model parameters and units"
          className="parameter-table-wrap"
          role="region"
          tabIndex={0}
        >
          <table className="parameter-table">
            <caption>Parameters used by the interactive model</caption>
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                <th scope="col">Symbol</th>
                <th scope="col">Meaning</th>
                <th scope="col">Unit</th>
              </tr>
            </thead>
            <tbody>
              {modelParameters.map((parameter) => (
                <tr key={parameter.name}>
                  <th scope="row">{parameter.name}</th>
                  <td>{parameter.symbol}</td>
                  <td>{parameter.meaning}</td>
                  <td>{parameter.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="boundaries-grid" id="boundaries">
        <section aria-labelledby="assumptions-title">
          <details className="boundary-disclosure disclosure">
            <summary>
              <h3 id="assumptions-title">Assumptions</h3>
            </summary>
            <div className="boundary-disclosure__body">
              <ul className="boundary-list">
                {modelAssumptions.map((assumption) => (
                  <li key={assumption}>{assumption}</li>
                ))}
              </ul>
            </div>
          </details>
        </section>
        <section aria-labelledby="limitations-title">
          <details className="boundary-disclosure disclosure">
            <summary>
              <h3 id="limitations-title">Limitations</h3>
            </summary>
            <div className="boundary-disclosure__body">
              <ul className="boundary-list">
                {modelLimitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
              <aside aria-labelledby="effective-noise-title" className="method-caveat" role="note">
                <strong id="effective-noise-title">Interpretation of effective noise.</strong>
                <p>
                  The random-neighbor proposal is not a symmetric proposal over all
                  Potts states. Its acceptance rule has the Metropolis form, but without
                  a Hastings correction it should not be interpreted as exact canonical
                  equilibrium sampling. Here θ is an exploratory kinetic-noise control,
                  never a material temperature.
                </p>
              </aside>
            </div>
          </details>
        </section>
      </div>

      <section aria-labelledby="demonstration-title" className="demonstration-summary">
        <details className="demonstration-disclosure disclosure">
          <summary>
            <h3 id="demonstration-title">What this demonstrates</h3>
          </summary>
          <div className="demonstration-summary__body">
            <p>
              This working experiment connects a deterministic numerical kernel,
              direct controls, live measurements, automated tests, and explicit
              scientific limits in one browser-based interface.
            </p>
            <ul className="demonstration-list">
              <li>A seeded two-dimensional neighbor-copy model with periodic boundaries.</li>
              <li>Reproducible initialization and Monte Carlo updates for a given seed.</li>
              <li>Live parameters and metrics presented beside the evolving state field.</li>
              <li>Assumptions, limitations, and primary sources documented in context.</li>
            </ul>
            <p className="evidence-boundary">
              It remains a qualitative experiment. It is not calibrated to a
              material and should not be used for predictive or engineering decisions.
            </p>
            <div className="demonstration-actions">
              <a className="text-link" href="/#projects">Back to project catalogue</a>
              <a
                className="quiet-link"
                href={project.sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                View source <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </details>
      </section>

      <section aria-labelledby="references-title" className="references-section">
        <div>
          <p className="panel-kicker">Primary literature</p>
          <h3 id="references-title">References</h3>
        </div>
        <ol>
          {grainGrowthReferences.map((reference) => (
            <li key={reference.url}>
              <span>{reference.authors} ({reference.year}).</span>{" "}
              <a href={reference.url} rel="noopener noreferrer" target="_blank">
                {reference.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>.{" "}
              <em>{reference.publication}</em>.
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}

export default function GrainGrowthPage() {
  useDocumentMeta({
    canonicalPath: "/simulations/grain-growth",
    title: project.title,
    description:
      "Run a reproducible 2D Monte Carlo Potts grain-growth experiment directly in the browser and inspect its assumptions and limitations.",
  });
  const simulation = useGrainGrowthSimulation();
  const { counters, metrics } = simulation.snapshot;

  return (
    <PageShell>
      <main className="simulation-page" id="main-content" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Projects</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Grain Growth Model</span>
        </nav>

        <header className="experiment-header">
          <div>
            <h1>
              Grain Growth <em>Model</em>
            </h1>
            <div className="experiment-header__meta">
              <StatusBadge status={project.status} />
              <span>Experiment 01</span>
            </div>
            <p>
              Explore how a discrete lattice reduces unlike-neighbor boundary
              energy through reproducible Monte Carlo updates. The model runs
              locally in your browser; its units and claims remain deliberately
              limited.
            </p>
          </div>
          <dl className="experiment-spec">
            <div>
              <dt>Method</dt>
              <dd>2D Monte Carlo Potts</dd>
            </div>
            <div>
              <dt>Boundary</dt>
              <dd>Periodic</dd>
            </div>
            <div>
              <dt>Execution</dt>
              <dd>In-browser</dd>
            </div>
          </dl>

          <aside aria-labelledby="experiment-notice-title" className="experiment-notice" role="note">
            <p>
              <strong id="experiment-notice-title">Experimental, qualitative model.</strong> Lattice sites are
              not micrometres, sweeps are not seconds, and effective noise θ is
              not a physical temperature.
            </p>
          </aside>
        </header>

        <nav aria-label="On this page" className="section-index">
          <a href="#experiment">Experiment</a>
          <a href="#method">Method</a>
          <a href="#parameters">Parameters</a>
          <a href="#boundaries">Boundaries</a>
        </nav>

        <section
          aria-label="Interactive grain-growth workspace"
          className="simulation-workspace"
          id="experiment"
        >
          <section aria-labelledby="state-field-title" className="simulation-visual">
            <div className="panel-heading panel-heading--visual">
              <h2 id="state-field-title">Lattice state</h2>
              <span className="determinism-label">Seed {simulation.snapshot.config.seed}</span>
            </div>
            <GrainCanvas snapshot={simulation.snapshot} />
            <dl className="simulation-metrics-grid">
              <Metric label="Sweep" note="L² attempts each" value={counters.sweeps.toLocaleString()} />
              <Metric label="Active labels" note="distinct grain IDs" value={metrics.activeGrains.toLocaleString()} />
              <Metric label="Boundary fraction" note="unlike bonds / 4L²" value={metrics.unlikeBondFraction.toFixed(3)} />
              <Metric label="Mean area" note="lattice-area units" value={metrics.meanGrainArea.toFixed(1)} />
              <Metric label="Mean eq. diameter" note="lattice spacings" value={metrics.meanEquivalentDiameter.toFixed(2)} />
            </dl>
          </section>
          <SimulationControls simulation={simulation} />
        </section>

        <AboutModel />
      </main>
    </PageShell>
  );
}
