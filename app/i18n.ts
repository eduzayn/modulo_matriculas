export const defaultLocale = 'pt-BR';
export const locales = ['pt-BR', 'en'];

export type Locale = (typeof locales)[number];

export const getLocale = (locale: string): Locale => {
  if (!locale) return defaultLocale;
  const normalizedLocale = locale.toLowerCase();
  
  return locales.find(
    (cur) => cur.toLowerCase() === normalizedLocale
  ) as Locale || defaultLocale;
};

export function getTranslations(locale: Locale = defaultLocale) {
  switch (locale) {
    case 'en':
      return import('./messages/en.json').then((module) => module.default);
    case 'pt-BR':
    default:
      return import('./messages/pt-BR.json').then((module) => module.default);
  }
}
