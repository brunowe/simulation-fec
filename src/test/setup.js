import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: vi.fn(() => ({
    createImageData(width, height) {
      return {
        data: new Uint8ClampedArray(width * height * 4),
        height,
        width,
      };
    },
    putImageData: vi.fn(),
  })),
});

Object.defineProperty(window, "requestAnimationFrame", {
  configurable: true,
  value: vi.fn(() => 1),
});

Object.defineProperty(window, "cancelAnimationFrame", {
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: vi.fn(),
});
