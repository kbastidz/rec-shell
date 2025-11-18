import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ReglaPuntos } from '../../types/model';
import { ReglaPuntosInput, TipoPunto } from '../../types/dto';


const API_URL = `/gamificacion/reglas-puntos`;
const API_URL_TP = `/gamificacion/tipos-punto`;

export class ConexionService extends InvokeApi {

  async POST(reglaPuntos: ReglaPuntosInput): Promise<ReglaPuntos> {
    const response = await this.post<ReglaPuntos>(API_URL, reglaPuntos);
    return response;
  }

  async GET_ID(id: string): Promise<ReglaPuntos> {
    const response = await this.getById<ReglaPuntos>(API_URL, id);
    return response;
  }

  async GET(): Promise<ReglaPuntos[]> {
    const response = await this.get<ReglaPuntos[]>(`${API_URL}/activas`);
    return response;
  }

  async GET_TIPO_PUNTO(): Promise<TipoPunto[]> {
    const response = await this.get<TipoPunto[]>(`${API_URL_TP}/activos`);
    return response;
  }

  async PUT(id: string, reglaPuntos: ReglaPuntosInput): Promise<ReglaPuntos> {
    const response = await this.put<ReglaPuntos>(`${API_URL}/${id}`, reglaPuntos);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();