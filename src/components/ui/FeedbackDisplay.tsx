import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Feedback {
  moduleNumber: number;
  moduleName: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface FeedbackDisplayProps {
  locale: 'en' | 'el';
}

const moduleNames: Record<number, string> = {
  1: 'Network Fundamentals',
  2: 'Network Access',
  3: 'IP Connectivity',
  4: 'IP Services',
  5: 'Security Fundamentals',
  6: 'Automation & Programmability',
};

export default function FeedbackDisplay({ locale }: FeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeedback() {
      try {
        // Load from localStorage
        const stored = JSON.parse(localStorage.getItem('moduleFeedback') || '[]');

        // Load from Supabase (if table exists)
        let dbFeedback: Feedback[] = [];
        try {
          const { data } = await supabase
            .from('module_feedback')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

          if (data) {
            dbFeedback = data.map((f: any) => ({
              moduleNumber: f.module_number,
              moduleName: moduleNames[f.module_number] || 'Module',
              rating: f.rating,
              comment: f.comment || '',
              userName: f.display_name || 'Anonymous',
              createdAt: f.created_at,
            }));
          }
        } catch {
          // Table might not exist yet
        }

        // Combine and deduplicate
        const allFeedback = [...dbFeedback, ...stored];
        setFeedback(allFeedback);
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, []);

  const t = locale === 'el' ? {
    title: 'Τι Λένε οι Φοιτητές μας',
    subtitle: 'Αξιολογήσεις από πραγματικούς χρήστες',
    module: 'Ενότητα',
    noReviews: 'Δεν υπάρχουν ακόμα αξιολογήσεις',
    beFirst: 'Ολοκληρώστε ένα τεστ και αφήστε την αξιολόγησή σας για να βοηθήσετε άλλους!',
    leaveReview: 'Αφήστε την Αξιολόγησή σας',
    loading: 'Φόρτωση αξιολογήσεων...',
  } : {
    title: 'What Our Students Say',
    subtitle: 'Reviews from real users',
    module: 'Module',
    noReviews: 'No reviews yet',
    beFirst: 'Complete a quiz and leave your review to help others learn!',
    leaveReview: 'Leave Your Review',
    loading: 'Loading reviews...',
  };

  if (loading) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-muted">{t.loading}</p>
        </div>
      </section>
    );
  }

  if (feedback.length === 0) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h2>
            <p className="text-text-muted">{t.subtitle}</p>
          </div>

          <div className="bg-surface-card rounded-2xl border border-primary/10 p-12 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-text mb-2">{t.noReviews}</h3>
            <p className="text-text-muted mb-6">{t.beFirst}</p>
            <a
              href={`/${locale}/lessons/1/quiz`}
              className="inline-flex px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              {t.leaveReview} →
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-text-muted">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedback.slice(0, 6).map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-card rounded-2xl border border-primary/10 p-6 hover:border-primary/20 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${star <= item.rating ? 'opacity-100' : 'opacity-30'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {/* Comment */}
              {item.comment && (
                <p className="text-text-muted text-sm mb-4 line-clamp-4">
                  "{item.comment}"
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-primary/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {item.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{item.userName}</p>
                  <p className="text-xs text-text-muted">{t.module} {item.moduleNumber}: {item.moduleName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
