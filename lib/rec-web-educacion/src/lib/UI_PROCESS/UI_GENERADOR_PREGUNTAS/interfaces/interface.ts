
// ===== Interfaces =====
export interface Trimestre {
  t1: number;
  t2: number;
  t3: number;
}

export  interface Materia {
  nombre: string;
  trimestres: Trimestre;
  promedioFinal: number;
}

export interface Estudiante {
  id: string;
  no: number;
  apellidos: string;
  nombres: string;
  materias: {
    lenguaExtranjera: Materia;
    educacionFisica: Materia;
    educacionCulturalArtistica: Materia;
    estudiosSociales: Materia;
    cienciasNaturales: Materia;
    matematica: Materia;
    lenguaLiteratura: Materia;
  };
  acompanamientoIntegral: number;
  animacionLectura: number;
  identificador?: string;
}

export interface RespuestaEstudiante {
  numeroPregunta: number;
  preguntaTexto: string;
  opciones: string[];
  respuestaCorrecta: number;
  respuestaSeleccionada: number;
  esCorrecta: boolean;
  tiempoRespuestaSegundos?: number;
}

export interface ResultadoEvaluacionData {
  evaluacionId: number;
  estudianteId: string;
  tiempoTotalSegundos?: number;
  puntuacionObtenida: number;
  puntuacionMaxima: number;
  porcentajeAciertos: number;
  estado?: 'completado' | 'en_progreso' | 'abandonado';
  respuestas: RespuestaEstudiante[];
}

export interface ResultadoEvaluacionResponse {
  id: number;
  evaluacionId: number;
  estudianteId: number;
  fechaRealizacion: string;
  tiempoTotalSegundos: number | null;
  puntuacionObtenida: number;
  puntuacionMaxima: number;
  porcentajeAciertos: number;
  estado: string;
}

export interface EstadisticasEvaluacion {
  evaluacionId: number;
  totalEstudiantes: number;
  promedioAciertos: number;
  mejorPuntuacion: number;
  peorPuntuacion: number;
  tiempoPromedio: number;
}

export interface HistorialEstudiante {
  estudianteId: number;
  nombre: string;
  apellido: string;
  resultados: Array<{
    resultadoId: number;
    evaluacionId: number;
    fechaRealizacion: string;
    puntuacionObtenida: number;
    puntuacionMaxima: number;
    porcentajeAciertos: number;
    tiempoTotalSegundos: number;
    estado: string;
  }>;
}

export interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

export interface OpcionPregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

export interface DatosEvaluacion {
  resumen: string | null;
  nombreArchivo: string | null;
  preguntas: OpcionPregunta[];
}

export interface Evaluacion {
  id: number;
  fechaCreacion: string; 
  datosEvaluacion: string; 
}

export interface EvaluacionParsed extends Omit<Evaluacion, 'datosEvaluacion'> {
  datosEvaluacion: DatosEvaluacion; 
}

export interface YoutubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      medium: { url: string };
    };
  };
}

export interface Concept {
  name: string;
  description: string;
}


export interface DataType {
  mainTopic?: string;
  concepts: Concept[];
}

export interface ConsultResultadoEvaluacionResponse {
  id: number;
  estado: string;
  respuestas: RespuestaEvaluacion[];
  evaluacion_id: number;
  estudiante_id: number;
  fecha_realizacion: string;
  tiempo_total_segundos: number;
  puntuacion_obtenida: number;
  puntuacion_maxima: number;
  porcentaje_aciertos: number;
}

export interface RespuestaEvaluacion {
  id: number;
  opciones: string[];
  numero_pregunta: number;
  pregunta_texto: string;
  respuesta_correcta: number;
  respuesta_seleccionada: number;
  es_correcta: boolean;
  tiempo_respuesta_segundos: number;
  fecha_respuesta: string;
}
