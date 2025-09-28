import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ActividadSeguimiento } from '../../types/model';
import { EstadoActividad } from '../../enums/Enums';

const API_URL = `/agricultura/actividades-seguimiento`;

export class Service extends InvokeApi {
  async crearActividad(actividadSeguimiento: ActividadSeguimiento): Promise<ActividadSeguimiento> {
    const response = await this.post<ActividadSeguimiento>(API_URL, actividadSeguimiento);
    return response;
  }

  async obtenerActividadPorId(id: string): Promise<ActividadSeguimiento> {
    const response = await this.getById<ActividadSeguimiento>(API_URL, id);
    return response;
  }

  async obtenerTodasLasActividades(): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(API_URL);
    return response;
  }

  async obtenerActividadesPorPlan(planId: string): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/plan/${planId}`);
    return response;
  }

  async obtenerActividadesPorEstado(estado: EstadoActividad): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/estado/${estado}`);
    return response;
  }

  async obtenerActividadesPorFecha(fecha: string): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/fecha/${fecha}`);
    return response;
  }

  async obtenerActividadesPorUsuario(usuarioId: string): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/usuario/${usuarioId}`);
    return response;
  }

  async obtenerActividadesVencidas(fecha?: string): Promise<ActividadSeguimiento[]> {
    const url = fecha ? `${API_URL}/vencidas?fecha=${fecha}` : `${API_URL}/vencidas`;
    const response = await this.get<ActividadSeguimiento[]>(url);
    return response;
  }

  async obtenerActividadesParaRecordatorio(fecha?: string): Promise<ActividadSeguimiento[]> {
    const url = fecha ? `${API_URL}/recordatorios?fecha=${fecha}` : `${API_URL}/recordatorios`;
    const response = await this.get<ActividadSeguimiento[]>(url);
    return response;
  }

  async contarActividadesEjecutadas(planId: string): Promise<number> {
    const response = await this.get<number>(`${API_URL}/plan/${planId}/count-ejecutadas`);
    return response;
  }

  async actualizarActividad(id: string, actividadSeguimiento: ActividadSeguimiento): Promise<ActividadSeguimiento> {
    const response = await this.put<ActividadSeguimiento>(`${API_URL}/${id}`, actividadSeguimiento);
    return response;
  }

  async eliminarActividad(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new Service();