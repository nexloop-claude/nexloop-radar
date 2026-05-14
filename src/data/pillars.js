export const PILLARS = [
  {
    id: 'infrastructure',
    name: 'Infraestrutura & Operações de TI',
    icon: '🖥️',
    description: 'Avalia a base tecnológica da empresa: conectividade, servidores, cloud e operações de TI.',
    color: '#18B8FF',
    questions: [
      {
        id: 'infra_1',
        text: 'Como é gerenciado o parque de equipamentos (computadores, servidores, periféricos) da empresa?',
        hint: 'Considere inventário, manutenção, vida útil e renovação.',
        weight: 1
      },
      {
        id: 'infra_2',
        text: 'A empresa utiliza algum serviço de nuvem (cloud) como Microsoft Azure, AWS ou Google Cloud?',
        hint: 'Descreva quais sistemas ou arquivos estão na nuvem.',
        weight: 1
      },
      {
        id: 'infra_3',
        text: 'Como é a conectividade de internet nos escritórios e obras/unidades? Há redundância de link?',
        hint: 'Velocidade, estabilidade, links redundantes.',
        weight: 1
      },
      {
        id: 'infra_4',
        text: 'Existe um processo formal de backup de dados críticos? Com que frequência é realizado?',
        hint: 'Frequência, local de armazenamento, testes de restauração.',
        weight: 1.2
      },
      {
        id: 'infra_5',
        text: 'Como é feito o suporte técnico aos usuários? Há uma equipe interna, fornecedor externo ou ambos?',
        hint: 'SLA, tempo de resposta, canais de atendimento.',
        weight: 1
      },
      {
        id: 'infra_6',
        text: 'Qual é o nível de padronização de sistemas operacionais e softwares utilizados na empresa?',
        hint: 'Licenças, versões, processos de atualização.',
        weight: 0.8
      }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cibersegurança',
    icon: '🔒',
    description: 'Avalia proteção de dados, políticas de segurança, conformidade com LGPD e resiliência a ataques.',
    color: '#DB05FF',
    questions: [
      {
        id: 'cyber_1',
        text: 'A empresa possui políticas formais de segurança da informação documentadas e comunicadas aos colaboradores?',
        hint: 'Política de senhas, uso de dispositivos, acesso remoto.',
        weight: 1.2
      },
      {
        id: 'cyber_2',
        text: 'Como é feita a gestão de acessos? Colaboradores têm apenas acesso ao que precisam para suas funções?',
        hint: 'Princípio do menor privilégio, gestão de usuários.',
        weight: 1.2
      },
      {
        id: 'cyber_3',
        text: 'Existe proteção contra malware, ransomware e vírus nos computadores e servidores da empresa?',
        hint: 'Antivírus, EDR, firewall.',
        weight: 1
      },
      {
        id: 'cyber_4',
        text: 'A empresa já passou por algum incidente de segurança (vazamento de dados, ransomware, fraude digital)?',
        hint: 'Se sim, como foi tratado e o que mudou depois.',
        weight: 1
      },
      {
        id: 'cyber_5',
        text: 'A empresa tem plano de conformidade com a LGPD? Sabe quais dados pessoais coleta e como os protege?',
        hint: 'DPO, mapeamento de dados, consentimento.',
        weight: 1.3
      },
      {
        id: 'cyber_6',
        text: 'Existe treinamento de conscientização em segurança para os colaboradores?',
        hint: 'Frequência, phishing simulado, cultura de segurança.',
        weight: 1
      }
    ]
  },
  {
    id: 'governance',
    name: 'Governança de TI',
    icon: '📋',
    description: 'Avalia processos, contratos, SLAs, gestão de fornecedores e alinhamento entre TI e negócio.',
    color: '#510B61',
    questions: [
      {
        id: 'gov_1',
        text: 'Existe um orçamento definido e aprovado para TI? Como são tomadas as decisões de investimento em tecnologia?',
        hint: 'Planejamento anual, aprovações, ROI.',
        weight: 1
      },
      {
        id: 'gov_2',
        text: 'A empresa possui contratos formais com SLA definido para seus principais fornecedores de TI?',
        hint: 'Disponibilidade, tempo de resposta, penalidades.',
        weight: 1
      },
      {
        id: 'gov_3',
        text: 'Existe documentação atualizada da infraestrutura, sistemas e processos de TI?',
        hint: 'Diagramas de rede, inventário, manuais.',
        weight: 0.9
      },
      {
        id: 'gov_4',
        text: 'Como é medida e reportada a performance de TI para a liderança da empresa?',
        hint: 'Indicadores, reuniões, dashboards.',
        weight: 1
      },
      {
        id: 'gov_5',
        text: 'A área de TI participa do planejamento estratégico do negócio? As iniciativas de TI estão alinhadas com os objetivos da empresa?',
        hint: 'Alinhamento estratégico, roadmap tecnológico.',
        weight: 1.2
      }
    ]
  },
  {
    id: 'data_bi',
    name: 'Dados & Business Intelligence',
    icon: '📊',
    description: 'Avalia qualidade dos dados, uso de analytics, relatórios gerenciais e cultura data-driven.',
    color: '#18B8FF',
    questions: [
      {
        id: 'data_1',
        text: 'Quais ferramentas a empresa usa para gerar relatórios gerenciais? Os dados são confiáveis e atualizados?',
        hint: 'Excel, Power BI, ERP, planilhas manuais.',
        weight: 1
      },
      {
        id: 'data_2',
        text: 'Os líderes e gestores tomam decisões baseados em dados ou predominantemente por intuição e experiência?',
        hint: 'Cultura data-driven, frequência de uso de relatórios.',
        weight: 1.2
      },
      {
        id: 'data_3',
        text: 'Os dados da empresa estão integrados entre os sistemas (ERP, CRM, financeiro, obras)? Ou há silos de informação?',
        hint: 'Integração de sistemas, dados duplicados, inconsistências.',
        weight: 1.1
      },
      {
        id: 'data_4',
        text: 'Existe um processo de qualidade de dados? Alguém é responsável por garantir que os dados estejam corretos?',
        hint: 'Data owner, processos de validação, limpeza de dados.',
        weight: 1
      },
      {
        id: 'data_5',
        text: 'A empresa utiliza indicadores de desempenho (KPIs) formais para monitorar resultados de negócio?',
        hint: 'OKRs, dashboards, metas mensuráveis.',
        weight: 1
      }
    ]
  },
  {
    id: 'digital_transformation',
    name: 'Transformação Digital',
    icon: '🔄',
    description: 'Avalia digitalização de processos, automação, sistemas de gestão e maturidade operacional digital.',
    color: '#DB05FF',
    questions: [
      {
        id: 'dt_1',
        text: 'Quais processos da empresa ainda são realizados de forma manual, em papel ou planilhas? Quais já foram digitalizados?',
        hint: 'Contratos, aprovações, financeiro, obras, RH.',
        weight: 1
      },
      {
        id: 'dt_2',
        text: 'A empresa utiliza algum ERP ou sistema de gestão integrado? Qual e como é usado na prática?',
        hint: 'SAP, TOTVS, Sienge, Mega, outros.',
        weight: 1.1
      },
      {
        id: 'dt_3',
        text: 'Existem automações de processos repetitivos? Por exemplo: geração automática de relatórios, aprovações por workflow, integração entre sistemas.',
        hint: 'RPA, integrações via API, workflows digitais.',
        weight: 1.1
      },
      {
        id: 'dt_4',
        text: 'Como é a comunicação e colaboração interna? A equipe usa ferramentas digitais de forma eficiente?',
        hint: 'Microsoft 365, Google Workspace, Slack, Teams.',
        weight: 0.9
      },
      {
        id: 'dt_5',
        text: 'Existe um roadmap ou plano de transformação digital para os próximos 1-2 anos?',
        hint: 'Iniciativas planejadas, responsável, orçamento.',
        weight: 1.2
      },
      {
        id: 'dt_6',
        text: 'Como é gerenciado o relacionamento com clientes digitalmente? Há uso de CRM ou plataformas de atendimento?',
        hint: 'CRM, portal do cliente, atendimento digital.',
        weight: 1
      }
    ]
  },
  {
    id: 'ai_adoption',
    name: 'Adoção de Inteligência Artificial',
    icon: '🤖',
    description: 'Avalia o uso atual e o potencial de IA generativa, automação inteligente e maturidade de adoção de IA no negócio.',
    color: '#18B8FF',
    questions: [
      {
        id: 'ai_1',
        text: 'Sua empresa já utiliza ferramentas de Inteligência Artificial no dia a dia? Quais e para quê?',
        hint: 'ChatGPT, Copilot, ferramentas de IA em sistemas existentes.',
        weight: 1
      },
      {
        id: 'ai_2',
        text: 'Os colaboradores utilizam IA generativa (como ChatGPT ou similares) para suas tarefas? Isso é encorajado ou há restrições?',
        hint: 'Política de uso, treinamento, adoção espontânea.',
        weight: 1.1
      },
      {
        id: 'ai_3',
        text: 'A liderança da empresa vê a IA como oportunidade estratégica ou como uma tendência distante do negócio?',
        hint: 'Visão estratégica, iniciativas em discussão, ceticismo.',
        weight: 1.2
      },
      {
        id: 'ai_4',
        text: 'Existe algum processo ou área onde a IA poderia trazer ganho imediato que ainda não foi explorado?',
        hint: 'Análise de documentos, atendimento, previsões, automação.',
        weight: 1
      },
      {
        id: 'ai_5',
        text: 'A empresa tem dados estruturados e de qualidade suficiente para alimentar modelos de IA ou analytics avançado?',
        hint: 'Maturidade dos dados como pré-requisito para IA.',
        weight: 1.1
      },
      {
        id: 'ai_6',
        text: 'Existe preocupação com os riscos da IA: alucinações, viés, segurança de dados, dependência de fornecedores?',
        hint: 'Governança de IA, AI Act, políticas internas.',
        weight: 0.9
      }
    ]
  },
  {
    id: 'innovation_culture',
    name: 'Inovação & Cultura Digital',
    icon: '💡',
    description: 'Avalia o mindset de inovação, capacitação digital dos colaboradores e liderança em transformação.',
    color: '#510B61',
    questions: [
      {
        id: 'innov_1',
        text: 'A cultura da empresa incentiva a inovação? Colaboradores são encorajados a propor melhorias e experimentar novas soluções?',
        hint: 'Processos de inovação, receptividade a mudanças.',
        weight: 1
      },
      {
        id: 'innov_2',
        text: 'Qual é o nível de capacitação digital dos colaboradores? A empresa investe em treinamento de tecnologia?',
        hint: 'Programas de capacitação, nível de letramento digital.',
        weight: 1.1
      },
      {
        id: 'innov_3',
        text: 'A liderança da empresa demonstra engajamento com a transformação digital? Lidera pelo exemplo?',
        hint: 'Sponsor executivo, uso pessoal de tecnologia pela liderança.',
        weight: 1.2
      },
      {
        id: 'innov_4',
        text: 'A empresa acompanha tendências tecnológicas do setor? Participa de eventos, associações ou benchmarks?',
        hint: 'Networking, eventos de tecnologia, visitas técnicas.',
        weight: 0.9
      },
      {
        id: 'innov_5',
        text: 'Existe espaço para projetos-piloto e experimentação de novas tecnologias sem risco para a operação?',
        hint: 'Labs, ambientes de sandbox, cultura de aprendizado por erro.',
        weight: 1
      }
    ]
  },
  {
    id: 'cx_digital',
    name: 'Experiência do Cliente Digital (CX)',
    icon: '🌐',
    description: 'Avalia os canais digitais de relacionamento com clientes, autoatendimento e presença digital.',
    color: '#DB05FF',
    questions: [
      {
        id: 'cx_1',
        text: 'Como os clientes interagem digitalmente com a empresa? Quais canais estão disponíveis?',
        hint: 'Site, app, portal, WhatsApp, e-mail, chat.',
        weight: 1
      },
      {
        id: 'cx_2',
        text: 'Existe um portal ou plataforma onde o cliente pode acompanhar pedidos, contratos ou o andamento de obras?',
        hint: 'Transparência e autoatendimento digital.',
        weight: 1.1
      },
      {
        id: 'cx_3',
        text: 'A empresa coleta e analisa sistematicamente a satisfação dos clientes? Como usa essas informações?',
        hint: 'NPS, pesquisas, feedback, ações tomadas.',
        weight: 1
      },
      {
        id: 'cx_4',
        text: 'A presença digital da empresa (site, redes sociais, Google) está alinhada com a qualidade dos produtos/serviços oferecidos?',
        hint: 'Reputação digital, avaliações, consistência de marca.',
        weight: 0.9
      },
      {
        id: 'cx_5',
        text: 'Existe integração entre os canais digitais de atendimento e os sistemas internos (CRM, ERP)?',
        hint: 'Omnichannel, dados do cliente disponíveis no atendimento.',
        weight: 1
      }
    ]
  }
];

export const MATURITY_LEVELS = [
  { min: 0,  max: 25,  label: 'Inicial',       color: '#EF4444', description: 'A empresa está no início da jornada digital, com processos predominantemente manuais e baixa estrutura tecnológica.' },
  { min: 25, max: 45,  label: 'Básico',         color: '#F97316', description: 'Há iniciativas isoladas de tecnologia, mas falta integração, governança e visão estratégica.' },
  { min: 45, max: 65,  label: 'Intermediário',  color: '#EAB308', description: 'A empresa possui boa base tecnológica com oportunidades claras de evolução e integração.' },
  { min: 65, max: 80,  label: 'Avançado',       color: '#22C55E', description: 'TI é parceiro estratégico do negócio, com processos bem estruturados e uso efetivo de dados.' },
  { min: 80, max: 101, label: 'Referência',     color: '#18B8FF', description: 'A empresa é referência em maturidade digital, com inovação contínua e tecnologia como diferencial competitivo.' }
];

export const SECTORS = [
  'Construção Civil',
  'Incorporação Imobiliária',
  'Indústria',
  'Varejo',
  'Agronegócio',
  'Saúde',
  'Educação',
  'Logística & Transporte',
  'Serviços Financeiros',
  'Tecnologia',
  'Serviços Profissionais',
  'Governo & Setor Público',
  'Outro'
];

export function getMaturityLevel(score) {
  return MATURITY_LEVELS.find(l => score >= l.min && score < l.max) || MATURITY_LEVELS[MATURITY_LEVELS.length - 1];
}

export function calculatePillarScore(questionsWithScores) {
  if (!questionsWithScores || questionsWithScores.length === 0) return 0;
  const totalWeight = questionsWithScores.reduce((sum, q) => sum + (q.weight || 1), 0);
  const weightedSum = questionsWithScores.reduce((sum, q) => sum + ((q.score || 0) * (q.weight || 1)), 0);
  return Math.round((weightedSum / totalWeight) * 10);
}

export function calculateOverallScore(pillarResults) {
  if (!pillarResults || pillarResults.length === 0) return 0;
  const sum = pillarResults.reduce((acc, p) => acc + (p.score || 0), 0);
  return Math.round(sum / pillarResults.length);
}
