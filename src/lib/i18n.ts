import en from '../i18n/en.json';
import el from '../i18n/el.json';

export type Locale = 'en' | 'el';

const translations: Record<Locale, typeof en> = { en, el };

export function t(key: string, locale: Locale = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations['en'];
      for (const fk of keys) {
        if (value && typeof value === 'object' && fk in value) {
          value = value[fk];
        } else {
          return key; // Return key if not found
        }
      }
      return typeof value === 'string' ? value : key;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith('/el')) return 'el';
  return 'en';
}

export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove existing locale prefix
  const cleanPath = path.replace(/^\/(en|el)/, '') || '/';
  return `/${locale}${cleanPath}`;
}
