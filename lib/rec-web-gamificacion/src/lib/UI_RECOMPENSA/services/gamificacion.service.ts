import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Recompensa } from '../../types/model';

const API_URL = `/gamificacion/recompensas`;

export class ConexionService extends InvokeApi {
  
  async GET(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(API_URL);
    return response;
  }

  async GET_ID(id: string): Promise<Recompensa> {
    const response = await this.getById<Recompensa>(API_URL, id);
    return response;
  }

  async POST(recompensa: Recompensa): Promise<Recompensa> {
    const response = await this.post<Recompensa>(API_URL, recompensa);
    return response;
  }

  async PUT(id: string, recompensa: Recompensa): Promise<Recompensa> {
    const response = await this.put<Recompensa>(`${API_URL}/${id}`, recompensa);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async GET_DISPONIBLES(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/disponibles`);
    return response;
  }

  async GET_VIGENTES(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/vigentes`);
    return response;
  }

  async GET_EXPIRADAS(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/expiradas`);
    return response;
  }

  async GET_BY_TYPE(tipoId: string): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/tipo/${tipoId}`);
    return response;
  }

  async GET_RANGE_COSTO(minCosto: number, maxCosto: number): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(
      `${API_URL}/rango-costo?minCosto=${minCosto}&maxCosto=${maxCosto}`
    );
    return response;
  }

  async GET_COUNT_TYPE(tipoId: string): Promise<number> {
    const response = await this.get<number>(`${API_URL}/tipo/${tipoId}/count`);
    return response;
  }

  async VERIFY_DISPONIBLE(id: string): Promise<boolean> {
    const response = await this.get<boolean>(`${API_URL}/${id}/disponible`);
    return response;
  }

  async GET_ACTIVE(id: string): Promise<void> {
    await this.patch(`${API_URL}/${id}/activar`);
  }

  async GET_INACTIVE(id: string): Promise<void> {
    await this.patch(`${API_URL}/${id}/desactivar`);
  }

  async GET_REDICIR_STOCK(id: string, cantidad: number): Promise<void> {
    await this.patch(`${API_URL}/${id}/reducir-stock?cantidad=${cantidad}`);
  }

  async GET_ADMIN(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/admin/todas`);
    console.log(response);
    return response;
  }
}

export const service = new ConexionService();