export const BUSINESS_PILLARS = [
  {
    id: 'biz_strategy',
    name: 'Estratégia & Visão Digital',
    icon: '🎯',
    description: 'Avalia o alinhamento da liderança com a agenda digital e a clareza da estratégia tecnológica.',
    color: '#18B8FF',
    questions: [
      {
        id: 'bs_1',
        text: 'A empresa possui uma estratégia digital clara e comunicada para as lideranças? Existe um responsável por conduzir essa agenda?',
        hint: 'CDO, comitê digital, roadmap tecnológico.',
        weight: 1.3
      },
      {
        id: 'bs_2',
        text: 'Como as iniciativas de tecnologia são priorizadas e aprovadas? Existe um processo formal de avaliação de investimentos em tecnologia?',
        hint: 'Comitê de TI, critérios de priorização, ROI esperado.',
        weight: 1.2
      },
      {
        id: 'bs_3',
        text: 'Os líderes de cada área participam ativamente das decisões de tecnologia que impactam seus setores?',
        hint: 'Engajamento dos diretores, alinhamento entre TI e negócio.',
        weight: 1.1
      },
      {
        id: 'bs_4',
        text: 'A empresa mede o retorno dos investimentos em tecnologia? Existem KPIs digitais acompanhados pela diretoria?',
        hint: 'ROI de projetos tecnológicos, indicadores de transformação digital.',
        weight: 1
      },
      {
        id: 'bs_5',
        text: 'Como a empresa monitora as tendências tecnológicas do setor de construção e incorporação para se manter competitiva?',
        hint: 'Benchmarking, participação em eventos, consultores, associações do setor.',
        weight: 0.9
      }
    ]
  },
  {
    id: 'biz_commercial',
    name: 'Comercial & Vendas',
    icon: '📈',
    description: 'Avalia o uso de tecnologia no processo comercial, gestão de leads, CRM e canais de venda.',
    color: '#DB05FF',
    questions: [
      {
        id: 'bc_1',
        text: 'A empresa utiliza um CRM para gestão de leads e acompanhamento do funil de vendas? Como é usado na prática?',
        hint: 'Salesforce, HubSpot, RD Station, planilhas, outros.',
        weight: 1.2
      },
      {
        id: 'bc_2',
        text: 'Como são captados os leads digitalmente? A empresa utiliza marketing digital integrado ao processo de vendas?',
        hint: 'Landing pages, portais imobiliários, redes sociais, Google Ads.',
        weight: 1.1
      },
      {
        id: 'bc_3',
        text: 'O time de vendas tem visibilidade em tempo real do pipeline, metas e desempenho individual? Como acompanha esses indicadores?',
        hint: 'Dashboards de vendas, relatórios automáticos, reuniões de resultado.',
        weight: 1
      },
      {
        id: 'bc_4',
        text: 'Como é gerenciado o processo de proposta, contrato e assinatura com o cliente? Existe algum nível de automação ou digitalização?',
        hint: 'Assinatura digital, geração automática de propostas, contratos eletrônicos.',
        weight: 1.1
      },
      {
        id: 'bc_5',
        text: 'A empresa utiliza alguma plataforma digital para apresentação de produtos (ex: tour virtual, plantas interativas, simuladores de financiamento)?',
        hint: 'Metaverso imobiliário, tours 360°, simuladores online, decorados digitais.',
        weight: 1
      },
      {
        id: 'bc_6',
        text: 'Após a venda, como é feita a gestão do relacionamento com o cliente até a entrega do imóvel? Existe um sistema de acompanhamento?',
        hint: 'CRM pós-venda, portal do cliente, comunicação estruturada.',
        weight: 1
      }
    ]
  },
  {
    id: 'biz_marketing',
    name: 'Marketing & Comunicação',
    icon: '📣',
    description: 'Avalia presença digital, estratégia de conteúdo, automação de marketing e análise de dados.',
    color: '#510B61',
    questions: [
      {
        id: 'bm_1',
        text: 'Qual é a estratégia de presença digital da empresa? Como são geridos site, redes sociais e anúncios online?',
        hint: 'Frequência de publicação, responsável, budget de mídia paga.',
        weight: 1
      },
      {
        id: 'bm_2',
        text: 'A empresa mensura os resultados das ações de marketing digital? Quais métricas são acompanhadas?',
        hint: 'CPL, taxa de conversão, ROI de campanhas, CAC.',
        weight: 1.1
      },
      {
        id: 'bm_3',
        text: 'Existe integração entre as ações de marketing digital e o CRM de vendas? Os leads gerados online chegam ao time comercial de forma automática?',
        hint: 'Integração de plataformas, qualificação automática de leads, SLA.',
        weight: 1.2
      },
      {
        id: 'bm_4',
        text: 'A empresa utiliza automação de marketing para nutrição de leads e comunicação com clientes? (e-mail, WhatsApp, SMS)',
        hint: 'RD Station, HubSpot, ActiveCampaign, automações de WhatsApp.',
        weight: 1
      },
      {
        id: 'bm_5',
        text: 'Como é gerenciada a reputação digital da empresa? Existe monitoramento de avaliações e menções em plataformas como Google, Reclame Aqui e redes sociais?',
        hint: 'Ferramentas de monitoramento, processo de resposta, gestão de crise.',
        weight: 0.9
      }
    ]
  },
  {
    id: 'biz_rh',
    name: 'Gestão de Pessoas (RH)',
    icon: '👥',
    description: 'Avalia a digitalização dos processos de RH, recrutamento, capacitação e experiência do colaborador.',
    color: '#18B8FF',
    questions: [
      {
        id: 'brh_1',
        text: 'A empresa utiliza algum sistema de gestão de RH (HRIS)? Como são gerenciados ponto, folha, férias e benefícios digitalmente?',
        hint: 'Totvs RH, Senior, Sólides, ADP, Gupy, sistemas próprios.',
        weight: 1.1
      },
      {
        id: 'brh_2',
        text: 'Como é o processo de recrutamento e seleção? Existem plataformas digitais para agilizar a contratação?',
        hint: 'ATS, LinkedIn Recruiter, Gupy, Indeed, triagem automatizada.',
        weight: 1
      },
      {
        id: 'brh_3',
        text: 'Existe uma plataforma ou processo estruturado para capacitação e treinamento dos colaboradores, incluindo operários e equipes de obra?',
        hint: 'LMS, e-learning, trilhas de desenvolvimento, treinamentos NR digitalizados.',
        weight: 1.1
      },
      {
        id: 'brh_4',
        text: 'Como a empresa mede o engajamento e satisfação dos colaboradores? Existem pesquisas ou ferramentas digitais para esse fim?',
        hint: 'eNPS, pulse surveys, plataformas de reconhecimento.',
        weight: 0.9
      },
      {
        id: 'brh_5',
        text: 'O controle de ponto e jornada dos colaboradores em obra é feito de forma digital? Como é gerenciado o banco de horas?',
        hint: 'Ponto eletrônico em obra, app de marcação, integração com folha.',
        weight: 1.2
      }
    ]
  },
  {
    id: 'biz_finance',
    name: 'Financeiro & Controladoria',
    icon: '💰',
    description: 'Avalia automação financeira, visibilidade do fluxo de caixa, relatórios gerenciais e integração com ERP.',
    color: '#DB05FF',
    questions: [
      {
        id: 'bf_1',
        text: 'Como são gerados os relatórios financeiros e de controladoria? O processo é automatizado ou ainda depende de planilhas manuais?',
        hint: 'ERP, BI, planilhas, frequência de fechamento.',
        weight: 1.2
      },
      {
        id: 'bf_2',
        text: 'A empresa tem visibilidade em tempo real do fluxo de caixa por obra/empreendimento? Como é feito o controle de custos por projeto?',
        hint: 'Centro de custo por obra, DRE por empreendimento, projeções.',
        weight: 1.3
      },
      {
        id: 'bf_3',
        text: 'Como é feita a conciliação bancária e o contas a pagar/receber? Existe integração entre o sistema financeiro e o banco?',
        hint: 'Open banking, integração ERP-banco, automação de pagamentos.',
        weight: 1.1
      },
      {
        id: 'bf_4',
        text: 'O orçamento anual e o planejamento financeiro são feitos com apoio de ferramentas adequadas? Como é feito o acompanhamento do realizado vs. orçado?',
        hint: 'Budget, forecast, variância, ferramentas de planejamento.',
        weight: 1
      },
      {
        id: 'bf_5',
        text: 'A empresa emite e recebe documentos fiscais (NF-e, NFS-e, boletos) de forma digitalizada e integrada aos sistemas?',
        hint: 'Emissor de NF integrado, gestão de boletos, SPED automático.',
        weight: 1
      }
    ]
  },
  {
    id: 'biz_legal',
    name: 'Jurídico & Compliance',
    icon: '⚖️',
    description: 'Avalia a gestão digital de contratos, conformidade regulatória, LGPD e ferramentas jurídicas.',
    color: '#510B61',
    questions: [
      {
        id: 'bjl_1',
        text: 'Como é feita a gestão de contratos (clientes, fornecedores, parceiros)? Existe um repositório digital centralizado com alertas de vencimento?',
        hint: 'CLM, assinatura digital, controle de prazos e renovações.',
        weight: 1.2
      },
      {
        id: 'bjl_2',
        text: 'A empresa possui processo estruturado para compliance com a LGPD? Sabe quais dados pessoais coleta de clientes e colaboradores?',
        hint: 'Mapeamento de dados, consentimento, DPO, incidentes.',
        weight: 1.3
      },
      {
        id: 'bjl_3',
        text: 'Como são gerenciadas as aprovações regulatórias de projetos (prefeitura, cartório, INSS, CEF)? Existe controle de prazos e documentação?',
        hint: 'Processos de aprovação, licenças, controle de pendências regulatórias.',
        weight: 1.1
      },
      {
        id: 'bjl_4',
        text: 'A empresa usa assinatura eletrônica/digital para contratos de venda, distrato ou documentos internos?',
        hint: 'DocuSign, D4Sign, ClickSign, validade jurídica, MP 2.200-2.',
        weight: 1
      },
      {
        id: 'bjl_5',
        text: 'Como são monitoradas e gerenciadas as ações judiciais em andamento? Existe um sistema para acompanhamento de processos?',
        hint: 'Sistemas jurídicos, JusBrasil, controle de prazos processuais.',
        weight: 0.9
      }
    ]
  },
  {
    id: 'biz_cx',
    name: 'Atendimento & Experiência do Cliente',
    icon: '🤝',
    description: 'Avalia os canais de atendimento, satisfação do cliente, pós-venda e experiência digital.',
    color: '#18B8FF',
    questions: [
      {
        id: 'bcx_1',
        text: 'Quais são os canais digitais de atendimento ao cliente disponíveis? Como são gerenciados e qual é o tempo médio de resposta?',
        hint: 'WhatsApp, chat, e-mail, portal, 0800, app próprio.',
        weight: 1
      },
      {
        id: 'bcx_2',
        text: 'A empresa mede sistematicamente a satisfação dos clientes ao longo da jornada (pré-venda, pós-venda, entrega, pós-entrega)?',
        hint: 'NPS, CSAT, pesquisas na entrega de chaves, reclamações formais.',
        weight: 1.2
      },
      {
        id: 'bcx_3',
        text: 'Existe um portal ou aplicativo onde o cliente pode acompanhar o andamento da obra, acessar documentos e solicitar assistência técnica?',
        hint: 'Portal do cliente, app de acompanhamento, transparência da obra.',
        weight: 1.2
      },
      {
        id: 'bcx_4',
        text: 'Como é gerenciado o processo de assistência técnica pós-entrega? Existe um sistema para abertura e acompanhamento de chamados?',
        hint: 'Helpdesk, app de assistência, SLA de atendimento, garantias.',
        weight: 1.1
      },
      {
        id: 'bcx_5',
        text: 'As reclamações e feedbacks dos clientes são analisados sistematicamente para gerar melhorias nos processos da empresa?',
        hint: 'Análise de causa raiz, ciclo de melhoria contínua, VOC.',
        weight: 1
      }
    ]
  },
  {
    id: 'biz_supplies',
    name: 'Suprimentos',
    icon: '🏗️',
    description: 'Avalia a gestão de materiais, cotações, fornecedores e controle de estoque em obras e incorporações.',
    color: '#DB05FF',
    questions: [
      {
        id: 'bsu_1',
        text: 'Como é feito o processo de cotação de materiais? A empresa utiliza alguma plataforma digital para comparar preços e selecionar fornecedores?',
        hint: 'Plataformas de cotação, e-procurement, cotação por e-mail/WhatsApp, planilhas.',
        weight: 1.2
      },
      {
        id: 'bsu_2',
        text: 'Existe integração entre o orçamento da obra e o processo de compra de materiais? Como é garantido que as compras respeitam o orçamento previsto?',
        hint: 'ERP de obras, Sienge, Volare, TOTVS Construção, controle de verba.',
        weight: 1.3
      },
      {
        id: 'bsu_3',
        text: 'Como é feito o controle de estoque de materiais nos canteiros de obra? Existe rastreabilidade de entrada, consumo e saldo?',
        hint: 'Sistema de almoxarifado em obra, contagem periódica, app de registro.',
        weight: 1.2
      },
      {
        id: 'bsu_4',
        text: 'A empresa possui um cadastro e avaliação formal de fornecedores? Como é feita a homologação e o acompanhamento de desempenho?',
        hint: 'Qualificação de fornecedores, scorecard, histórico de desempenho.',
        weight: 1
      },
      {
        id: 'bsu_5',
        text: 'Como são gerenciados os contratos de fornecimento de materiais de longo prazo? Existe controle de preços acordados vs. praticados?',
        hint: 'Contratos de fornecimento, planilha de preços, reajustes contratuais.',
        weight: 1
      },
      {
        id: 'bsu_6',
        text: 'A empresa tem visibilidade antecipada das necessidades de material por obra, permitindo planejar compras e evitar desabastecimento ou excesso de estoque?',
        hint: 'Planejamento de suprimentos baseado em cronograma físico, curva ABC de materiais.',
        weight: 1.1
      }
    ]
  },
  {
    id: 'biz_procurement',
    name: 'Compras Administrativas',
    icon: '🛒',
    description: 'Avalia o processo de compras de insumos e serviços administrativos, aprovações, controle de gastos e fornecedores.',
    color: '#510B61',
    questions: [
      {
        id: 'bpr_1',
        text: 'Como funciona o processo de solicitação e aprovação de compras administrativas? Existe um fluxo de aprovação digital por alçada?',
        hint: 'Workflow de aprovação, limites por cargo, sistema de requisição.',
        weight: 1.2
      },
      {
        id: 'bpr_2',
        text: 'A empresa tem controle centralizado de gastos administrativos por centro de custo e categoria? Como é monitorado o orçamento de despesas?',
        hint: 'Categorização de despesas, ERP, relatórios de gastos, cartão corporativo.',
        weight: 1.1
      },
      {
        id: 'bpr_3',
        text: 'Contratos de serviços recorrentes (limpeza, segurança, manutenção, utilities) são gerenciados de forma centralizada com controle de vencimentos?',
        hint: 'Gestão de contratos administrativos, renovações, reajustes, SLA.',
        weight: 1
      },
      {
        id: 'bpr_4',
        text: 'O processo de prestação de contas, adiantamentos e reembolsos é digitalizado? Como os colaboradores submetem despesas?',
        hint: 'Concur, Conta Simples, SAP Concur, app de despesas, planilhas.',
        weight: 1
      },
      {
        id: 'bpr_5',
        text: 'A empresa realiza análises periódicas de gastos administrativos para identificar oportunidades de redução de custos?',
        hint: 'Análise de spend, renegociação com fornecedores, benchmarking de preços.',
        weight: 0.9
      }
    ]
  },
  {
    id: 'biz_incorporation',
    name: 'Incorporação',
    icon: '🏢',
    description: 'Avalia a digitalização do processo de incorporação: viabilidade, aprovações, gestão de lançamentos e relacionamento com compradores.',
    color: '#18B8FF',
    questions: [
      {
        id: 'bi_1',
        text: 'Como é feito o estudo de viabilidade econômica e financeira de novos empreendimentos? Existem ferramentas ou modelos padronizados?',
        hint: 'VGV, TIR, VPL, modelos de viabilidade, softwares especializados.',
        weight: 1.3
      },
      {
        id: 'bi_2',
        text: 'O processo de aprovação e registro de empreendimentos (prefeitura, cartório, SPE, RET) é controlado digitalmente? Há rastreabilidade dos prazos?',
        hint: 'Cronograma de aprovações, controle de documentos, alertas de prazo.',
        weight: 1.2
      },
      {
        id: 'bi_3',
        text: 'Como é estruturado o processo de lançamento de um empreendimento? Existe integração entre incorporação, comercial e marketing na plataforma tecnológica?',
        hint: 'Sistemas integrados, gestão de estoque de unidades, tabela de preços digital.',
        weight: 1.2
      },
      {
        id: 'bi_4',
        text: 'A gestão dos contratos de compromisso de compra e venda é feita de forma digitalizada? Como é controlado o repasse e o financiamento bancário?',
        hint: 'Gestão de contratos de venda, ITBI, financiamento CEF/SBPE, distrato.',
        weight: 1.1
      },
      {
        id: 'bi_5',
        text: 'O setor de incorporação tem acesso a indicadores de desempenho do empreendimento (velocidade de vendas, VSO, inadimplência, evolução do obra)?',
        hint: 'Dashboard de incorporação, BI por empreendimento, relatórios de gestão.',
        weight: 1.1
      },
      {
        id: 'bi_6',
        text: 'Como é feita a gestão da documentação técnica e legal dos empreendimentos (memorial descritivo, especificações, habite-se)?',
        hint: 'GED, repositório de documentos, controle de versões, digitalização.',
        weight: 1
      }
    ]
  },
  {
    id: 'biz_logistics',
    name: 'Logística',
    icon: '🚚',
    description: 'Avalia a gestão de transporte, entrega de materiais, frota, rastreamento e logística de canteiro.',
    color: '#DB05FF',
    questions: [
      {
        id: 'bl_1',
        text: 'Como é gerenciado o transporte e a entrega de materiais aos canteiros de obra? Existe planejamento de entregas integrado ao cronograma de obra?',
        hint: 'Janelas de entrega, agendamento, controle de recebimento.',
        weight: 1.2
      },
      {
        id: 'bl_2',
        text: 'A empresa possui frota própria? Se sim, como é feita a gestão de veículos, manutenção, abastecimento e rotas?',
        hint: 'Sistema de gestão de frota, telemetria, manutenção preventiva.',
        weight: 1
      },
      {
        id: 'bl_3',
        text: 'Como é feito o recebimento e conferência de materiais na obra? O processo é registrado digitalmente com rastreabilidade?',
        hint: 'App de recebimento, leitura de NF, conferência eletrônica, divergências.',
        weight: 1.2
      },
      {
        id: 'bl_4',
        text: 'Existe visibilidade sobre a localização e status de entregas em trânsito? Como são tratados os atrasos de fornecedores?',
        hint: 'Rastreamento de entregas, comunicação com fornecedores, gestão de ocorrências.',
        weight: 1
      },
      {
        id: 'bl_5',
        text: 'Como é gerenciada a movimentação interna de materiais e equipamentos entre canteiros, almoxarifado e frentes de trabalho?',
        hint: 'Controle de movimentação interna, transferências entre obras, inventário.',
        weight: 1.1
      }
    ]
  },
  {
    id: 'biz_engineering',
    name: 'Engenharia',
    icon: '⚙️',
    description: 'Avalia o uso de tecnologia em projetos, gestão técnica de obras, controle de qualidade e documentação de engenharia.',
    color: '#510B61',
    questions: [
      {
        id: 'be_1',
        text: 'Quais softwares de projeto e modelagem a empresa utiliza? Existe adoção de BIM (Building Information Modeling)?',
        hint: 'AutoCAD, Revit, ArchiCAD, BIM 360, nível de maturidade BIM.',
        weight: 1.2
      },
      {
        id: 'be_2',
        text: 'Como é feito o orçamento e planejamento físico-financeiro das obras? Existe integração entre o orçamento previsto e o acompanhamento do realizado?',
        hint: 'SINAPI, Volare, Sienge, Microsoft Project, integração orçamento x ERP.',
        weight: 1.3
      },
      {
        id: 'be_3',
        text: 'O controle de qualidade e as inspeções de obra são registrados digitalmente? Existem checklists e relatórios de não conformidade em sistema?',
        hint: 'App de inspeção, ISO 9001, PBQP-H, registro fotográfico georeferenciado.',
        weight: 1.2
      },
      {
        id: 'be_4',
        text: 'Como é feita a gestão e distribuição de projetos e revisões para a equipe de obra? Existe controle de versões e compatibilização de projetos?',
        hint: 'GED de projetos, Autodesk Docs, Construmanager, controle de revisões.',
        weight: 1.1
      },
      {
        id: 'be_5',
        text: 'A empresa utiliza tecnologias de monitoramento ou produtividade em obra, como drones, IoT, sensores ou câmeras de progresso?',
        hint: 'Drones para topografia, monitoramento de segurança, avanço físico visual.',
        weight: 0.9
      },
      {
        id: 'be_6',
        text: 'Como é gerenciada a segurança do trabalho na obra? Os registros de SSO (treinamentos, incidentes, DDS) são feitos em sistema digital?',
        hint: 'App de SSO, e-Social, relatórios de acidente, DDS digital, ASO.',
        weight: 1.2
      }
    ]
  }
];

export const BUSINESS_MATURITY_LEVELS = [
  { min: 0,  max: 25,  label: 'Inicial',       color: '#EF4444', description: 'A área ainda opera de forma predominantemente manual, com baixa adoção de ferramentas digitais e processos pouco estruturados.' },
  { min: 25, max: 45,  label: 'Básico',         color: '#F97316', description: 'Há ferramentas pontuais em uso, mas sem integração entre sistemas. Processos dependem muito de pessoas-chave e planilhas.' },
  { min: 45, max: 65,  label: 'Intermediário',  color: '#EAB308', description: 'A área possui bons sistemas em operação, com oportunidades claras de integração e ganho de eficiência.' },
  { min: 65, max: 80,  label: 'Avançado',       color: '#22C55E', description: 'Processos bem digitalizados, com dados confiáveis e tomada de decisão baseada em indicadores.' },
  { min: 80, max: 101, label: 'Referência',     color: '#18B8FF', description: 'A área é referência em uso de tecnologia, com processos automatizados, integrados e orientados por dados.' }
];
