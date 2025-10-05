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