import { useState, useRef, useEffect } from 'react';
import { transcribeAudio } from '../utils/claudeApi';
import './AudioRecorder.css';

export default function AudioRecorder({ onTranscript, existingTranscript }) {
  const [status, setStatus] = useState('idle'); // idle | requesting | recording | processing | done | error
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [transcript, setTranscript] = useState(existingTranscript || '');
  const [editMode, setEditMode] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    setTranscript(existingTranscript || '');
    if (existingTranscript) setStatus('done');
  }, [existingTranscript]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  async function startRecording() {
    setStatus('requesting');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        setStatus('processing');

        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64 = reader.result.split(',')[1];
            const text = await transcribeAudio(base64, mimeType);
            setTranscript(text);
            onTranscript(text);
            setStatus('done');
          } catch (err) {
            setErrorMsg(err.message || 'Erro na transcrição. Você pode digitar a resposta manualmente.');
            setStatus('error');
          }
        };
        reader.readAsDataURL(blob);
      };

      mr.start(500);
      setStatus('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Permissão de microfone negada. Permita o acesso e tente novamente.');
      } else {
        setErrorMsg('Microfone não disponível neste dispositivo.');
      }
      setStatus('error');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function handleTranscriptChange(e) {
    setTranscript(e.target.value);
    onTranscript(e.target.value);
  }

  function reset() {
    setStatus('idle');
    setTranscript('');
    setElapsed(0);
    setErrorMsg('');
    onTranscript('');
  }

  return (
    <div className="audio-recorder">
      {status === 'idle' && (
        <button className="btn btn-outline audio-btn" onClick={startRecording}>
          🎙️ Gravar Resposta em Áudio
        </button>
      )}

      {status === 'requesting' && (
        <div className="audio-status audio-requesting">
          <span>⏳ Aguardando permissão do microfone...</span>
        </div>
      )}

      {status === 'recording' && (
        <div className="audio-recording-wrap">
          <div className="audio-rec-indicator nx-pulse">⏺</div>
          <span className="audio-timer">{formatTime(elapsed)}</span>
          <span className="audio-recording-label">Gravando...</span>
          <button className="btn btn-danger btn-sm" onClick={stopRecording}>
            ⏹ Parar
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div className="audio-status">
          <div className="nx-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
          <span>Transcrevendo com IA...</span>
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
              value={transcript}
              onChange={handleTranscriptChange}
              rows={4}
            />
          ) : (
            <p className="audio-transcript-text">{transcript}</p>
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
