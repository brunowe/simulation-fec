const WIDTH = 640;
const HEIGHT = 280;
const PADDING = { bottom: 42, left: 62, right: 24, top: 24 };

function scalePoint(point, config, durationSeconds) {
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const temperatureRange =
    config.initialTemperature - config.finalTemperature;

  return {
    x:
      PADDING.left +
      (durationSeconds === 0 ? 0 : point.seconds / durationSeconds) *
        chartWidth,
    y:
      PADDING.top +
      ((config.initialTemperature - point.temperature) / temperatureRange) *
        chartHeight,
  };
}

export function CoolingChart({ config, curve, durationSeconds, progress }) {
  const path = curve
    .map((point, index) => {
      const { x, y } = scalePoint(point, config, durationSeconds);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const currentPoint = scalePoint(
    {
      seconds: durationSeconds * progress,
      temperature:
        config.initialTemperature -
        (config.initialTemperature - config.finalTemperature) * progress,
    },
    config,
    durationSeconds,
  );
  const horizontalGridLines = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    return {
      temperature:
        config.initialTemperature -
        (config.initialTemperature - config.finalTemperature) * ratio,
      y:
        PADDING.top +
        ratio * (HEIGHT - PADDING.top - PADDING.bottom),
    };
  });

  return (
    <div className="chart-shell">
      <svg
        aria-label={`Linear cooling curve from ${config.initialTemperature} to ${config.finalTemperature} degrees Celsius over ${durationSeconds.toFixed(1)} seconds.`}
        className="cooling-chart"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <title>Linear cooling schedule</title>
        <defs>
          <linearGradient id="curve-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffb15a" />
            <stop offset="100%" stopColor="#5ee7e7" />
          </linearGradient>
        </defs>

        {horizontalGridLines.map((line) => (
          <g key={line.y}>
            <line
              className="chart-grid-line"
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={line.y}
              y2={line.y}
            />
            <text
              className="chart-axis-label"
              textAnchor="end"
              x={PADDING.left - 12}
              y={line.y + 4}
            >
              {Math.round(line.temperature)}°
            </text>
          </g>
        ))}

        <line
          className="chart-axis"
          x1={PADDING.left}
          x2={PADDING.left}
          y1={PADDING.top}
          y2={HEIGHT - PADDING.bottom}
        />
        <line
          className="chart-axis"
          x1={PADDING.left}
          x2={WIDTH - PADDING.right}
          y1={HEIGHT - PADDING.bottom}
          y2={HEIGHT - PADDING.bottom}
        />

        <path className="chart-curve" d={path} />
        <line
          className="chart-progress-line"
          x1={currentPoint.x}
          x2={currentPoint.x}
          y1={PADDING.top}
          y2={HEIGHT - PADDING.bottom}
        />
        <circle
          className="chart-current-point"
          cx={currentPoint.x}
          cy={currentPoint.y}
          r="7"
        />

        <text
          className="chart-axis-title"
          textAnchor="middle"
          x={(PADDING.left + WIDTH - PADDING.right) / 2}
          y={HEIGHT - 10}
        >
          Time (seconds)
        </text>
        <text
          className="chart-axis-label"
          textAnchor="start"
          x={PADDING.left}
          y={HEIGHT - PADDING.bottom + 24}
        >
          0
        </text>
        <text
          className="chart-axis-label"
          textAnchor="end"
          x={WIDTH - PADDING.right}
          y={HEIGHT - PADDING.bottom + 24}
        >
          {Number(durationSeconds.toFixed(1))}
        </text>
      </svg>
    </div>
  );
}
