import { InvokeApi } from '@rec-shell/rec-web-shared';
import { TipoDesafio } from '../../types/model';

interface TipoDesafioInput {
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  esIndividual: boolean;
  esGrupal: boolean;
}

const API_URL = `/gamificacion/tipos-desafio`;

export class ConexionService extends InvokeApi {
  async crearTipoDesafio(tipoDesafio: TipoDesafioInput): Promise<TipoDesafio> {
    const response = await this.post<TipoDesafio>(API_URL, tipoDesafio);
    return response;
  }

  async obtenerTiposIndividuales(): Promise<TipoDesafio[]> {
    const response = await this.get<TipoDesafio[]>(`${API_URL}/individuales`);
    return response;
  }

  async obtenerTiposGrupales(): Promise<TipoDesafio[]> {
    const response = await this.get<TipoDesafio[]>(`${API_URL}/grupales`);
    return response;
  }

  async buscarPorNombre(nombre: string): Promise<TipoDesafio> {
    const response = await this.get<TipoDesafio>(
      `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    return response;
  }

  async actualizarTipoDesafio(id: string, tipoDesafio: TipoDesafioInput): Promise<TipoDesafio> {
    const response = await this.put<TipoDesafio>(`${API_URL}/${id}`, tipoDesafio);
    return response;
  }

  async eliminarTipoDesafio(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();