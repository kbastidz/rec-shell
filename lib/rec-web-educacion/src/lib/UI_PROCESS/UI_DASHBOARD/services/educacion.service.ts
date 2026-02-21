import { InvokeApi } from '@rec-shell/rec-web-shared';
import { DashboardGeneralDTO, EstudianteMetricasDTO, EstudianteDetalleDTO, RangoFechasRequest, EvolucionDTO, AnalisisRespuestasDTO, ComparativaEstudiantesDTO, FiltroEstudiantesRequest, MateriaEstadisticasDTO } from '../dto/dto';

const API_URL = `/educacion/dashboard`;

export class ConexionService extends InvokeApi {

  async GET_DASHBOARD_GENERAL(ciclo?: string): Promise<DashboardGeneralDTO> {
    const url = ciclo ? `${API_URL}/general?ciclo=${ciclo}` : `${API_URL}/general`;
    const response = await this.get<DashboardGeneralDTO>(url);
    return response;
  }

  async GET_METRICAS_ESTUDIANTE(id: number, ciclo?: string): Promise<EstudianteMetricasDTO> {
    const url = ciclo 
      ? `${API_URL}/estudiantes/${id}/metricas?ciclo=${ciclo}` 
      : `${API_URL}/estudiantes/${id}/metricas`;
    const response = await this.get<EstudianteMetricasDTO>(url);
    return response;
  }

  async GET_DETALLE_ESTUDIANTE(id: number, ciclo?: string): Promise<EstudianteDetalleDTO> {
    const url = ciclo 
      ? `${API_URL}/estudiantes/${id}/detalle?ciclo=${ciclo}` 
      : `${API_URL}/estudiantes/${id}/detalle`;
    const response = await this.get<EstudianteDetalleDTO>(url);
    return response;
  }

  async POST_EVOLUCION_ESTUDIANTE(id: number, rango: RangoFechasRequest, ciclo?: string): Promise<EvolucionDTO> {
    const url = ciclo 
      ? `${API_URL}/estudiantes/${id}/evolucion?ciclo=${ciclo}` 
      : `${API_URL}/estudiantes/${id}/evolucion`;
    const response = await this.post<EvolucionDTO>(url, rango);
    return response;
  }

  async GET_ANALISIS_RESPUESTAS(resultadoId: number): Promise<AnalisisRespuestasDTO> {
    const response = await this.get<AnalisisRespuestasDTO>(`${API_URL}/evaluaciones/${resultadoId}/analisis`);
    return response;
  }

  async GET_COMPARATIVA(criterio = 'PROMEDIO_GENERAL', ciclo?: string): Promise<ComparativaEstudiantesDTO> {
    const params = new URLSearchParams({ criterio });
    if (ciclo) {
      params.append('ciclo', ciclo);
    }
    const response = await this.get<ComparativaEstudiantesDTO>(`${API_URL}/comparativa?${params.toString()}`);
    return response;
  }

  async POST_ESTUDIANTES_FILTRADOS(filtro: FiltroEstudiantesRequest): Promise<EstudianteMetricasDTO[]> {
    const response = await this.post<EstudianteMetricasDTO[]>(`${API_URL}/estudiantes/filtrar`, filtro);
    return response;
  }

  async GET_ESTADISTICAS_MATERIAS(ciclo?: string): Promise<MateriaEstadisticasDTO[]> {
    const url = ciclo 
      ? `${API_URL}/materias/estadisticas?ciclo=${ciclo}` 
      : `${API_URL}/materias/estadisticas`;
    const response = await this.get<MateriaEstadisticasDTO[]>(url);
    return response;
  }

  async GET_TOP_ESTUDIANTES(limite = 10, ciclo?: string): Promise<EstudianteMetricasDTO[]> {
    const params = new URLSearchParams({ limite: limite.toString() });
    if (ciclo) {
      params.append('ciclo', ciclo);
    }
    const response = await this.get<EstudianteMetricasDTO[]>(`${API_URL}/estudiantes/top?${params.toString()}`);
    return response;
  }

  async GET_ESTUDIANTES_RIESGO(ciclo?: string): Promise<EstudianteMetricasDTO[]> {
    const url = ciclo 
      ? `${API_URL}/estudiantes/riesgo?ciclo=${ciclo}` 
      : `${API_URL}/estudiantes/riesgo`;
    const response = await this.get<EstudianteMetricasDTO[]>(url);
    return response;
  }

  async GET_DISTRIBUCION_NIVELES(ciclo?: string): Promise<Record<string, number>> {
    const url = ciclo 
      ? `${API_URL}/estadisticas/distribucion?ciclo=${ciclo}` 
      : `${API_URL}/estadisticas/distribucion`;
    const response = await this.get<Record<string, number>>(url);
    return response;
  }
}

export const service = new ConexionService();