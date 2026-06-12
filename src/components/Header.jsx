import { useState } from 'react';
import ApiKeyModal, { getStoredLogo } from './ApiKeyModal';
import nexloopLogo from '/nexloop-logo.png';
import './Header.css';

export default function Header({
  subtitle, pillarInfo, onReset, onHistory, onLogout,
  draftCount = 0, isAdmin = false, onUsers,
}) {
  const [showConfig, setShowConfig] = useState(false);
  const logo = getStoredLogo();

  function handleLogoutClick() {
    if (window.confirm('Encerrar sessão? Você precisará fazer login novamente para acessar o sistema.')) {
      onLogout();
    }
  }

  return (
    <>
      <div className="nx-topline" />
      <header className="nx-header">
        <div className="nx-header-inner nx-container-wide">
          <div className="nx-logo" onClick={onReset} style={{ cursor: onReset ? 'pointer' : 'default' }}>
            <img src={logo || nexloopLogo} alt="Logo" className="nx-logo-img" />
          </div>

          <div className="nx-header-center">
            {pillarInfo && <span className="nx-header-pillar">{pillarInfo}</span>}
            {subtitle && !pillarInfo && <span className="nx-header-subtitle">{subtitle}</span>}
          </div>

          <div className="nx-header-actions">
            {onHistory && (
              <button
                className="btn btn-sm btn-secondary nx-header-history-btn"
                onClick={onHistory}
                title="Ver assessments em andamento e concluídos"
              >
                Assessments
                {draftCount > 0 && (
                  <span className="nx-header-draft-badge">{draftCount}</span>
                )}
              </button>
            )}

            {/* Gestão de usuários — apenas admin */}
            {isAdmin && onUsers && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={onUsers}
                title="Gestão de usuários"
              >
                Usuários
              </button>
            )}

            {/* Configurações — apenas admin */}
            {isAdmin && (
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowConfig(true)}
                title="Configurações administrativas"
              >
                ⚙️
              </button>
            )}

            {onLogout && (
              <button
                className="btn btn-sm btn-secondary nx-header-logout-btn"
                onClick={handleLogoutClick}
                title="Encerrar sessão"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      {showConfig && <ApiKeyModal onClose={() => setShowConfig(false)} />}
    </>
  );
}
