import './HomeScreen.css';

function IconDigital() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="home-icon-svg">
      <defs>
        <linearGradient id="ig1a" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18B8FF" />
          <stop offset="100%" stopColor="#510B61" />
        </linearGradient>
        <linearGradient id="ig1b" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18B8FF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#510B61" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Radar polygon background */}
      <polygon points="40,8 70,24 70,56 40,72 10,56 10,24" fill="url(#ig1b)" stroke="url(#ig1a)" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Inner hexagon */}
      <polygon points="40,20 57,30 57,50 40,60 23,50 23,30" fill="none" stroke="url(#ig1a)" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5"/>
      {/* Innermost */}
      <polygon points="40,30 49,35 49,45 40,50 31,45 31,35" fill="none" stroke="url(#ig1a)" strokeWidth="0.75" strokeLinejoin="round" strokeOpacity="0.3"/>
      {/* Data polygon */}
      <polygon points="40,14 64,34 58,54 40,62 18,50 22,26" fill="url(#ig1a)" fillOpacity="0.15" stroke="url(#ig1a)" strokeWidth="2" strokeLinejoin="round"/>
      {/* Axis lines */}
      <line x1="40" y1="8"  x2="40" y2="72" stroke="url(#ig1a)" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="10" y1="24" x2="70" y2="56" stroke="url(#ig1a)" strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="70" y1="24" x2="10" y2="56" stroke="url(#ig1a)" strokeWidth="1" strokeOpacity="0.3"/>
      {/* Data nodes */}
      <circle cx="40" cy="14" r="3" fill="#18B8FF"/>
      <circle cx="64" cy="34" r="3" fill="#18B8FF"/>
      <circle cx="58" cy="54" r="3" fill="#510B61"/>
      <circle cx="40" cy="62" r="3" fill="#510B61"/>
      <circle cx="18" cy="50" r="3" fill="#18B8FF"/>
      <circle cx="22" cy="26" r="3" fill="#18B8FF"/>
    </svg>
  );
}

function IconBusiness() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="home-icon-svg">
      <defs>
        <linearGradient id="ig2a" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DB05FF" />
          <stop offset="100%" stopColor="#170F3D" />
        </linearGradient>
        <linearGradient id="ig2b" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DB05FF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#170F3D" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Central node */}
      <circle cx="40" cy="40" r="10" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="2"/>
      <circle cx="40" cy="40" r="3.5" fill="url(#ig2a)"/>
      {/* Branch nodes + connectors */}
      {/* Top */}
      <line x1="40" y1="30" x2="40" y2="14" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.6"/>
      <rect x="32" y="6" width="16" height="10" rx="3" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="1.5"/>
      {/* Bottom */}
      <line x1="40" y1="50" x2="40" y2="64" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.6"/>
      <rect x="32" y="64" width="16" height="10" rx="3" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="1.5"/>
      {/* Left */}
      <line x1="30" y1="40" x2="16" y2="40" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.6"/>
      <rect x="6" y="34" width="12" height="12" rx="3" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="1.5"/>
      {/* Right */}
      <line x1="50" y1="40" x2="64" y2="40" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.6"/>
      <rect x="62" y="34" width="12" height="12" rx="3" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="1.5"/>
      {/* Top-right */}
      <line x1="47" y1="33" x2="57" y2="20" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="54" y="11" width="12" height="12" rx="3" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.7"/>
      {/* Bottom-left */}
      <line x1="33" y1="47" x2="23" y2="60" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="14" y="57" width="12" height="12" rx="3" fill="url(#ig2b)" stroke="url(#ig2a)" strokeWidth="1.5" strokeOpacity="0.7"/>
    </svg>
  );
}

const ASSESSMENTS = [
  {
    id: 'digital',
    Icon: IconDigital,
    tag: 'Infraestrutura & Tecnologia',
    title: 'Assessment de Maturidade Digital',
    description: 'Diagnóstico completo da base tecnológica da empresa: infraestrutura, segurança, dados, automação e adoção de inteligência artificial.',
    audience: 'Para: Diretoria de TI · CTO · CEO',
    pillars: [
      'Infraestrutura & Operações de TI',
      'Cibersegurança',
      'Governança de TI',
      'Dados & Business Intelligence',
      'Transformação Digital',
      'Adoção de Inteligência Artificial',
      'Inovação & Cultura Digital',
      'Experiência do Cliente Digital',
    ],
    accentColor: '#18B8FF',
    tagBg: 'rgba(24,184,255,0.08)',
    tagColor: '#0e7aaa',
  },
  {
    id: 'business',
    Icon: IconBusiness,
    tag: 'Áreas de Negócio',
    title: 'Assessment de Negócio',
    description: 'Avalia como cada área da empresa utiliza processos e tecnologia, com foco na visão dos diretores e gestores responsáveis.',
    audience: 'Para: Diretores de Área · Gestores · CEO',
    pillars: [
      'Estratégia & Visão Digital',
      'Comercial & Vendas',
      'Financeiro & Controladoria',
      'Suprimentos',
      'Engenharia',
      'Incorporação',
      'Logística',
      '+ 6 áreas de negócio',
    ],
    accentColor: '#DB05FF',
    tagBg: 'rgba(219,5,255,0.08)',
    tagColor: '#8b00a8',
  },
];

export default function HomeScreen({ onSelect }) {
  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-inner nx-container">
          <p className="home-eyebrow">Nexloop Radar · Plataforma de Assessment</p>
          <h1 className="home-heading">
            Qual diagnóstico<br />deseja conduzir?
          </h1>
          <p className="home-lead">
            Selecione a abordagem adequada ao objetivo do assessment.
            Cada modalidade gera um relatório executivo personalizado com recomendações geradas por IA.
          </p>
        </div>
      </section>

      {/* ── CARDS ── */}
      <section className="home-cards-section">
        <div className="home-cards-inner nx-container">
          {ASSESSMENTS.map(a => (
            <article key={a.id} className="home-card" onClick={() => onSelect(a.id)}>

              <div className="home-card-accent" style={{ background: a.accentColor }} />

              <div className="home-card-content">
                <div className="home-card-header">
                  <a.Icon />
                  <span
                    className="home-card-tag"
                    style={{ background: a.tagBg, color: a.tagColor }}
                  >
                    {a.tag}
                  </span>
                </div>

                <h2 className="home-card-title">{a.title}</h2>
                <p className="home-card-desc">{a.description}</p>

                <div className="home-card-divider" />

                <p className="home-card-audience">{a.audience}</p>

                <ul className="home-pillar-list">
                  {a.pillars.map((p, i) => (
                    <li key={i}>
                      <span className="home-pillar-marker" style={{ background: a.accentColor }} />
                      {p}
                    </li>
                  ))}
                </ul>

                <button
                  className="home-card-cta"
                  style={{ '--cta-color': a.accentColor }}
                  onClick={e => { e.stopPropagation(); onSelect(a.id); }}
                >
                  Iniciar assessment
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="nx-footer">
        <strong>Nexloop</strong> · Empowering Your Business
      </footer>
    </div>
  );
}
