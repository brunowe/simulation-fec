import { P5Canvas } from "@p5-wrapper/react";

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 440;
const PALETTE = [
  [94, 231, 231],
  [255, 177, 90],
  [137, 126, 255],
  [104, 211, 145],
  [244, 126, 175],
];

function seededRandom(seed) {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function createGrains() {
  const random = seededRandom(42);

  return Array.from({ length: 48 }, (_, index) => ({
    baseRadius: 4 + random() * 5,
    color: PALETTE[index % PALETTE.length],
    maxRadius: 24 + random() * 50,
    x: 20 + random() * (CANVAS_WIDTH - 40),
    y: 20 + random() * (CANVAS_HEIGHT - 40),
  }));
}

function microstructureSketch(p5) {
  const grains = createGrains();
  let progress = 0;

  p5.setup = () => {
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p5.pixelDensity(1);
    p5.noLoop();
  };

  p5.updateWithProps = (props) => {
    progress = Number.isFinite(props.progress)
      ? Math.min(1, Math.max(0, props.progress))
      : 0;
    p5.redraw();
  };

  p5.draw = () => {
    const glow = 16 + progress * 14;
    p5.background(7, glow, 31 + progress * 10);

    p5.stroke(255, 255, 255, 12);
    p5.strokeWeight(1);
    for (let x = 0; x <= CANVAS_WIDTH; x += 40) {
      p5.line(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += 40) {
      p5.line(0, y, CANVAS_WIDTH, y);
    }

    grains.forEach((grain, index) => {
      const radius =
        grain.baseRadius +
        (grain.maxRadius - grain.baseRadius) * Math.pow(progress, 0.72);
      const [red, green, blue] = grain.color;

      p5.noStroke();
      p5.fill(red, green, blue, 30 + progress * 34);
      p5.circle(grain.x, grain.y, radius * 2.15);
      p5.fill(red, green, blue, 115);
      p5.circle(grain.x, grain.y, Math.max(3, radius * 0.17));
      p5.noFill();
      p5.stroke(red, green, blue, 85 + progress * 70);
      p5.strokeWeight(1.25);
      p5.circle(grain.x, grain.y, radius * 2);
    });
  };
}

export function MicrostructureCanvas({ progress }) {
  return (
    <div
      aria-label={`Microstructure-inspired pattern at ${Math.round(progress * 100)} percent progress.`}
      className="microstructure-canvas"
      role="img"
    >
      <P5Canvas progress={progress} sketch={microstructureSketch} />
      <div aria-hidden="true" className="canvas-legend">
        <span>Conceptual pattern</span>
        <strong>{Math.round(progress * 100)}%</strong>
      </div>
    </div>
  );
}
