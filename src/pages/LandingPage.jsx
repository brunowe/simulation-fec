import { Link } from "react-router-dom";

import { getProjectBySlug, projects } from "../catalog/projects";
import { PageShell } from "../components/PageShell";
import { ProjectCard } from "../components/ProjectCard";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { createGrainGrowthEngine } from "../simulations/grain-growth/engine";
import { GrainCanvas } from "../simulations/grain-growth/GrainCanvas";

const workflow = [
  {
    number: "01",
    title: "Model",
    copy: "State the equations, assumptions, parameters, units, and numerical boundaries before presenting an output.",
  },
  {
    number: "02",
    title: "Compute",
    copy: "Keep scientific kernels independent from the interface so their behavior can be reproduced and tested.",
  },
  {
    number: "03",
    title: "Inspect",
    copy: "Use interactive views and transparent metrics to make model behavior easier to question, not easier to overclaim.",
  },
];

const grainGrowthProject = getProjectBySlug("grain-growth");
const heroSnapshot = createGrainGrowthEngine({
  effectiveTemperature: 0.1,
  initialGrains: 12,
  seed: 2025,
  size: 64,
}).snapshot();

export function LandingPage() {
  useDocumentMeta({
    canonicalPath: "/",
    description:
      "Bruno Weber's portfolio of interactive numerical experiments across scientific computing, visualization, science, and engineering.",
  });

  return (
    <PageShell>
      <main id="main-content" tabIndex={-1}>
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <h1>
              Numerical models,
              <em>made explorable.</em>
            </h1>
            <p className="landing-hero__lede">
              Bruno Weber - Simulation Lab is a growing collection of
              browser-based experiments at the intersection of numerical
              modelling, scientific computing, interactive visualization, and
              engineering software.
            </p>
            <div className="button-row">
              <Link className="button button--primary" to="/simulations/grain-growth">
                Explore Grain Growth <span aria-hidden="true">→</span>
              </Link>
              <a className="button button--text" href="#projects">
                Browse projects <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <figure className="hero-specimen">
            <div aria-hidden="true" className="hero-specimen__topline">
              <span>Engine snapshot</span>
              <span>Grain Growth Model</span>
            </div>
            <div className="hero-specimen__viewport">
              <GrainCanvas palette="identity" snapshot={heroSnapshot} />
            </div>
            <figcaption>
              <span>Seeded categorical lattice</span>
              <span>Rendered by the working simulation engine</span>
            </figcaption>
          </figure>

          <dl aria-label="Grain Growth Model facts" className="hero-ledger">
            <div>
              <dt>Availability</dt>
              <dd>Interactive</dd>
            </div>
            <div>
              <dt>Maturity</dt>
              <dd>Experimental</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>{grainGrowthProject.numericalMethod}</dd>
            </div>
            <div>
              <dt>Execution</dt>
              <dd>In-browser</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="projects-title" className="projects-section" id="projects">
          <div className="section-intro section-intro--row">
            <div>
              <p className="eyebrow">Project catalogue</p>
              <h2 id="projects-title">Models in the lab.</h2>
            </div>
            <p>
              Status labels separate runnable experiments from work that is
              only planned. No unavailable results or capabilities are implied.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard index={index} key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section aria-labelledby="standards-title" className="standards-section">
          <div className="standards-section__intro">
            <p className="eyebrow">Documentation standard</p>
            <h2 id="standards-title">A result is only as useful as its context.</h2>
            <p>
              Where applicable, projects state the phenomenon,
              governing equations, initial and boundary conditions, numerical
              method, parameters and units, validation strategy, assumptions,
              and limitations.
            </p>
          </div>
          <div className="workflow-grid">
            {workflow.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
