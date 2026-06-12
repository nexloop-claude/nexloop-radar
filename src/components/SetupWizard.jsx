import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { createUser, getTOTPUri, verifyTOTPCode, migrateV1Data, passwordStrength } from '../utils/authV2';
import nexloopLogo from '/nexloop-logo.png';
import './SetupWizard.css';

function StrengthBar({ password }) {
  const { level, label, color } = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="strength-wrap">
      <div className="strength-track">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="strength-seg"
            style={{ background: i <= level ? color : '#E8E4F0' }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color }}>{label}</span>
    </div>
  );
}

export default function SetupWizard({ onComplete }) {
  const [step, setStep]               = useState(1);
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [totpSecret, setTotpSecret]   = useState('');
  const [qrUrl, setQrUrl]             = useState('');
  const [userId, setUserId]           = useState('');
  const [totpCode, setTotpCode]       = useState('');
  const [shake, setShake]             = useState(false);
  const codeRef = useRef(null);
  const isLegacy = !!localStorage.getItem('nexloop_auth_hash');

  useEffect(() => { if (step === 3) codeRef.current?.focus(); }, [step]);

  function triggerShake(msg) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!username.trim()) return triggerShake('Informe um nome de usuário.');
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username.trim()))
      return triggerShake('Use 3–30 caracteres: letras, números, ponto, hífen ou sublinhado.');
    if (password.length < 10) return triggerShake('A senha deve ter no mínimo 10 caracteres.');
    if (!/[A-Z]/.test(password)) return triggerShake('Use ao menos uma letra maiúscula.');
    if (!/[0-9]/.test(password)) return triggerShake('Use ao menos um número.');
    if (password !== confirm) return triggerShake('As senhas não coincidem.');

    setLoading(true);
    try {
      const result = await createUser({ username: username.trim(), password, role: 'admin' });
      migrateV1Data(result.user.id);
      setUserId(result.user.id);
      setTotpSecret(result.totpSecret);

      const uri = getTOTPUri(result.totpSecret, result.user.username);
      try {
        const url = await QRCode.toDataURL(uri, {
          width: 200, margin: 1, color: { dark: '#170F3D', light: '#FFFFFF' },
        });
        setQrUrl(url);
      } catch {
        setQrUrl('');
      }
      setStep(2);
    } catch (err) {
      triggerShake(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  function handleVerify(e) {
    e.preventDefault();
    setError('');
    if (!verifyTOTPCode(totpSecret, totpCode)) {
      setTotpCode('');
      return triggerShake('Código inválido. Verifique se o QR foi escaneado corretamente e tente novamente.');
    }
    onComplete();
  }

  return (
    <div className="setup-page">
      <div className={`setup-card ${shake ? 'setup-shake' : ''}`}>
        <div className="setup-brand">
          <img src={nexloopLogo} alt="Nexloop" className="setup-logo" />
        </div>

        {/* Step indicators */}
        <div className="setup-steps">
          {['Criar conta', 'Configurar 2FA', 'Verificar'].map((label, i) => (
            <div key={i} className={`setup-step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              <div className="setup-step-dot">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="setup-step-label">{label}</span>
              {i < 2 && <div className="setup-step-line" />}
            </div>
          ))}
        </div>

        {/* ── Step 1: Create admin ─────────────────────────────── */}
        {step === 1 && (
          <>
            <h1 className="setup-title">Configuração inicial</h1>
            <p className="setup-subtitle">
              {isLegacy
                ? 'Migre para o novo sistema criando sua conta de administrador. Os dados existentes serão preservados.'
                : 'Crie a conta de administrador para começar a usar o Nexloop Radar.'}
            </p>

            <form className="setup-form" onSubmit={handleCreate} autoComplete="off">
              <input type="text"     style={{ display: 'none' }} aria-hidden tabIndex={-1} readOnly />
              <input type="password" style={{ display: 'none' }} aria-hidden tabIndex={-1} readOnly />

              <div className="nx-field">
                <label className="nx-label">Nome de usuário</label>
                <input
                  className="nx-input"
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="ex: guto.sousa"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>

              <div className="nx-field">
                <label className="nx-label">Senha (mín. 10 caracteres)</label>
                <div className="login-input-wrap">
                  <input
                    className="nx-input"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Crie uma senha forte"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                  />
                  <button type="button" className="login-toggle-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
                <StrengthBar password={password} />
              </div>

              <div className="nx-field">
                <label className="nx-label">Confirmar senha</label>
                <input
                  className="nx-input"
                  type={showPwd ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
              </div>

              {error && <div className="nx-alert nx-alert-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-lg setup-submit"
                disabled={loading || !username || !password || !confirm}
              >
                {loading ? 'Criando conta…' : 'Criar conta admin →'}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: Show QR code ─────────────────────────────── */}
        {step === 2 && (
          <>
            <h1 className="setup-title">Configure o autenticador</h1>
            <p className="setup-subtitle">
              Escaneie o QR code com <strong>Google Authenticator</strong>, <strong>Authy</strong> ou qualquer app TOTP.
            </p>

            <div className="setup-qr-wrap">
              {qrUrl
                ? <img src={qrUrl} alt="QR Code 2FA" className="setup-qr-img" />
                : <div className="setup-qr-placeholder">QR não disponível</div>
              }
            </div>

            <details className="setup-secret-details">
              <summary>Inserir manualmente (sem câmera)</summary>
              <div className="setup-secret-box">
                <p className="setup-secret-label">Chave secreta:</p>
                <code className="setup-secret-code">{totpSecret}</code>
                <p className="setup-secret-hint">
                  No app: escolha "Inserir chave" · Tipo: TOTP · Dígitos: 6 · Período: 30s
                </p>
              </div>
            </details>

            <button className="btn btn-primary btn-lg setup-submit" onClick={() => setStep(3)}>
              Já escaniei, próximo →
            </button>
          </>
        )}

        {/* ── Step 3: Verify TOTP ──────────────────────────────── */}
        {step === 3 && (
          <>
            <h1 className="setup-title">Verificar configuração</h1>
            <p className="setup-subtitle">
              Digite o código de 6 dígitos gerado pelo app autenticador para confirmar que está funcionando.
            </p>

            <form className="setup-form" onSubmit={handleVerify}>
              <div className="nx-field">
                <label className="nx-label">Código de verificação</label>
                <input
                  ref={codeRef}
                  className="nx-input setup-totp-input"
                  type="text"
                  inputMode="numeric"
                  value={totpCode}
                  onChange={e => { setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="000 000"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>

              {error && <div className="nx-alert nx-alert-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-lg setup-submit"
                disabled={totpCode.length !== 6}
              >
                Verificar e entrar →
              </button>

              <button type="button" className="btn btn-secondary setup-back-btn" onClick={() => setStep(2)}>
                ← Voltar ao QR code
              </button>
            </form>
          </>
        )}

        <p className="setup-footer"><strong>Nexloop</strong> · Conteúdo confidencial</p>
      </div>
    </div>
  );
}
