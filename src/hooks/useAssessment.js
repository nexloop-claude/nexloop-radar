import { useState, useEffect, useCallback, useRef } from 'react';
import { PILLARS } from '../data/pillars';
import { BUSINESS_PILLARS } from '../data/businessPillars';

const STORAGE_KEY = 'nexloop_current_assessment';
const HISTORY_KEY = 'nexloop_history';

const initialState = {
  step: 'setup',
  assessmentType: null,           // 'digital' | 'business' — persisted
  companyInfo: {
    company: '',
    responsible: '',
    sector: 'Construção Civil',
    date: new Date().toISOString().split('T')[0],
  },
  selectedPillarIds: [],
  currentPillarIndex: 0,
  currentQuestionIndex: 0,
  answers: {},                    // { questionId: { text, audioTranscript } }
  pillarResults: [],
  reportData: null,
  analysisProgress: 0,
  analysisStatus: [],
  lastSavedAt: null,              // timestamp visível na UI
};

// ── Persistence helpers ───────────────────────────────────────────

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Ignore stale setup states
    if (!parsed.step || parsed.step === 'setup') return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    const payload = { ...state, lastSavedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload.lastSavedAt;
  } catch {
    return null;
  }
}

function saveToHistory(state) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({
      id: Date.now(),
      assessmentType: state.assessmentType,
      companyInfo: state.companyInfo,
      pillarResults: state.pillarResults,
      reportData: state.reportData,
      timestamp: Date.now(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  } catch { /* ignore */ }
}

// ── Hook ─────────────────────────────────────────────────────────

export function useAssessment() {
  const [state, setState] = useState(() => loadSaved() || { ...initialState });
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const stateRef = useRef(state);

  // Keep ref in sync for beforeunload
  useEffect(() => { stateRef.current = state; }, [state]);

  // Auto-save on every state change (except setup/report)
  useEffect(() => {
    if (state.step === 'questionnaire' || state.step === 'analyzing') {
      const ts = persist(state);
      if (ts) setLastSavedAt(ts);
    }
  }, [state]);

  // Safety save on tab close / page navigation
  useEffect(() => {
    function handleBeforeUnload() {
      const s = stateRef.current;
      if (s.step === 'questionnaire' || s.step === 'analyzing') {
        persist(s);
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ── Pillar resolution (uses correct list based on type) ─────────
  const allPillars = state.assessmentType === 'business' ? BUSINESS_PILLARS : PILLARS;
  const selectedPillars = allPillars.filter(p => state.selectedPillarIds.includes(p.id));
  const currentPillar = selectedPillars[state.currentPillarIndex] || null;

  const totalQuestions   = selectedPillars.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredQuestions = Object.values(state.answers).filter(a => a.text?.trim()).length;

  // ── Callbacks ────────────────────────────────────────────────────

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

  function startAssessment(companyInfo, selectedPillarIds) {
    const newState = {
      ...initialState,
      step: 'questionnaire',
      assessmentType: companyInfo.assessmentType || 'digital',
      companyInfo,
      selectedPillarIds,
      answers: {},
      pillarResults: [],
      reportData: null,
      analysisProgress: 0,
      analysisStatus: [],
      currentPillarIndex: 0,
      currentQuestionIndex: 0,
    };
    setState(newState);
    persist(newState);
  }

  function goToNextQuestion() {
    if (!currentPillar) return;
    const questions = currentPillar.questions;
    if (state.currentQuestionIndex < questions.length - 1) {
      update({ currentQuestionIndex: state.currentQuestionIndex + 1 });
    } else if (state.currentPillarIndex < selectedPillars.length - 1) {
      update({ currentPillarIndex: state.currentPillarIndex + 1, currentQuestionIndex: 0 });
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
    setLastSavedAt(null);
  }

  // Returns saved-assessment metadata for the resume screen (does not modify state)
  function getSavedMeta() {
    const saved = loadSaved();
    if (!saved) return null;
    const answered = Object.values(saved.answers || {}).filter(a => a.text?.trim()).length;
    return {
      company: saved.companyInfo?.company || 'Assessment',
      assessmentType: saved.assessmentType,
      answered,
      lastSavedAt: saved.lastSavedAt,
      currentPillarIndex: saved.currentPillarIndex || 0,
      totalPillars: (saved.selectedPillarIds || []).length,
    };
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
    lastSavedAt,
    startAssessment,
    goToNextQuestion,
    goToPrevQuestion,
    isLastQuestion,
    startAnalysis,
    setAnalysisProgress,
    finishAssessment,
    resetAssessment,
    getSavedMeta,
    resumeAssessment,
  };
}
