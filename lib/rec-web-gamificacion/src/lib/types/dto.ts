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