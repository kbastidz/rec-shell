export interface EstudianteMetricasDTO {
  id: number;
  nombreCompleto: string;
  apellidos: string;
  nombres: string;
  promedioGeneral: number;
  acompaniamientoIntegral: number;
  animacionLectura: number;
  totalEvaluacionesRealizadas: number;
  promedioEvaluaciones: number;
  estadoGeneral: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'NECESITA_APOYO';
}

export interface EstudianteDetalleDTO {
  id: number;
  nombreCompleto: string;
  calificaciones: CalificacionMateriaDTO[];
  evaluaciones: EvaluacionResumenDTO[];
  estadisticas: EstadisticasGeneralesDTO;
  evolucion: EvolucionDTO;
}

export interface CalificacionMateriaDTO {
  materiaId: number;
  codigoMateria: string;
  nombreMateria: string;
  trimestre1: number;
  trimestre2: number;
  trimestre3: number;
  promedioFinal: number;
  tendencia: 'MEJORANDO' | 'ESTABLE' | 'DECLINANDO';
}

export interface EvaluacionResumenDTO {
  evaluacionId: number;
  resultadoId: number;
  fechaRealizacion: string; // ISO 8601 format
  puntuacionObtenida: number;
  puntuacionMaxima: number;
  porcentajeAciertos: number;
  tiempoTotalSegundos: number;
  estado: string;
  totalPreguntas: number;
  respuestasCorrectas: number;
}

export interface EstadisticasGeneralesDTO {
  promedioCalificaciones: number;
  promedioEvaluaciones: number;
  totalEvaluacionesCompletadas: number;
  totalMaterias: number;
  mejorCalificacion: number;
  peorCalificacion: number;
  materiaFuerte: string;
  materiaDebil: string;
}

export interface EvolucionDTO {
  evolucionTrimestral: PuntoEvolucionDTO[];
  evolucionEvaluaciones: PuntoEvolucionDTO[];
  tendenciaGeneral: number; 
}

export interface PuntoEvolucionDTO {
  periodo: string; 
  fecha: string; // ISO 8601 format
  valor: number;
}

export interface DashboardGeneralDTO {
  totalEstudiantes: number;
  promedioGeneral: number;
  estudiantesExcelentes: number; // >= 9.0
  estudiantesBuenos: number; // >= 7.0 && < 9.0
  estudiantesRegulares: number; // >= 5.0 && < 7.0
  estudiantesNecesitanApoyo: number; // < 5.0
  topEstudiantes: EstudianteMetricasDTO[];
  estudiantesRiesgo: EstudianteMetricasDTO[];
  estadisticasPorMateria: MateriaEstadisticasDTO[];
}

export interface MateriaEstadisticasDTO {
  materiaId: number;
  codigoMateria: string;
  nombreMateria: string;
  promedioGeneral: number;
  totalEstudiantes: number;
  mejorNota: number;
  peorNota: number;
  aprobados: number;
  reprobados: number;
}

export interface ComparativaEstudiantesDTO {
  estudiantes: EstudianteComparacionDTO[];
  criterio: 'PROMEDIO_GENERAL' | 'EVALUACIONES' | 'MATERIA_ESPECIFICA';
}

export interface EstudianteComparacionDTO {
  id: number;
  nombreCompleto: string;
  valor: number;
  posicion: number;
}

export interface AnalisisRespuestasDTO {
  evaluacionId: number;
  estudianteId: number;
  nombreEstudiante: string;
  respuestas: RespuestaDetalleDTO[];
  estadisticas: EstadisticasRespuestasDTO;
}

export interface RespuestaDetalleDTO {
  numeroPregunta: number;
  preguntaTexto: string;
  respuestaCorrecta: number;
  respuestaSeleccionada: number;
  esCorrecta: boolean;
  tiempoRespuestaSegundos: number;
  fechaRespuesta: string; // ISO 8601 format
}

export interface EstadisticasRespuestasDTO {
  totalPreguntas: number;
  respuestasCorrectas: number;
  respuestasIncorrectas: number;
  porcentajeAciertos: number;
  tiempoPromedioRespuesta: number;
  tiempoTotal: number;
}

export interface FiltroEstudiantesRequest {
  promedioMinimo?: number;
  promedioMaximo?: number;
  estadoGeneral?: string;
  materiaId?: number;
  trimestre?: number;
}

export interface RangoFechasRequest {
  fechaInicio: string; // ISO 8601 format
  fechaFin: string; // ISO 8601 format
}



export interface PageResponseDTO<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}