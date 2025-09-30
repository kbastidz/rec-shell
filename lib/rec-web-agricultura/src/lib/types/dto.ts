import { Cultivo } from "./model";

export interface UseCultivosState {
  cultivos: Cultivo[];
  cultivo: Cultivo | null;
  loading: boolean;
  error: string | null;
  areaTotalActiva: number | null;
}

export interface CultivoFormData {
  nombreCultivo: string;
  variedadCacao?: string;
  fechaSiembra: string;
  areaHectareas?: number;
  ubicacionNombre?: string;
  latitud: number;
  longitud: number;
  altitud?: number;
  tipoSuelo?: string;
  sistemaRiego?: string;
  estadoCultivo: string;
  notas?: string;
}