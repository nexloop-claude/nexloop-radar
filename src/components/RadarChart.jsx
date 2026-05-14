import './RadarChart.css';

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = 130;
const LEVELS = 5;

function polarToCartesian(angle, r) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function buildPolygon(points) {
  return points.map(p => `${p.x},${p.y}`).join(' ');
}

export default function RadarChart({ pillars, compact = false }) {
  if (!pillars || pillars.length < 3) return null;

  const n = pillars.length;
  const angleStep = 360 / n;
  const size = compact ? 260 : SIZE;
  const center = size / 2;
  const radius = compact ? 95 : RADIUS;

  function pt(angle, r) {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  }

  // Grid polygons (background levels)
  const gridPolygons = Array.from({ length: LEVELS }, (_, i) => {
    const r = (radius * (i + 1)) / LEVELS;
    const pts = pillars.map((_, idx) => pt(angleStep * idx, r));
    return buildPolygon(pts);
  });

  // Axis lines
  const axisLines = pillars.map((_, idx) => {
    const end = pt(angleStep * idx, radius);
    return { x1: center, y1: center, x2: end.x, y2: end.y };
  });

  // Data polygon
  const dataPoints = pillars.map((p, idx) => {
    const r = (p.score / 100) * radius;
    return pt(angleStep * idx, r);
  });

  // Labels (positioned outside radius)
  const labelOffset = compact ? 28 : 36;
  const labelPoints = pillars.map((p, idx) => {
    const pos = pt(angleStep * idx, radius + labelOffset);
    const angle = angleStep * idx;
    let anchor = 'middle';
    if (angle > 10 && angle < 170) anchor = 'start';
    else if (angle > 190 && angle < 350) anchor = 'end';
    return { ...pos, anchor, label: p.name, score: p.score, icon: p.icon };
  });

  const fontSize = compact ? 9 : 11;
  const scoreFontSize = compact ? 10 : 12;

  return (
    <div className="radar-chart-wrap">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="radar-svg"
      >
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DB05FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#18B8FF" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DB05FF" />
            <stop offset="100%" stopColor="#18B8FF" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        {gridPolygons.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill={i % 2 === 0 ? '#F8F8FC' : '#FFFFFF'}
            stroke="#E8E4F0"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((l, i) => (
          <line key={i} {...l} stroke="#E8E4F0" strokeWidth="1.5" />
        ))}

        {/* Level labels */}
        {[20, 40, 60, 80, 100].map((val, i) => {
          const r = (radius * (i + 1)) / LEVELS;
          const pos = pt(-90 + 90, r);
          return (
            <text
              key={val}
              x={center + 4}
              y={center - r + 4}
              fontSize="8"
              fill="#AAAABB"
              fontFamily="Poppins, sans-serif"
            >
              {val}%
            </text>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={buildPolygon(dataPoints)}
          fill="url(#radarFill)"
          stroke="url(#radarStroke)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#DB05FF" strokeWidth="2" />
        ))}

        {/* Labels */}
        {labelPoints.map((lp, i) => (
          <g key={i}>
            <text
              x={lp.x}
              y={lp.y - 2}
              textAnchor={lp.anchor}
              fontSize={fontSize}
              fontFamily="Poppins, sans-serif"
              fontWeight="600"
              fill="#1E1E1E"
            >
              {lp.icon} {lp.label.length > 18 ? lp.label.substring(0, 16) + '…' : lp.label}
            </text>
            <text
              x={lp.x}
              y={lp.y + scoreFontSize + 1}
              textAnchor={lp.anchor}
              fontSize={scoreFontSize}
              fontFamily="Poppins, sans-serif"
              fontWeight="700"
              fill="#18B8FF"
            >
              {lp.score}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
