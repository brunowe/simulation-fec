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
      className="equation"
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
      className="equation"
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
    <section aria-labelledby="about-model-title" className="model-notes" id="method">
      <div className="model-notes__intro">
        <p className="eyebrow">Scientific basis</p>
        <h2 id="about-model-title">About the model</h2>
        <p>
          This experiment uses a simplified two-dimensional, neighbor-copy
          Monte Carlo Potts variant. Categorical labels occupy a periodic
          lattice and evolve toward fewer unlike-neighbor bonds, producing a
          qualitative picture of grain growth and coarsening.
        </p>
      </div>

      <div className="model-section-grid">
        <article className="model-card model-card--wide">
          <span className="model-card__number">01</span>
          <div>
            <h3>Boundary energy</h3>
            <p>
              A pair of Moore neighbors contributes one dimensionless energy
              unit when their labels differ. The Kronecker delta δ is one for
              equal labels and zero otherwise; each undirected bond is counted
              once. The engine uses ε = ℋ/J, the dimensionless unlike-bond
              count, with J as the energy unit.
            </p>
            <BoundaryEnergyEquation />
          </div>
        </article>

        <article className="model-card model-card--wide">
          <span className="model-card__number">02</span>
          <div>
            <h3>Update and acceptance</h3>
            <p>
              A random site proposes copying one random neighbor. Moves that do
              not increase local energy are accepted. Uphill moves use a
              Metropolis-shaped probability controlled by dimensionless
              effective noise θ.
            </p>
            <AcceptanceEquation />
          </div>
        </article>

        <article className="model-card">
          <span className="model-card__number">03</span>
          <div>
            <h3>One sweep</h3>
            <p>
              One Monte Carlo sweep is exactly L² attempted updates, sampled
              with replacement. A sweep is algorithmic time; it is not a
              physical second.
            </p>
          </div>
        </article>

        <article className="model-card">
          <span className="model-card__number">04</span>
          <div>
            <h3>Initialization</h3>
            <p>
              Distinct seeded nuclei generate a periodic Voronoi tessellation.
              It creates exactly the requested number of initial labels and is
              reproducible, but it does not simulate nucleation.
            </p>
          </div>
        </article>
      </div>

      <section aria-labelledby="algorithm-title" className="model-detail-block" id="algorithm">
        <div>
          <p className="panel-kicker">Algorithm</p>
          <h3 id="algorithm-title">A sweep, step by step</h3>
        </div>
        <ol className="algorithm-list">
          {modelAlgorithm.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="parameters-title"
        className="model-detail-block model-detail-block--stacked"
        id="parameters"
      >
        <div>
          <p className="panel-kicker">Parameters and units</p>
          <h3 id="parameters-title">Everything shown is dimensionless or lattice-based.</h3>
        </div>
        <div
          aria-label="Model parameters and units"
          className="parameter-table-wrap"
          role="region"
          tabIndex={0}
        >
          <table className="parameter-table">
            <caption className="sr-only">Model parameters and units</caption>
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
      </section>

      <div className="scope-grid" id="boundaries">
        <section aria-labelledby="assumptions-title" className="scope-card">
          <p className="panel-kicker">Assumptions</p>
          <h3 id="assumptions-title">What the model assumes</h3>
          <ul>
            {modelAssumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="limitations-title" className="scope-card scope-card--warning">
          <p className="panel-kicker">Limitations</p>
          <h3 id="limitations-title">What the model does not claim</h3>
          <ul>
            {modelLimitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="method-caveat" role="note">
        <strong>Interpretation of effective noise.</strong>
        <p>
          The random-neighbor proposal is not a symmetric proposal over all
          Potts states. Its acceptance rule has the Metropolis form, but without
          a Hastings correction it should not be interpreted as exact canonical
          equilibrium sampling. Here θ is an exploratory kinetic-noise control,
          never a material temperature.
        </p>
      </aside>

      <section aria-labelledby="demonstration-title" className="demonstration-summary">
        <p className="panel-kicker">What this demonstrates</p>
        <h3 id="demonstration-title">A working model with visible boundaries.</h3>
        <p>
          The experiment connects a deterministic numerical kernel, direct
          manipulation, live measurements, automated tests, and explicit
          scientific limits in one browser-based interface.
        </p>
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
