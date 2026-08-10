import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

vi.mock("@p5-wrapper/react", () => ({
  P5Canvas: ({ progress }) => (
    <div data-progress={progress} data-testid="p5-canvas" />
  ),
}));

describe("Cooling Schedule Explorer", () => {
  it("exposes labeled inputs and the initial schedule summary", () => {
    render(<App />);

    expect(screen.getByLabelText(/initial temperature/i)).toHaveValue(900);
    expect(screen.getByLabelText(/final temperature/i)).toHaveValue(700);
    expect(screen.getByLabelText(/cooling rate/i)).toHaveValue(10);
    expect(screen.getByText("20 s")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /linear cooling curve/i }),
    ).toBeInTheDocument();
  });

  it("runs a valid schedule and updates the derived duration", async () => {
    const user = userEvent.setup();
    render(<App />);

    const finalTemperature = screen.getByLabelText(/final temperature/i);
    const coolingRate = screen.getByLabelText(/cooling rate/i);

    await user.clear(finalTemperature);
    await user.type(finalTemperature, "600");
    await user.clear(coolingRate);
    await user.type(coolingRate, "20");
    await user.click(screen.getByRole("button", { name: /run schedule/i }));

    expect(screen.getByText("15 s")).toBeInTheDocument();
    expect(screen.getByText(/running a 15 s linear cooling schedule/i)).toBeInTheDocument();
    expect(screen.getByTestId("p5-canvas")).toHaveAttribute("data-progress");
  });

  it("associates validation errors with invalid fields", async () => {
    const user = userEvent.setup();
    render(<App />);

    const finalTemperature = screen.getByLabelText(/final temperature/i);
    await user.clear(finalTemperature);
    await user.type(finalTemperature, "950");
    await user.click(screen.getByRole("button", { name: /run schedule/i }));

    expect(finalTemperature).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByText(/final temperature must be lower/i),
    ).toBeInTheDocument();
    expect(screen.getByText("20 s")).toBeInTheDocument();
  });
});
