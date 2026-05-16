import './ProgressBar.css';

export default function ProgressBar({ current, total, pillarIndex, totalPillars, pillarName, lastSavedAt }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  const savedTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="nx-progress-section">
      <div className="nx-container-wide">
        <div className="nx-progress-top">
          <span className="nx-progress-label">
            {pillarName && <strong>{pillarName}</strong>}
          </span>
          <span className="nx-progress-counters">
            {savedTime && (
              <span className="nx-progress-saved" title={`Salvo às ${savedTime}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3.5 6l1.8 1.8 3-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Salvo {savedTime}
              </span>
            )}
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
