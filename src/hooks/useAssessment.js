import { useState, useEffect, useCallback } from 'react';
import { PILLARS } from '../data/pillars';

const STORAGE_KEY = 'nexloop_current_assessment';
const HISTORY_KEY = 'nexloop_history';

const initialState = {
  step: 'setup',          // setup | questionnaire | analyzing | report
  companyInfo: {
    company: '',
    responsible: '',
    sector: 'Construção Civil',
    date: new Date().toISOString().split('T')[0],
  },
  selectedPillarIds: ['infrastructure', 'cybersecurity', 'data_bi', 'digital_transformation', 'ai_adoption'],
  currentPillarIndex: 0,
  currentQuestionIndex: 0,
  answers: {},             // { questionId: { text: '', audioTranscript: '' } }
  pillarResults: [],       // analyzed results per pillar
  reportData: null,
  analysisProgress: 0,
  analysisStatus: [],
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveToCurrent(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      timestamp: Date.now(),
    }));
  } catch { /* ignore */ }
}

function saveToHistory(state) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({
      id: Date.now(),
      companyInfo: state.companyInfo,
      pillarResults: state.pillarResults,
      reportData: state.reportData,
      timestamp: Date.now(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  } catch { /* ignore */ }
}

export function useAssessment() {
  const [state, setState] = useState(() => loadSaved() || initialState);

  useEffect(() => {
    if (state.step !== 'setup') {
      saveToCurrent(state);
    }
  }, [state]);

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  const setAnswer = useCallback((questionId, answer) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: { ...(prev.answers[questionId] || {}), ...answer },
      },
    }));
  }, []);

  const getAnswer = useCallback((questionId) => {
    return state.answers[questionId] || { text: '', audioTranscript: '' };
  }, [state.answers]);

  const selectedPillars = PILLARS.filter(p => state.selectedPillarIds.includes(p.id));
  const currentPillar = selectedPillars[state.currentPillarIndex] || null;

  const totalQuestions = selectedPillars.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredQuestions = Object.values(state.answers).filter(a => a.text?.trim()).length;
  const overallProgress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  function startAssessment(companyInfo, selectedPillarIds) {
    setState({
      ...initialState,
      step: 'questionnaire',
      companyInfo,
      selectedPillarIds,
      answers: {},
      pillarResults: [],
      reportData: null,
      analysisProgress: 0,
      analysisStatus: [],
      currentPillarIndex: 0,
      currentQuestionIndex: 0,
    });
  }

  function goToNextQuestion() {
    if (!currentPillar) return;
    const questions = currentPillar.questions;
    if (state.currentQuestionIndex < questions.length - 1) {
      update({ currentQuestionIndex: state.currentQuestionIndex + 1 });
    } else if (state.currentPillarIndex < selectedPillars.length - 1) {
      update({
        currentPillarIndex: state.currentPillarIndex + 1,
        currentQuestionIndex: 0,
      });
    }
  }

  function goToPrevQuestion() {
    if (state.currentQuestionIndex > 0) {
      update({ currentQuestionIndex: state.currentQuestionIndex - 1 });
    } else if (state.currentPillarIndex > 0) {
      const prevPillar = selectedPillars[state.currentPillarIndex - 1];
      update({
        currentPillarIndex: state.currentPillarIndex - 1,
        currentQuestionIndex: prevPillar.questions.length - 1,
      });
    }
  }

  function isLastQuestion() {
    if (!currentPillar) return false;
    return (
      state.currentPillarIndex === selectedPillars.length - 1 &&
      state.currentQuestionIndex === currentPillar.questions.length - 1
    );
  }

  function startAnalysis() {
    update({ step: 'analyzing', analysisProgress: 0, analysisStatus: [] });
  }

  function setAnalysisProgress(progress, statusItem) {
    setState(prev => ({
      ...prev,
      analysisProgress: progress,
      analysisStatus: statusItem
        ? [...prev.analysisStatus, statusItem]
        : prev.analysisStatus,
    }));
  }

  function finishAssessment(pillarResults, reportData) {
    setState(prev => {
      const next = { ...prev, step: 'report', pillarResults, reportData };
      saveToHistory(next);
      return next;
    });
    localStorage.removeItem(STORAGE_KEY);
  }

  function resetAssessment() {
    localStorage.removeItem(STORAGE_KEY);
    setState({ ...initialState, companyInfo: { ...initialState.companyInfo, date: new Date().toISOString().split('T')[0] } });
  }

  function hasSavedAssessment() {
    return !!loadSaved();
  }

  function resumeAssessment() {
    const saved = loadSaved();
    if (saved) setState(saved);
  }

  return {
    state,
    update,
    setAnswer,
    getAnswer,
    selectedPillars,
    currentPillar,
    totalQuestions,
    answeredQuestions,
    overallProgress,
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
  };
}
