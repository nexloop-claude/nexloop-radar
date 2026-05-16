import { useState, useRef, useEffect } from 'react';
import './AudioRecorder.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function AudioRecorder({ onTranscript, existingTranscript }) {
  const [status, setStatus] = useState('idle'); // idle | recording | done | error | unsupported
  const [finalText, setFinalText] = useState(existingTranscript || '');
  const [interimText, setInterimText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const accumulatedRef = useRef(existingTranscript || '');

  useEffect(() => {
    setFinalText(existingTranscript || '');
    accumulatedRef.current = existingTranscript || '';
    if (existingTranscript) setStatus('done');
  }, [existingTranscript]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  function startRecording() {
    if (!SpeechRecognition) {
      setStatus('unsupported');
      return;
    }

    accumulatedRef.current = '';
    setFinalText('');
    setInterimText('');
    setErrorMsg('');

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setStatus('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          accumulatedRef.current += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      setFinalText(accumulatedRef.current);
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      clearInterval(timerRef.current);
      if (event.error === 'not-allowed') {
        setErrorMsg('Permissão de microfone negada. Permita o acesso nas configurações do navegador.');
      } else if (event.error === 'no-speech') {
        // Silence detected — treat as normal stop
        stopRecording();
        return;
      } else if (event.error === 'network') {
        setErrorMsg('Erro de rede. A transcrição de voz requer conexão com a internet.');
      } else {
        setErrorMsg(`Erro no reconhecimento de voz: ${event.error}. Tente digitar a resposta.`);
      }
      setStatus('error');
    };

    recognition.onend = () => {
      clearInterval(timerRef.current);
      setInterimText('');
      const text = accumulatedRef.current.trim();
      if (text) {
        setFinalText(text);
        onTranscript(text);
        setStatus('done');
      } else if (status === 'recording') {
        setStatus('idle');
      }
    };

    try {
      recognition.start();
    } catch {
      setErrorMsg('Não foi possível iniciar o microfone.');
      setStatus('error');
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
  }

  function reset() {
    recognitionRef.current?.stop();
    clearInterval(timerRef.current);
    accumulatedRef.current = '';
    setFinalText('');
    setInterimText('');
    setElapsed(0);
    setStatus('idle');
    setEditMode(false);
    onTranscript('');
  }

  function handleEdit(e) {
    setFinalText(e.target.value);
    onTranscript(e.target.value);
  }

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  }

  if (status === 'unsupported') {
    return (
      <div className="audio-recorder">
        <div className="nx-alert nx-alert-warning">
          🎙️ Reconhecimento de voz não disponível neste navegador.
          Use <strong>Chrome</strong> ou <strong>Edge</strong> para gravar, ou digite a resposta acima.
        </div>
      </div>
    );
  }

  return (
    <div className="audio-recorder">
      {status === 'idle' && (
        <button className="btn btn-outline audio-btn" onClick={startRecording}>
          🎙️ Gravar Resposta em Áudio
        </button>
      )}

      {status === 'recording' && (
        <div className="audio-recording-wrap">
          <div className="audio-rec-indicator nx-pulse">⏺</div>
          <span className="audio-timer">{formatTime(elapsed)}</span>
          <span className="audio-recording-label">Gravando... fale claramente</span>
          <button className="btn btn-danger btn-sm" onClick={stopRecording}>
            ⏹ Parar
          </button>
        </div>
      )}

      {status === 'recording' && (finalText || interimText) && (
        <div className="audio-interim-box">
          <span className="audio-interim-final">{finalText}</span>
          <span className="audio-interim-text">{interimText}</span>
        </div>
      )}

      {status === 'done' && (
        <div className="audio-done">
          <div className="audio-done-header">
            <span className="audio-done-label">🎙️ Transcrição</span>
            <div className="audio-done-actions">
              <button className="btn btn-sm btn-secondary" onClick={() => setEditMode(v => !v)}>
                {editMode ? '✓ Feito' : '✏️ Editar'}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={reset}>
                🔄 Regravar
              </button>
            </div>
          </div>
          {editMode ? (
            <textarea
              className="nx-textarea audio-transcript-edit"
              value={finalText}
              onChange={handleEdit}
              rows={4}
            />
          ) : (
            <p className="audio-transcript-text">{finalText}</p>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="audio-error">
          <div className="nx-alert nx-alert-warning">{errorMsg}</div>
          <button className="btn btn-sm btn-outline" onClick={() => setStatus('idle')} style={{ marginTop: 8 }}>
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}
