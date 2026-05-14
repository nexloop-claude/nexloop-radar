import './AnalysisScreen.css';

export default function AnalysisScreen({ progress, statusItems }) {
  return (
    <div className="analysis-page">
      <div className="analysis-inner">
        <div className="analysis-logo">
          <span className="analysis-logo-nexloop">NEXLOOP</span>
          <span className="analysis-logo-radar">RADAR</span>
        </div>

        <div className="analysis-icon">🤖</div>

        <h2 className="analysis-title">Analisando respostas com IA...</h2>
        <p className="analysis-subtitle">
          O Claude está avaliando cada pilar e gerando recomendações personalizadas.
          Isso pode levar alguns instantes.
        </p>

        <div className="analysis-progress-wrap">
          <div className="analysis-progress-bar">
            <div className="analysis-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="analysis-pct">{progress}%</span>
        </div>

        <div className="analysis-status-list">
          {statusItems.map((item, i) => (
            <div key={i} className={`analysis-status-item ${item.done ? 'done' : 'pending'}`}>
              <span className="analysis-status-icon">
                {item.done ? '✓' : i === statusItems.filter(x => x.done).length ? '◌' : '○'}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <p className="analysis-note">
          Não feche esta janela enquanto a análise estiver em andamento.
        </p>
      </div>
    </div>
  );
}
