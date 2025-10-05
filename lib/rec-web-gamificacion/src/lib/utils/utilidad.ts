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