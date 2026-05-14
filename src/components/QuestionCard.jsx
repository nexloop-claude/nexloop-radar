import AudioRecorder from './AudioRecorder';
import './QuestionCard.css';

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  pillar,
  answer,
  onAnswerChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) {
  const text = answer?.text || '';
  const audioTranscript = answer?.audioTranscript || '';

  function handleTextChange(e) {
    onAnswerChange({ text: e.target.value, audioTranscript });
  }

  function handleTranscript(transcript) {
    onAnswerChange({ text: transcript, audioTranscript: transcript });
  }

  const hasAnswer = text.trim().length > 0;

  return (
    <div className="question-card nx-card">
      <div className="question-card-header">
        <div className="question-pill" style={{ background: `${pillar.color}18`, color: pillar.color, border: `1px solid ${pillar.color}40` }}>
          <span>{pillar.icon}</span>
          <span>{pillar.name}</span>
        </div>
        <span className="question-counter">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      <div className="question-body">
        <p className="question-text">{question.text}</p>
        {question.hint && (
          <p className="question-hint">💡 {question.hint}</p>
        )}
      </div>

      <div className="question-input-section">
        <label className="nx-label">Sua resposta</label>
        <textarea
          className="nx-textarea"
          placeholder="Descreva a situação atual da empresa em relação a este tema..."
          value={text}
          onChange={handleTextChange}
          rows={5}
        />

        <div className="question-divider">
          <span>ou grave em áudio</span>
        </div>

        <AudioRecorder
          onTranscript={handleTranscript}
          existingTranscript={audioTranscript}
        />
      </div>

      <div className="question-actions">
        <button
          className="btn btn-secondary"
          onClick={onPrev}
          disabled={isFirst}
        >
          ← Anterior
        </button>

        <div className="question-skip">
          {!hasAnswer && !isLast && (
            <span className="question-skip-hint">Você pode pular e responder depois</span>
          )}
        </div>

        <button
          className={`btn ${isLast ? 'btn-primary' : 'btn-primary'}`}
          onClick={onNext}
        >
          {isLast ? '✓ Concluir Assessment' : 'Próxima →'}
        </button>
      </div>
    </div>
  );
}
