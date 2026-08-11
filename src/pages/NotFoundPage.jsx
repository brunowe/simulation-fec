import { Link } from "react-router-dom";

import { PageShell } from "../components/PageShell";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function NotFoundPage() {
  useDocumentMeta({
    canonicalPath: "/",
    title: "Page not found",
    description: "The requested Simulation Lab page could not be found.",
    noIndex: true,
  });

  return (
    <PageShell>
      <main className="not-found" id="main-content" tabIndex={-1}>
        <p className="eyebrow">404 · Outside the domain</p>
        <h1>This route is not part of the current model.</h1>
        <p>
          The experiment may have moved, or the address may be incomplete.
          Return to the catalogue to see what is currently available.
        </p>
        <Link className="button button--primary" to="/">
          Return to projects
        </Link>
      </main>
    </PageShell>
  );
}
