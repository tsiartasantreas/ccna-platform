import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FeedbackFormProps {
  moduleNumber: number;
  moduleName: string;
  locale: 'en' | 'el';
  onSubmit?: () => void;
}

export default function FeedbackForm({ moduleNumber, moduleName, locale, onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const t = locale === 'el' ? {
    title: 'Πώς ήταν η εμπειρία σας;',
    subtitle: `Αξιολογήστε την Ενότητα ${moduleNumber}`,
    placeholder: 'Πείτε μας τη γνώμη σας... (προαιρετικό)',
    submit: 'Υποβολή Αξιολόγησης',
    thanks: 'Ευχαριστούμε για την αξιολόγηση!',
    thanksDesc: 'Η γνώμη σας μας βοηθάει να βελτιωθούμε.',
    stars: ['Πολύ κακό', 'Κακό', 'Μέτριο', 'Καλό', 'Εξαιρετικό'],
  } : {
    title: 'How was your experience?',
    subtitle: `Rate Module ${moduleNumber}`,
    placeholder: 'Tell us what you think... (optional)',
    submit: 'Submit Feedback',
    thanks: 'Thank you for your feedback!',
    thanksDesc: 'Your feedback helps us improve.',
    stars: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Save to localStorage as backup
      const feedback = {
        moduleNumber,
        moduleName,
        rating,
        comment,
        userId: session?.user?.id || 'anonymous',
        userName: session?.user?.user_metadata?.display_name || 'Anonymous',
        createdAt: new Date().toISOString(),
      };

      const existingFeedback = JSON.parse(localStorage.getItem('moduleFeedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('moduleFeedback', JSON.stringify(existingFeedback));

      // Try to save to Supabase if table exists
      try {
        await supabase.from('module_feedback').insert({
          user_id: session?.user?.id || null,
          module_number: moduleNumber,
          rating,
          comment: comment || null,
          display_name: session?.user?.user_metadata?.display_name || 'Anonymous',
        });
      } catch {
        // Table might not exist yet, localStorage is fallback
      }

      setSubmitted(true);
      onSubmit?.();
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-success/5 rounded-2xl border border-success/20 p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-text mb-2">{t.thanks}</h3>
        <p className="text-text-muted">{t.thanksDesc}</p>
        <div className="flex justify-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`text-2xl ${star <= rating ? 'opacity-100' : 'opacity-30'}`}>
              ⭐
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-2xl border border-primary/10 p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text mb-1">{t.title}</h3>
        <p className="text-sm text-text-muted">{t.subtitle}: {moduleName}</p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="text-4xl transition-transform hover:scale-125 focus:outline-none"
            title={t.stars[star - 1]}
          >
            <span className={star <= (hoveredStar || rating) ? 'opacity-100' : 'opacity-30'}>
              ⭐
            </span>
          </button>
        ))}
      </div>

      {rating > 0 && (
        <p className="text-center text-sm text-primary font-medium mb-4">
          {t.stars[rating - 1]}
        </p>
      )}

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t.placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-surface border border-primary/10 rounded-xl text-text placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none mb-4"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {submitting ? '...' : t.submit}
      </button>
    </div>
  );
}
