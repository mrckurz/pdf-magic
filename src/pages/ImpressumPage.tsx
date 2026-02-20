import { useTranslation } from 'react-i18next';

export function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {t('impressum.title')}
      </h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('impressum.legalTitle')}
          </h2>
          <p className="whitespace-pre-line">{t('impressum.owner')}</p>
          <p className="mt-2">
            {t('impressum.contact')}:{' '}
            <a
              href="mailto:office@marckurz-consulting.at"
              className="text-primary hover:underline"
            >
              office@marckurz-consulting.at
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('impressum.disclosureTitle')}
          </h2>
          <p>{t('impressum.disclosureText')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('impressum.liabilityTitle')}
          </h2>
          <p>{t('impressum.liabilityText')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('impressum.copyrightTitle')}
          </h2>
          <p>{t('impressum.copyrightText')}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('impressum.odrTitle')}
          </h2>
          <p>
            {t('impressum.odrText')}{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
        </section>

        <p className="text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
          &copy; 2026 FH-Prof. DI Dr. Marc Kurz
        </p>
      </div>
    </div>
  );
}
