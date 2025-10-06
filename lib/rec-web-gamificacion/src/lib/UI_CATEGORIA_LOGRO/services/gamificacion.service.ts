import { InvokeApi } from '@rec-shell/rec-web-shared';
import { CategoriaLogro } from '../../types/model';
import { CategoriaInput } from '../../types/dto';

const API_URL = `/gamificacion/categorias-logro`;

export class ConexionService extends InvokeApi {

  async POST(categoria: CategoriaInput): Promise<CategoriaLogro> {
    const response = await this.post<CategoriaLogro>(API_URL, categoria);
    return response;
  }

  async GET_BY_ID(id: string): Promise<CategoriaLogro> {
    const response = await this.getById<CategoriaLogro>(API_URL, id);
    return response;
  }

  async GET(): Promise<CategoriaLogro[]> {
    const response = await this.get<CategoriaLogro[]>(API_URL);
    return response;
  }

  async GET_ACTIVE(): Promise<CategoriaLogro[]> {
    const response = await this.get<CategoriaLogro[]>(`${API_URL}/activas`);
    return response;
  }

  async GET_BY_NAME(nombre: string): Promise<CategoriaLogro[]> {
    const response = await this.get<CategoriaLogro[]>(
        `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    return response;
  }

  async PUT(id: string, categoria: CategoriaInput): Promise<CategoriaLogro> {
    const response = await this.put<CategoriaLogro>(`${API_URL}/${id}`, categoria);
    return response;
  }

   async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();
