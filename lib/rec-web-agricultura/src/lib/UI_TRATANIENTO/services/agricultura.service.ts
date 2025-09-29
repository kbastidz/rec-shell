import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Tratamiento } from '../../types/model';

const API_URL = `/agricultura/tratamientos`;

export class ConexionService extends InvokeApi {
  async crearTratamiento(tratamiento: Omit<Tratamiento, 'id'>): Promise<Tratamiento> {
    const response = await this.post<Tratamiento>(API_URL, tratamiento);
    return response;
  }

  async obtenerTratamientoPorId(id: number): Promise<Tratamiento> {
    const response = await this.getById<Tratamiento>(API_URL, id.toString());
    return response;
  }

  async obtenerTodosLosTratamientos(): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(API_URL);
    return response;
  }

  async obtenerTratamientosPorDeficiencia(deficienciaId: number): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(`${API_URL}/deficiencia/${deficienciaId}`);
    return response;
  }

  async obtenerTratamientosActivos(): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(`${API_URL}/activos`);
    return response;
  }

  async obtenerTratamientosPorTipo(tipoTratamiento: string): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(
      `${API_URL}/tipo/${encodeURIComponent(tipoTratamiento)}`
    );
    return response;
  }

  async obtenerTratamientosActivosPorDeficiencia(deficienciaId: number): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(
      `${API_URL}/activos/deficiencia/${deficienciaId}`
    );
    return response;
  }

  async obtenerTratamientosRapidos(diasMaximos: number): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(
      `${API_URL}/rapidos?diasMaximos=${diasMaximos}`
    );
    return response;
  }

  async actualizarTratamiento(id: number, tratamiento: Omit<Tratamiento, 'id'>): Promise<Tratamiento> {
    const response = await this.put<Tratamiento>(`${API_URL}/${id}`, tratamiento);
    return response;
  }

  async eliminarTratamiento(id: number): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();