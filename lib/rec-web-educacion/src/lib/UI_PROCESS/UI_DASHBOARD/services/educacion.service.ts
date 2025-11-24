import { InvokeApi } from '@rec-shell/rec-web-shared';
import { DashboardGeneralDTO, EstudianteMetricasDTO, EstudianteDetalleDTO, RangoFechasRequest, EvolucionDTO, AnalisisRespuestasDTO, ComparativaEstudiantesDTO, FiltroEstudiantesRequest, MateriaEstadisticasDTO } from '../dto/dto';

const API_URL = `/educacion/dashboard`;

export class ConexionService extends InvokeApi {

  async GET_DASHBOARD_GENERAL(): Promise<DashboardGeneralDTO> {
    const response = await this.get<DashboardGeneralDTO>(`${API_URL}/general`);
    return response;
  }

  async GET_METRICAS_ESTUDIANTE(id: number): Promise<EstudianteMetricasDTO> {
    const response = await this.get<EstudianteMetricasDTO>(`${API_URL}/estudiantes/${id}/metricas`);
    return response;
  }

  async GET_DETALLE_ESTUDIANTE(id: number): Promise<EstudianteDetalleDTO> {
    const response = await this.get<EstudianteDetalleDTO>(`${API_URL}/estudiantes/${id}/detalle`);
    return response;
  }

  async POST_EVOLUCION_ESTUDIANTE(id: number, rango: RangoFechasRequest): Promise<EvolucionDTO> {
    const response = await this.post<EvolucionDTO>(`${API_URL}/estudiantes/${id}/evolucion`, rango);
    return response;
  }

  async GET_ANALISIS_RESPUESTAS(resultadoId: number): Promise<AnalisisRespuestasDTO> {
    const response = await this.get<AnalisisRespuestasDTO>(`${API_URL}/evaluaciones/${resultadoId}/analisis`);
    return response;
  }

  async GET_COMPARATIVA(criterio = 'PROMEDIO_GENERAL'): Promise<ComparativaEstudiantesDTO> {
    const response = await this.get<ComparativaEstudiantesDTO>(`${API_URL}/comparativa?criterio=${criterio}`);
    return response;
  }

  async POST_ESTUDIANTES_FILTRADOS(filtro: FiltroEstudiantesRequest): Promise<EstudianteMetricasDTO[]> {
    const response = await this.post<EstudianteMetricasDTO[]>(`${API_URL}/estudiantes/filtrar`, filtro);
    return response;
  }

  async GET_ESTADISTICAS_MATERIAS(): Promise<MateriaEstadisticasDTO[]> {
    const response = await this.get<MateriaEstadisticasDTO[]>(`${API_URL}/materias/estadisticas`);
    return response;
  }

  async GET_TOP_ESTUDIANTES(limite = 10): Promise<EstudianteMetricasDTO[]> {
    const response = await this.get<EstudianteMetricasDTO[]>(`${API_URL}/estudiantes/top?limite=${limite}`);
    return response;
  }

  async GET_ESTUDIANTES_RIESGO(): Promise<EstudianteMetricasDTO[]> {
    const response = await this.get<EstudianteMetricasDTO[]>(`${API_URL}/estudiantes/riesgo`);
    return response;
  }

 
  async GET_DISTRIBUCION_NIVELES(): Promise<Record<string, number>> {
    const response = await this.get<Record<string, number>>(`${API_URL}/estadisticas/distribucion`);
    return response;
  }
}

export const service = new ConexionService();