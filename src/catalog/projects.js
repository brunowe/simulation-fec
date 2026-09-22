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

export const PROJECT_TYPE = Object.freeze({
  CASE_STUDY: "case-study",
  INTERACTIVE_EXPERIMENT: "interactive-experiment",
  PLANNED_STUDY: "planned-study",
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
    projectType: PROJECT_TYPE.INTERACTIVE_EXPERIMENT,
    availability: "Interactive",
    execution: "In-browser",
    actionLabel: "Open experiment",
    technologies: Object.freeze(["React", "Canvas", "Vitest"]),
    demoRoute: "/simulations/grain-growth",
    contentRoute: null,
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
    slug: "weldvision",
    title: "WeldVision",
    summary:
      "A reproducible Python and OpenCV study for estimating a defined visual boundary in high-speed laser welding footage.",
    scientificArea: "Computer vision / laser welding",
    numericalMethod: "Classical computer vision",
    status: PROJECT_STATUS.IN_DEVELOPMENT,
    projectType: PROJECT_TYPE.CASE_STUDY,
    availability: "Documented results",
    execution: "Offline analysis",
    actionLabel: "Read case study",
    technologies: Object.freeze(["Python", "OpenCV", "NumPy"]),
    demoRoute: null,
    contentRoute: "/projects/weldvision",
    sourceUrl: null,
    hypotheses: Object.freeze([
      "The target is a deliberately defined visual boundary in the image domain",
      "Development and second-condition validation remain separated",
      "Non-measurable states are preserved instead of forcing a curve",
    ]),
    limitations: Object.freeze([
      "No physical structure, phase, temperature, defect, or weld quality is inferred",
      "The optical evidence comes from two videos in one experimental campaign",
      "The separate thermal track has no analytical result yet",
    ]),
  }),
  Object.freeze({
    slug: "laser-fem",
    title: "Laser FEM",
    summary:
      "A planned finite-element experiment related to laser processes. Its governing model and implementation scope have not yet been defined.",
    scientificArea: "Laser-matter interaction",
    numericalMethod: "Finite element method",
    status: PROJECT_STATUS.PLANNED,
    projectType: PROJECT_TYPE.PLANNED_STUDY,
    availability: "Not implemented",
    execution: "Not yet defined",
    actionLabel: null,
    technologies: Object.freeze([]),
    demoRoute: null,
    contentRoute: null,
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
      "projectType",
      "availability",
      "execution",
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

    if (!Object.values(PROJECT_TYPE).includes(project.projectType)) {
      throw new Error(`Unknown project type for ${project.slug}: ${project.projectType}`);
    }

    if (
      project.status === PROJECT_STATUS.PLANNED &&
      (project.demoRoute || project.contentRoute)
    ) {
      throw new Error(`Planned project ${project.slug} cannot expose a project route.`);
    }

    if (
      project.projectType === PROJECT_TYPE.INTERACTIVE_EXPERIMENT &&
      !project.demoRoute
    ) {
      throw new Error(`Interactive project ${project.slug} requires a demo route.`);
    }

    if (
      project.projectType === PROJECT_TYPE.CASE_STUDY &&
      (!project.contentRoute || project.demoRoute)
    ) {
      throw new Error(
        `Case study ${project.slug} requires a content route and cannot expose a demo route.`,
      );
    }

    slugs.add(project.slug);
  }

  return true;
}

validateProjectRegistry();
