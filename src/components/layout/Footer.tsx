interface FooterProps {
  locale: 'en' | 'el';
  translations: {
    footer: {
      copyright: string;
      privacy: string;
      terms: string;
      contact: string;
    };
  };
}

export default function Footer({ locale, translations }: FooterProps) {
  return (
    <footer className="bg-surface-light border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NetworkLearn
              </span>
            </div>
            <p className="text-text-muted text-sm max-w-md">
              {locale === 'en'
                ? 'Master networking fundamentals with interactive 3D lessons and gamified quizzes. Prepare for your CCNA certification with a structured, engaging learning experience.'
                : 'Κατακτήστε τα θεμέλια των δικτύων με διαδραστικά 3D μαθήματα και gamified τεστ. Προετοιμαστείτε για την πιστοποίηση CCNA με μια δομημένη, ελκυστική εμπειρία μάθησης.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text font-semibold mb-4">
              {locale === 'en' ? 'Quick Links' : 'Γρήγοροι Σύνδεσμοι'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href={`/${locale}/curriculum`} className="text-text-muted hover:text-primary transition-colors text-sm">
                  {locale === 'en' ? 'Curriculum' : 'Πρόγραμμα'}
                </a>
              </li>
              <li>
                <a href={`/${locale}/pricing`} className="text-text-muted hover:text-primary transition-colors text-sm">
                  {locale === 'en' ? 'Pricing' : 'Τιμολόγηση'}
                </a>
              </li>
              <li>
                <a href={`/${locale}/login`} className="text-text-muted hover:text-primary transition-colors text-sm">
                  {locale === 'en' ? 'Login' : 'Σύνδεση'}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text font-semibold mb-4">
              {locale === 'en' ? 'Legal' : 'Νομικά'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href={`/${locale}/privacy`} className="text-text-muted hover:text-primary transition-colors text-sm">
                  {translations.footer.privacy}
                </a>
              </li>
              <li>
                <a href={`/${locale}/terms`} className="text-text-muted hover:text-primary transition-colors text-sm">
                  {translations.footer.terms}
                </a>
              </li>
              <li>
                <a href={`/${locale}/contact`} className="text-text-muted hover:text-primary transition-colors text-sm">
                  {translations.footer.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">{translations.footer.copyright}</p>
          <p className="text-text-muted text-xs">
            {locale === 'en'
              ? 'CCNA® is a registered trademark of Cisco Systems, Inc. This platform is not affiliated with Cisco.'
              : 'Το CCNA® είναι σήμα κατατεθέν της Cisco Systems, Inc. Αυτή η πλατφόρμα δεν σχετίζεται με την Cisco.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
