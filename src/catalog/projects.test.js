import { describe, expect, it } from "vitest";

import {
  getProjectBySlug,
  projects,
  PROJECT_STATUS,
  PROJECT_TYPE,
  validateProjectRegistry,
} from "./projects";

describe("project registry", () => {
  it("contains an experiment, a documented case study, and a planned project", () => {
    expect(projects).toHaveLength(3);
    expect(getProjectBySlug("grain-growth")).toMatchObject({
      demoRoute: "/simulations/grain-growth",
      projectType: PROJECT_TYPE.INTERACTIVE_EXPERIMENT,
      status: PROJECT_STATUS.EXPERIMENTAL,
    });
    expect(getProjectBySlug("weldvision")).toMatchObject({
      contentRoute: "/projects/weldvision",
      demoRoute: null,
      projectType: PROJECT_TYPE.CASE_STUDY,
      status: PROJECT_STATUS.IN_DEVELOPMENT,
    });
    expect(getProjectBySlug("laser-fem")).toMatchObject({
      contentRoute: null,
      demoRoute: null,
      projectType: PROJECT_TYPE.PLANNED_STUDY,
      sourceUrl: null,
      status: PROJECT_STATUS.PLANNED,
    });
  });

  it("rejects duplicate slugs", () => {
    expect(() => validateProjectRegistry([projects[0], projects[0]])).toThrow(
      /duplicate project slug/i,
    );
  });

  it("rejects a demo route on a planned project", () => {
    const laserFem = getProjectBySlug("laser-fem");
    expect(() =>
      validateProjectRegistry([
        {
          ...laserFem,
          demoRoute: "/not-built",
        },
      ]),
    ).toThrow(/planned project.*cannot expose a project route/i);
  });

  it("requires an explicit content route for case studies", () => {
    const weldVision = getProjectBySlug("weldvision");
    expect(() =>
      validateProjectRegistry([
        {
          ...weldVision,
          contentRoute: null,
        },
      ]),
    ).toThrow(/case study.*requires a content route/i);
  });

  it("rejects incomplete metadata and unknown status values", () => {
    expect(() =>
      validateProjectRegistry([{ ...projects[0], title: "" }]),
    ).toThrow(/metadata is incomplete/i);
    expect(() =>
      validateProjectRegistry([{ ...projects[0], status: "fictional" }]),
    ).toThrow(/unknown status/i);
  });
});
