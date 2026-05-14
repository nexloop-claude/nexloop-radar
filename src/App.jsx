import { useAssessment } from './hooks/useAssessment';
import { getMaturityLevel, calculatePillarScore } from './data/pillars';
import { analyzePillar, generateReport } from './utils/claudeApi';

import Header from './components/Header';
import SetupScreen from './components/SetupScreen';
import ProgressBar from './components/ProgressBar';
import QuestionCard from './components/QuestionCard';
import AnalysisScreen from './components/AnalysisScreen';
import Report from './components/Report';
import './App.css';

export default function App() {
  const {
    state,
    setAnswer,
    getAnswer,
    selectedPillars,
    currentPillar,
    startAssessment,
    goToNextQuestion,
    goToPrevQuestion,
    isLastQuestion,
    startAnalysis,
    setAnalysisProgress,
    finishAssessment,
    resetAssessment,
    hasSavedAssessment,
    resumeAssessment,
  } = useAssessment();

  const { step, companyInfo, currentPillarIndex, currentQuestionIndex, answers, analysisProgress, analysisStatus } = state;

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
      // Finalize without report data if generation fails
    }

    setAnalysisProgress(100, { label: 'Relatório concluído!', done: true });

    await new Promise(r => setTimeout(r, 600));
    finishAssessment(pillarResults, reportData);
  }

  function handleFinishQuestionnaire() {
    runAnalysis();
  }

  if (step === 'setup') {
    return (
      <div className="nx-page">
        <Header />
        <SetupScreen
          onStart={startAssessment}
          hasSaved={hasSavedAssessment()}
          onResume={resumeAssessment}
        />
        <footer className="nx-footer">
          <strong>Nexloop</strong> · Empowering Your Business
        </footer>
      </div>
    );
  }

  if (step === 'questionnaire' && currentPillar) {
    const questions = currentPillar.questions;
    const question = questions[currentQuestionIndex];
    const totalQInPillar = questions.length;
    const qNumber = currentQuestionIndex + 1;
    const isFirst = currentPillarIndex === 0 && currentQuestionIndex === 0;
    const isLast = isLastQuestion();

    const pillarInfo = `${currentPillar.icon} ${currentPillar.name} · Pilar ${currentPillarIndex + 1} de ${selectedPillars.length}`;

    return (
      <div className="nx-page">
        <Header
          pillarInfo={pillarInfo}
          onReset={() => {
            if (window.confirm('Cancelar o assessment? O progresso será salvo localmente.')) {
              resetAssessment();
            }
          }}
        />
        <ProgressBar
          current={qNumber}
          total={totalQInPillar}
          pillarIndex={currentPillarIndex}
          totalPillars={selectedPillars.length}
          pillarName={currentPillar.name}
        />
        <div className="nx-container app-question-wrap">
          <QuestionCard
            question={question}
            questionNumber={qNumber}
            totalQuestions={totalQInPillar}
            pillar={currentPillar}
            answer={getAnswer(question.id)}
            onAnswerChange={ans => setAnswer(question.id, ans)}
            onNext={isLast ? handleFinishQuestionnaire : goToNextQuestion}
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

  if (step === 'report') {
    return (
      <div className="nx-page">
        <Report
          companyInfo={companyInfo}
          pillarResults={state.pillarResults}
          reportData={state.reportData}
          onReset={resetAssessment}
        />
      </div>
    );
  }

  return null;
}
