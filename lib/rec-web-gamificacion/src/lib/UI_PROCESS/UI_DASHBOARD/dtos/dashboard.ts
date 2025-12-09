export interface MetadatosTrivia {
  precision: number;
  mejor_racha: number;
  fecha_completado?: string;
  preguntas_respondidas: number;
}

export interface MetadatosRuleta {
  emoji: string;
  materia: string;
  actividad?: string;
  fecha_giro?: string;
}

export type Metadatos = MetadatosTrivia | MetadatosRuleta;

export interface TransaccionPuntos {
  id?: number;
  cantidad: number;
  creado_en: string;
  usuario_id: number;
  tipo_origen: 'TRIVIA' | 'RULETA';
  descripcion: string;
  metadatos: Metadatos;
}

export interface DatosPorTipo {
  name: string;
  value: number;
  [key: string]: string | number; // Index signature para Recharts
}

export interface EvolucionTemporal {
  fecha: string;
  puntos: number;
  hora: string;
}

export interface PuntosPorPeriodo {
  periodo: string;
  puntos: number;
}

export interface RankingUsuario {
  usuario: string;
  puntos: number;
}

export interface TriviaPrecision {
  precision: number;
  puntos: number;
  racha: number;
}

export interface FrecuenciaTipo {
  tipo: string;
  cantidad: number;
}

export interface DistribucionPuntos {
  rango: string;
  frecuencia: number;
}

export interface EstadisticasResumen {
  totalPuntos: number;
  totalTransacciones: number;
  usuariosActivos: number;
  promedioPorTransaccion: number;
}

export interface DatosGraficos {
  datosPorTipo: DatosPorTipo[];
  evolucionTemporal: EvolucionTemporal[];
  puntosPorPeriodo: PuntosPorPeriodo[];
  rankingUsuarios: RankingUsuario[];
  triviaPrecision: TriviaPrecision[];
  frecuenciaTipo: FrecuenciaTipo[];
  distribucionPuntos: DistribucionPuntos[];
  estadisticasResumen: EstadisticasResumen;
}