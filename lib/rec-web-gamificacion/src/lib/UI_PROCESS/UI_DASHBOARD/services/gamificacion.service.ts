import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ActividadUsuarioDTO, DesafiosActivosDTO, DistribucionPuntosDTO, EstadisticasGeneralesDTO, EstadisticasLogrosDTO, ResumenUsuarioDTO, TransaccionesRecientesDTO } from '../dtos/dtos';

const API_URL = `/gamificacion/dashboard`;

export class ConexionService extends InvokeApi {

  async getEstadisticasGenerales(): Promise<EstadisticasGeneralesDTO> {
    const response = await this.get<EstadisticasGeneralesDTO>(`${API_URL}/estadisticas-generales`);
    return response;
  }

  async getResumenUsuario(usuarioId: number): Promise<ResumenUsuarioDTO> {
    const response = await this.get<ResumenUsuarioDTO>(`${API_URL}/usuario/${usuarioId}/resumen`);
    return response;
  }

  async getDistribucionPuntos(): Promise<DistribucionPuntosDTO> {
    const response = await this.get<DistribucionPuntosDTO>(`${API_URL}/puntos/distribucion`);
    return response;
  }

  async getEstadisticasLogros(): Promise<EstadisticasLogrosDTO> {
    const response = await this.get<EstadisticasLogrosDTO>(`${API_URL}/logros/estadisticas`);
    return response;
  }

  async getDesafiosActivos(): Promise<DesafiosActivosDTO> {
    const response = await this.get<DesafiosActivosDTO>(`${API_URL}/desafios/activos`);
    return response;
  }

  async getTransaccionesRecientes(): Promise<TransaccionesRecientesDTO> {
    const response = await this.get<TransaccionesRecientesDTO>(`${API_URL}/transacciones/recientes`);
    return response;
  }

  async getActividadUsuario(usuarioId: number): Promise<ActividadUsuarioDTO> {
    const response = await this.get<ActividadUsuarioDTO>(`${API_URL}/usuario/${usuarioId}/actividad`);
    return response;
  }

}

export const service = new ConexionService();