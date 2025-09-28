  import { InvokeApi } from '@rec-shell/rec-web-shared';
import { TipoRecompensa } from '../../types/model';

const API_URL = `/gamificacion/tipos-recompensa`;

export class ConexionService extends InvokeApi {
  async crearTipoRecompensa(tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>): Promise<TipoRecompensa> {
    const response = await this.post<TipoRecompensa>(API_URL, tipoRecompensa);
    return response;
  }

  async obtenerRecompensasFisicas(): Promise<TipoRecompensa[]> {
    const response = await this.get<TipoRecompensa[]>(`${API_URL}/fisicas`);
    return response;
  }

  async obtenerRecompensasDigitales(): Promise<TipoRecompensa[]> {
    const response = await this.get<TipoRecompensa[]>(`${API_URL}/digitales`);
    return response;
  }

  async buscarPorNombre(nombre: string): Promise<TipoRecompensa> {
    const response = await this.get<TipoRecompensa>(
      `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    return response;
  }

  async actualizarTipoRecompensa(
    id: string, 
    tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>
  ): Promise<TipoRecompensa> {
    const response = await this.put<TipoRecompensa>(`${API_URL}/${id}`, tipoRecompensa);
    return response;
  }

  async eliminarTipoRecompensa(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();