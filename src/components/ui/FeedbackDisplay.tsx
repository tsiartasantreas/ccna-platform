import { useState, useEffect } from 'react';

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

// Default testimonials for initial display
const defaultTestimonials: Feedback[] = [
  { moduleNumber: 1, moduleName: 'Network Fundamentals', rating: 5, comment: 'Excellent introduction to networking! The 3D diagrams made complex concepts easy to understand.', userName: 'John S.', createdAt: '2026-08-01' },
  { moduleNumber: 2, moduleName: 'Network Access', rating: 5, comment: 'The VLAN and STP lessons were incredibly clear. Best CCNA resource I\'ve found.', userName: 'Maria P.', createdAt: '2026-08-02' },
  { moduleNumber: 3, moduleName: 'IP Connectivity', rating: 4, comment: 'OSPF explained better than any textbook. The interactive quizzes really helped cement the concepts.', userName: 'Giorgos N.', createdAt: '2026-08-03' },
  { moduleNumber: 1, moduleName: 'Network Fundamentals', rating: 5, comment: 'As a complete beginner, this platform made networking approachable. Highly recommend!', userName: 'Sarah J.', createdAt: '2026-08-02' },
  { moduleNumber: 4, moduleName: 'IP Services', rating: 4, comment: 'NAT and DHCP sections were exactly what I needed. Clear, concise, and practical.', userName: 'Andreas T.', createdAt: '2026-08-03' },
  { moduleNumber: 5, moduleName: 'Security Fundamentals', rating: 5, comment: 'The ACL and VPN lessons are top-notch. The security concepts are explained perfectly.', userName: 'Elena K.', createdAt: '2026-08-04' },
];

export default function FeedbackDisplay({ locale }: FeedbackDisplayProps) {
  const [feedback, setFeedback] = useState<Feedback[]>(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load feedback from localStorage
    const stored = JSON.parse(localStorage.getItem('moduleFeedback') || '[]');
    if (stored.length > 0) {
      setFeedback([...stored, ...defaultTestimonials]);
    }

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedback.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [feedback.length]);

  const t = locale === 'el' ? {
    title: 'Τι Λένε οι Φοιτητές μας',
    subtitle: 'Αξιολογήσεις από πραγματικούς χρήστες',
    module: 'Ενότητα',
  } : {
    title: 'What Our Students Say',
    subtitle: 'Reviews from real users',
    module: 'Module',
  };

  const visibleFeedback = [
    feedback[currentIndex % feedback.length],
    feedback[(currentIndex + 1) % feedback.length],
    feedback[(currentIndex + 2) % feedback.length],
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-text-muted">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleFeedback.map((item, idx) => (
            <div
              key={`${currentIndex}-${idx}`}
              className="bg-surface-card rounded-2xl border border-primary/10 p-6 hover:border-primary/20 transition-all animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
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
              <p className="text-text-muted text-sm mb-4 line-clamp-4">
                "{item.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-primary/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {item.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{item.userName}</p>
                  <p className="text-xs text-text-muted">{t.module} {item.moduleNumber}: {item.moduleName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {feedback.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-primary w-6' : 'bg-primary/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
