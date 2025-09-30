import { InvokeApi } from '@rec-shell/rec-web-shared';
import { CategoriaLogro } from '../../types/model';

const API_URL = `/gamificacion/categorias-logro`;


export interface CategoriaInput {
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  urlIcono?: string;
  color?: string;
  ordenClasificacion: number;
  estaActivo: boolean;
}

export class ConexionService extends InvokeApi {
  async crearCategoria(categoria: CategoriaInput): Promise<CategoriaLogro> {
    const response = await this.post<CategoriaLogro>(API_URL, categoria);
    return response;
  }

  async obtenerCategoriaPorId(id: string): Promise<CategoriaLogro> {
    const response = await this.getById<CategoriaLogro>(API_URL, id);
    return response;
  }

  async obtenerTodasLasCategorias(): Promise<CategoriaLogro[]> {
    const response = await this.get<CategoriaLogro[]>(API_URL);
    return response;
  }

  async obtenerCategoriasActivas(): Promise<CategoriaLogro[]> {
    const response = await this.get<CategoriaLogro[]>(`${API_URL}/activas`);
    return response;
  }

  async buscarCategoriasPorNombre(nombre: string): Promise<CategoriaLogro[]> {
    const response = await this.get<CategoriaLogro[]>(
        `${API_URL}/buscar?nombre=${encodeURIComponent(nombre)}`
    );
    return response;
  }

  async actualizarCategoria(id: string, categoria: CategoriaInput): Promise<CategoriaLogro> {
    const response = await this.put<CategoriaLogro>(`${API_URL}/${id}`, categoria);
    return response;
  }

   async eliminarCategoria(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

}

export const service = new ConexionService();
