export const dictionaries = {
  es: {
    // Sidebar
    nav_home: 'Inicio',
    nav_create: 'Crear Entrenamiento',
    nav_directory: 'Directorio de Ejercicios',
    nav_history: 'Entrenamientos Registrados',
    nav_calendar: 'Calendario',
    nav_nutrition: 'Nutrición y Calorías',
    nav_settings: 'Ajustes',
    nav_explore: 'Explorar Rutinas',
    logout: 'Cerrar Sesión',
    plan_name: 'Plan',
    fork_success: '¡Rutina añadida a tu biblioteca personal!',

    // Directorio de Ejercicios
    directory_search: 'Buscar ejercicios...',
    filter_all: 'Todos',
    filter_favorites: 'Favoritos',
    filter_cardio: 'Cardio',
    filter_chest: 'Pecho',
    filter_back: 'Espalda',
    filter_biceps: 'Bíceps',
    filter_triceps: 'Tríceps',
    filter_quads: 'Cuádriceps',
    filter_hamstrings: 'Isquiotibiales',
    filter_shoulders: 'Hombros',
    filter_calves: 'Gemelos',
    filter_core: 'Core',
    error_loading_exercises: 'No hay ejercicios disponibles o error al cargar.',

    // Ajustes
    settings_title_1: 'Ajustes ',
    settings_title_2: 'de Perfil',
    settings_desc: 'Personaliza tu experiencia en VigorNova. Ajusta tus datos personales, preferencias de visualización y tu plan mensual.',

    basic_info: 'Información Básica',
    name_label: 'Nombre en Plataforma',
    email_label: 'Correo Electrónico',
    save_personal: 'Guardar Cambios Personales',

    training_prefs: 'Preferencias de Entrenamiento',
    measurement_system: 'Sistema de Medición Preferido',
    kg_label: 'Kilogramos (kg)',
    lbs_label: 'Libras (lbs)',

    rest_timer: 'Temporizador de Descanso Automático',
    rest_60: '60 segundos (Hipertrofia metabólica)',
    rest_90: '90 segundos (Hipertrofia estándar)',
    rest_120: '120 segundos (Fuerza moderada)',
    rest_180: '180+ segundos (Fuerza pura)',
    rest_manual: 'Desactivar / Modo Manual',
    rest_desc: 'Al registrar una serie en plena rutina, un reloj bajará automáticamente para controlar la fatiga.',

    muscle_alerts: 'Alertas de Grupos Musculares',
    muscle_alerts_desc: 'Recibir notificaciones cuando pases > 7 días sin entrenar un grupo principal.',

    language_label: 'Idioma de la Interfaz',
    lang_es: 'Español (España)',
    lang_en: 'English (US)',
    lang_desc: 'Selecciona el idioma principal de la aplicación.',

    current_plan: 'Plan Actual',
    active_badge: 'ACTIVO',
    pro_desc: 'La élite de VigorNova. Tienes acceso a seguimiento de series musculares inteligente y rutinas infinitas.',
    next_cycle: 'Siguiente ciclo',
    paid_with: 'Pagado con',
    upgrade_annual: 'Mejorar a Anual (Oferta)',
    cancel_sub: 'Cancelar Suscripción'
  },
  en: {
    // Sidebar
    nav_home: 'Home',
    nav_create: 'Create Workout',
    nav_directory: 'Exercise Directory',
    nav_history: 'Workout History',
    nav_calendar: 'Calendar',
    nav_nutrition: 'Nutrition & Calories',
    nav_settings: 'Settings',
    nav_explore: 'Explore Routines',
    logout: 'Log Out',
    plan_name: 'Plan',
    fork_success: 'Routine added to your personal library!',

    // Directorio de Ejercicios
    directory_search: 'Search for exercises...',
    filter_all: 'All',
    filter_favorites: 'Favorites',
    filter_cardio: 'Cardio',
    filter_chest: 'Chest',
    filter_back: 'Back',
    filter_biceps: 'Biceps',
    filter_triceps: 'Triceps',
    filter_quads: 'Quadriceps',
    filter_hamstrings: 'Hamstrings',
    filter_shoulders: 'Shoulders',
    filter_calves: 'Calves',
    filter_core: 'Core',
    error_loading_exercises: 'No exercises available or failed to load.',

    // Ajustes
    settings_title_1: 'Profile ',
    settings_title_2: 'Settings',
    settings_desc: 'Customize your VigorNova experience. Adjust your personal data, display preferences, and your monthly plan.',

    basic_info: 'Basic Information',
    name_label: 'Platform Name',
    email_label: 'Email Address',
    save_personal: 'Save Personal Changes',

    training_prefs: 'Training Preferences',
    measurement_system: 'Preferred Measurement System',
    kg_label: 'Kilograms (kg)',
    lbs_label: 'Pounds (lbs)',

    rest_timer: 'Automatic Rest Timer',
    rest_60: '60 seconds (Metabolic Hypertrophy)',
    rest_90: '90 seconds (Standard Hypertrophy)',
    rest_120: '120 seconds (Moderate Strength)',
    rest_180: '180+ seconds (Pure Strength)',
    rest_manual: 'Disable / Manual Mode',
    rest_desc: 'When recording a set mid-routine, a timer will automatically count down to control fatigue.',

    muscle_alerts: 'Muscle Group Alerts',
    muscle_alerts_desc: 'Receive notifications when you go > 7 days without training a primary group.',

    language_label: 'Interface Language',
    lang_es: 'Español (España)',
    lang_en: 'English (US)',
    lang_desc: 'Select the main application language.',

    current_plan: 'Current Plan',
    active_badge: 'ACTIVE',
    pro_desc: 'The VigorNova Elite. You have access to intelligent muscle set tracking and infinite routines.',
    next_cycle: 'Next cycle',
    paid_with: 'Paid with',
    upgrade_annual: 'Upgrade to Annual (Offer)',
    cancel_sub: 'Cancel Subscription'
  }
};

export type Language = keyof typeof dictionaries;
