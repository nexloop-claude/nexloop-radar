import { useState } from 'react';
import ApiKeyModal from './ApiKeyModal';
import './Header.css';

export default function Header({ subtitle, pillarInfo, onReset }) {
  const [showModal, setShowModal] = useState(false);
  const hasKey = !!localStorage.getItem('nexloop_api_key');

  return (
    <>
      <div className="nx-topline" />
      <header className="nx-header">
        <div className="nx-header-inner nx-container-wide">
          <div className="nx-logo" onClick={onReset} style={{ cursor: onReset ? 'pointer' : 'default' }}>
            <span className="nx-logo-nexloop">NEXLOOP</span>
            <span className="nx-logo-radar">RADAR</span>
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
            <button
              className={`btn btn-sm ${hasKey ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setShowModal(true)}
              title="Configurar API Key"
            >
              {hasKey ? '⚙️ Config.' : '🔑 API Key'}
            </button>
          </div>
        </div>
      </header>

      {showModal && <ApiKeyModal onClose={() => setShowModal(false)} />}
    </>
  );
}
