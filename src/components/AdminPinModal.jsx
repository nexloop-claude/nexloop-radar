import { useState, useRef, useEffect } from 'react';
import { verifyPassword } from '../utils/auth';
import './AdminPinModal.css';

export default function AdminPinModal({ onSuccess, onClose }) {
  const [pin, setPin]     = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || !pin) return;
    setLoading(true);
    const valid = await verifyPassword(pin);
    setLoading(false);
    if (valid) {
      onSuccess();
    } else {
      setError('Senha incorreta.');
      setShake(true);
      setPin('');
      setTimeout(() => { setShake(false); inputRef.current?.focus(); }, 500);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box pin-modal-box ${shake ? 'pin-shake' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔐 Acesso Administrativo</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <form className="pin-form" onSubmit={handleSubmit} autoComplete="off">
          <p className="pin-desc">Digite sua senha para acessar as configurações.</p>

          <input type="text"     style={{ display: 'none' }} aria-hidden="true" readOnly tabIndex={-1} />
          <input type="password" style={{ display: 'none' }} aria-hidden="true" readOnly tabIndex={-1} />

          <div className="nx-field">
            <label className="nx-label">Senha</label>
            <input
              ref={inputRef}
              className="nx-input pin-input pin-masked"
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(''); }}
              placeholder="Digite sua senha"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
            />
          </div>

          {error && <div className="nx-alert nx-alert-error">{error}</div>}

          <div className="pin-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!pin || loading}>
              {loading ? 'Verificando...' : 'Entrar →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
