import { useState } from 'react';
import { PILLARS, SECTORS } from '../data/pillars';
import './SetupScreen.css';

const DEFAULT_PILLARS = ['infrastructure', 'cybersecurity', 'data_bi', 'digital_transformation', 'ai_adoption'];

export default function SetupScreen({ onStart, hasSaved, onResume }) {
  const [company, setCompany] = useState('');
  const [responsible, setResponsible] = useState('');
  const [sector, setSector] = useState('Construção Civil');
  const [selectedIds, setSelectedIds] = useState(DEFAULT_PILLARS);
  const [error, setError] = useState('');

  function togglePillar(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function handleStart() {
    if (!company.trim()) { setError('Informe o nome da empresa.'); return; }
    if (selectedIds.length < 2) { setError('Selecione pelo menos 2 pilares.'); return; }
    const hasKey = !!localStorage.getItem('nexloop_api_key');
    if (!hasKey) { setError('Configure a API Key Anthropic antes de iniciar (botão ⚙️ no topo).'); return; }
    setError('');
    onStart({ company: company.trim(), responsible: responsible.trim(), sector }, selectedIds);
  }

  return (
    <div className="setup-page">
      <div className="setup-hero">
        <div className="nx-container">
          <div className="setup-hero-inner">
            <div className="setup-badge nx-badge nx-badge-grad">Assessment de Maturidade Digital</div>
            <h1 className="setup-title">
              Avalie a maturidade digital da sua empresa com precisão e inteligência.
            </h1>
            <p className="setup-subtitle">
              Selecione os pilares, responda as perguntas por texto ou áudio,
              e receba um relatório completo gerado por IA.
            </p>
          </div>
        </div>
      </div>

      <div className="setup-main nx-container">
        {hasSaved && (
          <div className="setup-resume-banner">
            <div>
              <strong>Assessment em andamento encontrado</strong>
              <p>Você tem um assessment não finalizado salvo localmente.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={onResume}>
              Continuar →
            </button>
          </div>
        )}

        <div className="setup-grid">
          {/* Form */}
          <div className="setup-form-section">
            <h2 className="setup-section-title">Informações da Empresa</h2>

            <div className="nx-field">
              <label className="nx-label">Nome da Empresa *</label>
              <input
                className="nx-input"
                type="text"
                placeholder="Ex: Construtora ABC"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>

            <div className="nx-field">
              <label className="nx-label">Responsável pelo Assessment</label>
              <input
                className="nx-input"
                type="text"
                placeholder="Ex: João Silva (Diretor de TI)"
                value={responsible}
                onChange={e => setResponsible(e.target.value)}
              />
            </div>

            <div className="nx-field">
              <label className="nx-label">Setor da Empresa</label>
              <select
                className="nx-select"
                value={sector}
                onChange={e => setSector(e.target.value)}
              >
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="setup-info-box">
              <div className="setup-info-icon">📊</div>
              <div>
                <strong>Como funciona?</strong>
                <p>Para cada pilar selecionado, você responderá 5-6 perguntas por texto ou áudio.
                   A IA analisará as respostas e gerará um relatório com pontuação e recomendações.</p>
              </div>
            </div>
          </div>

          {/* Pillar selection */}
          <div className="setup-pillars-section">
            <h2 className="setup-section-title">
              Pilares a Avaliar
              <span className="setup-pillar-count">{selectedIds.length} selecionados</span>
            </h2>

            <div className="setup-pillars-list">
              {PILLARS.map(pillar => {
                const isSelected = selectedIds.includes(pillar.id);
                return (
                  <label
                    key={pillar.id}
                    className={`nx-checkbox-label setup-pillar-item ${isSelected ? 'checked' : ''}`}
                    onClick={() => togglePillar(pillar.id)}
                  >
                    <div className="nx-checkbox-box">
                      <span className="nx-checkbox-check">✓</span>
                    </div>
                    <div className="setup-pillar-info">
                      <div className="setup-pillar-name">
                        <span>{pillar.icon}</span>
                        <strong>{pillar.name}</strong>
                      </div>
                      <p className="setup-pillar-desc">{pillar.description}</p>
                      <span className="setup-pillar-qcount">{pillar.questions.length} perguntas</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="nx-alert nx-alert-error" style={{ marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        <div className="setup-cta">
          <div className="setup-cta-info">
            <span>
              {selectedIds.length} pilares ·{' '}
              {PILLARS.filter(p => selectedIds.includes(p.id))
                .reduce((sum, p) => sum + p.questions.length, 0)} perguntas no total
            </span>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            Iniciar Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}
