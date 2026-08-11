import { describe, expect, it } from "vitest";

import { createSeededRandom } from "./prng.js";

describe("seeded random number generator", () => {
  it("reproduces the same sequence from the same seed", () => {
    const first = createSeededRandom(1);
    const second = createSeededRandom(1);

    expect(Array.from({ length: 20 }, () => first.next())).toEqual(
      Array.from({ length: 20 }, () => second.next()),
    );
  });

  it("locks the Mulberry32 sequence for cross-run reproducibility", () => {
    const random = createSeededRandom(1);

    expect(Array.from({ length: 5 }, () => random.next())).toEqual([
      0.6270739405881613,
      0.002735721180215478,
      0.5274470399599522,
      0.9810509674716741,
      0.9683778982143849,
    ]);
  });

  it("produces a different sequence for a different seed", () => {
    const first = createSeededRandom(10);
    const second = createSeededRandom(11);

    expect(Array.from({ length: 10 }, () => first.next())).not.toEqual(
      Array.from({ length: 10 }, () => second.next()),
    );
  });

  it("returns bounded floating-point and integer values", () => {
    const random = createSeededRandom(0xffffffff);
    const values = Array.from({ length: 200 }, () => random.next());
    const integers = Array.from({ length: 200 }, () => random.nextInt(7));

    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
    expect(
      integers.every(
        (value) => Number.isInteger(value) && value >= 0 && value < 7,
      ),
    ).toBe(true);
  });

  it("exposes the advancing internal state", () => {
    const random = createSeededRandom(5);
    const initialState = random.getState();
    random.next();

    expect(initialState).toBe(5);
    expect(random.getState()).not.toBe(initialState);
  });

  it.each([-1, 0x100000000, 1.5, Number.NaN])(
    "rejects invalid seed %s",
    (seed) => {
      expect(() => createSeededRandom(seed)).toThrow();
    },
  );

  it.each([0, -1, 1.5, 0x100000001])(
    "rejects invalid integer bound %s",
    (bound) => {
      expect(() => createSeededRandom(1).nextInt(bound)).toThrow();
    },
  );
});
