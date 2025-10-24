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
  async POST(tipoDesafio: TipoDesafioInput): Promise<TipoDesafio> {
    const response = await this.post<TipoDesafio>(API_URL, tipoDesafio);
    return response;
  }

  async GET_INDIVIDUALES(): Promise<TipoDesafio[]> {
    const response = await this.get<TipoDesafio[]>(`${API_URL}/individuales`);
    return response;
  }

  async GET_GRUPALES(): Promise<TipoDesafio[]> {
    const response = await this.get<TipoDesafio[]>(`${API_URL}/grupales`);
    return response;
  }

  async GET(): Promise<TipoDesafio[]> {
    const response = await this.get<TipoDesafio[]>(`${API_URL}/listar`);
    return response;
  }

  async GET_BY_NAME(nombre: string): Promise<TipoDesafio> {
    const response = await this.get<TipoDesafio>(
      `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    return response;
  }

  async PUT(id: string, tipoDesafio: TipoDesafioInput): Promise<TipoDesafio> {
    const response = await this.put<TipoDesafio>(`${API_URL}/${id}`, tipoDesafio);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();