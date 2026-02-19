import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language?.startsWith('de') ? 'en' : 'de';
    i18n.changeLanguage(next);
  };

  const isGerman = i18n.language?.startsWith('de');

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      title={isGerman ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <span className={isGerman ? 'font-bold text-primary' : ''}>DE</span>
      <span className="text-gray-300">|</span>
      <span className={!isGerman ? 'font-bold text-primary' : ''}>EN</span>
    </button>
  );
}
