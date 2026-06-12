import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  listUsers,
  adminCreateUser,
  adminResetUserPassword,
  adminDeleteUser,
  adminUpdateUserRole,
  getSession,
  getTOTPUri,
  passwordStrength,
} from '../utils/authV2';
import './UserManagement.css';

function StrengthBar({ password }) {
  const { level, label, color } = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="um-strength-wrap">
      <div className="um-strength-track">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="um-strength-seg" style={{ background: i <= level ? color : '#E8E4F0' }} />
        ))}
      </div>
      <span className="um-strength-label" style={{ color }}>{label}</span>
    </div>
  );
}

function RoleBadge({ role }) {
  return (
    <span className={`um-role-badge um-role-${role}`}>
      {role === 'admin' ? 'Admin' : 'Usuário'}
    </span>
  );
}

function QRDialog({ title, username, totpSecret, onClose }) {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const uri = getTOTPUri(totpSecret, username);
    QRCode.toDataURL(uri, { width: 200, margin: 1, color: { dark: '#170F3D', light: '#FFFFFF' } })
      .then(setQrUrl)
      .catch(() => setQrUrl(''));
  }, [totpSecret, username]);

  return (
    <div className="um-overlay" onClick={onClose}>
      <div className="um-dialog" onClick={e => e.stopPropagation()}>
        <div className="um-dialog-header">
          <h2>{title}</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <p className="um-dialog-intro">
          O usuário <strong>{username}</strong> deve escanear este QR code com o app autenticador
          antes do próximo login.
        </p>

        <div className="um-qr-wrap">
          {qrUrl
            ? <img src={qrUrl} alt="QR Code 2FA" className="um-qr-img" />
            : <div className="um-qr-placeholder">Gerando QR…</div>}
        </div>

        <details className="um-secret-details">
          <summary>Código para inserção manual</summary>
          <code className="um-secret-code">{totpSecret}</code>
          <p className="um-secret-hint">App autenticador → Inserir chave · Tipo: TOTP · 6 dígitos · 30s</p>
        </details>

        <div className="nx-alert nx-alert-warning um-warning">
          Este QR code não será exibido novamente. Garanta que o usuário salve ou escaneie agora.
        </div>

        <button className="btn btn-primary um-dialog-close" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

function CreateUserDialog({ onCreated, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState('user');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim()) return setError('Informe um nome de usuário.');
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username.trim()))
      return setError('Use 3–30 caracteres: letras, números, ponto, hífen ou sublinhado.');
    if (password.length < 10) return setError('A senha deve ter no mínimo 10 caracteres.');
    if (!/[A-Z]/.test(password)) return setError('Use ao menos uma letra maiúscula.');
    if (!/[0-9]/.test(password)) return setError('Use ao menos um número.');
    if (password !== confirm) return setError('As senhas não coincidem.');

    setLoading(true);
    try {
      const result = await adminCreateUser(username.trim(), password, role);
      onCreated(result);
    } catch (err) {
      setError(err.message || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="um-overlay" onClick={onClose}>
      <div className="um-dialog" onClick={e => e.stopPropagation()}>
        <div className="um-dialog-header">
          <h2>Novo usuário</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>✕</button>
        </div>

        <form className="um-form" onSubmit={handleSubmit} autoComplete="off">
          <input type="text"     style={{ display: 'none' }} aria-hidden readOnly tabIndex={-1} />
          <input type="password" style={{ display: 'none' }} aria-hidden readOnly tabIndex={-1} />

          <div className="nx-field">
            <label className="nx-label">Nome de usuário</label>
            <input
              className="nx-input"
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="ex: ana.silva"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">Perfil</label>
            <select className="nx-input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">Usuário — acesso aos próprios assessments</option>
              <option value="admin">Administrador — acesso total</option>
            </select>
          </div>

          <div className="nx-field">
            <label className="nx-label">Senha inicial (mín. 10 caracteres)</label>
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

          <div className="um-dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !username || !password || !confirm}
            >
              {loading ? 'Criando…' : 'Criar usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagement({ onClose }) {
  const [users, setUsers]         = useState(() => listUsers());
  const [qrData, setQrData]       = useState(null); // {username, totpSecret, title}
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError]         = useState('');
  const session = getSession();

  function refresh() { setUsers(listUsers()); }

  function handleCreated({ user, totpSecret }) {
    setShowCreate(false);
    refresh();
    setQrData({ username: user.username, totpSecret, title: `QR Code — ${user.username}` });
  }

  async function handleReset(userId, username) {
    const newPwd = window.prompt(
      `Resetar senha e 2FA de "${username}".\n\nDigite a nova senha temporária (mín. 10 caracteres, 1 maiúscula, 1 número):`
    );
    if (!newPwd) return;
    if (newPwd.length < 10 || !/[A-Z]/.test(newPwd) || !/[0-9]/.test(newPwd)) {
      setError('Senha inválida: mínimo 10 caracteres, 1 maiúscula, 1 número.');
      return;
    }
    setError('');
    try {
      const result = await adminResetUserPassword(userId, newPwd);
      setQrData({ username: result.username, totpSecret: result.totpSecret, title: `Novo QR Code — ${result.username}` });
    } catch (err) {
      setError(err.message || 'Erro ao resetar senha.');
    }
  }

  function handleDelete(userId, username) {
    if (!window.confirm(`Excluir o usuário "${username}"? Esta ação não pode ser desfeita e apagará todos os dados do usuário.`)) return;
    setError('');
    try {
      adminDeleteUser(userId);
      refresh();
    } catch (err) {
      setError(err.message || 'Erro ao excluir usuário.');
    }
  }

  function handleToggleRole(userId, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const label   = newRole === 'admin' ? 'Administrador' : 'Usuário';
    if (!window.confirm(`Alterar perfil para "${label}"?`)) return;
    setError('');
    try {
      adminUpdateUserRole(userId, newRole);
      refresh();
    } catch (err) {
      setError(err.message || 'Erro ao alterar perfil.');
    }
  }

  return (
    <div className="um-page">
      <div className="um-header">
        <div className="nx-container-wide um-header-inner">
          <div>
            <h1 className="um-title">Gestão de Usuários</h1>
            <p className="um-subtitle">{users.length} {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}</p>
          </div>
          <div className="um-header-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              + Novo usuário
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>← Voltar</button>
          </div>
        </div>
      </div>

      <div className="nx-container-wide um-body">
        {error && <div className="nx-alert nx-alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="um-list">
          {users.map(user => (
            <div key={user.id} className="um-card">
              <div className="um-card-info">
                <div className="um-card-avatar">{user.username[0].toUpperCase()}</div>
                <div>
                  <div className="um-card-name">
                    {user.username}
                    {user.id === session?.userId && <span className="um-you-tag">você</span>}
                  </div>
                  <div className="um-card-meta">
                    <RoleBadge role={user.role} />
                    <span className="um-card-date">
                      Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="um-card-actions">
                {user.id !== session?.userId && (
                  <>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleToggleRole(user.id, user.role)}
                      title={user.role === 'admin' ? 'Tornar usuário comum' : 'Tornar administrador'}
                    >
                      {user.role === 'admin' ? '↓ Usuário' : '↑ Admin'}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleReset(user.id, user.username)}
                      title="Resetar senha e 2FA"
                    >
                      🔑 Resetar
                    </button>
                    <button
                      className="btn btn-sm um-delete-btn"
                      onClick={() => handleDelete(user.id, user.username)}
                      title="Excluir usuário"
                    >
                      Excluir
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="um-info-box">
          <p><strong>Perfis de acesso:</strong></p>
          <p><strong>Admin</strong> — acesso total: cria usuários, vê todos os assessments, acessa configurações e API key.</p>
          <p><strong>Usuário</strong> — vê apenas seus próprios assessments. Sem acesso a configurações ou gestão de usuários.</p>
        </div>
      </div>

      {showCreate && (
        <CreateUserDialog
          onCreated={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      {qrData && (
        <QRDialog
          title={qrData.title}
          username={qrData.username}
          totpSecret={qrData.totpSecret}
          onClose={() => setQrData(null)}
        />
      )}
    </div>
  );
}
