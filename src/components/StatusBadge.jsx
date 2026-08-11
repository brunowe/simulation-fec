import { PROJECT_STATUS_LABELS } from "../catalog/projects";

export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span aria-hidden="true" className="status-badge__dot" />
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
