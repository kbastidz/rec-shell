import { InvokeApi } from '@rec-shell/rec-web-shared';
import { DeficienciaNutriente } from '../../types/model';


export interface DeficienciaNutrienteInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  sintomasVisuales?: string;
  nutrienteDeficiente?: string;
  activo: boolean;
}

const API_URL = `/agricultura/deficiencias-nutrientes`;

export class ConexionService extends InvokeApi {
  async crearDeficienciaNutriente(deficiencia: DeficienciaNutrienteInput): Promise<DeficienciaNutriente> {
    const response = await this.post<DeficienciaNutriente>(API_URL, deficiencia);
    return response;
  }

  async obtenerDeficienciaPorId(id: string): Promise<DeficienciaNutriente> {
    const response = await this.getById<DeficienciaNutriente>(API_URL, id);
    return response;
  }

  async obtenerDeficienciaPorCodigo(codigo: string): Promise<DeficienciaNutriente> {
    const response = await this.get<DeficienciaNutriente>(`${API_URL}/codigo/${encodeURIComponent(codigo)}`);
    return response;
  }

  async obtenerTodasLasDeficiencias(): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(API_URL);
    return response;
  }

  async obtenerDeficienciasActivas(): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(`${API_URL}/activas`);
    return response;
  }

  async obtenerDeficienciasPorNutriente(nutrienteDeficiente: string): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(
      `${API_URL}/nutriente/${encodeURIComponent(nutrienteDeficiente)}`
    );
    return response;
  }

  async obtenerDeficienciasActivasOrdenadas(): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(`${API_URL}/activas-ordenadas`);
    return response;
  }

  async contarDeficienciasActivas(): Promise<number> {
    const response = await this.get<number>(`${API_URL}/count-activas`);
    return response;
  }

  async actualizarDeficiencia(id: string, deficiencia: DeficienciaNutrienteInput): Promise<DeficienciaNutriente> {
    const response = await this.put<DeficienciaNutriente>(`${API_URL}/${id}`, deficiencia);
    return response;
  }

  async eliminarDeficiencia(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async activarDeficiencia(id: string): Promise<DeficienciaNutriente> {
    const response = await this.patch<DeficienciaNutriente>(`${API_URL}/${id}/activar`);
    return response;
  }

  async desactivarDeficiencia(id: string): Promise<DeficienciaNutriente> {
    const response = await this.patch<DeficienciaNutriente>(`${API_URL}/${id}/desactivar`);
    return response;
  }
}

export const service = new ConexionService();