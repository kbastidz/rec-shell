import { InvokeApi } from "@rec-shell/rec-web-shared";
import { ConsultResultadoEvaluacionResponse, EstadisticasEvaluacion, HistorialEstudiante, RespuestaEstudiante, ResultadoEvaluacionData, ResultadoEvaluacionResponse } from "../interfaces/interface";

const API_URL = `/educacion/resultados-evaluaciones`;

export class ConexionService extends InvokeApi {
  
  async guardarResultado(data: ResultadoEvaluacionData): Promise<ResultadoEvaluacionResponse> {
    const response = await this.post<ResultadoEvaluacionResponse>(API_URL, {
      evaluacion_id: data.evaluacionId,
      estudiante_id: data.estudianteId,
      tiempo_total_segundos: data.tiempoTotalSegundos,
      puntuacion_obtenida: data.puntuacionObtenida,
      puntuacion_maxima: data.puntuacionMaxima,
      porcentaje_aciertos: data.porcentajeAciertos,
      estado: data.estado || 'completado',
      respuestas: data.respuestas.map(r => ({
        numero_pregunta: r.numeroPregunta,
        pregunta_texto: r.preguntaTexto,
        opciones: r.opciones,
        respuesta_correcta: r.respuestaCorrecta,
        respuesta_seleccionada: r.respuestaSeleccionada,
        es_correcta: r.esCorrecta,
        tiempo_respuesta_segundos: r.tiempoRespuestaSegundos
      }))
    });
    return response;
  }

  async GET(): Promise<ConsultResultadoEvaluacionResponse[]> {
    const response = await this.get<ConsultResultadoEvaluacionResponse[]>(`${API_URL}`);
    return response;
  }

  async obtenerResultado(resultadoId: number): Promise<ResultadoEvaluacionResponse> {
    const response = await this.get<ResultadoEvaluacionResponse>(`${API_URL}/${resultadoId}`);
    return response;
  }

  async obtenerEstadisticas(evaluacionId: number): Promise<EstadisticasEvaluacion> {
    const response = await this.get<EstadisticasEvaluacion>(`${API_URL}/estadisticas/${evaluacionId}`);
    return response;
  }

  async obtenerHistorialEstudiante(estudianteId: number): Promise<HistorialEstudiante> {
    const response = await this.get<HistorialEstudiante>(`${API_URL}/historial/estudiante/${estudianteId}`);
    return response;
  }

  async obtenerResultadosPorEvaluacion(evaluacionId: number): Promise<ResultadoEvaluacionResponse[]> {
    const response = await this.get<ResultadoEvaluacionResponse[]>(`${API_URL}/evaluacion/${evaluacionId}`);
    return response;
  }

  async obtenerRespuestasDetalladas(resultadoId: number): Promise<RespuestaEstudiante[]> {
    const response = await this.get<RespuestaEstudiante[]>(`${API_URL}/${resultadoId}/respuestas`);
    return response;
  }
}

export const service = new ConexionService();