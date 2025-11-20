

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