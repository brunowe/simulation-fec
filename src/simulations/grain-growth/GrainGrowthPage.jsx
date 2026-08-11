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
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function Equation({ children, label }) {
  return (
    <div aria-label={label} className="equation" role="math">
      {children}
    </div>
  );
}

function AboutModel() {
  return (
    <section aria-labelledby="about-model-title" className="model-notes">
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
            <Equation label="Hamiltonian equals J times the sum over neighboring pairs of one minus the Kronecker delta of their states; dimensionless epsilon equals the Hamiltonian divided by J">
              ℋ = J Σ<sub>⟨i,j⟩</sub> (1 − δ<sub>qᵢqⱼ</sub>); &nbsp;
              ε = ℋ/J, &nbsp; J = 1
            </Equation>
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
            <Equation label="Acceptance probability is one for nonpositive delta energy, exponential negative delta energy over theta for positive delta energy and positive theta, and zero for uphill moves at zero theta">
              P<sub>acc</sub> = 1 if Δε ≤ 0; &nbsp; exp(−Δε/θ) if Δε &gt; 0 and θ &gt; 0;
              &nbsp; 0 if Δε &gt; 0 and θ = 0
            </Equation>
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

      <section aria-labelledby="algorithm-title" className="model-detail-block">
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

      <section aria-labelledby="parameters-title" className="model-detail-block model-detail-block--stacked">
        <div>
          <p className="panel-kicker">Parameters and units</p>
          <h3 id="parameters-title">Everything shown is dimensionless or lattice-based.</h3>
        </div>
        <div className="parameter-table-wrap">
          <table className="parameter-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Symbol</th>
                <th>Meaning</th>
                <th>Unit</th>
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

      <div className="scope-grid">
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

      <section aria-labelledby="references-title" className="references-section">
        <div>
          <p className="panel-kicker">Primary literature</p>
          <h3 id="references-title">References</h3>
        </div>
        <ol>
          {grainGrowthReferences.map((reference) => (
            <li key={reference.url}>
              <span>{reference.authors} ({reference.year}).</span>{" "}
              <a href={reference.url}>{reference.title}</a>.{" "}
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
            <div className="experiment-header__meta">
              <StatusBadge status={project.status} />
              <span>Experiment 01</span>
            </div>
            <h1>Grain Growth Model</h1>
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
        </header>

        <aside className="experiment-notice" role="note">
          <span aria-hidden="true">i</span>
          <p>
            <strong>Experimental, qualitative model.</strong> Lattice sites are
            not micrometres, sweeps are not seconds, and effective noise θ is
            not a physical temperature.
          </p>
        </aside>

        <section aria-label="Interactive grain-growth workspace" className="simulation-workspace">
          <SimulationControls simulation={simulation} />
          <section aria-labelledby="state-field-title" className="simulation-visual">
            <div className="panel-heading panel-heading--visual">
              <div>
                <p className="panel-kicker">02 / Observe</p>
                <h2 id="state-field-title">Lattice state</h2>
              </div>
              <span className="determinism-label">Seed {simulation.snapshot.config.seed}</span>
            </div>
            <GrainCanvas snapshot={simulation.snapshot} />
            <div className="simulation-metrics-grid">
              <Metric label="Sweep" note="L² attempts each" value={counters.sweeps.toLocaleString()} />
              <Metric label="Active labels" note="distinct grain IDs" value={metrics.activeGrains.toLocaleString()} />
              <Metric label="Boundary fraction" note="unlike bonds / 4L²" value={metrics.unlikeBondFraction.toFixed(3)} />
              <Metric label="Mean area" note="lattice-area units" value={metrics.meanGrainArea.toFixed(1)} />
              <Metric label="Mean eq. diameter" note="lattice spacings" value={metrics.meanEquivalentDiameter.toFixed(2)} />
            </div>
          </section>
        </section>

        <AboutModel />
      </main>
    </PageShell>
  );
}
