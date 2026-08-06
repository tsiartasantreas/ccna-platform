import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizEngineProps {
  moduleNumber: number;
  moduleName: string;
  questions: QuizQuestion[];
  locale: 'en' | 'el';
}

export default function QuizEngine({ moduleNumber, moduleName, questions, locale }: QuizEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [saving, setSaving] = useState(false);

  const t = locale === 'el' ? {
    start: 'Ξεκινήστε το Τεστ',
    next: 'Επόμενη',
    prev: 'Προηγούμενη',
    submit: 'Υποβολή',
    tryAgain: 'Δοκιμάστε Ξανά',
    backToCurriculum: 'Επιστροφή στο Πρόγραμμα',
    question: 'Ερώτηση',
    of: 'από',
    score: 'Η Βαθμολογία σας',
    correct: 'Σωστό!',
    incorrect: 'Λάθος',
    explanation: 'Εξήγηση',
    passed: 'Συγχαρητήρια! Περάσατε!',
    failed: 'Συνεχίστε να εξασκείστε! Χρειάζεστε 80% για να περάσετε.',
    selectAnswer: 'Επιλέξτε μια απάντηση',
    points: 'Πόντοι',
    streak: 'Σερί',
  } : {
    start: 'Start Quiz',
    next: 'Next',
    prev: 'Previous',
    submit: 'Submit Quiz',
    tryAgain: 'Try Again',
    backToCurriculum: 'Back to Curriculum',
    question: 'Question',
    of: 'of',
    score: 'Your Score',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    explanation: 'Explanation',
    passed: 'Congratulations! You passed!',
    failed: 'Keep practicing! You need 80% to pass.',
    selectAnswer: 'Select an answer',
    points: 'Points',
    streak: 'Streak',
  };

  const handleSelectAnswer = (questionIdx: number, answerIdx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: answerIdx }));
  };

  const calculateScore = useCallback(() => {
    let correct = 0;
    let streak = 0;
    let maxStreak = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else {
        streak = 0;
      }
    });
    const percentage = Math.round((correct / questions.length) * 100);
    const points = correct * 10 + (maxStreak >= 3 ? maxStreak * 5 : 0);
    return { correct, total: questions.length, percentage, points, maxStreak, passed: percentage >= 80 };
  }, [questions, selectedAnswers]);

  const handleSubmit = async () => {
    setShowResults(true);
    setCurrentQuestion(0);

    // Save quiz score via secure server-side RPC (uses auth.uid(), no client user_id)
    try {
      setSaving(true);
      const score = calculateScore();

      // Use secure RPC - server validates auth and saves score
      const { data, error } = await supabase.rpc('user_save_quiz_score', {
        p_module_number: moduleNumber,
        p_score: score.percentage,
        p_total_questions: score.total,
        p_correct_answers: score.correct,
        p_time_taken: 0,
      });

      if (error) {
        console.error('Error saving quiz score:', error);
      }
    } catch (error) {
      console.error('Error saving quiz score:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
    setQuizStarted(false);
  };

  // Start screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-surface-card rounded-2xl border border-primary/10 p-12">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold text-text mb-2">
            {locale === 'el' ? `Τεστ Ενότητας ${moduleNumber}` : `Module ${moduleNumber} Quiz`}
          </h2>
          <h3 className="text-xl text-primary mb-4">{moduleName}</h3>
          <p className="text-text-muted mb-2">
            {locale === 'el'
              ? `${questions.length} ερωτήσεις πολλαπλής επιλογής`
              : `${questions.length} multiple choice questions`}
          </p>
          <p className="text-text-muted mb-8">
            {locale === 'el'
              ? 'Χρειάζεστε 80% για να περάσετε.'
              : 'You need 80% to pass.'}
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
          >
            {t.start} →
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-3xl mx-auto">
        {/* Score card */}
        <div className={`rounded-2xl border-2 p-8 mb-8 text-center ${
          score.passed
            ? 'border-success/30 bg-success/5'
            : 'border-warning/30 bg-warning/5'
        }`}>
          <div className="text-6xl mb-4">{score.passed ? '🎉' : '📚'}</div>
          <h2 className="text-3xl font-bold text-text mb-2">{t.score}</h2>
          <div className={`text-6xl font-bold mb-4 ${
            score.passed ? 'text-success' : 'text-warning'
          }`}>
            {score.percentage}%
          </div>
          <p className="text-lg text-text-muted mb-4">
            {score.correct}/{score.total} {locale === 'el' ? 'σωστές' : 'correct'}
          </p>
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{score.points}</div>
              <div className="text-sm text-text-muted">{t.points}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{score.maxStreak}</div>
              <div className="text-sm text-text-muted">{t.streak}</div>
            </div>
          </div>
          <p className={`text-lg font-medium ${score.passed ? 'text-success' : 'text-warning'}`}>
            {score.passed ? t.passed : t.failed}
          </p>
        </div>

        {/* Question review - only show details if passed */}
        {score.passed ? (
          <>
            <h3 className="text-xl font-bold text-text mb-6">
              {locale === 'el' ? 'Ανασκόπηση Απαντήσεων' : 'Answer Review'}
            </h3>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[idx];
                const isCorrect = userAnswer === q.correct;
                return (
                  <div key={q.id} className={`bg-surface-card rounded-xl border p-6 ${
                    isCorrect ? 'border-success/20' : 'border-error/20'
                  }`}>
                    <div className="flex items-start gap-3 mb-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <div>
                        <p className="font-medium text-text">{q.question}</p>
                        {userAnswer !== undefined && userAnswer !== null && (
                          <p className="text-sm text-text-muted mt-1">
                            {locale === 'el' ? 'Η απάντησή σας:' : 'Your answer:'}{' '}
                            <span className={isCorrect ? 'text-success' : 'text-error'}>
                              {q.options[userAnswer]}
                            </span>
                          </p>
                        )}
                        {!isCorrect && (
                          <p className="text-sm text-text-muted mt-1">
                            {locale === 'el' ? 'Σωστή απάντηση:' : 'Correct answer:'}{' '}
                            <span className="text-success">{q.options[q.correct]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="bg-surface-light rounded-lg p-4 ml-11">
                      <p className="text-sm text-text-muted">
                        <span className="font-bold text-primary">{t.explanation}:</span> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-surface-card rounded-2xl border border-warning/20 p-8 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-text mb-2">
              {locale === 'el' ? 'Χρειάζεστε περισσότερη εξάσκηση!' : 'Keep Practicing!'}
            </h3>
            <p className="text-text-muted mb-4">
              {locale === 'el'
                ? 'Περάστε με 80%+ για να δείτε τις σωστές απαντήσεις και να λάβετε το πιστοποιητικό.'
                : 'Pass with 80%+ to see the correct answers and earn your certificate.'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 border border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/10 transition-all"
          >
            {t.tryAgain}
          </button>
          <a
            href={`/${locale}/curriculum`}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            {t.backToCurriculum}
          </a>
        </div>
      </div>
    );
  }

  // Quiz questions
  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-text-muted mb-2">
          <span>{t.question} {currentQuestion + 1} {t.of} {questions.length}</span>
          <span>{Object.keys(selectedAnswers).length}/{questions.length} {locale === 'el' ? 'απαντήθηκαν' : 'answered'}</span>
        </div>
        <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface-card rounded-2xl border border-primary/10 p-8 mb-6">
        <h3 className="text-xl font-bold text-text mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((opt, optIdx) => (
            <button
              key={optIdx}
              onClick={() => handleSelectAnswer(currentQuestion, optIdx)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                selectedAnswer === optIdx
                  ? 'border-primary bg-primary/10'
                  : 'border-primary/10 hover:border-primary/30 hover:bg-surface-light'
              }`}
            >
              <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                selectedAnswer === optIdx
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-text-muted text-text-muted'
              }`}>
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className={`${selectedAnswer === optIdx ? 'text-primary font-medium' : 'text-text-muted'}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← {t.prev}
        </button>

        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                idx === currentQuestion
                  ? 'bg-primary text-white'
                  : selectedAnswers[idx] !== undefined
                    ? 'bg-primary/20 text-primary'
                    : 'bg-surface-light text-text-muted hover:bg-surface'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            {t.next} →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-2 bg-gradient-to-r from-success to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t.submit}
          </button>
        )}
      </div>
    </div>
  );
}
