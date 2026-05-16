import './ResumeScreen.css';

const TYPE_LABELS = {
  digital:  'Assessment de Maturidade Digital',
  business: 'Assessment de Negócio',
};

export default function ResumeScreen({ meta, onResume, onDiscard }) {
  const savedDate = meta.lastSavedAt
    ? new Date(meta.lastSavedAt).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div className="resume-page">
      <div className="resume-card">

        <div className="resume-icon">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#18B8FF"/>
                <stop offset="100%" stopColor="#DB05FF"/>
              </linearGradient>
            </defs>
            <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4Z" stroke="url(#rg)" strokeWidth="2" fill="none"/>
            <path d="M16 24l6 6 10-12" stroke="url(#rg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="resume-label">Assessment em andamento</div>
        <h1 className="resume-company">{meta.company}</h1>
        <p className="resume-type">{TYPE_LABELS[meta.assessmentType] || 'Assessment'}</p>

        <div className="resume-stats">
          <div className="resume-stat">
            <span className="resume-stat-value">{meta.answered}</span>
            <span className="resume-stat-desc">respostas salvas</span>
          </div>
          <div className="resume-stat-divider" />
          <div className="resume-stat">
            <span className="resume-stat-value">
              {meta.currentPillarIndex + 1}/{meta.totalPillars}
            </span>
            <span className="resume-stat-desc">pilares concluídos</span>
          </div>
        </div>

        {savedDate && (
          <p className="resume-saved-at">
            Último salvamento: <strong>{savedDate}</strong>
          </p>
        )}

        <div className="resume-actions">
          <button className="btn btn-primary btn-lg" onClick={onResume}>
            Continuar de onde parei →
          </button>
          <button className="btn btn-secondary" onClick={onDiscard}>
            Descartar e iniciar novo assessment
          </button>
        </div>
      </div>
    </div>
  );
}
