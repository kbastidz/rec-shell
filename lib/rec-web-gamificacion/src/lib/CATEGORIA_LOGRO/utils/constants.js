
// Colores predefinidos para las categorías (diseño amigable para niños)
export const COLORES_CATEGORIA = [
  { valor: '#FF6B6B', nombre: 'Rojo Alegre' },
  { valor: '#4ECDC4', nombre: 'Verde Agua' },
  { valor: '#45B7D1', nombre: 'Azul Cielo' },
  { valor: '#96CEB4', nombre: 'Verde Menta' },
  { valor: '#FFEAA7', nombre: 'Amarillo Sol' },
  { valor: '#DDA0DD', nombre: 'Violeta Suave' },
  { valor: '#98D8C8', nombre: 'Turquesa' },
  { valor: '#F7DC6F', nombre: 'Dorado' },
  { valor: '#AED6F1', nombre: 'Azul Pastel' },
  { valor: '#A9DFBF', nombre: 'Verde Claro' },
  { valor: '#F8C471', nombre: 'Naranja Suave' },
  { valor: '#D7BDE2', nombre: 'Lila' },
];

// Íconos por defecto para categorías
export const ICONOS_CATEGORIA = [
  { url: '🌟', nombre: 'Estrella' },
  { url: '🏆', nombre: 'Trofeo' },
  { url: '🎯', nombre: 'Diana' },
  { url: '🚀', nombre: 'Cohete' },
  { url: '🎨', nombre: 'Arte' },
  { url: '📚', nombre: 'Libro' },
  { url: '⚽', nombre: 'Deporte' },
  { url: '🎵', nombre: 'Música' },
  { url: '🧠', nombre: 'Inteligencia' },
  { url: '❤️', nombre: 'Corazón' },
];

// Mensajes motivacionales para niños
export const MENSAJES_MOTIVACIONALES = [
  '¡Eres increíble! 🌟',
  '¡Sigue brillando! ✨',
  '¡Lo estás haciendo genial! 🎉',
  '¡Eres una estrella! ⭐',
  '¡Súper trabajo! 🦸‍♂️',
  '¡Eres extraordinario! 🌈',
  '¡Qué talentoso eres! 🎭',
  '¡Eres un campeón! 🏆',
  '¡Bravo por ti! 👏',
  '¡Eres fantástico! 🎪',
];

// Configuración de notificaciones
export const NOTIFICACIONES = {
  SUCCESS: {
    autoClose: 3000,
    withCloseButton: true,
    position: 'top-right',
  },
  ERROR: {
    autoClose: 5000,
    withCloseButton: true,
    position: 'top-right',
  },
  INFO: {
    autoClose: 4000,
    withCloseButton: true,
    position: 'top-right',
  },
};

// Configuración de grid responsivo
export const GRID_BREAKPOINTS = {
  xs: 1,  // Móvil muy pequeño
  sm: 2,  // Móvil
  md: 3,  // Tablet
  lg: 4,  // Escritorio
  xl: 5,  // Pantalla grande
};

// Validaciones del formulario
export const VALIDACIONES = {
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 50,
  DESCRIPCION_MIN_LENGTH: 5,
  DESCRIPCION_MAX_LENGTH: 500,
  URL_PATTERN: /^https?:\/\/.+/,
};

// Configuración por defecto para nuevas categorías
export const CATEGORIA_DEFAULT = {
  nombre: '',
  nombreMostrar: '',
  descripcion: '',
  urlIcono: '',
  color: '#4ECDC4',
  ordenClasificacion: 0,
  estaActivo: true,
};

// Textos de ayuda para el formulario
export const TEXTOS_AYUDA = {
  nombre: 'Nombre interno usado por el sistema (sin espacios, usar guiones bajos)',
  nombreMostrar: 'Nombre que verán los niños en la aplicación',
  descripcion: 'Una descripción motivadora que inspire a los niños',
  urlIcono: 'URL de una imagen que represente la categoría (opcional)',
  color: 'Color que identificará esta categoría en toda la aplicación',
  orden: 'Número que determina el orden de aparición (0 = primero)',
  activo: 'Si está desactivada, no aparecerá en la aplicación',
};

// Estados de carga
export const ESTADOS_CARGA = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Funciones utilitarias
export const obtenerMensajeAleatorio = () => {
  const indice = Math.floor(Math.random() * MENSAJES_MOTIVACIONALES.length);
  return MENSAJES_MOTIVACIONALES[indice];
};

export const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generarColorAleatorio = () => {
  const indice = Math.floor(Math.random() * COLORES_CATEGORIA.length);
  return COLORES_CATEGORIA[indice].valor;
};

export const validarURL = (url) => {
  if (!url) return true; // URL vacía es válida (opcional)
  return VALIDACIONES.URL_PATTERN.test(url);
};