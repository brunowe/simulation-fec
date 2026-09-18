import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import App from "./App";
import {
  grainGrowthReferences,
  modelAlgorithm,
  modelAssumptions,
  modelLimitations,
  modelParameters,
} from "./content/grainGrowth";

function visit(path) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("Bruno Weber - Simulation Lab", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = "";
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.setAttribute("name", "theme-color");
      document.head.append(themeColor);
    }
    themeColor.setAttribute("content", "#12100f");
    window.requestAnimationFrame.mockReset().mockImplementation(() => 1);
    window.cancelAnimationFrame.mockClear();
    window.scrollTo.mockClear();
  });

  it("uses dark by default and persists the selected theme", async () => {
    const user = userEvent.setup();
    const view = visit("/");
    const themeToggle = screen.getByRole("button", { name: "Switch to light theme" });

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#12100f",
    );
    expect(window.localStorage.getItem("simulation-lab-theme")).toBe("dark");

    await user.click(themeToggle);

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#f5efe5",
    );
    expect(window.localStorage.getItem("simulation-lab-theme")).toBe("light");
    expect(themeToggle).toHaveAccessibleName("Switch to dark theme");

    view.unmount();
    delete document.documentElement.dataset.theme;
    document.documentElement.style.colorScheme = "";
    visit("/");

    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    const restoredToggle = screen.getByRole("button", { name: "Switch to dark theme" });
    expect(restoredToggle).toBeInTheDocument();

    await user.click(restoredToggle);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#12100f",
    );
  });

  it("presents the platform identity and registry-driven catalogue", () => {
    visit("/");

    expect(
      screen.getByRole("heading", { name: /numerical models,\s*made explorable/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/bruno weber - simulation lab is/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Grain Growth Model" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Laser FEM" })).toBeInTheDocument();
    expect(screen.getAllByText("Experimental")).not.toHaveLength(0);
    expect(screen.getAllByText("Planned")).not.toHaveLength(0);
    expect(screen.queryByText(/cooling schedule explorer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/evidence boundary/i)).not.toBeInTheDocument();
    expect(document.querySelector(".brand__mark img")).toHaveAttribute(
      "src",
      "/simulation-lab-symbol-09.png",
    );
    expect(
      screen.getByRole("img", { name: /after 0 sweeps with 20 active grain labels/i }),
    ).toBeInTheDocument();
    expect(document.querySelector(".hero-specimen canvas.grain-canvas")).toBeInTheDocument();
    expect(screen.getByText("Engine snapshot")).toBeInTheDocument();
    expect(screen.getByText("Rendered by the working simulation engine")).toBeInTheDocument();
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
    const sectionIndex = screen.getByRole("navigation", { name: "On this page" });
    expect(within(sectionIndex).getByRole("link", { name: "Experiment" })).toHaveAttribute(
      "href",
      "#experiment",
    );

    await user.click(screen.getByRole("button", { name: /^step/i }));

    expect(
      screen.getByRole("img", { name: /after 1 sweeps/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/advanced exactly one monte carlo sweep/i)).toBeInTheDocument();
  });

  it("preserves the V5 scientific hierarchy and reveals technical details on request", async () => {
    const user = userEvent.setup();
    visit("/simulations/grain-growth");

    const scientificBasis = await screen.findByRole("region", {
      name: "Scientific basis",
    });
    expect(
      within(scientificBasis).getByRole("heading", {
        name: "Scientific basis",
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(
      within(scientificBasis).getByRole("heading", {
        name: "Boundary energy",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(
      within(scientificBasis).getByRole("heading", {
        name: "Update and acceptance",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "About the model" })).not.toBeInTheDocument();

    const algorithmSummary = within(scientificBasis).getByText(
      "Algorithm - one Monte Carlo sweep",
    );
    const algorithmDetails = algorithmSummary.closest("details");
    expect(algorithmDetails).not.toHaveAttribute("open");

    await user.click(algorithmSummary);

    expect(algorithmDetails).toHaveAttribute("open");
    expect(within(algorithmDetails).getAllByRole("listitem")).toHaveLength(
      modelAlgorithm.length,
    );

    const parametersSummary = within(scientificBasis).getByText("Parameters and units");
    const parametersDetails = parametersSummary.closest("details");
    expect(parametersDetails).not.toHaveAttribute("open");

    await user.click(parametersSummary);

    expect(parametersDetails).toHaveAttribute("open");
    const parameterRegion = within(parametersDetails).getByRole("region", {
      name: "Model parameters and units",
    });
    expect(within(parameterRegion).getAllByRole("row")).toHaveLength(
      modelParameters.length + 1,
    );

    const assumptionsSummary = within(scientificBasis).getByText("Assumptions");
    const assumptionsDetails = assumptionsSummary.closest("details");
    expect(
      within(scientificBasis).getByRole("heading", {
        name: "Assumptions",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(assumptionsDetails).not.toHaveAttribute("open");

    await user.click(assumptionsSummary);

    expect(assumptionsDetails).toHaveAttribute("open");
    expect(within(assumptionsDetails).getAllByRole("listitem")).toHaveLength(
      modelAssumptions.length,
    );

    const limitationsSummary = within(scientificBasis).getByText("Limitations");
    const limitationsDetails = limitationsSummary.closest("details");
    expect(
      within(scientificBasis).getByRole("heading", {
        name: "Limitations",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(limitationsDetails).not.toHaveAttribute("open");

    await user.click(limitationsSummary);

    expect(limitationsDetails).toHaveAttribute("open");
    expect(within(limitationsDetails).getAllByRole("listitem")).toHaveLength(
      modelLimitations.length,
    );
    expect(within(limitationsDetails).getByRole("note")).toBeInTheDocument();
  });

  it("keeps the real evidence, references, and navigation in the V5 closing layout", async () => {
    const user = userEvent.setup();
    visit("/simulations/grain-growth");

    const demonstration = screen.getByRole("region", {
      name: "What this demonstrates",
    });
    const demonstrationSummary = within(demonstration).getByText(
      "What this demonstrates",
    );
    const demonstrationDetails = demonstrationSummary.closest("details");
    expect(
      within(demonstration).getByRole("heading", {
        name: "What this demonstrates",
        level: 3,
      }),
    ).toBeInTheDocument();
    expect(demonstrationDetails).not.toHaveAttribute("open");

    await user.click(demonstrationSummary);

    expect(demonstrationDetails).toHaveAttribute("open");
    expect(demonstration).toHaveTextContent(/not calibrated to a material/i);
    expect(
      within(demonstration).getByRole("link", { name: "Back to project catalogue" }),
    ).toHaveAttribute("href", "/#projects");
    expect(
      within(demonstration).getByRole("link", { name: /^View source/i }),
    ).toHaveAttribute("href", "https://github.com/brunowe/simulation-fec");

    const references = screen.getByRole("region", { name: "References" });
    expect(within(references).getAllByRole("listitem")).toHaveLength(
      grainGrowthReferences.length,
    );
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
