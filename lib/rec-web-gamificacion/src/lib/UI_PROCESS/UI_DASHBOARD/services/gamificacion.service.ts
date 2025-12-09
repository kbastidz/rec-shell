import { InvokeApi } from '@rec-shell/rec-web-shared';
import { MetadatosRuleta, MetadatosTrivia, TransaccionPuntos } from '../dtos/dashboard';

const API_URL = `/gamificacion/dashboard-v1`;

export interface DashboardStatsDTO {
  totalPuntos: number;
  totalTransacciones: number;
  usuariosActivos: number;
  promedioPorTransaccion: number;
}

export interface FiltrosTransaccionesDTO {
  usuarioId?: number;
  tipoOrigen?: 'TRIVIA' | 'RULETA';
  fechaInicio?: string;
  fechaFin?: string;
}

// Interface que viene del backend
interface TransaccionPuntosBackendDTO {
  id?: number;
  cantidad: number;
  creadoEn: string;
  usuarioId: number;
  tipoOrigen: string;
  descripcion: string;
  metadatos: Record<string, any>;
}

export class ConexionService extends InvokeApi {

  /**
   * Convierte el DTO del backend al formato que espera el Hook
   */
  private convertirATransaccionPuntos(dto: TransaccionPuntosBackendDTO): TransaccionPuntos {
    return {
      id: dto.id,
      cantidad: dto.cantidad,
      creado_en: dto.creadoEn, // Convertir de camelCase a snake_case
      usuario_id: dto.usuarioId, // Convertir de camelCase a snake_case
      tipo_origen: dto.tipoOrigen as 'TRIVIA' | 'RULETA',
      descripcion: dto.descripcion,
      metadatos: dto.metadatos as MetadatosTrivia | MetadatosRuleta
    };
  }

  /**
   * Convierte array de DTOs del backend
   */
  private convertirArrayTransacciones(dtos: TransaccionPuntosBackendDTO[]): TransaccionPuntos[] {
    return dtos.map(dto => this.convertirATransaccionPuntos(dto));
  }

  /**
   * Obtener todas las transacciones para el dashboard
   * GET /api/transacciones-puntos
   */
  async getAllTransacciones(): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntosBackendDTO[]>(`${API_URL}`);
    return this.convertirArrayTransacciones(response);
  }

  /**
   * Obtener transacciones con filtros opcionales
   * GET /api/transacciones-puntos/filtrar
   */
  async getTransaccionesFiltradas(filtros: FiltrosTransaccionesDTO): Promise<TransaccionPuntos[]> {
    const params = new URLSearchParams();
    
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId.toString());
    if (filtros.tipoOrigen) params.append('tipoOrigen', filtros.tipoOrigen);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const queryString = params.toString();
    const url = queryString ? `${API_URL}/filtrar?${queryString}` : `${API_URL}/filtrar`;
    
    const response = await this.get<TransaccionPuntosBackendDTO[]>(url);
    return this.convertirArrayTransacciones(response);
  }

  /**
   * Obtener estadísticas generales del dashboard
   * GET /api/transacciones-puntos/estadisticas
   */
  async getEstadisticasGenerales(): Promise<DashboardStatsDTO> {
    const response = await this.get<DashboardStatsDTO>(`${API_URL}/estadisticas`);
    return response;
  }

  /**
   * Obtener transacciones de un usuario específico
   * GET /api/transacciones-puntos/usuario/{usuarioId}
   */
  async getTransaccionesPorUsuario(usuarioId: number): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntosBackendDTO[]>(`${API_URL}/usuario/${usuarioId}`);
    return this.convertirArrayTransacciones(response);
  }

  /**
   * Obtener transacciones por tipo de origen (TRIVIA, RULETA)
   * GET /api/transacciones-puntos/tipo/{tipoOrigen}
   */
  async getTransaccionesPorTipo(tipoOrigen: 'TRIVIA' | 'RULETA'): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntosBackendDTO[]>(`${API_URL}/tipo/${tipoOrigen}`);
    return this.convertirArrayTransacciones(response);
  }

  /**
   * Obtener transacciones en un rango de fechas
   * GET /api/transacciones-puntos/rango-fechas
   */
  async getTransaccionesPorRangoFechas(fechaInicio: string, fechaFin: string): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntosBackendDTO[]>(
      `${API_URL}/rango-fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
    return this.convertirArrayTransacciones(response);
  }
}

export const service = new ConexionService();
