import { useState } from 'react';
import { PILLARS, getMaturityLevel } from '../data/pillars';
import { BUSINESS_PILLARS } from '../data/businessPillars';
import './HistoryScreen.css';

const HISTORY_KEY = 'nexloop_history';
const DRAFTS_KEY  = 'nexloop_drafts';

const TYPE_LABELS = {
  digital:  'Maturidade Digital',
  business: 'Assessment de Negócio',
};

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    const all = raw ? JSON.parse(raw) : [];
    return all.filter(d => d.step && d.step !== 'setup' && d.step !== 'report');
  } catch { return []; }
}

function deleteHistoryEntry(id) {
  try {
    const history = loadHistory().filter(e => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

function getDraftProgress(draft) {
  const allPillars = draft.assessmentType === 'business' ? BUSINESS_PILLARS : PILLARS;
  const selected = allPillars.filter(p => (draft.selectedPillarIds || []).includes(p.id));
  const totalQ = selected.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredQ = Object.values(draft.answers || {})
    .filter(a => a.text?.trim() || a.audioTranscript?.trim()).length;
  const currentPillarName = selected[draft.currentPillarIndex || 0]?.name || '';
  return { answeredQ, totalQ, currentPillarName, totalPillars: selected.length };
}

function IconEmpty() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="32" height="36" rx="3" stroke="#C4C4C4" strokeWidth="2"/>
      <line x1="15" y1="16" x2="33" y2="16" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="22" x2="33" y2="22" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="28" x2="24" y2="28" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="#C4C4C4" strokeWidth="2"/>
      <path d="M24 14v10l6 4" stroke="#C4C4C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function HistoryScreen({ onViewReport, onClose, onResumeDraft, onDeleteDraft }) {
  const initialDrafts = loadDrafts();
  const [drafts, setDrafts]   = useState(initialDrafts);
  const [entries, setEntries] = useState(() => loadHistory());
  const [tab, setTab]         = useState(initialDrafts.length > 0 ? 'inprogress' : 'completed');

  function handleClearAllHistory() {
    if (!window.confirm(`Apagar todos os ${entries.length} relatórios concluídos? Esta ação não pode ser desfeita.`)) return;
    try { localStorage.setItem('nexloop_history', JSON.stringify([])); } catch { /* ignore */ }
    setEntries([]);
  }

  function handleClearAllDrafts() {
    if (!window.confirm(`Excluir todos os ${drafts.length} assessments em andamento? As respostas serão perdidas.`)) return;
    drafts.forEach(d => onDeleteDraft(d.id));
    setDrafts([]);
  }

  function handleDeleteHistory(id) {
    if (!window.confirm('Remover este relatório do histórico?')) return;
    deleteHistoryEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function handleDeleteDraft(id) {
    if (!window.confirm('Excluir este assessment em andamento? As respostas serão perdidas.')) return;
    onDeleteDraft(id);
    setDrafts(prev => prev.filter(d => d.id !== id));
  }

  return (
    <div className="history-page">

      {/* ── Page header ── */}
      <div className="history-header">
        <div className="nx-container-wide history-header-inner">
          <div>
            <h1 className="history-title">Assessments</h1>
            <p className="history-subtitle">
              {drafts.length} em andamento · {entries.length} {entries.length === 1 ? 'concluído' : 'concluídos'}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>← Voltar</button>
        </div>

        {/* ── Tabs ── */}
        <div className="nx-container-wide">
          <div className="history-tabs">
            <button
              className={`history-tab${tab === 'inprogress' ? ' active' : ''}`}
              onClick={() => setTab('inprogress')}
            >
              Em andamento
              {drafts.length > 0 && (
                <span className="history-tab-badge">{drafts.length}</span>
              )}
            </button>
            <button
              className={`history-tab${tab === 'completed' ? ' active' : ''}`}
              onClick={() => setTab('completed')}
            >
              Concluídos
              {entries.length > 0 && (
                <span className="history-tab-badge history-tab-badge-muted">{entries.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="nx-container-wide history-body">

        {/* ── Em andamento ── */}
        {tab === 'inprogress' && (
          <>
          {drafts.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="btn btn-sm history-delete-btn" onClick={handleClearAllDrafts}>
                Excluir todos os rascunhos
              </button>
            </div>
          )}
          {drafts.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon"><IconClock /></div>
              <p className="history-empty-text">Nenhum assessment em andamento.</p>
              <p className="history-empty-sub">
                Inicie um assessment e ele aparecerá aqui para ser retomado quando quiser — inclusive em dias diferentes.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {drafts.map(draft => {
                const { answeredQ, totalQ, currentPillarName } = getDraftProgress(draft);
                const pct = totalQ > 0 ? Math.round((answeredQ / totalQ) * 100) : 0;
                const savedDate = draft.lastSavedAt
                  ? new Date(draft.lastSavedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })
                  : '—';
                return (
                  <div key={draft.id} className="history-card history-card-draft">
                    <div className="history-card-left">
                      <div className="history-card-type history-card-type-draft">
                        {TYPE_LABELS[draft.assessmentType] || 'Assessment'} · Em andamento
                      </div>
                      <div className="history-card-company">
                        {draft.companyInfo?.company || '—'}
                      </div>
                      <div className="history-card-meta">
                        {draft.companyInfo?.sector && <span>{draft.companyInfo.sector}</span>}
                        {draft.companyInfo?.responsible && (
                          <>
                            <span className="history-dot">·</span>
                            <span>{draft.companyInfo.responsible}</span>
                          </>
                        )}
                        <span className="history-dot">·</span>
                        <span>Salvo em {savedDate}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="draft-progress-wrap">
                        <div className="draft-progress-track">
                          <div
                            className="draft-progress-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="draft-progress-label">
                          {answeredQ}/{totalQ} respostas ({pct}%)
                          {currentPillarName && ` · Pilar atual: ${currentPillarName}`}
                        </span>
                      </div>
                    </div>

                    <div className="history-card-right">
                      <div className="history-card-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onResumeDraft(draft)}
                        >
                          Retomar →
                        </button>
                        <button
                          className="btn btn-sm history-delete-btn"
                          onClick={() => handleDeleteDraft(draft.id)}
                          title="Excluir rascunho"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </>
        )}

        {/* ── Concluídos ── */}
        {tab === 'completed' && (
          <>
          {entries.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="btn btn-sm history-delete-btn" onClick={handleClearAllHistory}>
                Apagar todos os relatórios
              </button>
            </div>
          )}
          {entries.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon"><IconEmpty /></div>
              <p className="history-empty-text">Nenhum relatório gerado ainda.</p>
              <p className="history-empty-sub">
                Os relatórios aparecem aqui automaticamente após serem concluídos.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {entries.map(entry => {
                const overallScore = entry.pillarResults?.length
                  ? Math.round(
                      entry.pillarResults.reduce((s, p) => s + p.score, 0) /
                      entry.pillarResults.length
                    )
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
                        {entry.companyInfo?.sector && <span>{entry.companyInfo.sector}</span>}
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
                          onClick={() => handleDeleteHistory(entry.id)}
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
          </>
        )}
      </div>
    </div>
  );
}
