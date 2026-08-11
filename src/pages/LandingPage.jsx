import { Link } from "react-router-dom";

import { projects, PROJECT_STATUS } from "../catalog/projects";
import { PageShell } from "../components/PageShell";
import { ProjectCard } from "../components/ProjectCard";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

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

export function LandingPage() {
  useDocumentMeta({
    canonicalPath: "/",
    description:
      "Bruno Weber's portfolio of interactive numerical experiments across scientific computing, visualization, science, and engineering.",
  });

  const activeCount = projects.filter(
    ({ status }) => status !== PROJECT_STATUS.PLANNED,
  ).length;
  const plannedCount = projects.length - activeCount;

  return (
    <PageShell>
      <main id="main-content" tabIndex={-1}>
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <p className="eyebrow">Computational portfolio · v0.1</p>
            <h1>
              Numerical models,
              <span>made explorable.</span>
            </h1>
            <p className="landing-hero__lede">
              Bruno Weber - Simulation Lab is a growing collection of
              browser-based experiments at the intersection of numerical
              modelling, scientific computing, interactive visualization, and
              engineering software.
            </p>
            <div className="button-row">
              <Link className="button button--primary" to="/simulations/grain-growth">
                Explore Grain Growth <span aria-hidden="true">↗</span>
              </Link>
              <a className="button button--secondary" href="#projects">
                Browse projects
              </a>
            </div>
            <p className="landing-hero__note">
              Every active experiment publishes its assumptions, numerical
              method, and limitations alongside the interface.
            </p>
          </div>

          <div aria-label="Current lab overview" className="lab-console">
            <div className="lab-console__header">
              <span>
                <i aria-hidden="true" /> LAB / STATUS
              </span>
              <span>PUBLIC BUILD 001</span>
            </div>
            <div aria-hidden="true" className="lab-console__field">
              <span className="field-cell field-cell--01" />
              <span className="field-cell field-cell--02" />
              <span className="field-cell field-cell--03" />
              <span className="field-cell field-cell--04" />
              <span className="field-cell field-cell--05" />
              <span className="field-cell field-cell--06" />
              <span className="field-cell field-cell--07" />
              <span className="field-cell field-cell--08" />
              <span className="field-cell field-cell--09" />
            </div>
            <dl className="lab-console__metrics">
              <div>
                <dt>Active</dt>
                <dd>{String(activeCount).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Planned</dt>
                <dd>{String(plannedCount).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Execution</dt>
                <dd>Browser</dd>
              </div>
            </dl>
            <div className="lab-console__footer">
              <span>Deterministic seeds</span>
              <span>Tested kernels</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="lab-scope-title" className="scope-section">
          <div className="section-intro">
            <p className="eyebrow">What the lab contains</p>
            <h2 id="lab-scope-title">Experiments built to be examined.</h2>
            <p>
              The lab is not limited to one scientific domain. Each project is
              a focused implementation of a numerical idea, with the software
              structure and scientific scope visible together.
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
          <div>
            <p className="eyebrow">Documentation standard</p>
            <h2 id="standards-title">A result is only as useful as its context.</h2>
          </div>
          <p>
            Where applicable, future projects will state the phenomenon,
            governing equations, initial and boundary conditions, numerical
            method, parameters and units, validation strategy, assumptions,
            and limitations. These experiments are portfolio projects, not
            certified engineering tools.
          </p>
        </section>
      </main>
    </PageShell>
  );
}
