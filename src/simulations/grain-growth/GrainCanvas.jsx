import { useEffect, useMemo, useRef } from "react";

import { isBoundaryCell } from "./rendering";

const identityPalette = Object.freeze([
  Object.freeze([137, 91, 54]),
  Object.freeze([171, 93, 85]),
  Object.freeze([78, 96, 118]),
  Object.freeze([124, 83, 54]),
  Object.freeze([151, 69, 63]),
  Object.freeze([111, 121, 102]),
  Object.freeze([160, 106, 69]),
  Object.freeze([178, 107, 95]),
]);

function hslToRgb(hue, saturation, lightness) {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const h = hue / 60;
  const x = chroma * (1 - Math.abs((h % 2) - 1));
  let rgb;

  if (h < 1) rgb = [chroma, x, 0];
  else if (h < 2) rgb = [x, chroma, 0];
  else if (h < 3) rgb = [0, chroma, x];
  else if (h < 4) rgb = [0, x, chroma];
  else if (h < 5) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];

  const match = l - chroma / 2;
  return rgb.map((channel) => Math.round((channel + match) * 255));
}

function colorForGrain(grainId, seed, palette) {
  let hash = (Math.imul(grainId + 1, 2654435761) ^ seed) >>> 0;
  hash ^= hash >>> 16;

  if (palette === "identity") {
    return identityPalette[(hash >>> 0) % identityPalette.length];
  }

  const hue = hash % 360;
  const saturation = 53 + ((hash >>> 9) % 18);
  const lightness = 51 + ((hash >>> 17) % 12);
  return hslToRgb(hue, saturation, lightness);
}

export function GrainCanvas({ palette = "spectrum", snapshot }) {
  const canvasRef = useRef(null);
  const { config, counters, lattice, metrics } = snapshot;
  const colorMap = useMemo(() => {
    const colors = new Map();
    for (const grainId of lattice) {
      if (!colors.has(grainId)) {
        colors.set(grainId, colorForGrain(grainId, config.seed, palette));
      }
    }
    return colors;
  }, [config.seed, lattice, palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext?.("2d");
    if (!context) return;

    const image = context.createImageData(config.size, config.size);

    for (let index = 0; index < lattice.length; index += 1) {
      const boundary = isBoundaryCell(lattice, index, config.size);
      const color = colorMap.get(lattice[index]);
      const factor = boundary ? 0.34 : 0.92;
      const pixel = index * 4;

      image.data[pixel] = Math.round(color[0] * factor);
      image.data[pixel + 1] = Math.round(color[1] * factor);
      image.data[pixel + 2] = Math.round(color[2] * factor);
      image.data[pixel + 3] = 255;
    }

    context.putImageData(image, 0, 0);
  }, [colorMap, config.size, lattice]);

  return (
    <div className="grain-canvas-frame">
      <div className="grain-canvas-frame__topline">
        <span>State field / q(x, y)</span>
        <span>{config.size} × {config.size} lattice sites</span>
      </div>
      <canvas
        aria-label={`Grain lattice after ${counters.sweeps} sweeps with ${metrics.activeGrains} active grain labels.`}
        className="grain-canvas"
        height={config.size}
        ref={canvasRef}
        role="img"
        width={config.size}
      >
        A colored lattice visualization of the grain-growth model.
      </canvas>
      <div className="grain-canvas-frame__legend">
        <span><i className="legend-swatch legend-swatch--grain" /> Grain state</span>
        <span><i className="legend-swatch legend-swatch--boundary" /> Unlike-neighbor boundary</span>
      </div>
    </div>
  );
}
