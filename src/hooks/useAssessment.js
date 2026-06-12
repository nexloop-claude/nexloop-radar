import { useState, useEffect, useCallback, useRef } from 'react';
import { PILLARS } from '../data/pillars';
import { BUSINESS_PILLARS } from '../data/businessPillars';

const LEGACY_KEY  = 'nexloop_current_assessment'; // migration from single-draft format

function getDraftsKey(userId)  { return userId ? `nexloop_drafts_${userId}`  : 'nexloop_drafts'; }
function getHistoryKey(userId) { return userId ? `nexloop_history_${userId}` : 'nexloop_history'; }

const initialState = {
  step: 'setup',
  draftId: null,
  assessmentType: null,
  companyInfo: {
    company: '',
    responsible: '',
    sector: 'Construção Civil',
    date: new Date().toISOString().split('T')[0],
  },
  selectedPillarIds: [],
  currentPillarIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  pillarResults: [],
  reportData: null,
  analysisProgress: 0,
  analysisStatus: [],
};

// ── Draft persistence ─────────────────────────────────────────────

function readDrafts(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeDrafts(key, drafts) {
  try {
    localStorage.setItem(key, JSON.stringify(drafts));
  } catch { /* ignore */ }
}

function migrateLegacyDraft(draftsKey) {
  try {
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (!legacyRaw) return;
    const legacy = JSON.parse(legacyRaw);
    if (legacy?.step && legacy.step !== 'setup' && legacy.step !== 'report') {
      const drafts = readDrafts(draftsKey);
      const legacyId = `draft_${legacy.lastSavedAt || Date.now()}`;
      if (!drafts.find(d => d.id === legacyId)) {
        drafts.push({ ...legacy, id: legacyId, createdAt: legacy.lastSavedAt || Date.now() });
        writeDrafts(draftsKey, drafts);
      }
    }
  } catch { /* ignore */ }
  localStorage.removeItem(LEGACY_KEY);
}

function upsertDraft(key, draft) {
  const drafts = readDrafts(key);
  const idx = drafts.findIndex(d => d.id === draft.id);
  if (idx >= 0) drafts[idx] = draft;
  else drafts.push(draft);
  writeDrafts(key, drafts);
}

function eraseDraft(key, id) {
  writeDrafts(key, readDrafts(key).filter(d => d.id !== id));
}

// ── History persistence ───────────────────────────────────────────

function saveToHistory(historyKey, state) {
  try {
    const raw = localStorage.getItem(historyKey);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({
      id: Date.now(),
      assessmentType: state.assessmentType,
      companyInfo: state.companyInfo,
      pillarResults: state.pillarResults,
      reportData: state.reportData,
      timestamp: Date.now(),
    });
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));
  } catch { /* ignore */ }
}

// ── Hook ─────────────────────────────────────────────────────────

export function useAssessment(userId) {
  const draftsKey  = getDraftsKey(userId);
  const historyKey = getHistoryKey(userId);

  const [state, setState] = useState(() => {
    migrateLegacyDraft(draftsKey);
    return { ...initialState };
  });
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const stateRef = useRef(state);

  useEffect(() => { stateRef.current = state; }, [state]);

  // Auto-save active draft on every relevant state change
  useEffect(() => {
    if ((state.step === 'questionnaire' || state.step === 'analyzing') && state.draftId) {
      const ts = Date.now();
      upsertDraft(draftsKey, { ...state, lastSavedAt: ts });
      setLastSavedAt(ts);
    }
  }, [state]);

  // Safety save on tab close
  useEffect(() => {
    function handleBeforeUnload() {
      const s = stateRef.current;
      if ((s.step === 'questionnaire' || s.step === 'analyzing') && s.draftId) {
        upsertDraft(draftsKey, { ...s, lastSavedAt: Date.now() });
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const allPillars = state.assessmentType === 'business' ? BUSINESS_PILLARS : PILLARS;
  const selectedPillars = allPillars.filter(p => state.selectedPillarIds.includes(p.id));
  const currentPillar = selectedPillars[state.currentPillarIndex] || null;

  const totalQuestions    = selectedPillars.reduce((sum, p) => sum + p.questions.length, 0);
  const answeredQuestions = Object.values(state.answers).filter(a => a.text?.trim()).length;

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
    const draftId = `draft_${Date.now()}`;
    const newState = {
      ...initialState,
      draftId,
      step: 'questionnaire',
      assessmentType: companyInfo.assessmentType || 'digital',
      companyInfo,
      selectedPillarIds,
      createdAt: Date.now(),
    };
    setState(newState);
    upsertDraft(draftsKey, newState);
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
      saveToHistory(historyKey, next);
      if (prev.draftId) eraseDraft(draftsKey, prev.draftId);
      return next;
    });
  }

  function resetAssessment() {
    if (state.draftId) eraseDraft(draftsKey, state.draftId);
    setState({
      ...initialState,
      companyInfo: { ...initialState.companyInfo, date: new Date().toISOString().split('T')[0] },
    });
    setLastSavedAt(null);
  }

  function resumeAssessment(draft) {
    setState(draft);
    setLastSavedAt(draft.lastSavedAt || null);
  }

  function listDrafts() {
    return readDrafts(draftsKey).filter(d => d.step && d.step !== 'setup' && d.step !== 'report');
  }

  function deleteDraftById(id) {
    eraseDraft(draftsKey, id);
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
    resumeAssessment,
    listDrafts,
    deleteDraftById,
  };
}
