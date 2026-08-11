import { describe, expect, it } from "vitest";

import { isBoundaryCell } from "./rendering";

describe("grain boundary rendering", () => {
  it("does not mark a site in a uniform Moore neighborhood as a boundary", () => {
    expect(isBoundaryCell(new Uint32Array(9).fill(1), 0, 3)).toBe(false);
  });

  it("detects a boundary that exists only across a diagonal Moore bond", () => {
    const lattice = new Uint32Array(9).fill(1);
    lattice[4] = 2;

    expect(isBoundaryCell(lattice, 0, 3)).toBe(true);
  });
});
