

export function GET_ERROR(error: unknown, defaultMessage = "Error al cargar los registros"): string {
  return error instanceof Error ? error.message : defaultMessage;
}

export function ST_GET_USER_ID(): string {
  const userStr = window.sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr).id : ''; 
}

export const rarezaOptions = [
  { value: 'COMUN', label: 'Común' },
  { value: 'POCO_COMUN', label: 'Poco Común' },
  { value: 'RARO', label: 'Raro' },
  { value: 'EPICO', label: 'Épico' },
  { value: 'LEGENDARIO', label: 'Legendario' }
];

export const rarezaColors: Record<string, string> = {
  COMUN: 'gray',
  POCO_COMUN: 'green',
  RARO: 'blue',
  EPICO: 'violet',
  LEGENDARIO: 'orange'
};

export const dificultadColors = {
  FACIL: 'green',
  MEDIO: 'yellow',
  DIFICIL: 'orange',
  EXTREMO: 'red',
  EXPERTO: 'blue'
};

export const tipoDesafioOptions = [
  { value: 'DIARIO', label: 'Diario' },
  { value: 'SEMANAL', label: 'Semanal' },
  { value: 'ESPECIAL', label: 'Especial' }
];

export const TIPOS_TABLA = [
  { value: 'PUNTUACION', label: 'Puntuación' },
  { value: 'TIEMPO', label: 'Tiempo' },
  { value: 'COMPLETADOS', label: 'Completados' },
  { value: 'RACHA', label: 'Racha' }
];

export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatearTiempo = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos}m ${segs}s`;
};

/*

const menuItems = [
  { 
    icon: '🧠', 
    label: 'Generador de Resúmenes y Preguntas IA', 
    value: 'generador',
    color: 'indigo',
    description: 'Analiza documentos PDF utilizando inteligencia artificial para generar automáticamente un resumen claro y conciso del contenido, junto con preguntas relevantes que facilitan la comprensión y evaluación del texto',
    component: GeneradorAdmin
  },
  { 
    icon: '📚', 
    label: 'Gestor de Notas Trimestrales', 
    value: 'historico',
    color: 'blue',
    description: 'Permite cargar, organizar y visualizar las calificaciones de los estudiantes por trimestre, facilitando la gestión histórica del rendimiento académico',
    component: HistoricoNotasAdmin
  },
  { 
    icon: '📊', 
    label: 'Panel de Análisis Académico', 
    value: 'dashboard',
    color: 'teal',
    description: 'Genera un dashboard interactivo que presenta métricas, gráficos y estadísticas detalladas sobre las notas de los estudiantes, brindando una visión global del desempeño académico',
    component: DashboardNotasAcademico
  },
  { 
    icon: '📝', 
    label: 'Módulo de Evaluaciones', 
    value: 'evaluacion',
    color: 'violet',
    description: 'Permite crear y realizar evaluaciones personalizadas, registrando respuestas y resultados para medir el aprendizaje de manera dinámica y eficiente',
    component: Evaluacion
  },
  { 
    icon: '🎥', 
    label: 'Generador IA de Recursos Educativos', 
    value: 'recomendaciones',
    color: 'pink',
    description: 'Utiliza inteligencia artificial para analizar textos y generar materiales de apoyo como videos recomendados y mapas conceptuales, potenciando el aprendizaje visual y contextual',
    component: RecomendacionesAdmin
  },
   { 
    icon: '📋', 
    label: 'Analisis de Evaluaciones', 
    value: 'resultados',
    color: 'yelow',
    description: 'Permite consultar y analizar de manera detallada los resultados de las evaluaciones.',
    component: ConsultarEvaluacionesAdmin
  },
  {
    icon: '📋',
    label: 'Dashboard',
    value: 'dashboard2',
    color: 'yelow',
    description: 'Permite consultar y analizar de manera detallada los resultados de las evaluaciones.',
    component: DashboardAdmin
  }
];*/
