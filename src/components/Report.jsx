import RadarChart from './RadarChart';
import { getMaturityLevel } from '../data/pillars';
import './Report.css';

const IMPACT_COLORS = {
  'Alto': '#EF4444',
  'Médio': '#EAB308',
  'Baixo': '#22C55E',
};

const TIMEFRAME_COLORS = {
  '0-3 meses': '#18B8FF',
  '3-12 meses': '#DB05FF',
  '12-24 meses': '#510B61',
};

export default function Report({ companyInfo, pillarResults, reportData, onReset }) {
  const overallScore = Math.round(
    pillarResults.reduce((s, p) => s + p.score, 0) / pillarResults.length
  );
  const maturity = getMaturityLevel(overallScore);
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const sortedPillars = [...pillarResults].sort((a, b) => b.score - a.score);

  return (
    <div className="report-root">
      {/* Action buttons (no print) */}
      <div className="report-actions no-print">
        <div className="nx-container-wide">
          <div className="report-actions-inner">
            <span className="report-actions-label">Relatório gerado com sucesso!</span>
            <div className="report-actions-btns">
              <button className="btn btn-secondary" onClick={() => window.print()}>
                🖨️ Imprimir / Salvar PDF
              </button>
              <button className="btn btn-primary" onClick={onReset}>
                ↩ Novo Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="report-document">
        {/* TOP LINE */}
        <div className="report-topline" />

        {/* HEADER */}
        <div className="report-header">
          <div className="report-confidential">CONFIDENCIAL</div>
          <div className="report-brand">
            <span className="report-logo-nexloop">NEXLOOP</span>
            <span className="report-logo-radar">RADAR</span>
          </div>
          <h1 className="report-title">Assessment de Maturidade Digital</h1>
          <div className="report-meta">
            <span className="report-company">{companyInfo.company}</span>
            <span className="report-dot">·</span>
            <span>{companyInfo.sector}</span>
            <span className="report-dot">·</span>
            <span>{dateStr}</span>
          </div>
          {companyInfo.responsible && (
            <p className="report-responsible">Responsável: {companyInfo.responsible}</p>
          )}
        </div>

        {/* EXECUTIVE SUMMARY */}
        {reportData?.executiveSummary && (
          <section className="report-section">
            <h2 className="report-section-title">Sumário Executivo</h2>
            <div className="report-card">
              <p className="report-exec-text">{reportData.executiveSummary}</p>
            </div>
          </section>
        )}

        {/* OVERALL SCORE */}
        <section className="report-section">
          <h2 className="report-section-title">Índice Geral de Maturidade</h2>
          <div className="report-score-card report-card">
            <div className="report-score-big">
              <span className="report-score-number">{overallScore}%</span>
              <div className="report-score-right">
                <span className="report-maturity-badge" style={{ background: maturity.color + '18', color: maturity.color, border: `2px solid ${maturity.color}40` }}>
                  {maturity.label}
                </span>
                <p className="report-maturity-desc">{maturity.description}</p>
              </div>
            </div>
            <div className="report-score-bar-wrap">
              <div className="report-score-bar-fill" style={{ width: `${overallScore}%` }} />
            </div>
          </div>
        </section>

        {/* RADAR CHART */}
        <section className="report-section report-section-chart">
          <h2 className="report-section-title">Visão Geral por Pilar</h2>
          <div className="report-card report-chart-card">
            <RadarChart pillars={pillarResults} />
          </div>
        </section>

        {/* PILLAR RESULTS */}
        <section className="report-section">
          <h2 className="report-section-title">Resultado por Pilar</h2>
          <div className="report-pillars-grid">
            {sortedPillars.map(pillar => {
              const level = getMaturityLevel(pillar.score);
              return (
                <div key={pillar.id} className="report-pillar-card report-card">
                  <div className="report-pillar-header">
                    <div className="report-pillar-name">
                      <span className="report-pillar-icon">{pillar.icon}</span>
                      <span>{pillar.name}</span>
                    </div>
                    <div className="report-pillar-score-wrap">
                      <span className="report-pillar-score" style={{ color: level.color }}>
                        {pillar.score}%
                      </span>
                      <span className="report-pillar-level" style={{ color: level.color }}>
                        {level.label}
                      </span>
                    </div>
                  </div>

                  <div className="report-pillar-bar-wrap">
                    <div
                      className="report-pillar-bar-fill"
                      style={{ width: `${pillar.score}%`, background: level.color }}
                    />
                  </div>

                  {pillar.summary && (
                    <p className="report-pillar-summary">{pillar.summary}</p>
                  )}

                  <div className="report-pillar-points">
                    {pillar.strengths?.length > 0 && (
                      <div className="report-points-group">
                        <span className="report-points-label report-points-green">✓ Pontos Fortes</span>
                        <ul className="report-points-list">
                          {pillar.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pillar.weaknesses?.length > 0 && (
                      <div className="report-points-group">
                        <span className="report-points-label report-points-orange">⚡ Oportunidades</span>
                        <ul className="report-points-list">
                          {pillar.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        {reportData?.recommendations?.length > 0 && (
          <section className="report-section">
            <h2 className="report-section-title">Principais Recomendações</h2>
            <div className="report-recs">
              {reportData.recommendations.map((rec, i) => (
                <div key={i} className="report-rec-card report-card">
                  <div className="report-rec-header">
                    <span className="report-rec-num">{i + 1}</span>
                    <div className="report-rec-meta">
                      <h3 className="report-rec-title">{rec.title}</h3>
                      <div className="report-rec-tags">
                        {rec.impact && (
                          <span className="report-tag" style={{ color: IMPACT_COLORS[rec.impact] || '#666', background: (IMPACT_COLORS[rec.impact] || '#666') + '15' }}>
                            Impacto: {rec.impact}
                          </span>
                        )}
                        {rec.timeframe && (
                          <span className="report-tag" style={{ color: TIMEFRAME_COLORS[rec.timeframe] || '#666', background: (TIMEFRAME_COLORS[rec.timeframe] || '#666') + '15' }}>
                            {rec.timeframe}
                          </span>
                        )}
                        {rec.pillar && (
                          <span className="report-tag report-tag-pillar">{rec.pillar}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="report-rec-desc">{rec.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ROADMAP */}
        {reportData?.roadmap && (
          <section className="report-section">
            <h2 className="report-section-title">Roadmap Sugerido</h2>
            <div className="report-roadmap">
              {[
                { key: 'shortTerm',  label: 'Curto Prazo',  period: '0–3 meses',   color: '#18B8FF' },
                { key: 'midTerm',    label: 'Médio Prazo',  period: '3–12 meses',  color: '#DB05FF' },
                { key: 'longTerm',   label: 'Longo Prazo',  period: '1–2 anos',    color: '#510B61' },
              ].map(phase => (
                <div key={phase.key} className="report-roadmap-phase report-card">
                  <div className="report-phase-header" style={{ borderLeftColor: phase.color }}>
                    <span className="report-phase-label" style={{ color: phase.color }}>{phase.label}</span>
                    <span className="report-phase-period">{phase.period}</span>
                  </div>
                  <ul className="report-roadmap-list">
                    {(reportData.roadmap[phase.key] || []).map((item, i) => (
                      <li key={i} className="report-roadmap-item">
                        <div className="report-roadmap-dot" style={{ background: phase.color }} />
                        <div>
                          <strong>{item.action}</strong>
                          {item.description && <p>{item.description}</p>}
                          {item.owner && <span className="report-roadmap-owner">👤 {item.owner}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="report-footer">
          <div className="report-footer-brand">
            <span className="report-logo-nexloop" style={{ fontSize: 14 }}>NEXLOOP</span>
            <span style={{ color: '#888' }}>· Empowering Your Business · nexloop.tech</span>
          </div>
          <p className="report-footer-note">
            Este relatório foi gerado com suporte de Inteligência Artificial (Anthropic Claude) · {dateStr}
          </p>
        </footer>
      </div>

      {/* Bottom actions */}
      <div className="report-bottom-actions no-print">
        <div className="nx-container">
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '32px 0' }}>
            <button className="btn btn-secondary btn-lg" onClick={() => window.print()}>
              🖨️ Imprimir / Salvar PDF
            </button>
            <button className="btn btn-primary btn-lg" onClick={onReset}>
              ↩ Novo Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
