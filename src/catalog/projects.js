export const PROJECT_STATUS = Object.freeze({
  AVAILABLE: "available",
  EXPERIMENTAL: "experimental",
  IN_DEVELOPMENT: "in-development",
  PLANNED: "planned",
});

export const PROJECT_STATUS_LABELS = Object.freeze({
  [PROJECT_STATUS.AVAILABLE]: "Available",
  [PROJECT_STATUS.EXPERIMENTAL]: "Experimental",
  [PROJECT_STATUS.IN_DEVELOPMENT]: "In development",
  [PROJECT_STATUS.PLANNED]: "Planned",
});

export const projects = Object.freeze([
  Object.freeze({
    slug: "grain-growth",
    title: "Grain Growth Model",
    summary:
      "A seeded 2D Monte Carlo Potts experiment for exploring curvature-driven grain coarsening on a discrete lattice.",
    scientificArea: "Microstructure evolution",
    numericalMethod: "2D Monte Carlo Potts model",
    status: PROJECT_STATUS.EXPERIMENTAL,
    technologies: Object.freeze(["React", "Canvas", "Vitest"]),
    demoRoute: "/simulations/grain-growth",
    sourceUrl: "https://github.com/brunowe/simulation-fec",
    hypotheses: Object.freeze([
      "Two-dimensional square lattice with periodic boundaries",
      "Grain-ID-independent interaction energy between unlike states",
      "Dimensionless Monte Carlo kinetics",
    ]),
    limitations: Object.freeze([
      "Qualitative coarsening only; no material calibration or physical time scale",
      "No phase transformations, mechanical properties, or alloy-specific physics",
      "A finite lattice and neighborhood stencil introduce discretization effects",
    ]),
  }),
  Object.freeze({
    slug: "laser-fem",
    title: "Laser FEM",
    summary:
      "A planned finite-element experiment related to laser processes. Its governing model and implementation scope have not yet been defined.",
    scientificArea: "Laser–matter interaction",
    numericalMethod: "Finite element method",
    status: PROJECT_STATUS.PLANNED,
    technologies: Object.freeze([]),
    demoRoute: null,
    sourceUrl: null,
    hypotheses: Object.freeze([]),
    limitations: Object.freeze([
      "Planning status only; no model, solver, results, or delivery date is claimed.",
    ]),
  }),
]);

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

export function validateProjectRegistry(registry = projects) {
  const slugs = new Set();

  for (const project of registry) {
    const requiredTextFields = [
      "slug",
      "title",
      "summary",
      "scientificArea",
      "numericalMethod",
      "status",
    ];

    if (requiredTextFields.some((field) => !project[field]?.trim?.())) {
      throw new Error(`Project metadata is incomplete for ${project.slug || "unknown"}.`);
    }

    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate project slug: ${project.slug}`);
    }

    if (!Object.values(PROJECT_STATUS).includes(project.status)) {
      throw new Error(`Unknown status for ${project.slug}: ${project.status}`);
    }

    if (project.status === PROJECT_STATUS.PLANNED && project.demoRoute) {
      throw new Error(`Planned project ${project.slug} cannot expose a demo route.`);
    }

    slugs.add(project.slug);
  }

  return true;
}

validateProjectRegistry();
