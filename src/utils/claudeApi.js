const BASE_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_VERSION = '2023-06-01';

function getApiKey() {
  return localStorage.getItem('nexloop_api_key') || '';
}

async function callClaude(messages, systemPrompt, maxTokens = 2000) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API Key não configurada. Configure em Configurações (⚙️).');

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('API Key inválida. Verifique nas Configurações.');
    if (response.status === 429) throw new Error('Limite de requisições atingido. Aguarde um momento.');
    throw new Error(err.error?.message || `Erro da API: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function validateApiKey(key) {
  if (!key) return false;
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    return response.ok || response.status === 400;
  } catch {
    return false;
  }
}


export async function analyzePillar(pillar, questionsWithAnswers) {
  const qList = questionsWithAnswers
    .map((q, i) => `${i + 1}. Pergunta: ${q.text}\n   Resposta: ${q.answer || '(sem resposta)'}`)
    .join('\n\n');

  const system = `Você é um especialista em transformação digital e maturidade tecnológica empresarial com mais de 15 anos de experiência assessando empresas brasileiras de médio e grande porte.`;

  const prompt = `Analise as respostas do questionário de assessment para o pilar "${pillar.name}".

Para cada pergunta, atribua uma nota de 0 a 10:
- 0-2: Inexistente / muito inicial
- 3-4: Básico / informal / apenas iniciando
- 5-6: Intermediário / parcialmente estruturado
- 7-8: Avançado / bem estruturado / consolidado
- 9-10: Referência / excelência / melhores práticas

Se a resposta estiver vazia ou indicar desconhecimento, dê nota baixa (0-2).
Se a resposta for vaga mas positiva, dê nota moderada (4-6).
Seja rigoroso e realista — a maioria das empresas brasileiras está em nível básico-intermediário.

Perguntas e respostas:
${qList}

Retorne APENAS um JSON válido (sem markdown, sem blocos de código) com esta estrutura exata:
{
  "scores": [
    {"questionId": "id_da_pergunta", "score": 7, "justification": "breve justificativa de 1 linha"}
  ],
  "pillarScore": 72,
  "strengths": ["Ponto forte 1 específico", "Ponto forte 2 específico"],
  "weaknesses": ["Oportunidade de melhoria 1 específica", "Oportunidade de melhoria 2 específica"],
  "summary": "Resumo de 2-3 linhas sobre este pilar específico para esta empresa."
}`;

  const raw = await callClaude(
    [{ role: 'user', content: prompt }],
    system,
    1500
  );

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Erro ao processar resposta da IA. Tente novamente.');
  }
}

export async function generateReport(companyInfo, pillarResults) {
  const pillarsText = pillarResults
    .map(p => `• ${p.name}: ${p.score}% (${p.maturityLabel})\n  Pontos fortes: ${p.strengths?.join(', ')}\n  Atenção: ${p.weaknesses?.join(', ')}`)
    .join('\n\n');

  const overallScore = Math.round(pillarResults.reduce((s, p) => s + p.score, 0) / pillarResults.length);
  const weakestPillars = [...pillarResults].sort((a, b) => a.score - b.score).slice(0, 3);

  const system = `Você é um consultor sênior da Nexloop, especialista em transformação digital para empresas brasileiras. Sua escrita é clara, profissional, orientada a resultados e com linguagem executiva.`;

  const prompt = `Gere um relatório executivo de assessment de maturidade digital para:

Empresa: ${companyInfo.company}
Setor: ${companyInfo.sector}
Responsável: ${companyInfo.responsible}
Data: ${new Date().toLocaleDateString('pt-BR')}
Score geral: ${overallScore}%

Resultados por pilar:
${pillarsText}

Pilares mais críticos (priorizar): ${weakestPillars.map(p => p.name).join(', ')}

Gere o relatório em JSON válido (sem markdown extra) com esta estrutura:
{
  "executiveSummary": "Parágrafo executivo de 4-5 linhas resumindo o assessment, situação atual e perspectivas.",
  "recommendations": [
    {
      "title": "Título da recomendação",
      "description": "Descrição de 2-3 linhas",
      "impact": "Alto/Médio/Baixo",
      "timeframe": "0-3 meses / 3-12 meses / 12-24 meses",
      "pillar": "Pilar relacionado"
    }
  ],
  "roadmap": {
    "shortTerm": [
      {"action": "Ação específica", "description": "Detalhamento", "owner": "Quem lidera"}
    ],
    "midTerm": [
      {"action": "Ação específica", "description": "Detalhamento", "owner": "Quem lidera"}
    ],
    "longTerm": [
      {"action": "Ação específica", "description": "Detalhamento", "owner": "Quem lidera"}
    ]
  }
}

Regras:
- Recomendações: exatamente 5, ordenadas por prioridade/impacto
- Roadmap: shortTerm tem 3 itens, midTerm tem 3 itens, longTerm tem 2 itens
- Seja específico para o setor ${companyInfo.sector}
- Use linguagem de negócios, não técnica demais
- Baseie as recomendações nos pilares mais fracos`;

  const raw = await callClaude(
    [{ role: 'user', content: prompt }],
    system,
    3000
  );

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Erro ao gerar relatório. Tente novamente.');
  }
}
