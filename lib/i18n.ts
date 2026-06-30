/**
 * Internationalization (i18n) system for CalmSpace
 * Supports: English (EN), Spanish (ES), German (DE)
 */

export type Language = 'en' | 'es' | 'de';

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Translation strings for all supported languages
 */
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Home Screen
    'home.title': 'How are you feeling today?',
    'home.mood.anxiety': 'Anxiety',
    'home.mood.stress': 'Stress',
    'home.mood.overthinking': 'Overthinking',
    'home.mood.sleep': 'Sleep Problems',
    'home.mood.sadness': 'Sadness',
    'home.mood.relax': 'Just Relax',
    'home.startSession': 'Start Session',
    'home.soundToggle': 'Sound',
    'home.themeToggle': 'Theme',

    // Session Screen
    'session.inputPlaceholder': 'Share your thoughts...',
    'session.send': 'Send',
    'session.breathingExercise': 'Breathing Exercise',
    'session.audioLabel': 'Audio',
    'session.messageLimitReached': 'You\'ve reached your daily message limit. Upgrade to Premium for unlimited messages.',

    // AI Responses (Examples)
    'ai.greeting': 'I\'m here with you. How can I help you feel calmer today?',
    'ai.breathing': 'Let\'s slow down together.',
    'ai.support': 'There\'s no need to rush.',
    'ai.gentle': 'We can take this step by step.',

    // Breathing Exercise
    'breathing.title': 'Breathing Exercise',
    'breathing.inhale': 'Slowly breathe in...',
    'breathing.hold': 'Gently hold your breath...',
    'breathing.exhale': 'Slowly breathe out...',
    'breathing.exit': 'Exit',

    // Relaxation Tools
    'tools.title': 'Relaxation Tools',
    'tools.breathing': 'Breathing Exercise',
    'tools.sleep': 'Sleep Mode',
    'tools.grounding': 'Grounding Exercise',
    'tools.quiet': 'Quiet Relaxation',
    'tools.premiumOnly': 'Premium only',

    // Sleep Mode
    'sleep.title': 'Sleep Mode',
    'sleep.message1': 'You don\'t need to force sleep.',
    'sleep.message2': 'Just allow yourself to rest.',
    'sleep.message3': 'It\'s okay to slow down.',

    // Grounding Exercise
    'grounding.title': 'Grounding Exercise',
    'grounding.step1': 'Name 5 things you can see',
    'grounding.step2': 'Name 4 things you can touch',
    'grounding.step3': 'Name 3 things you can hear',
    'grounding.step4': 'Name 2 things you can smell',
    'grounding.step5': 'Name 1 emotion you currently feel',
    'grounding.progress': 'Step {{current}} of {{total}}',

    // Quiet Mode
    'quiet.title': 'Quiet Relaxation',
    'quiet.description': 'Just breathe. Listen. Be present.',

    // Audio
    'audio.music': 'Music',
    'audio.forest': 'Forest Sounds',
    'audio.rain': 'Rain Sounds',
    'audio.free': 'Free',
    'audio.premium': 'Premium',

    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.sound': 'Sound',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.subscription': 'Subscription',
    'settings.premium': 'Premium',
    'settings.free': 'Free',
    'settings.upgrade': 'Upgrade to Premium',
    'settings.disclaimer': 'This app provides emotional support and relaxation and is not a medical service.',
    'settings.about': 'About',
    'settings.support': 'Support',

    // Premium
    'premium.title': 'Premium Features',
    'premium.unlimitedMessages': 'Unlimited AI messages',
    'premium.allAudio': 'All audio categories',
    'premium.sleepMode': 'Sleep Mode',
    'premium.groundingExercise': 'Grounding Exercise',
    'premium.quietMode': 'Quiet Relaxation',
    'premium.trialPrice': '$2.99 for first week',
    'premium.monthlyPrice': '$4.99/month',
    'premium.annualPrice': '$39.99/year',
    'premium.subscribe': 'Subscribe',
    'premium.cancel': 'Cancel',

    // Common
    'common.back': 'Back',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.ok': 'OK',
    'common.cancel': 'Cancel',
  },

  es: {
    // Home Screen
    'home.title': '¿Cómo te sientes hoy?',
    'home.mood.anxiety': 'Ansiedad',
    'home.mood.stress': 'Estrés',
    'home.mood.overthinking': 'Exceso de pensamiento',
    'home.mood.sleep': 'Problemas de sueño',
    'home.mood.sadness': 'Tristeza',
    'home.mood.relax': 'Solo relajarme',
    'home.startSession': 'Comenzar sesión',
    'home.soundToggle': 'Sonido',
    'home.themeToggle': 'Tema',

    // Session Screen
    'session.inputPlaceholder': 'Comparte tus pensamientos...',
    'session.send': 'Enviar',
    'session.breathingExercise': 'Ejercicio de respiración',
    'session.audioLabel': 'Audio',
    'session.messageLimitReached': 'Has alcanzado tu límite diario de mensajes. Actualiza a Premium para mensajes ilimitados.',

    // AI Responses (Examples)
    'ai.greeting': 'Estoy aquí contigo. ¿Cómo puedo ayudarte a sentirte más tranquilo?',
    'ai.breathing': 'Bajemos el ritmo juntos.',
    'ai.support': 'No hay prisa.',
    'ai.gentle': 'Podemos tomar esto paso a paso.',

    // Breathing Exercise
    'breathing.title': 'Ejercicio de respiración',
    'breathing.inhale': 'Respira lentamente...',
    'breathing.hold': 'Sostén suavemente tu respiración...',
    'breathing.exhale': 'Exhala lentamente...',
    'breathing.exit': 'Salir',

    // Relaxation Tools
    'tools.title': 'Herramientas de relajación',
    'tools.breathing': 'Ejercicio de respiración',
    'tools.sleep': 'Modo de sueño',
    'tools.grounding': 'Ejercicio de anclaje',
    'tools.quiet': 'Relajación silenciosa',
    'tools.premiumOnly': 'Solo premium',

    // Sleep Mode
    'sleep.title': 'Modo de sueño',
    'sleep.message1': 'No necesitas forzar el sueño.',
    'sleep.message2': 'Solo permítete descansar.',
    'sleep.message3': 'Está bien bajar el ritmo.',

    // Grounding Exercise
    'grounding.title': 'Ejercicio de anclaje',
    'grounding.step1': 'Nombra 5 cosas que puedas ver',
    'grounding.step2': 'Nombra 4 cosas que puedas tocar',
    'grounding.step3': 'Nombra 3 cosas que puedas escuchar',
    'grounding.step4': 'Nombra 2 cosas que puedas oler',
    'grounding.step5': 'Nombra 1 emoción que sientas ahora',
    'grounding.progress': 'Paso {{current}} de {{total}}',

    // Quiet Mode
    'quiet.title': 'Relajación silenciosa',
    'quiet.description': 'Solo respira. Escucha. Sé presente.',

    // Audio
    'audio.music': 'Música',
    'audio.forest': 'Sonidos del bosque',
    'audio.rain': 'Sonidos de lluvia',
    'audio.free': 'Gratis',
    'audio.premium': 'Premium',

    // Settings
    'settings.title': 'Configuración',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.sound': 'Sonido',
    'settings.darkMode': 'Modo oscuro',
    'settings.lightMode': 'Modo claro',
    'settings.subscription': 'Suscripción',
    'settings.premium': 'Premium',
    'settings.free': 'Gratis',
    'settings.upgrade': 'Actualizar a Premium',
    'settings.disclaimer': 'Esta aplicación proporciona apoyo emocional y relajación y no es un servicio médico.',
    'settings.about': 'Acerca de',
    'settings.support': 'Soporte',

    // Premium
    'premium.title': 'Características Premium',
    'premium.unlimitedMessages': 'Mensajes de IA ilimitados',
    'premium.allAudio': 'Todas las categorías de audio',
    'premium.sleepMode': 'Modo de sueño',
    'premium.groundingExercise': 'Ejercicio de anclaje',
    'premium.quietMode': 'Relajación silenciosa',
    'premium.trialPrice': '$2.99 primera semana',
    'premium.monthlyPrice': '$4.99/mes',
    'premium.annualPrice': '$39.99/año',
    'premium.subscribe': 'Suscribirse',
    'premium.cancel': 'Cancelar',

    // Common
    'common.back': 'Atrás',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.retry': 'Reintentar',
    'common.ok': 'OK',
    'common.cancel': 'Cancelar',
  },

  de: {
    // Home Screen
    'home.title': 'Wie fühlst du dich heute?',
    'home.mood.anxiety': 'Angst',
    'home.mood.stress': 'Stress',
    'home.mood.overthinking': 'Überdenken',
    'home.mood.sleep': 'Schlafprobleme',
    'home.mood.sadness': 'Traurigkeit',
    'home.mood.relax': 'Einfach entspannen',
    'home.startSession': 'Sitzung starten',
    'home.soundToggle': 'Ton',
    'home.themeToggle': 'Design',

    // Session Screen
    'session.inputPlaceholder': 'Teile deine Gedanken...',
    'session.send': 'Senden',
    'session.breathingExercise': 'Atemübung',
    'session.audioLabel': 'Audio',
    'session.messageLimitReached': 'Du hast dein tägliches Nachrichtenlimit erreicht. Upgrade auf Premium für unbegrenzte Nachrichten.',

    // AI Responses (Examples)
    'ai.greeting': 'Ich bin für dich da. Wie kann ich dir helfen, dich ruhiger zu fühlen?',
    'ai.breathing': 'Lassen Sie uns zusammen langsamer werden.',
    'ai.support': 'Es gibt keinen Grund zu hetzen.',
    'ai.gentle': 'Wir können dies Schritt für Schritt angehen.',

    // Breathing Exercise
    'breathing.title': 'Atemübung',
    'breathing.inhale': 'Atme langsam ein...',
    'breathing.hold': 'Halte deinen Atem sanft...',
    'breathing.exhale': 'Atme langsam aus...',
    'breathing.exit': 'Beenden',

    // Relaxation Tools
    'tools.title': 'Entspannungswerkzeuge',
    'tools.breathing': 'Atemübung',
    'tools.sleep': 'Schlafmodus',
    'tools.grounding': 'Erdungsübung',
    'tools.quiet': 'Stille Entspannung',
    'tools.premiumOnly': 'Nur Premium',

    // Sleep Mode
    'sleep.title': 'Schlafmodus',
    'sleep.message1': 'Du musst den Schlaf nicht erzwingen.',
    'sleep.message2': 'Erlaube dir einfach zu ruhen.',
    'sleep.message3': 'Es ist in Ordnung, langsamer zu werden.',

    // Grounding Exercise
    'grounding.title': 'Erdungsübung',
    'grounding.step1': 'Nenne 5 Dinge, die du sehen kannst',
    'grounding.step2': 'Nenne 4 Dinge, die du berühren kannst',
    'grounding.step3': 'Nenne 3 Dinge, die du hören kannst',
    'grounding.step4': 'Nenne 2 Dinge, die du riechen kannst',
    'grounding.step5': 'Nenne 1 Emotion, die du gerade fühlst',
    'grounding.progress': 'Schritt {{current}} von {{total}}',

    // Quiet Mode
    'quiet.title': 'Stille Entspannung',
    'quiet.description': 'Atme einfach. Höre zu. Sei präsent.',

    // Audio
    'audio.music': 'Musik',
    'audio.forest': 'Waldgeräusche',
    'audio.rain': 'Regengeräusche',
    'audio.free': 'Kostenlos',
    'audio.premium': 'Premium',

    // Settings
    'settings.title': 'Einstellungen',
    'settings.theme': 'Design',
    'settings.language': 'Sprache',
    'settings.sound': 'Ton',
    'settings.darkMode': 'Dunkler Modus',
    'settings.lightMode': 'Heller Modus',
    'settings.subscription': 'Abonnement',
    'settings.premium': 'Premium',
    'settings.free': 'Kostenlos',
    'settings.upgrade': 'Auf Premium upgraden',
    'settings.disclaimer': 'Diese App bietet emotionale Unterstützung und Entspannung und ist kein medizinischer Dienst.',
    'settings.about': 'Über',
    'settings.support': 'Unterstützung',

    // Premium
    'premium.title': 'Premium-Funktionen',
    'premium.unlimitedMessages': 'Unbegrenzte KI-Nachrichten',
    'premium.allAudio': 'Alle Audiokategorien',
    'premium.sleepMode': 'Schlafmodus',
    'premium.groundingExercise': 'Erdungsübung',
    'premium.quietMode': 'Stille Entspannung',
    'premium.trialPrice': '$2,99 erste Woche',
    'premium.monthlyPrice': '$4,99/Monat',
    'premium.annualPrice': '$39,99/Jahr',
    'premium.subscribe': 'Abonnieren',
    'premium.cancel': 'Abbrechen',

    // Common
    'common.back': 'Zurück',
    'common.close': 'Schließen',
    'common.loading': 'Wird geladen...',
    'common.error': 'Etwas ist schief gelaufen',
    'common.retry': 'Erneut versuchen',
    'common.ok': 'OK',
    'common.cancel': 'Abbrechen',
  },
};

/**
 * Get translation string for a given key and language
 * Falls back to English if key not found in target language
 */
export function t(key: string, language: Language = DEFAULT_LANGUAGE, variables?: Record<string, string>): string {
  let text = translations[language]?.[key] || translations.en[key] || key;

  // Replace variables in text (e.g., {{current}} -> value)
  if (variables) {
    Object.entries(variables).forEach(([varKey, varValue]) => {
      text = text.replace(`{{${varKey}}}`, varValue);
    });
  }

  return text;
}

/**
 * Hook to use translations in React components
 * Usage: const { t } = useTranslation();
 */
export function useTranslation(language: Language = DEFAULT_LANGUAGE) {
  return {
    t: (key: string, variables?: Record<string, string>) => t(key, language, variables),
    language,
  };
}
