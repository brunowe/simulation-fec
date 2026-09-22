import { Link } from "react-router-dom";

import {
  PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
} from "../catalog/projects";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({ index, project }) {
  const isPlanned = project.status === PROJECT_STATUS.PLANNED;
  const projectRoute = project.contentRoute || project.demoRoute;

  return (
    <article
      className={`project-card project-card--${project.projectType} ${isPlanned ? "project-card--planned" : ""}`}
    >
      <div className="project-card__topline">
        <span className="project-card__index">0{index + 1}</span>
        <StatusBadge status={project.status} />
      </div>
      <div className="project-card__body">
        <p className="project-card__area">{project.scientificArea}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
      <dl className="project-card__facts">
        <div>
          <dt>Availability</dt>
          <dd>{project.availability}</dd>
        </div>
        <div>
          <dt>Maturity</dt>
          <dd>{PROJECT_STATUS_LABELS[project.status]}</dd>
        </div>
        <div>
          <dt>Method</dt>
          <dd>{project.numericalMethod}</dd>
        </div>
        <div>
          <dt>Execution</dt>
          <dd>{project.execution}</dd>
        </div>
      </dl>
      {project.technologies.length ? (
        <ul aria-label="Technologies" className="tag-list">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      ) : null}
      <div className="project-card__actions">
        {projectRoute ? (
          <Link className="text-link" to={projectRoute}>
            {project.actionLabel} <span aria-hidden="true">↗</span>
          </Link>
        ) : (
          <span className="muted-action">No demo available</span>
        )}
        {project.sourceUrl ? (
          <a className="quiet-link" href={project.sourceUrl} rel="noopener noreferrer" target="_blank">
            View code <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
