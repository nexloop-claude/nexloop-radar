# Nexloop Radar

> Plataforma de Assessment de Maturidade Digital — powered by Nexloop + Claude AI

## Como usar

1. Acesse a URL do GitHub Pages após o deploy
2. Configure sua API Key Anthropic (botão no canto superior direito)
3. Crie um novo assessment, selecione os pilares e responda as perguntas
4. Receba o relatório com análise de IA e recomendações personalizadas

## Desenvolvimento local

```bash
git clone https://github.com/[seu-usuario]/nexloop-radar.git
cd nexloop-radar
npm install
npm run dev
```

Acesse http://localhost:5173/nexloop-radar/

## Configuração do GitHub Pages

1. Crie um repositório no GitHub chamado `nexloop-radar`
2. Ative o GitHub Pages em: Settings > Pages > Source: GitHub Actions
3. Faça push do código — o deploy acontece automaticamente

## Tecnologia

- React 18 + Vite
- API Anthropic (Claude Sonnet 4)
- MediaRecorder API para gravação de áudio
- SVG nativo para gráfico de radar
- GitHub Pages para hospedagem (deploy via GitHub Actions)
- Zero backend — 100% client-side
- Zero dependências de UI — CSS puro

---

Desenvolvido pela **Nexloop** · Empowering Your Business · nexloop.tech
