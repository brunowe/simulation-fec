import { describe, expect, it } from "vitest";

import {
  getProjectBySlug,
  projects,
  PROJECT_STATUS,
  validateProjectRegistry,
} from "./projects";

describe("project registry", () => {
  it("contains one experimental demo and one planned project", () => {
    expect(projects).toHaveLength(2);
    expect(getProjectBySlug("grain-growth")).toMatchObject({
      demoRoute: "/simulations/grain-growth",
      status: PROJECT_STATUS.EXPERIMENTAL,
    });
    expect(getProjectBySlug("laser-fem")).toMatchObject({
      demoRoute: null,
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
    expect(() =>
      validateProjectRegistry([
        {
          ...projects[1],
          demoRoute: "/not-built",
        },
      ]),
    ).toThrow(/planned project.*cannot expose a demo route/i);
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
