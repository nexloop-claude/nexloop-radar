import { useState, useEffect } from 'react';
import { validateApiKey } from '../utils/claudeApi';
import './ApiKeyModal.css';

export default function ApiKeyModal({ onClose }) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState('idle'); // idle | validating | valid | invalid
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nexloop_api_key');
    if (saved) setKey(saved);
  }, []);

  async function handleSave() {
    if (!key.trim()) return;
    setStatus('validating');
    const valid = await validateApiKey(key.trim());
    if (valid) {
      localStorage.setItem('nexloop_api_key', key.trim());
      setStatus('valid');
      setTimeout(onClose, 1200);
    } else {
      setStatus('invalid');
    }
  }

  function handleRemove() {
    localStorage.removeItem('nexloop_api_key');
    setKey('');
    setStatus('idle');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔑 Configuração da API Key</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            O Nexloop Radar usa a API da Anthropic (Claude) para transcrição de áudio e análise das respostas.
            Sua chave é armazenada apenas localmente no seu navegador.
          </p>

          <div className="nx-field">
            <label className="nx-label">Anthropic API Key</label>
            <div className="key-input-wrap">
              <input
                className="nx-input"
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={e => { setKey(e.target.value); setStatus('idle'); }}
                placeholder="sk-ant-..."
                autoComplete="off"
              />
              <button
                className="btn btn-sm btn-secondary key-toggle"
                onClick={() => setShowKey(v => !v)}
                type="button"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {status === 'valid' && (
            <div className="nx-alert nx-alert-success">✅ API Key válida! Salvando...</div>
          )}
          {status === 'invalid' && (
            <div className="nx-alert nx-alert-error">❌ API Key inválida. Verifique e tente novamente.</div>
          )}

          <div className="nx-alert nx-alert-info" style={{ marginTop: 12 }}>
            💡 Obtenha sua chave em{' '}
            <strong>console.anthropic.com</strong> → API Keys
          </div>
        </div>

        <div className="modal-footer">
          {localStorage.getItem('nexloop_api_key') && (
            <button className="btn btn-secondary btn-sm" onClick={handleRemove}>
              🗑️ Remover
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!key.trim() || status === 'validating'}
          >
            {status === 'validating' ? '⏳ Validando...' : '✓ Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
