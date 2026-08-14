import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import App from "./App";

function visit(path) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("Bruno Weber - Simulation Lab", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    window.requestAnimationFrame.mockReset().mockImplementation(() => 1);
    window.cancelAnimationFrame.mockClear();
    window.scrollTo.mockClear();
  });

  it("presents the platform identity and registry-driven catalogue", () => {
    visit("/");

    expect(
      screen.getByRole("heading", { name: /numerical models,\s*made explorable/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/bruno weber - simulation lab is/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Grain Growth Model" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Laser FEM" })).toBeInTheDocument();
    expect(screen.getByText("Experimental")).toBeInTheDocument();
    expect(screen.getAllByText("Planned")).not.toHaveLength(0);
    expect(screen.queryByText(/cooling schedule explorer/i)).not.toBeInTheDocument();
  });

  it("links the active experiment while keeping Laser FEM explicitly unavailable", () => {
    visit("/");

    expect(
      screen.getAllByRole("link", { name: /explore grain growth|open experiment/i }),
    ).not.toHaveLength(0);

    const laserCard = screen.getByRole("heading", { name: "Laser FEM" }).closest("article");
    expect(within(laserCard).getByText("No demo available")).toBeInTheDocument();
    expect(within(laserCard).queryByRole("link")).not.toBeInTheDocument();
  });

  it("loads the Grain Growth route directly and advances exactly one sweep", async () => {
    const user = userEvent.setup();
    visit("/simulations/grain-growth");

    expect(
      await screen.findByRole("heading", { name: "Grain Growth Model", level: 1 }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(document.title).toBe("Grain Growth Model | Bruno Weber - Simulation Lab");
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://brunoweber.dev/simulations/grain-growth",
      );
    });
    expect(screen.getByRole("main")).toHaveFocus();
    expect(
      screen.getByRole("img", { name: /after 0 sweeps with 64 active grain labels/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^step/i }));

    expect(
      screen.getByRole("img", { name: /after 1 sweeps/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/advanced exactly one monte carlo sweep/i)).toBeInTheDocument();
  });

  it("supports start, pause, continue, seed changes, restart, and defaults", async () => {
    const user = userEvent.setup();
    visit("/simulations/grain-growth");

    const start = await screen.findByRole("button", { name: /^start/i });
    await user.click(start);
    expect(screen.getByRole("button", { name: /^pause/i })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Animation speed"), "12");
    expect(screen.getByText("Running at 12 sweeps per second.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^pause/i }));
    expect(screen.getByRole("button", { name: /^continue/i })).toBeInTheDocument();

    const seed = screen.getByLabelText("Random seed");
    await user.clear(seed);
    await user.type(seed, "42");
    expect(screen.getByText("Restart to apply")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^restart/i }));
    expect(screen.getByText("Seed 42")).toBeInTheDocument();
    expect(screen.getByText(/restarted a 96 × 96 lattice with seed 42/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /restore defaults/i }));
    expect(seed).toHaveValue(2025);
    expect(screen.getByText("Seed 2025")).toBeInTheDocument();
  });

  it("advances the running model on an animation frame and cancels on unmount", async () => {
    const user = userEvent.setup();
    let frameCallback;
    window.requestAnimationFrame.mockImplementation((callback) => {
      frameCallback = callback;
      return 99;
    });
    const view = visit("/simulations/grain-growth");

    await user.click(await screen.findByRole("button", { name: /^start/i }));
    expect(frameCallback).toBeTypeOf("function");

    act(() => frameCallback(1000));
    expect(
      screen.getByRole("img", { name: /after 1 sweeps/i }),
    ).toBeInTheDocument();

    view.unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(99);
  });

  it("renders a useful not-found state", () => {
    visit("/unknown-experiment");

    expect(
      screen.getByRole("heading", { name: /this route is not part of the current model/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to projects/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
