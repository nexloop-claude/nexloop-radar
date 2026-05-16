import { useState, useRef, useEffect } from 'react';
import './AdminPinModal.css';

const DEFAULT_PIN = 'Nexloop@#1935';
const PIN_KEY = 'nexloop_admin_pin';

export function getAdminPin() {
  return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
}

export function setAdminPin(pin) {
  localStorage.setItem(PIN_KEY, pin);
}

export default function AdminPinModal({ onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === getAdminPin()) {
      onSuccess();
    } else {
      setError('PIN incorreto.');
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box pin-modal-box ${shake ? 'pin-shake' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔐 Acesso Administrativo</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        {/* role="presentation" + no action prevent browser password manager */}
        <form className="pin-form" onSubmit={handleSubmit} role="presentation" autoComplete="off">
          <p className="pin-desc">Digite o PIN para acessar as configurações.</p>

          {/* Dummy hidden fields fool browser autofill away from the real input */}
          <input type="text"     style={{ display: 'none' }} aria-hidden="true" readOnly tabIndex={-1} />
          <input type="password" style={{ display: 'none' }} aria-hidden="true" readOnly tabIndex={-1} />

          <div className="nx-field">
            <label className="nx-label">PIN</label>
            <input
              ref={inputRef}
              className="nx-input pin-input pin-masked"
              type="text"
              inputMode="text"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(''); }}
              placeholder="Digite o PIN"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
            />
          </div>

          {error && <div className="nx-alert nx-alert-error">{error}</div>}

          <div className="pin-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!pin}>Entrar →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
