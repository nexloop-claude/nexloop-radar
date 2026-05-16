import { useState } from 'react';
import { getMaturityLevel } from '../data/pillars';
import './HistoryScreen.css';

const HISTORY_KEY = 'nexloop_history';

const TYPE_LABELS = {
  digital:  'Maturidade Digital',
  business: 'Assessment de Negócio',
};

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function deleteEntry(id) {
  try {
    const history = loadHistory().filter(e => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

export default function HistoryScreen({ onViewReport, onClose }) {
  const [entries, setEntries] = useState(() => loadHistory());

  function handleDelete(id) {
    if (!window.confirm('Remover este relatório do histórico?')) return;
    deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <div className="nx-container-wide history-header-inner">
          <div>
            <h1 className="history-title">Repositório de Relatórios</h1>
            <p className="history-subtitle">{entries.length} {entries.length === 1 ? 'relatório salvo' : 'relatórios salvos'}</p>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            ← Voltar
          </button>
        </div>
      </div>

      <div className="nx-container-wide history-body">
        {entries.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="6" width="32" height="36" rx="3" stroke="#C4C4C4" strokeWidth="2"/>
                <line x1="15" y1="16" x2="33" y2="16" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="15" y1="22" x2="33" y2="22" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="15" y1="28" x2="24" y2="28" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="history-empty-text">Nenhum relatório gerado ainda.</p>
            <p className="history-empty-sub">Os relatórios aparecem aqui automaticamente após serem concluídos.</p>
          </div>
        ) : (
          <div className="history-list">
            {entries.map(entry => {
              const overallScore = entry.pillarResults?.length
                ? Math.round(entry.pillarResults.reduce((s, p) => s + p.score, 0) / entry.pillarResults.length)
                : null;
              const maturity = overallScore != null ? getMaturityLevel(overallScore) : null;
              const date = new Date(entry.timestamp).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              });

              return (
                <div key={entry.id} className="history-card">
                  <div className="history-card-left">
                    <div className="history-card-type">
                      {TYPE_LABELS[entry.assessmentType] || 'Assessment'}
                    </div>
                    <div className="history-card-company">
                      {entry.companyInfo?.company || '—'}
                    </div>
                    <div className="history-card-meta">
                      {entry.companyInfo?.sector && (
                        <span>{entry.companyInfo.sector}</span>
                      )}
                      {entry.companyInfo?.responsible && (
                        <>
                          <span className="history-dot">·</span>
                          <span>{entry.companyInfo.responsible}</span>
                        </>
                      )}
                      <span className="history-dot">·</span>
                      <span>{date}</span>
                    </div>
                  </div>

                  <div className="history-card-right">
                    {maturity && overallScore != null && (
                      <div className="history-score">
                        <span className="history-score-num" style={{ color: maturity.color }}>
                          {overallScore}%
                        </span>
                        <span className="history-score-label" style={{ color: maturity.color }}>
                          {maturity.label}
                        </span>
                      </div>
                    )}

                    <div className="history-card-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onViewReport(entry)}
                      >
                        Ver relatório
                      </button>
                      <button
                        className="btn btn-sm history-delete-btn"
                        onClick={() => handleDelete(entry.id)}
                        title="Remover do histórico"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
