import { describe, it, expect } from 'vitest';
import { translations, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, useTranslation } from '../lib/i18n';

describe('i18n Language Support', () => {
  describe('Language Configuration', () => {
    it('should have 6 supported languages', () => {
      expect(Object.keys(SUPPORTED_LANGUAGES)).toHaveLength(6);
    });

    it('should have English as default language', () => {
      expect(DEFAULT_LANGUAGE).toBe('en');
    });

    it('should support all required languages', () => {
      const requiredLanguages = ['en', 'es', 'de', 'fr', 'pt', 'ja'];
      requiredLanguages.forEach(lang => {
        expect(SUPPORTED_LANGUAGES).toHaveProperty(lang);
      });
    });

    it('should have correct language display names', () => {
      expect(SUPPORTED_LANGUAGES.en).toBe('English');
      expect(SUPPORTED_LANGUAGES.es).toBe('Español');
      expect(SUPPORTED_LANGUAGES.de).toBe('Deutsch');
      expect(SUPPORTED_LANGUAGES.fr).toBe('Français');
      expect(SUPPORTED_LANGUAGES.pt).toBe('Português');
      expect(SUPPORTED_LANGUAGES.ja).toBe('日本語');
    });
  });

  describe('Navigation Translations', () => {
    it('should have nav.home translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('nav.home');
      });
    });

    it('should have nav.settings translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('nav.settings');
      });
    });

    it('should have nav.music translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('nav.music');
      });
    });

    it('should have correct English navigation translations', () => {
      expect(translations.en['nav.home']).toBe('Home');
      expect(translations.en['nav.settings']).toBe('Settings');
      expect(translations.en['nav.music']).toBe('Music');
    });

    it('should have correct Spanish navigation translations', () => {
      expect(translations.es['nav.home']).toBe('Inicio');
      expect(translations.es['nav.settings']).toBe('Configuración');
      expect(translations.es['nav.music']).toBe('Música');
    });

    it('should have correct German navigation translations', () => {
      expect(translations.de['nav.home']).toBe('Startseite');
      expect(translations.de['nav.settings']).toBe('Einstellungen');
      expect(translations.de['nav.music']).toBe('Musik');
    });

    it('should have correct French navigation translations', () => {
      expect(translations.fr['nav.home']).toBe('Accueil');
      expect(translations.fr['nav.settings']).toBe('Paramètres');
      expect(translations.fr['nav.music']).toBe('Musique');
    });

    it('should have correct Portuguese navigation translations', () => {
      expect(translations.pt['nav.home']).toBe('Início');
      expect(translations.pt['nav.settings']).toBe('Configurações');
      expect(translations.pt['nav.music']).toBe('Música');
    });

    it('should have correct Japanese navigation translations', () => {
      expect(translations.ja['nav.home']).toBe('ホーム');
      expect(translations.ja['nav.settings']).toBe('設定');
      expect(translations.ja['nav.music']).toBe('音楽');
    });
  });

  describe('Music Screen Translations', () => {
    it('should have music.title translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.title');
      });
    });

    it('should have music.subtitle translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.subtitle');
      });
    });

    it('should have music.free translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.free');
      });
    });

    it('should have music.premium translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.premium');
      });
    });

    it('should have music.freeLimit translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.freeLimit');
      });
    });

    it('should have music.unlimitedListening translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.unlimitedListening');
      });
    });

    it('should have music.premiumInfo translation in all languages', () => {
      Object.keys(translations).forEach(lang => {
        expect(translations[lang as keyof typeof translations]).toHaveProperty('music.premiumInfo');
      });
    });

    it('should have correct English music translations', () => {
      expect(translations.en['music.title']).toBe('Soundscapes');
      expect(translations.en['music.subtitle']).toBe('Find your calm moment');
      expect(translations.en['music.free']).toBe('Free');
      expect(translations.en['music.premium']).toBe('Premium');
    });
  });

  describe('Track Description Translations', () => {
    const trackKeys = [
      'track.gentleBreathing',
      'track.rainAfterMidnight',
      'track.whisperingForest',
      'track.velvetEvening',
      'track.blueSilence',
      'track.slowCityLights',
      'track.ocean',
      'track.summerNight',
      'track.cozyfireplace',
      'track.myOwnPlace',
      'track.gentlePurring',
      'track.deepSleepInduction',
      'track.calmConcentration',
      'track.anxietyRelief',
    ];

    trackKeys.forEach(trackKey => {
      it(`should have ${trackKey} translation in all languages`, () => {
        Object.keys(translations).forEach(lang => {
          expect(translations[lang as keyof typeof translations]).toHaveProperty(trackKey);
          const value = translations[lang as keyof typeof translations][trackKey];
          expect(value).toBeTruthy();
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have correct English track descriptions', () => {
      expect(translations.en['track.gentleBreathing']).toBe('Calm breathing guide');
      expect(translations.en['track.rainAfterMidnight']).toBe('Rain atmosphere');
      expect(translations.en['track.ocean']).toBe('Gentle ocean waves');
    });
  });

  describe('Common Translations', () => {
    const commonKeys = ['common.back', 'common.close', 'common.loading', 'common.error', 'common.retry', 'common.ok', 'common.cancel'];

    commonKeys.forEach(commonKey => {
      it(`should have ${commonKey} translation in all languages`, () => {
        Object.keys(translations).forEach(lang => {
          expect(translations[lang as keyof typeof translations]).toHaveProperty(commonKey);
        });
      });
    });
  });

  describe('Translation Completeness', () => {
    it('should have same number of keys in all language objects', () => {
      const englishKeyCount = Object.keys(translations.en).length;
      Object.keys(translations).forEach(lang => {
        const langKeyCount = Object.keys(translations[lang as keyof typeof translations]).length;
        expect(langKeyCount).toBe(englishKeyCount);
      });
    });

    it('should have all English keys in all other languages', () => {
      const englishKeys = Object.keys(translations.en);
      Object.keys(translations).forEach(lang => {
        if (lang !== 'en') {
          englishKeys.forEach(key => {
            expect(translations[lang as keyof typeof translations]).toHaveProperty(key);
          });
        }
      });
    });

    it('should not have empty translation values', () => {
      Object.keys(translations).forEach(lang => {
        Object.values(translations[lang as keyof typeof translations]).forEach(value => {
          expect(value).toBeTruthy();
          expect(typeof value).toBe('string');
          expect(value.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('useTranslation Hook', () => {
    it('should return translation function for English', () => {
      const { t } = useTranslation('en') as any;
      expect(typeof t).toBe('function');
      expect(t('nav.home')).toBe('Home');
    });

    it('should return translation function for Spanish', () => {
      const { t } = useTranslation('es') as any;
      expect(typeof t).toBe('function');
      expect(t('nav.home')).toBe('Inicio');
    });

    it('should return translation function for German', () => {
      const { t } = useTranslation('de') as any;
      expect(typeof t).toBe('function');
      expect(t('nav.home')).toBe('Startseite');
    });

    it('should return translation function for French', () => {
      const { t } = useTranslation('fr') as any;
      expect(typeof t).toBe('function');
      expect(t('nav.home')).toBe('Accueil');
    });

    it('should return translation function for Portuguese', () => {
      const { t } = useTranslation('pt') as any;
      expect(typeof t).toBe('function');
      expect(t('nav.home')).toBe('Início');
    });

    it('should return translation function for Japanese', () => {
      const { t } = useTranslation('ja') as any;
      expect(typeof t).toBe('function');
      expect(t('nav.home')).toBe('ホーム');
    });

    it('should fall back to English for missing keys', () => {
      const { t } = useTranslation('es') as any;
      const result = t('nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });
  });

  describe('Language Switching', () => {
    it('should switch between all language pairs', () => {
      const languages = ['en', 'es', 'de', 'fr', 'pt', 'ja'] as const;
      languages.forEach(sourceLang => {
        languages.forEach(targetLang => {
          const { t: sourceT } = useTranslation(sourceLang) as any;
          const { t: targetT } = useTranslation(targetLang) as any;
          
          const sourceHome = sourceT('nav.home');
          const targetHome = targetT('nav.home');
          
          expect(sourceHome).toBeTruthy();
          expect(targetHome).toBeTruthy();
          
          if (sourceLang !== targetLang) {
            expect(sourceHome).not.toBe(targetHome);
          }
        });
      });
    });
  });

  describe('Music Screen Completeness', () => {
    it('should have all music-related keys for Music screen', () => {
      const musicKeys = [
        'music.title',
        'music.subtitle',
        'music.free',
        'music.premium',
        'music.freeLimit',
        'music.unlimitedListening',
        'music.premiumInfo',
      ];

      musicKeys.forEach(key => {
        Object.keys(translations).forEach(lang => {
          expect(translations[lang as keyof typeof translations]).toHaveProperty(key);
        });
      });
    });

    it('should have all track description keys for Music screen', () => {
      const trackDescriptionKeys = [
        'track.gentleBreathing',
        'track.rainAfterMidnight',
        'track.whisperingForest',
        'track.velvetEvening',
        'track.blueSilence',
        'track.slowCityLights',
        'track.ocean',
        'track.summerNight',
        'track.cozyfireplace',
        'track.myOwnPlace',
        'track.gentlePurring',
        'track.deepSleepInduction',
        'track.calmConcentration',
        'track.anxietyRelief',
      ];

      trackDescriptionKeys.forEach(key => {
        Object.keys(translations).forEach(lang => {
          expect(translations[lang as keyof typeof translations]).toHaveProperty(key);
        });
      });
    });
  });
});
