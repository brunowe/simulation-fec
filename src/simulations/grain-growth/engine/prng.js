const UINT32_RANGE = 0x100000000;

function assertUint32(value, name = "seed") {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be an integer.`);
  }

  if (value < 0 || value >= UINT32_RANGE) {
    throw new RangeError(`${name} must be an unsigned 32-bit integer.`);
  }
}

export function createSeededRandom(seed) {
  assertUint32(seed);
  let state = seed >>> 0;

  function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  }

  return Object.freeze({
    getState() {
      return state;
    },

    next,

    nextInt(maxExclusive) {
      if (!Number.isInteger(maxExclusive)) {
        throw new TypeError("maxExclusive must be an integer.");
      }

      if (maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
        throw new RangeError(
          "maxExclusive must be between 1 and 2^32, inclusive.",
        );
      }

      return Math.floor(next() * maxExclusive);
    },
  });
}
