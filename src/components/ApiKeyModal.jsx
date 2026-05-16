import { useState, useEffect, useRef } from 'react';
import { validateApiKey } from '../utils/claudeApi';
import { setAdminPin, getAdminPin } from './AdminPinModal';
import './ApiKeyModal.css';

const LOGO_KEY = 'nexloop_logo_b64';

export function getStoredLogo() {
  return localStorage.getItem(LOGO_KEY) || null;
}

export default function ApiKeyModal({ onClose }) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState('idle');
  const [showKey, setShowKey] = useState(false);
  const [logo, setLogo] = useState(getStoredLogo());
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStatus, setPinStatus] = useState('idle'); // idle | saved | mismatch
  const logoInputRef = useRef(null);

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

  function handleRemoveKey() {
    localStorage.removeItem('nexloop_api_key');
    setKey('');
    setStatus('idle');
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem(LOGO_KEY, reader.result);
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    localStorage.removeItem(LOGO_KEY);
    setLogo(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  }

  function handleSavePin() {
    if (!newPin) return;
    if (newPin !== confirmPin) { setPinStatus('mismatch'); return; }
    setAdminPin(newPin);
    setNewPin('');
    setConfirmPin('');
    setPinStatus('saved');
    setTimeout(() => setPinStatus('idle'), 2000);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Configurações Admin</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* API KEY */}
          <div className="admin-section">
            <h3 className="admin-section-title">🔑 Anthropic API Key</h3>
            <p className="modal-desc">
              Chave armazenada localmente no navegador. Nunca enviada a terceiros.
            </p>
            <div className="nx-field">
              <label className="nx-label">API Key</label>
              <div className="key-input-wrap">
                <input
                  className="nx-input"
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={e => { setKey(e.target.value); setStatus('idle'); }}
                  placeholder="sk-ant-..."
                  autoComplete="off"
                />
                <button className="btn btn-sm btn-secondary key-toggle" onClick={() => setShowKey(v => !v)} type="button">
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {status === 'valid'   && <div className="nx-alert nx-alert-success">✅ API Key válida! Salvando...</div>}
            {status === 'invalid' && <div className="nx-alert nx-alert-error">❌ API Key inválida.</div>}
            <div className="admin-row">
              {localStorage.getItem('nexloop_api_key') && (
                <button className="btn btn-secondary btn-sm" onClick={handleRemoveKey}>🗑️ Remover</button>
              )}
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!key.trim() || status === 'validating'}>
                {status === 'validating' ? '⏳ Validando...' : '✓ Salvar chave'}
              </button>
            </div>
          </div>

          <div className="admin-divider" />

          {/* LOGO */}
          <div className="admin-section">
            <h3 className="admin-section-title">🖼️ Logo da Empresa</h3>
            <p className="modal-desc">
              Aparece no cabeçalho e no rodapé do relatório. Recomendado: PNG ou SVG com fundo transparente.
            </p>
            {logo ? (
              <div className="logo-preview-wrap">
                <img src={logo} alt="Logo" className="logo-preview" />
                <div className="admin-row">
                  <button className="btn btn-secondary btn-sm" onClick={() => logoInputRef.current?.click()}>
                    🔄 Trocar
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={handleRemoveLogo}>
                    🗑️ Remover
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn btn-outline" onClick={() => logoInputRef.current?.click()}>
                📁 Selecionar logo...
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleLogoUpload}
            />
          </div>

          <div className="admin-divider" />

          {/* PIN */}
          <div className="admin-section">
            <h3 className="admin-section-title">🔐 Alterar PIN Admin</h3>
            <div className="admin-pin-grid">
              <div className="nx-field">
                <label className="nx-label">Novo PIN</label>
                <input
                  className="nx-input pin-masked"
                  type="text"
                  inputMode="text"
                  value={newPin}
                  onChange={e => { setNewPin(e.target.value); setPinStatus('idle'); }}
                  placeholder="Novo PIN"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
              <div className="nx-field">
                <label className="nx-label">Confirmar PIN</label>
                <input
                  className="nx-input pin-masked"
                  type="text"
                  inputMode="text"
                  value={confirmPin}
                  onChange={e => { setConfirmPin(e.target.value); setPinStatus('idle'); }}
                  placeholder="Repita o PIN"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>
            </div>
            {pinStatus === 'mismatch' && <div className="nx-alert nx-alert-error">Os PINs não coincidem.</div>}
            {pinStatus === 'saved'    && <div className="nx-alert nx-alert-success">✅ PIN alterado com sucesso!</div>}
            <div className="admin-row">
              <button className="btn btn-primary btn-sm" onClick={handleSavePin} disabled={!newPin || !confirmPin}>
                ✓ Salvar PIN
              </button>
            </div>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
