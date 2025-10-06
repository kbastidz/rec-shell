import { Dificultad, PeriodoTiempo } from "../enums/Enums";

export interface TipoRecompensaForm {
  nombre: string;
  nombreMostrar: string;
  descripcion: string;
  esFisico: boolean;
  esDigital: boolean;
}

export interface TipoDesafioInput {
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  esIndividual: boolean;
  esGrupal: boolean;
}

export interface DesafioFormData {
  titulo: string;
  descripcion: string;
  dificultad: Dificultad;
  categoria: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  maxParticipantes: number;
  esDiario: boolean;
  esSemanal: boolean;
  esEspecial: boolean;
  estaActivo: boolean;
  criterioCompletado: string;
  recompensas: string;
}

export interface CategoriaInput {
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  urlIcono?: string;
  color?: string;
  ordenClasificacion: number;
  estaActivo: boolean;
}

export interface TablaFormData {
  nombre: string;
  descripcion: string;
  tipoTablaLideres: string;
  criterio: string;
  maxEntradas: number;
  estaActivo: boolean;
  periodoTiempo?: PeriodoTiempo;
}