import { useState, useEffect, useRef } from 'react';
import { loginStep1, loginStep2, getLockoutUntil } from '../utils/authV2';
import nexloopLogo from '/nexloop-logo.png';
import './LoginScreen.css';

function LockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
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
  const [step, setStep]                   = useState(1); // 1=credentials, 2=totp
  const [username, setUsername]           = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [totpCode, setTotpCode]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [shake, setShake]                 = useState(false);
  const [lockoutUntil, setLockoutUntil]   = useState(null);
  const [countdown, setCountdown]         = useState('');
  const [pendingUsername, setPendingUsername] = useState('');
  const usernameRef = useRef(null);
  const totpRef     = useRef(null);

  useEffect(() => { usernameRef.current?.focus(); }, []);

  useEffect(() => {
    if (step === 2) setTimeout(() => totpRef.current?.focus(), 80);
  }, [step]);

  // Lockout countdown
  useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const rem = lockoutUntil - Date.now();
      if (rem <= 0) { setLockoutUntil(null); setCountdown(''); return; }
      const m = Math.floor(rem / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setCountdown(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockoutUntil]);

  function triggerShake(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleCredentials(e) {
    e.preventDefault();
    if (loading || lockoutUntil) return;
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');
    try {
      const result = await loginStep1(username.trim(), password);
      setPassword('');
      if (result.totpEnabled) {
        setPendingUsername(result.username);
        setStep(2);
      } else {
        loginStep2(''); // no-TOTP path (future: allow disabling)
        onLogin();
      }
    } catch (err) {
      setPassword('');
      if (err.locked) {
        setLockoutUntil(err.until);
        triggerShake('Acesso bloqueado temporariamente por muitas tentativas incorretas.');
      } else {
        triggerShake(err.message || 'Erro ao verificar credenciais.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleTOTP(e) {
    e.preventDefault();
    if (totpCode.length !== 6) return;
    setError('');
    try {
      loginStep2(totpCode);
      onLogin();
    } catch (err) {
      setTotpCode('');
      triggerShake(err.message || 'Código inválido.');
      setTimeout(() => totpRef.current?.focus(), 100);
    }
  }

  return (
    <div className="login-page">
      <div className={`login-card ${shake ? 'login-shake' : ''}`}>

        <div className="login-brand">
          <img src={nexloopLogo} alt="Nexloop" className="login-logo-img" />
        </div>

        <div className="login-icon"><LockIcon /></div>

        <h1 className="login-title">Acesso restrito</h1>
        <p className="login-subtitle">
          {step === 1
            ? 'Este conteúdo é confidencial. Insira suas credenciais para continuar.'
            : `Olá, ${pendingUsername}. Digite o código gerado pelo seu app autenticador.`}
        </p>

        {lockoutUntil ? (
          <div className="login-lockout">
            <div className="login-lockout-icon">🔒</div>
            <p className="login-lockout-title">Acesso temporariamente bloqueado</p>
            <p className="login-lockout-desc">Muitas tentativas incorretas. Tente novamente em:</p>
            <div className="login-lockout-timer">{countdown}</div>
          </div>
        ) : step === 1 ? (
          <form className="login-form" onSubmit={handleCredentials} autoComplete="off">
            <input type="text"     style={{ display: 'none' }} aria-hidden readOnly tabIndex={-1} />
            <input type="password" style={{ display: 'none' }} aria-hidden readOnly tabIndex={-1} />

            <div className="nx-field">
              <label className="nx-label">Usuário</label>
              <input
                ref={usernameRef}
                className="nx-input"
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="Seu nome de usuário"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
              />
            </div>

            <div className="nx-field">
              <label className="nx-label">Senha</label>
              <div className="login-input-wrap">
                <input
                  className="nx-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
                <button type="button" className="login-toggle-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div className="nx-alert nx-alert-error login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={loading || !username.trim() || !password}
            >
              {loading ? 'Verificando…' : 'Entrar →'}
            </button>
          </form>
        ) : (
          /* Step 2: TOTP */
          <form className="login-form" onSubmit={handleTOTP} autoComplete="off">
            <div className="login-totp-hint">
              <span className="login-totp-icon">📱</span>
              Abra o <strong>Google Authenticator</strong> ou <strong>Authy</strong> e
              copie o código de 6 dígitos para <em>Nexloop Radar</em>.
            </div>

            <div className="nx-field">
              <label className="nx-label">Código de autenticação</label>
              <input
                ref={totpRef}
                className="nx-input login-totp-input"
                type="text"
                inputMode="numeric"
                value={totpCode}
                onChange={e => { setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                placeholder="000 000"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {error && <div className="nx-alert nx-alert-error login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={totpCode.length !== 6}
            >
              Verificar →
            </button>

            <button
              type="button"
              className="btn btn-secondary login-submit"
              style={{ marginTop: 8 }}
              onClick={() => { setStep(1); setTotpCode(''); setError(''); }}
            >
              ← Voltar
            </button>
          </form>
        )}

        <p className="login-footer"><strong>Nexloop</strong> · Conteúdo confidencial</p>
      </div>
    </div>
  );
}
