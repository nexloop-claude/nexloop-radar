import { useState } from 'react';
import ApiKeyModal, { getStoredLogo } from './ApiKeyModal';
import AdminPinModal from './AdminPinModal';
import './Header.css';

export default function Header({ subtitle, pillarInfo, onReset, onHistory, onLogout, draftCount = 0 }) {
  const [showPin, setShowPin]     = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const logo = getStoredLogo();

  function handleConfigClick() {
    setShowPin(true);
  }

  function handlePinSuccess() {
    setShowPin(false);
    setShowConfig(true);
  }

  function handleLogoutClick() {
    if (window.confirm('Encerrar sessão? Você precisará inserir a senha novamente para acessar o sistema.')) {
      onLogout();
    }
  }

  return (
    <>
      <div className="nx-topline" />
      <header className="nx-header">
        <div className="nx-header-inner nx-container-wide">
          <div className="nx-logo" onClick={onReset} style={{ cursor: onReset ? 'pointer' : 'default' }}>
            {logo
              ? <img src={logo} alt="Logo" className="nx-logo-img" />
              : (
                <>
                  <span className="nx-logo-nexloop">NEXLOOP</span>
                  <span className="nx-logo-radar">RADAR</span>
                </>
              )
            }
          </div>

          <div className="nx-header-center">
            {pillarInfo && (
              <span className="nx-header-pillar">{pillarInfo}</span>
            )}
            {subtitle && !pillarInfo && (
              <span className="nx-header-subtitle">{subtitle}</span>
            )}
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
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleConfigClick}
              title="Configurações administrativas"
            >
              ⚙️
            </button>
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

      {showPin    && <AdminPinModal onSuccess={handlePinSuccess} onClose={() => setShowPin(false)} />}
      {showConfig && <ApiKeyModal onClose={() => setShowConfig(false)} />}
    </>
  );
}
