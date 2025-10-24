  import { InvokeApi } from '@rec-shell/rec-web-shared';
import { TipoRecompensa } from '../../types/model';

const API_URL = `/gamificacion/tipos-recompensa`;

export class ConexionService extends InvokeApi {
  async POST(tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>): Promise<TipoRecompensa> {
    const response = await this.post<TipoRecompensa>(API_URL, tipoRecompensa);
    return response;
  }

  async GET_FISICAS(): Promise<TipoRecompensa[]> {
    const response = await this.get<TipoRecompensa[]>(`${API_URL}/fisicas`);
    return response;
  }

  async GET_DIGITALES(): Promise<TipoRecompensa[]> {
    const response = await this.get<TipoRecompensa[]>(`${API_URL}/digitales`);
    return response;
  }

  async GET_BY_NAME(nombre: string): Promise<TipoRecompensa> {
    const response = await this.get<TipoRecompensa>(`${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`);
    return response;
  }

  async GET(): Promise<TipoRecompensa[]> {
    const response = await this.get<TipoRecompensa[]>(`${API_URL}/listar`);
    return response;
  }

  async PUT(id: string, tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>): Promise<TipoRecompensa> {
    const response = await this.put<TipoRecompensa>(`${API_URL}/${id}`, tipoRecompensa);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();