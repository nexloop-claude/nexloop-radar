import { useState, useEffect, useRef } from 'react';
import {
  hasPasswordSet,
  setupPassword,
  verifyPassword,
  getLockoutUntil,
  recordFailedAttempt,
  clearAttempts,
} from '../utils/auth';
import nexloopLogo from '/nexloop-logo.png';
import './LoginScreen.css';

function LockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lockGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18B8FF" />
          <stop offset="100%" stopColor="#510B61" />
        </linearGradient>
      </defs>
      <rect x="10" y="18" width="20" height="16" rx="3" stroke="url(#lockGrad)" strokeWidth="2" fill="none"/>
      <path d="M14 18v-5a6 6 0 0112 0v5" stroke="url(#lockGrad)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="26" r="2" fill="url(#lockGrad)"/>
    </svg>
  );
}

export default function LoginScreen({ onLogin }) {
  const isSetup = !hasPasswordSet();

  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [shake, setShake]               = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState(() => getLockoutUntil());
  const [countdown, setCountdown]       = useState('');
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (!lockoutUntil) inputRef.current?.focus();
  }, [lockoutUntil]);

  // Lockout countdown
  useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const remaining = lockoutUntil - Date.now();
      if (remaining <= 0) {
        setLockoutUntil(null);
        setCountdown('');
        clearAttempts();
        inputRef.current?.focus();
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${mins}:${secs.toString().padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  function triggerShake(message) {
    setError(message);
    setShake(true);
    setPassword('');
    setConfirm('');
    setTimeout(() => setShake(false), 500);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || lockoutUntil) return;

    if (isSetup) {
      if (password.length < 8) {
        triggerShake('A senha deve ter no mínimo 8 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        triggerShake('As senhas não coincidem.');
        return;
      }
      setLoading(true);
      await setupPassword(password);
      setLoading(false);
      onLogin();
    } else {
      setLoading(true);
      const valid = await verifyPassword(password);
      setLoading(false);
      if (valid) {
        clearAttempts();
        onLogin();
      } else {
        const result = recordFailedAttempt();
        if (result.locked) {
          setLockoutUntil(result.until);
          triggerShake('Acesso bloqueado por 30 minutos após 5 tentativas incorretas.');
        } else {
          triggerShake(
            result.remaining === 1
              ? 'Senha incorreta. Última tentativa antes do bloqueio.'
              : `Senha incorreta. ${result.remaining} tentativas restantes.`
          );
        }
      }
    }
  }

  return (
    <div className="login-page">
      <div className={`login-card ${shake ? 'login-shake' : ''}`}>

        {/* Brand */}
        <div className="login-brand">
          <img src={nexloopLogo} alt="Nexloop" className="login-logo-img" />
        </div>

        <div className="login-icon"><LockIcon /></div>

        <h1 className="login-title">
          {isSetup ? 'Criar senha de acesso' : 'Acesso restrito'}
        </h1>
        <p className="login-subtitle">
          {isSetup
            ? 'Defina uma senha para proteger o acesso aos relatórios e dados de assessment.'
            : 'Este conteúdo é confidencial. Insira sua senha para continuar.'}
        </p>

        {lockoutUntil ? (
          <div className="login-lockout">
            <div className="login-lockout-icon">🔒</div>
            <p className="login-lockout-title">Acesso temporariamente bloqueado</p>
            <p className="login-lockout-desc">
              Muitas tentativas incorretas. Tente novamente em:
            </p>
            <div className="login-lockout-timer">{countdown}</div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {/* Honeypot fields to confuse autofill */}
            <input type="text"     style={{ display: 'none' }} aria-hidden="true" readOnly tabIndex={-1} />
            <input type="password" style={{ display: 'none' }} aria-hidden="true" readOnly tabIndex={-1} />

            <div className="nx-field">
              <label className="nx-label">
                {isSetup ? 'Nova senha (mínimo 8 caracteres)' : 'Senha'}
              </label>
              <div className="login-input-wrap">
                <input
                  ref={inputRef}
                  className="nx-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder={isSetup ? 'Crie uma senha forte' : 'Digite sua senha'}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
                <button
                  type="button"
                  className="login-toggle-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {isSetup && (
              <div className="nx-field">
                <label className="nx-label">Confirmar senha</label>
                <div className="login-input-wrap">
                  <input
                    className="nx-input"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirm(e.target.value); setError(''); }}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    data-1p-ignore="true"
                  />
                </div>
              </div>
            )}

            {error && <div className="nx-alert nx-alert-error login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={loading || !password || (isSetup && !confirmPassword)}
            >
              {loading
                ? (isSetup ? 'Configurando...' : 'Verificando...')
                : (isSetup ? 'Criar senha e entrar →' : 'Entrar →')}
            </button>
          </form>
        )}

        <p className="login-footer">
          <strong>Nexloop</strong> · Conteúdo confidencial
        </p>
      </div>
    </div>
  );
}
