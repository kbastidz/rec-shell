import { TipoRecompensa } from "../types/model";

export const getBadgeColor = (item: TipoRecompensa) => {
    if (item.esFisico && item.esDigital) return 'blue';
    if (item.esFisico) return 'green';
    if (item.esDigital) return 'orange';
    return 'gray';
  };

export const getBadgeText = (item: TipoRecompensa) => {
    if (item.esFisico && item.esDigital) return 'Física & Digital';
    if (item.esFisico) return 'Física';
    if (item.esDigital) return 'Digital';
    return 'Sin tipo';
};

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