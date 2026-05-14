import './ProgressBar.css';

export default function ProgressBar({ current, total, pillarIndex, totalPillars, pillarName }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="nx-progress-section">
      <div className="nx-container-wide">
        <div className="nx-progress-top">
          <span className="nx-progress-label">
            {pillarName && <strong>{pillarName}</strong>}
          </span>
          <span className="nx-progress-counters">
            <span className="nx-progress-pillar">
              Pilar {pillarIndex + 1} de {totalPillars}
            </span>
            <span className="nx-progress-q">
              Pergunta {current} de {total}
            </span>
          </span>
        </div>
        <div className="nx-progress-wrap">
          <div className="nx-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
