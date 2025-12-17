import { LanguageCode } from '../types';

export const translations: Record<LanguageCode, any> = {
  en: {
    common: {
      appName: "ZenWork AI",
      login: "Log In",
      signOut: "Sign Out",
      settings: "Settings",
      save: "Save Changes",
      cancel: "Cancel",
      loading: "Loading...",
      cups: "cups",
      goal: "goal",
      days: "Days",
    },
    // ... existing ...
    settings: {
      title: "Settings",
      displayName: "Display Name",
      role: "Job Role",
      wellnessGoal: "Primary Wellness Goal",
      goals: {
        reduce_stress: "Reduce Stress & Anxiety",
        improve_focus: "Improve Focus & Productivity",
        better_sleep: "Better Sleep Quality",
        work_life_balance: "Better Work-Life Balance",
        boost_energy: "Boost Physical Energy"
      },
      waterGoal: "Daily Water Goal (Cups)",
      waterRec: "Recommended: 8-10 cups per day",
      language: "Language",
      theme: "Theme",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      notifications: "Notifications",
      integrations: "Integrations",
      connected: "Connected",
      connect: "Connect"
    },
    // ... rest ...
    landing: {
      newFeature: "New: AI Burnout Detection",
      titleStart: "Prevent Burnout.",
      titleEnd: "Before It Starts.",
      subtitle: "The intelligent wellness tracker for remote teams. Monitor stress, track mood, and get actionable AI coaching to maintain peak performance without the crash.",
      startTrial: "Start Free Trial",
      viewDemo: "View Demo",
      pricing: "Pricing",
      featureCoaching: "AI Coaching",
      featureCoachingDesc: "Personalized daily tips based on your work patterns and mood logs.",
      featureMood: "Mood Tracking",
      featureMoodDesc: "Simple 30-second daily check-ins to monitor team pulse and individual health.",
      featurePrivacy: "Privacy First",
      featurePrivacyDesc: "Your wellness data is encrypted and private. Share only what you choose.",
      trustedBy: "Trusted by remote teams at"
    },
    dashboard: {
      greeting: "Hello, {name}",
      subtitle: "Let's prioritize your wellness today.",
      streak: "Streak",
      avgMood: "Avg Mood",
      avgWork: "Avg Work",
      hydration: "Hydration",
      chartMood: "Mood & Stress Flow",
      chartWork: "Workload Balance",
      workHours: "Hours worked per day",
      moodLabel: "Mood",
      stressLabel: "Stress",
      teamPulse: "Team Pulse",
      achievements: "Achievements",
      breatheTitle: "Need a moment?",
      breatheDesc: "Take a quick 2-minute breathing break.",
      startBreathe: "Start Breathing",
      tabOverview: "Overview",
      tabJournal: "Journal",
      tabCoach: "AI Coach",
      emptyJournal: "No logs yet. Start by checking in!",
      delete: "Delete",
      journalTitle: "Your Wellness Journey",
      journalSubtitle: "Track your daily progress and patterns.",
      zenScore: "Daily Zen Score",
      zenScoreDesc: "Based on mood, stress & balance",
      dailyQuests: "Daily Quests",
      level: "Level",
      xp: "XP",
      questCheckin: "Daily Check-in",
      questWater: "Hit Water Goal",
      questBreathe: "Mindful Breath",
      complete: "Complete"
    },
    checkIn: {
      title: "Daily Check-In",
      question: "How are you feeling today?",
      struggling: "Struggling",
      thriving: "Thriving",
      workHours: "Work Hours",
      water: "Water (cups)",
      stressLevel: "Stress Level (1-10)",
      submit: "Complete Check-In"
    },
    aiCoach: {
      title: "ZenWork AI Coach",
      analyze: "Analyze Trends",
      analyzing: "Analyzing your work-life balance patterns...",
      recommendation: "Recommended Action",
      refresh: "Refresh Analysis",
      placeholder: "Get personalized insights based on your recent activity logs, sleep patterns, and stress levels.",
      errorTitle: "Connection Issue",
      errorMessage: "We couldn't reach the AI coach right now. Please try again later.",
      errorAction: "Take a deep breath and relax."
    },
    breathe: {
      title: "4-7-8 Breathing",
      inhale: "Inhale...",
      hold: "Hold...",
      exhale: "Exhale...",
      completed: "Session Completed",
      close: "Close"
    }
  },
  es: {
    // ... existing ...
    settings: {
      title: "Ajustes",
      displayName: "Nombre para mostrar",
      role: "Puesto / Rol",
      wellnessGoal: "Meta Principal de Bienestar",
      goals: {
        reduce_stress: "Reducir Estrés y Ansiedad",
        improve_focus: "Mejorar Enfoque y Productividad",
        better_sleep: "Mejorar Calidad de Sueño",
        work_life_balance: "Mejorar Equilibrio Vida-Trabajo",
        boost_energy: "Aumentar Energía Física"
      },
      waterGoal: "Meta diaria de agua (Vasos)",
      waterRec: "Recomendado: 8-10 vasos al día",
      language: "Idioma",
      theme: "Tema",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro",
      notifications: "Notificaciones",
      integrations: "Integraciones",
      connected: "Conectado",
      connect: "Conectar"
    },
    common: { appName: "ZenWork AI", login: "Iniciar sesión", signOut: "Cerrar sesión", settings: "Ajustes", save: "Guardar cambios", cancel: "Cancelar", loading: "Cargando...", cups: "vasos", goal: "meta", days: "Días" },
    landing: { newFeature: "Nuevo: Detección de agotamiento por IA", titleStart: "Previene el agotamiento.", titleEnd: "Antes de que empiece.", subtitle: "El rastreador de bienestar inteligente para equipos remotos. Monitorea el estrés y recibe consejos de IA para mantener el rendimiento.", startTrial: "Prueba gratis", viewDemo: "Ver demostración", pricing: "Precios", featureCoaching: "Entrenamiento IA", featureCoachingDesc: "Consejos diarios personalizados basados en tus patrones de trabajo y estado de ánimo.", featureMood: "Rastreo de ánimo", featureMoodDesc: "Chequeos diarios de 30 segundos para monitorear el pulso del equipo y la salud individual.", featurePrivacy: "Privacidad primero", featurePrivacyDesc: "Tus datos de bienestar están encriptados y son privados. Comparte solo lo que elijas.", trustedBy: "Con la confianza de equipos remotos en" },
    dashboard: { 
      greeting: "Hola, {name}", subtitle: "Prioricemos tu bienestar hoy.", streak: "Racha", avgMood: "Ánimo Prom.", avgWork: "Trabajo Prom.", hydration: "Hidratación", chartMood: "Flujo de ánimo y estrés", chartWork: "Equilibrio de carga de trabajo", workHours: "Horas trabajadas por día", moodLabel: "Ánimo", stressLabel: "Estrés", teamPulse: "Pulso del Equipo", achievements: "Logros", breatheTitle: "¿Necesitas un momento?", breatheDesc: "Toma un descanso de respiración de 2 minutos.", startBreathe: "Respirar", tabOverview: "Resumen", tabJournal: "Diario", tabCoach: "Entrenador IA", emptyJournal: "No hay registros aún. ¡Empieza con un check-in!", delete: "Eliminar", journalTitle: "Tu viaje de bienestar", journalSubtitle: "Rastrea tu progreso diario y patrones.",
      zenScore: "Puntaje Zen Diario", zenScoreDesc: "Basado en ánimo, estrés y equilibrio", dailyQuests: "Misiones Diarias", level: "Nivel", xp: "XP", questCheckin: "Registro Diario", questWater: "Meta de Agua", questBreathe: "Respiración Consciente", complete: "Completado"
    },
    checkIn: { title: "Registro diario", question: "¿Cómo te sientes hoy?", struggling: "Mal", thriving: "Excelente", workHours: "Horas de trabajo", water: "Agua (vasos)", stressLevel: "Nivel de estrés (1-10)", submit: "Completar registro" },
    aiCoach: { title: "Entrenador ZenWork AI", analyze: "Analizar tendencias", analyzing: "Analizando tus patrones de equilibrio vida-trabajo...", recommendation: "Acción recomendada", refresh: "Actualizar análisis", placeholder: "Obtén información personalizada basada en tus registros de actividad recientes, patrones de sueño y niveles de estrés.", errorTitle: "Problema de conexión", errorMessage: "No pudimos contactar al entrenador de IA en este momento.", errorAction: "Respira profundo y relájate." },
    breathe: { title: "Respiración 4-7-8", inhale: "Inhala...", hold: "Mantén...", exhale: "Exhala...", completed: "Sesión Completada", close: "Cerrar" }
  },
  fr: {
    // ... existing ...
    settings: {
      title: "Paramètres",
      displayName: "Nom d'affichage",
      role: "Poste / Rôle",
      wellnessGoal: "Objectif Principal de Bien-être",
      goals: {
        reduce_stress: "Réduire le Stress",
        improve_focus: "Améliorer la Concentration",
        better_sleep: "Meilleur Sommeil",
        work_life_balance: "Équilibre Vie Pro/Perso",
        boost_energy: "Augmenter l'Énergie"
      },
      waterGoal: "Objectif d'eau (Tasses)",
      waterRec: "Recommandé : 8-10 tasses par jour",
      language: "Langue",
      theme: "Thème",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair",
      notifications: "Notifications",
      integrations: "Intégrations",
      connected: "Connecté",
      connect: "Connecter"
    },
    common: { appName: "ZenWork AI", login: "Connexion", signOut: "Déconnexion", settings: "Paramètres", save: "Enregistrer", cancel: "Annuler", loading: "Chargement...", cups: "tasses", goal: "objectif", days: "Jours" },
    landing: { newFeature: "Nouveau : Détection de burnout par IA", titleStart: "Évitez le burnout.", titleEnd: "Avant qu'il ne commence.", subtitle: "Le suivi de bien-être intelligent pour les équipes à distance. Surveillez le stress et obtenez un coaching IA pour maintenir la performance.", startTrial: "Essai gratuit", viewDemo: "Voir la démo", pricing: "Tarifs", featureCoaching: "Coaching IA", featureCoachingDesc: "Conseils quotidiens personnalisés basés sur vos habitudes de travail et votre humeur.", featureMood: "Suivi de l'humeur", featureMoodDesc: "Bilans quotidiens de 30 secondes pour surveiller le pouls de l'équipe et la santé individuelle.", featurePrivacy: "Confidentialité d'abord", featurePrivacyDesc: "Vos données de bien-être sont cryptées et privées. Partagez uniquement ce que vous choisissez.", trustedBy: "Recommandé par les équipes à distance chez" },
    dashboard: { 
      greeting: "Bonjour, {name}", subtitle: "Priorisons votre bien-être aujourd'hui.", streak: "Série", avgMood: "Humeur Moy.", avgWork: "Travail Moy.", hydration: "Hydratation", chartMood: "Flux d'humeur et de stress", chartWork: "Équilibre de travail", workHours: "Heures travaillées par jour", moodLabel: "Humeur", stressLabel: "Stress", teamPulse: "Pouls de l'équipe", achievements: "Succès", breatheTitle: "Besoin d'une pause ?", breatheDesc: "Prenez 2 minutes pour respirer.", startBreathe: "Respirer", tabOverview: "Aperçu", tabJournal: "Journal", tabCoach: "Coach IA", emptyJournal: "Aucun journal pour le moment. Commencez par un bilan !", delete: "Supprimer", journalTitle: "Votre parcours bien-être", journalSubtitle: "Suivez vos progrès quotidiens.",
      zenScore: "Score Zen Quotidien", zenScoreDesc: "Basé sur l'humeur, le stress et l'équilibre", dailyQuests: "Quêtes Quotidiennes", level: "Niveau", xp: "XP", questCheckin: "Bilan Quotidien", questWater: "Objectif Eau", questBreathe: "Respiration Consciente", complete: "Complet"
    },
    checkIn: { title: "Bilan quotidien", question: "Comment vous sentez-vous aujourd'hui ?", struggling: "Difficile", thriving: "Épanoui", workHours: "Heures de travail", water: "Eau (tasses)", stressLevel: "Niveau de stress (1-10)", submit: "Terminer le bilan" },
    aiCoach: { title: "Coach ZenWork AI", analyze: "Analyser les tendances", analyzing: "Analyse de vos modèles d'équilibre travail-vie...", recommendation: "Action recommandée", refresh: "Actualiser l'analyse", placeholder: "Obtenez des informations personnalisées basées sur vos journaux d'activité récents.", errorTitle: "Problème de connexion", errorMessage: "Nous n'avons pas pu joindre le coach IA pour le moment.", errorAction: "Prenez une grande respiration et détendez-vous." },
    breathe: { title: "Respiration 4-7-8", inhale: "Inspirez...", hold: "Retenez...", exhale: "Expirez...", completed: "Session Terminée", close: "Fermer" }
  },
  de: {
    // ... existing ...
    settings: {
      title: "Einstellungen",
      displayName: "Anzeigename",
      role: "Berufsbezeichnung",
      wellnessGoal: "Primäres Wellness-Ziel",
      goals: {
        reduce_stress: "Stress & Angst reduzieren",
        improve_focus: "Fokus & Produktivität verbessern",
        better_sleep: "Schlafqualität verbessern",
        work_life_balance: "Work-Life-Balance verbessern",
        boost_energy: "Körperliche Energie steigern"
      },
      waterGoal: "Tägliches Wasserziel (Tassen)",
      waterRec: "Empfohlen: 8-10 Tassen pro Tag",
      language: "Sprache",
      theme: "Thema",
      darkMode: "Dunkelmodus",
      lightMode: "Lichtmodus",
      notifications: "Benachrichtigungen",
      integrations: "Integrationen",
      connected: "Verbunden",
      connect: "Verbinden"
    },
    common: { appName: "ZenWork AI", login: "Anmelden", signOut: "Abmelden", settings: "Einstellungen", save: "Speichern", cancel: "Abbrechen", loading: "Laden...", cups: "Tassen", goal: "Ziel", days: "Tage" },
    landing: { newFeature: "Neu: KI-Burnout-Erkennung", titleStart: "Burnout verhindern.", titleEnd: "Bevor es beginnt.", subtitle: "Der intelligente Wellness-Tracker für Remote-Teams. Überwachen Sie Stress und erhalten Sie KI-Coaching.", startTrial: "Kostenlos testen", viewDemo: "Demo ansehen", pricing: "Preise", featureCoaching: "KI-Coaching", featureCoachingDesc: "Personalisierte tägliche Tipps basierend auf Ihren Arbeitsmustern und Stimmungsprotokollen.", featureMood: "Stimmungs-Tracking", featureMoodDesc: "Einfache tägliche 30-Sekunden-Check-ins zur Überwachung der Teamstimmung.", featurePrivacy: "Datenschutz zuerst", featurePrivacyDesc: "Ihre Wellness-Daten sind verschlüsselt und privat. Teilen Sie nur, was Sie möchten.", trustedBy: "Vertraut von Remote-Teams bei" },
    dashboard: { 
      greeting: "Hallo, {name}", subtitle: "Lassen Sie uns heute Ihr Wohlbefinden priorisieren.", streak: "Strähne", avgMood: "D-Stimm.", avgWork: "D-Arbeit", hydration: "Hydratation", chartMood: "Stimmungs- & Stressfluss", chartWork: "Arbeitsbelastung", workHours: "Arbeitsstunden pro Tag", moodLabel: "Stimmung", stressLabel: "Stress", teamPulse: "Team-Puls", achievements: "Erfolge", breatheTitle: "Brauchen Sie einen Moment?", breatheDesc: "Machen Sie eine 2-minütige Atempause.", startBreathe: "Atmen", tabOverview: "Überblick", tabJournal: "Tagebuch", tabCoach: "KI-Coach", emptyJournal: "Noch keine Einträge. Starten Sie mit einem Check-in!", delete: "Löschen", journalTitle: "Ihre Wellness-Reise", journalSubtitle: "Verfolgen Sie Ihren täglichen Fortschritt.",
      zenScore: "Täglicher Zen-Score", zenScoreDesc: "Basierend auf Stimmung, Stress & Balance", dailyQuests: "Tägliche Quests", level: "Level", xp: "EP", questCheckin: "Täglicher Check-in", questWater: "Wasserziel erreichen", questBreathe: "Achtsames Atmen", complete: "Fertig"
    },
    checkIn: { title: "Täglicher Check-in", question: "Wie fühlen Sie sich heute?", struggling: "Schlecht", thriving: "Großartig", workHours: "Arbeitsstunden", water: "Wasser (Tassen)", stressLevel: "Stresslevel (1-10)", submit: "Check-in abschließen" },
    aiCoach: { title: "ZenWork KI-Coach", analyze: "Trends analysieren", analyzing: "Analysiere Ihre Work-Life-Balance-Muster...", recommendation: "Empfohlene Maßnahme", refresh: "Analyse aktualisieren", placeholder: "Erhalten Sie personalisierte Einblicke basierend auf Ihren letzten Aktivitätsprotokollen.", errorTitle: "Verbindungsproblem", errorMessage: "Wir konnten den KI-Coach gerade nicht erreichen.", errorAction: "Atmen Sie tief durch und entspannen Sie sich." },
    breathe: { title: "4-7-8 Atmung", inhale: "Einatmen...", hold: "Halten...", exhale: "Ausatmen...", completed: "Sitzung Beendet", close: "Schließen" }
  }
};