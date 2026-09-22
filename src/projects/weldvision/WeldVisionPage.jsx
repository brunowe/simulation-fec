import { Link } from "react-router-dom";

import contactSheet from "../../assets/weldvision/optical-contact-sheet.jpg";
import validationComparison from "../../assets/weldvision/validation-comparison.jpg";
import { getProjectBySlug } from "../../catalog/projects";
import { PageShell } from "../../components/PageShell";
import { StatusBadge } from "../../components/StatusBadge";
import {
  weldVisionAssumptions,
  weldVisionDemonstrates,
  weldVisionDoesNotDemonstrate,
  weldVisionLimitations,
  weldVisionMethodSteps,
  weldVisionMetrics,
  weldVisionReferences,
} from "../../content/weldVision";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import "./weldvision.css";

const project = getProjectBySlug("weldvision");

function Metric({ label, note, value }) {
  return (
    <div className="weldvision-metric">
      <dt>{label}</dt>
      <dd>
        <strong>{value}</strong>
        <small>{note}</small>
      </dd>
    </div>
  );
}

function Disclosure({ children, id, title }) {
  return (
    <details className="weldvision-disclosure" id={id}>
      <summary>
        <h3>{title}</h3>
      </summary>
      <div className="weldvision-disclosure__body">{children}</div>
    </details>
  );
}

export default function WeldVisionPage() {
  useDocumentMeta({
    canonicalPath: "/projects/weldvision",
    description:
      "WeldVision is a documented computer-vision study of an image-domain boundary in high-speed laser welding footage.",
    title: "WeldVision",
  });

  return (
    <PageShell>
      <main className="weldvision-page" id="main-content" tabIndex={-1}>
        <header className="weldvision-hero">
          <nav aria-label="Breadcrumb" className="weldvision-breadcrumb">
            <Link to="/#projects">Projects</Link>
            <span aria-hidden="true">/</span>
            <span>WeldVision</span>
          </nav>

          <div className="weldvision-hero__grid">
            <div className="weldvision-hero__copy">
              <p className="eyebrow">Computer vision case study</p>
              <h1>
                WeldVision
                <em>Reproducible visual analysis.</em>
              </h1>
              <div className="weldvision-hero__status">
                <StatusBadge status={project.status} />
                <span>Optical cycle complete with limitations</span>
              </div>
              <p className="weldvision-hero__lede">
                A deterministic Python and OpenCV workflow for estimating a
                deliberately defined image-domain boundary in high-speed laser
                welding video, with second-condition evaluation and explicit
                failure states.
              </p>
            </div>

            <dl aria-label="WeldVision facts" className="weldvision-hero__facts">
              <div>
                <dt>Method</dt>
                <dd>Classical computer vision</dd>
              </div>
              <div>
                <dt>Dataset</dt>
                <dd>WVD-001</dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>2 videos / 96 masks</dd>
              </div>
              <div>
                <dt>Execution</dt>
                <dd>Offline analysis</dd>
              </div>
            </dl>
          </div>

          <aside className="weldvision-claim" role="note">
            <strong>Evidence boundary.</strong>
            <span>
              The output is a boundary in image coordinates. It does not
              identify physical structure, phase, temperature, defect, or weld
              quality.
            </span>
          </aside>
        </header>

        <nav aria-label="On this page" className="weldvision-index">
          <a href="#overview">Overview</a>
          <a href="#method">Method</a>
          <a href="#results">Results</a>
          <a href="#research-tracks">Research tracks</a>
          <a href="#boundaries">Boundaries</a>
          <a href="#references">References</a>
        </nav>

        <section
          aria-labelledby="weldvision-overview-title"
          className="weldvision-section weldvision-overview"
          id="overview"
        >
          <div className="weldvision-section__heading">
            <div>
              <p className="eyebrow">Optical cycle</p>
              <h2 id="weldvision-overview-title">A narrow question, made inspectable.</h2>
            </div>
            <div>
              <p>
                Can a reproducible computer-vision pipeline estimate a visible
                boundary without forcing a result after that boundary is no
                longer distinguishable?
              </p>
              <p>
                The target remains strictly within the image domain. The
                workflow records measurable and non-measurable states across a
                full sequence instead of attaching a physical meaning that the
                data cannot support.
              </p>
            </div>
          </div>

          <figure className="weldvision-figure weldvision-figure--panoramic">
            <div aria-hidden="true" className="weldvision-figure__topline">
              <span>Optical sequence inspection</span>
              <span>Robust V2</span>
            </div>
            <img
              alt="Eight grayscale frames from an optical laser-welding video, labelled to indicate whether the visible boundary is measurable; image-domain indicator only."
              decoding="async"
              fetchPriority="high"
              src={contactSheet}
            />
            <figcaption>
              <span>
                Eight points from the processed sequence show when the defined
                visual boundary is measurable and when the pipeline returns no
                measurement.
              </span>
              <span>Image-domain indicator only</span>
            </figcaption>
          </figure>
        </section>

        <section
          aria-labelledby="weldvision-method-title"
          className="weldvision-section"
          id="method"
        >
          <div className="weldvision-section__heading">
            <div>
              <p className="eyebrow">Reproducible method</p>
              <h2 id="weldvision-method-title">From video to a bounded result.</h2>
            </div>
            <p>
              The pipeline combines an intensity change-point score with
              temporal image differences. A lateral continuity constraint of 8
              pixels was selected using only the development video and then
              applied unchanged to the second recording condition.
            </p>
          </div>

          <ol className="weldvision-steps">
            {weldVisionMethodSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="weldvision-results-title"
          className="weldvision-section"
          id="results"
        >
          <div className="weldvision-section__heading">
            <div>
              <p className="eyebrow">Second-condition evaluation</p>
              <h2 id="weldvision-results-title">What the optical evidence supports.</h2>
            </div>
            <p>
              The robust V2 configuration was evaluated on 48 masks from a
              second optical condition. Presence classification produced 24
              true positives, 0 false negatives, 23 true negatives, and 1
              false positive.
            </p>
          </div>

          <dl className="weldvision-metrics">
            {weldVisionMetrics.map((metric) => (
              <Metric key={metric.label} {...metric} />
            ))}
          </dl>

          <aside className="weldvision-evidence-note" role="note">
            <strong>Reference scope.</strong>
            <p>
              The complete reference contains 96 masks: 48 for development and
              48 for validation. Each set contains 24 visible-boundary cases
              and 24 empty cases. The stated reference uncertainty is 5 pixels,
              and the single-reviewer annotation is not an independent gold
              standard.
            </p>
          </aside>

          <figure className="weldvision-figure weldvision-figure--validation">
            <div aria-hidden="true" className="weldvision-figure__topline">
              <span>Validation comparison</span>
              <span>Reference / prediction</span>
            </div>
            <img
              alt="Twelve grayscale validation frames from the optical welding video, comparing green reference curves with magenta WeldVision predictions on visible boundaries."
              decoding="async"
              loading="lazy"
              src={validationComparison}
            />
            <figcaption>
              <span>
                Green indicates the intensity-assisted reference and magenta
                indicates the robust V2 prediction on the second condition.
              </span>
              <span>Evaluation remains in pixels</span>
            </figcaption>
          </figure>
        </section>

        <section
          aria-labelledby="weldvision-tracks-title"
          className="weldvision-section"
          id="research-tracks"
        >
          <div className="weldvision-section__heading">
            <div>
              <p className="eyebrow">Research tracks</p>
              <h2 id="weldvision-tracks-title">Two cycles, kept separate.</h2>
            </div>
            <p>
              Optical and thermal sources answer different questions. Their
              datasets, metrics, and claims are not merged.
            </p>
          </div>

          <div className="weldvision-tracks">
            <article className="weldvision-track weldvision-track--complete">
              <div className="weldvision-track__topline">
                <span>Optical cycle</span>
                <strong>Complete with limitations</strong>
              </div>
              <h3>Visible-boundary estimation</h3>
              <p>
                Four technical phases produced and evaluated the robust V2
                configuration. The result is documented, reproducible, and
                limited to the stated image-domain target.
              </p>
              <dl>
                <div>
                  <dt>Configuration</dt>
                  <dd>WELDVISION-OPTICAL-ROBUST-V2</dd>
                </div>
                <div>
                  <dt>Validation</dt>
                  <dd>Second optical condition</dd>
                </div>
              </dl>
            </article>

            <article className="weldvision-track weldvision-track--pending">
              <div className="weldvision-track__topline">
                <span>Thermal cycle</span>
                <strong>Research in progress</strong>
              </div>
              <h3>Semantic validation pending</h3>
              <p>
                A separate WVD-005 cycle is prepared for controlled semantic
                validation. Selective extraction is complete, but semantic
                validation, baseline development, training, and Phase 2 have
                not begun.
              </p>
              <p className="weldvision-track__caveat">
                No thermal model, performance metric, or physical claim is
                presented in this preview.
              </p>
            </article>
          </div>
        </section>

        <section
          aria-labelledby="weldvision-boundaries-title"
          className="weldvision-section"
          id="boundaries"
        >
          <div className="weldvision-section__heading weldvision-section__heading--compact">
            <div>
              <p className="eyebrow">Interpretation</p>
              <h2 id="weldvision-boundaries-title">The evidence stays attached to its limits.</h2>
            </div>
          </div>

          <div className="weldvision-disclosures">
            <Disclosure id="assumptions" title="Assumptions">
              <ul>
                {weldVisionAssumptions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Disclosure>
            <Disclosure id="limitations" title="Limitations">
              <ul>
                {weldVisionLimitations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Disclosure>
            <Disclosure id="demonstrates" title="What this demonstrates">
              <ul>
                {weldVisionDemonstrates.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Disclosure>
            <Disclosure id="does-not-demonstrate" title="What this does not demonstrate">
              <ul>
                {weldVisionDoesNotDemonstrate.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Disclosure>
          </div>
        </section>

        <section
          aria-labelledby="weldvision-references-title"
          className="weldvision-section weldvision-references"
          id="references"
        >
          <div className="weldvision-section__heading">
            <div>
              <p className="eyebrow">Sources and attribution</p>
              <h2 id="weldvision-references-title">References.</h2>
            </div>
            <p>
              The images on this page are derived optical visualizations. The
              source data is licensed under CC BY 4.0, and the web preview adds
              WeldVision annotations and presentation changes.
            </p>
          </div>

          <ol className="weldvision-reference-list">
            {weldVisionReferences.map((reference, index) => (
              <li key={reference.href}>
                <span aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{reference.title}</h3>
                  <p>{reference.authors}</p>
                  <p>{reference.source}. {reference.detail}</p>
                  <a href={reference.href} rel="noopener noreferrer" target="_blank">
                    {reference.linkLabel} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </li>
            ))}
          </ol>

          <p className="weldvision-attribution">
            Optical source data: Reshad Bakhtari and Pasquale Franciosa,
            "High speed videos of laser beam welding with dynamic beam
            shaping", University of Warwick, Zenodo, DOI
            10.5281/zenodo.19882091, CC BY 4.0. Derived visualization and
            annotations by WeldVision.
          </p>

          <div className="weldvision-closing">
            <Link className="button button--secondary" to="/#projects">
              Back to project catalogue <span aria-hidden="true">←</span>
            </Link>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
