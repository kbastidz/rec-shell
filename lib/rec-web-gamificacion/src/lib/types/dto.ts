import { Dificultad, PeriodoTiempo, TipoTransaccion } from "../enums/Enums";
import { TipoPunto } from "./model";

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

export interface CrearTransaccionDTO {
  usuarioId: string;
  tipoPunto: TipoPunto;
  tipoTransaccion: TipoTransaccion;//'GANAR' | 'GASTAR' | 'BONUS' | 'PENALIZACION' | 'TRANSFERIR';
  cantidad: number;
  descripcion?: string;
  tipoOrigen?: string;
  idOrigen?: string;
  metadatos?: Record<string, any>;
  expiraEn?: string; // ISO date string
}