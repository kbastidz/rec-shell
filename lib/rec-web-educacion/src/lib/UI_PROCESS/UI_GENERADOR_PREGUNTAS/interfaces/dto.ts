export  interface Resultado {
  evaluacion_id: number;
  estudiante_id: number;
  puntuacion_obtenida: number;
  puntuacion_maxima: number;
  porcentaje_aciertos: number;
  tiempo_total_segundos: number;
  fecha_realizacion: string;
  estado: string;
  respuestas: Respuesta[];
}

export interface Respuesta {
  id: number;
  numero_pregunta: number;
  pregunta_texto: string;
  opciones: string[];
  respuesta_correcta: number;
  respuesta_seleccionada: number;
  es_correcta: boolean;
  tiempo_respuesta_segundos: number;
}