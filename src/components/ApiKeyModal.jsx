import { useState, useEffect, useRef } from 'react';
import { validateApiKey } from '../utils/claudeApi';
import { changePassword } from '../utils/auth';
import './ApiKeyModal.css';

const LOGO_KEY = 'nexloop_logo_b64';

export function getStoredLogo() {
  return localStorage.getItem(LOGO_KEY) || null;
}

export default function ApiKeyModal({ onClose }) {
  const [key, setKey]             = useState('');
  const [status, setStatus]       = useState('idle');
  const [showKey, setShowKey]     = useState(false);
  const [logo, setLogo]           = useState(getStoredLogo());

  const [currentPwd, setCurrentPwd]   = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [pwdStatus, setPwdStatus]     = useState('idle'); // idle | saving | saved | error | mismatch | short
  const [showPwds, setShowPwds]       = useState(false);

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

  async function handleChangePassword() {
    if (!currentPwd || !newPwd || !confirmPwd) return;
    if (newPwd.length < 8) { setPwdStatus('short'); return; }
    if (newPwd !== confirmPwd) { setPwdStatus('mismatch'); return; }
    setPwdStatus('saving');
    const ok = await changePassword(currentPwd, newPwd);
    if (ok) {
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setPwdStatus('saved');
      setTimeout(() => setPwdStatus('idle'), 3000);
    } else {
      setPwdStatus('error');
    }
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

          {/* CHANGE PASSWORD */}
          <div className="admin-section">
            <h3 className="admin-section-title">🔐 Alterar Senha de Acesso</h3>
            <p className="modal-desc">A nova senha deve ter no mínimo 8 caracteres.</p>

            <div className="admin-pwd-grid">
              <div className="nx-field" style={{ gridColumn: '1 / -1' }}>
                <label className="nx-label">Senha atual</label>
                <div className="key-input-wrap">
                  <input
                    className="nx-input"
                    type={showPwds ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={e => { setCurrentPwd(e.target.value); setPwdStatus('idle'); }}
                    placeholder="Sua senha atual"
                    autoComplete="current-password"
                    data-lpignore="true"
                  />
                  <button className="btn btn-sm btn-secondary key-toggle" type="button" onClick={() => setShowPwds(v => !v)}>
                    {showPwds ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="nx-field">
                <label className="nx-label">Nova senha</label>
                <input
                  className="nx-input"
                  type={showPwds ? 'text' : 'password'}
                  value={newPwd}
                  onChange={e => { setNewPwd(e.target.value); setPwdStatus('idle'); }}
                  placeholder="Nova senha"
                  autoComplete="new-password"
                  data-lpignore="true"
                />
              </div>
              <div className="nx-field">
                <label className="nx-label">Confirmar nova senha</label>
                <input
                  className="nx-input"
                  type={showPwds ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={e => { setConfirmPwd(e.target.value); setPwdStatus('idle'); }}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  data-lpignore="true"
                />
              </div>
            </div>

            {pwdStatus === 'short'    && <div className="nx-alert nx-alert-error">A senha deve ter no mínimo 8 caracteres.</div>}
            {pwdStatus === 'mismatch' && <div className="nx-alert nx-alert-error">As senhas não coincidem.</div>}
            {pwdStatus === 'error'    && <div className="nx-alert nx-alert-error">Senha atual incorreta.</div>}
            {pwdStatus === 'saved'    && <div className="nx-alert nx-alert-success">✅ Senha alterada com sucesso!</div>}

            <div className="admin-row">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleChangePassword}
                disabled={!currentPwd || !newPwd || !confirmPwd || pwdStatus === 'saving'}
              >
                {pwdStatus === 'saving' ? '⏳ Salvando...' : '✓ Alterar senha'}
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
