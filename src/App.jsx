import { useState } from 'react';
import { useAssessment } from './hooks/useAssessment';
import { PILLARS, getMaturityLevel, calculatePillarScore } from './data/pillars';
import { BUSINESS_PILLARS } from './data/businessPillars';
import { analyzePillar, generateReport } from './utils/claudeApi';
import { isAuthenticated, logout } from './utils/auth';

import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import SetupScreen from './components/SetupScreen';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import AnalysisScreen from './components/AnalysisScreen';
import Report from './components/Report';
import HistoryScreen from './components/HistoryScreen';
import './App.css';

export default function App() {
  // ── All hooks must be at the top — no conditional calls ──────────
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const [historyView, setHistoryView]     = useState('none');
  const [historyEntry, setHistoryEntry]   = useState(null);

  const {
    state,
    update,
    setAnswer,
    getAnswer,
    selectedPillars,
    currentPillar,
    lastSavedAt,
    startAssessment,
    goToNextQuestion,
    goToPrevQuestion,
    isLastQuestion,
    startAnalysis,
    setAnalysisProgress,
    finishAssessment,
    resetAssessment,
    resumeAssessment,
    listDrafts,
    deleteDraftById,
  } = useAssessment();

  const { step, companyInfo, assessmentType, currentPillarIndex, currentQuestionIndex, answers, analysisProgress, analysisStatus } = state;

  const availablePillars = assessmentType === 'business' ? BUSINESS_PILLARS : PILLARS;

  // ── AUTH GATE ────────────────────────────────────────────────────
  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  function handleLogout() {
    logout();
    setAuthenticated(false);
  }

  function handleReset() {
    resetAssessment();
    setHistoryView('none');
    setHistoryEntry(null);
  }

  function handleSelectType(type) {
    update({ assessmentType: type, step: 'setup' });
  }

  function openHistory() {
    setHistoryView('list');
    setHistoryEntry(null);
  }

  function viewHistoryReport(entry) {
    setHistoryEntry(entry);
    setHistoryView('detail');
  }

  function handleResumeDraft(draft) {
    resumeAssessment(draft);
    setHistoryView('none');
  }

  function handleDeleteDraft(id) {
    deleteDraftById(id);
  }

  async function runAnalysis() {
    startAnalysis();

    const totalSteps = selectedPillars.length + 1;
    let completed = 0;
    const pillarResults = [];

    for (const pillar of selectedPillars) {
      setAnalysisProgress(
        Math.round((completed / totalSteps) * 90),
        { label: `Analisando: ${pillar.name}...`, done: false }
      );

      const questionsWithAnswers = pillar.questions.map(q => ({
        id: q.id,
        text: q.text,
        weight: q.weight,
        answer: answers[q.id]?.text || answers[q.id]?.audioTranscript || '',
      }));

      try {
        const result = await analyzePillar(pillar, questionsWithAnswers);

        const scoreData = pillar.questions.map(q => {
          const s = result.scores?.find(sc => sc.questionId === q.id);
          return { ...q, score: s?.score ?? 5 };
        });
        const score = result.pillarScore ?? calculatePillarScore(scoreData);
        const maturity = getMaturityLevel(score);

        pillarResults.push({
          id: pillar.id,
          name: pillar.name,
          icon: pillar.icon,
          color: pillar.color,
          score,
          maturityLabel: maturity.label,
          maturityColor: maturity.color,
          strengths: result.strengths || [],
          weaknesses: result.weaknesses || [],
          summary: result.summary || '',
          scores: result.scores || [],
        });

        completed++;
        setAnalysisProgress(
          Math.round((completed / totalSteps) * 90),
          { label: `${pillar.name}: ${score}% (${maturity.label})`, done: true }
        );
      } catch {
        pillarResults.push({
          id: pillar.id,
          name: pillar.name,
          icon: pillar.icon,
          color: pillar.color,
          score: 50,
          maturityLabel: 'Intermediário',
          maturityColor: '#EAB308',
          strengths: [],
          weaknesses: [],
          summary: '',
          scores: [],
        });
        completed++;
        setAnalysisProgress(
          Math.round((completed / totalSteps) * 90),
          { label: `${pillar.name}: erro na análise`, done: true }
        );
      }
    }

    setAnalysisProgress(92, { label: 'Gerando relatório executivo...', done: false });

    let reportData = null;
    try {
      reportData = await generateReport(companyInfo, pillarResults);
    } catch {
      // Finaliza sem dados de relatório se a geração falhar
    }

    setAnalysisProgress(100, { label: 'Relatório concluído!', done: true });
    await new Promise(r => setTimeout(r, 600));
    finishAssessment(pillarResults, reportData);
  }

  // ── HISTORY — detail view ────────────────────────────────────────
  if (historyView === 'detail' && historyEntry) {
    return (
      <div className="nx-page">
        <div className="nx-topline" />
        <Header onHistory={openHistory} onLogout={handleLogout} />
        <Report
          companyInfo={historyEntry.companyInfo}
          pillarResults={historyEntry.pillarResults}
          reportData={historyEntry.reportData}
          onReset={handleReset}
          onHistory={() => setHistoryView('list')}
        />
      </div>
    );
  }

  // ── HISTORY — list ───────────────────────────────────────────────
  if (historyView === 'list') {
    return (
      <div className="nx-page">
        <div className="nx-topline" />
        <Header onHistory={openHistory} onLogout={handleLogout} />
        <HistoryScreen
          onViewReport={viewHistoryReport}
          onClose={() => setHistoryView('none')}
          onResumeDraft={handleResumeDraft}
          onDeleteDraft={handleDeleteDraft}
        />
      </div>
    );
  }

  // ── HOME ─────────────────────────────────────────────────────────
  if (step === 'setup' && !assessmentType) {
    const draftCount = listDrafts().length;
    return (
      <div className="nx-page">
        <div className="nx-topline" />
        <Header onHistory={openHistory} draftCount={draftCount} onLogout={handleLogout} />
        <HomeScreen onSelect={handleSelectType} draftCount={draftCount} onOpenHistory={openHistory} />
      </div>
    );
  }

  // ── SETUP ────────────────────────────────────────────────────────
  if (step === 'setup' && assessmentType) {
    return (
      <div className="nx-page">
        <Header onHistory={openHistory} onLogout={handleLogout} />
        <SetupScreen
          pillars={availablePillars}
          assessmentType={assessmentType}
          onStart={startAssessment}
          onBack={() => update({ assessmentType: null })}
        />
      </div>
    );
  }

  // ── QUESTIONNAIRE ────────────────────────────────────────────────
  if (step === 'questionnaire' && currentPillar) {
    const questions  = currentPillar.questions;
    const question   = questions[currentQuestionIndex];
    const qNumber    = currentQuestionIndex + 1;
    const isFirst    = currentPillarIndex === 0 && currentQuestionIndex === 0;
    const isLast     = isLastQuestion();
    const pillarInfo = `${currentPillar.icon} ${currentPillar.name} · Pilar ${currentPillarIndex + 1} de ${selectedPillars.length}`;

    return (
      <div className="nx-page">
        <Header
          pillarInfo={pillarInfo}
          onLogout={handleLogout}
          onReset={() => {
            if (window.confirm('Pausar o assessment? O progresso foi salvo e pode ser retomado em Assessments → Em andamento.')) {
              handleReset();
            }
          }}
        />
        <ProgressBar
          current={qNumber}
          total={questions.length}
          pillarIndex={currentPillarIndex}
          totalPillars={selectedPillars.length}
          pillarName={currentPillar.name}
          lastSavedAt={lastSavedAt}
        />
        <div className="nx-container app-question-wrap">
          <QuestionCard
            question={question}
            questionNumber={qNumber}
            totalQuestions={questions.length}
            pillar={currentPillar}
            answer={getAnswer(question.id)}
            onAnswerChange={ans => setAnswer(question.id, ans)}
            onNext={isLast ? runAnalysis : goToNextQuestion}
            onPrev={goToPrevQuestion}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>
        <footer className="nx-footer">
          <strong>Nexloop</strong> · Empowering Your Business
        </footer>
      </div>
    );
  }

  // ── ANALYZING ────────────────────────────────────────────────────
  if (step === 'analyzing') {
    return (
      <div className="nx-page">
        <div className="nx-topline" />
        <AnalysisScreen
          progress={analysisProgress}
          statusItems={analysisStatus}
        />
      </div>
    );
  }

  // ── REPORT ───────────────────────────────────────────────────────
  if (step === 'report') {
    return (
      <div className="nx-page">
        <Header onHistory={openHistory} onLogout={handleLogout} />
        <Report
          companyInfo={companyInfo}
          pillarResults={state.pillarResults}
          reportData={state.reportData}
          onReset={handleReset}
          onHistory={openHistory}
        />
      </div>
    );
  }

  return null;
}
