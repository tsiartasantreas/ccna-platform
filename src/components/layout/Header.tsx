import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jhesstimsojwmkdysmpy.supabase.co',
  'sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD'
);

const ADMIN_EMAIL = 'tsiartasantreas@gmail.com';

interface HeaderProps {
  locale: 'en' | 'el';
  translations: {
    nav: {
      home: string;
      curriculum: string;
      pricing: string;
      dashboard: string;
      login: string;
      signup: string;
    };
  };
}

export default function Header({ locale, translations }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [siteName, setSiteName] = useState('NetworkLearn');
  const [logoUrl, setLogoUrl] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');

    // Load site settings
    const loadSettings = () => {
      const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
      if (settings.siteName) setSiteName(settings.siteName);
      const url = settings.logoUrl || '/images/logo.png';
      // Add cache busting for custom URLs
      setLogoUrl(url.includes('github') || url.includes('http') ? `${url}?v=${Date.now()}` : url);
    };

    loadSettings();

    // Listen for storage changes (when admin updates settings)
    window.addEventListener('storage', loadSettings);
    // Also listen for focus (when user comes back from admin page)
    window.addEventListener('focus', loadSettings);

    // Check Supabase session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        localStorage.setItem('userEmail', session.user.email || '');
        localStorage.setItem('userId', session.user.id);
        setIsAdmin(session.user.email === ADMIN_EMAIL);
        // Get display name from metadata or email
        const name = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User';
        setUserName(name);
        // Get avatar from localStorage or profile
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) setUserAvatar(savedAvatar);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName('');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setIsAdmin(session.user.email === ADMIN_EMAIL);
        const name = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User';
        setUserName(name);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName('');
      }
    });

    let prevScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      prevScrollY = currentScrollY;
      setShowBackToTop(currentScrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'el' : 'en';
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  const navLinks = [
    { href: `/${locale}/`, label: translations.nav.home },
    { href: `/${locale}/curriculum`, label: translations.nav.curriculum },
    { href: `/${locale}/pricing`, label: translations.nav.pricing },
    { href: `/${locale}/dashboard`, label: translations.nav.dashboard },
    ...(isAdmin ? [{ href: `/${locale}/admin`, label: '🔧 Admin' }] : []),
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-xl shadow-lg shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={`/${locale}/`} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors shadow-lg shadow-primary/10">
              <img
                src={logoUrl}
                alt={siteName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent items-center justify-center text-white font-bold text-xl" style={{ display: logoUrl ? 'none' : 'flex', position: 'absolute', top: 0, left: 0 }}>
                {siteName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
              {siteName}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={switchLocale}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-primary hover:bg-surface-light transition-all"
              title={locale === 'en' ? 'Switch to Greek' : 'Switch to English'}
            >
              {locale === 'en' ? '🇬🇷 EL' : '🇬🇧 EN'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface-light transition-all"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-light hover:bg-surface transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-text hidden sm:block">{userName}</span>
                  <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-surface-card rounded-xl border border-primary/10 shadow-lg shadow-primary/5 py-2 z-50">
                    <div className="px-4 py-2 border-b border-primary/10">
                      <p className="text-sm font-medium text-text">{userName}</p>
                      <p className="text-xs text-text-muted">{localStorage.getItem('userEmail')}</p>
                    </div>
                    <a
                      href={`/${locale}/dashboard`}
                      className="block px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-surface-light transition-colors"
                    >
                      📊 {translations.nav.dashboard}
                    </a>
                    <a
                      href={`/${locale}/profile`}
                      className="block px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-surface-light transition-colors"
                    >
                      👤 {translations.nav.profile}
                    </a>
                    {isAdmin && (
                      <a
                        href={`/${locale}/admin`}
                        className="block px-4 py-2 text-sm text-primary hover:bg-surface-light transition-colors"
                      >
                        🔧 Admin
                      </a>
                    )}
                    <div className="border-t border-primary/10 mt-1 pt-1">
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          localStorage.removeItem('userEmail');
                          localStorage.removeItem('userId');
                          window.location.href = `/${locale}/`;
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-light transition-colors"
                      >
                        🚪 {translations.nav.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href={`/${locale}/login`}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  {translations.nav.login}
                </a>
                <a
                  href={`/${locale}/login?mode=signup`}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {translations.nav.signup}
                </a>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-primary"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface-light/95 backdrop-blur-xl border-t border-primary/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-text-muted hover:text-primary hover:bg-surface transition-all"
              >
                {link.label}
              </a>
            ))}
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('userId');
                  window.location.href = `/${locale}/`;
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-text-muted hover:text-primary hover:bg-surface transition-all"
              >
                {translations.nav.logout}
              </button>
            ) : (
              <a
                href={`/${locale}/login`}
                className="block px-4 py-3 rounded-lg text-text-muted hover:text-primary hover:bg-surface transition-all"
              >
                {translations.nav.login}
              </a>
            )}
          </div>
        </div>
      )}
    </header>

    {/* Back to Top Button */}
    {showBackToTop && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        title="Back to top"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    )}
    </>
  );
}
