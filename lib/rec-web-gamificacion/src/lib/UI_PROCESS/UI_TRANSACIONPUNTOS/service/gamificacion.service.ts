import { ApiResponse, InvokeApi } from '@rec-shell/rec-web-shared';
import { TransaccionPuntos } from '../../../types/model';
import { User } from '@rec-shell/rec-web-usuario';

const API_URL = `/gamificacion/transacciones-puntos`;
const API_URL_TP = `/gamificacion/tipos-punto`;

export class ConexionService extends InvokeApi {
  async GET_ID(id: string): Promise<TransaccionPuntos> {
    const response = await this.getById<TransaccionPuntos>(API_URL, id);
    return response;
  }

  async GET(): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntos[]>(`${API_URL}/activas`);
    return response;
  }

  async PUT(id: string,reglaPuntos: TransaccionPuntos): Promise<TransaccionPuntos> {
    const response = await this.put<TransaccionPuntos>(`${API_URL}/${id}`,reglaPuntos);
    return response;
  }

  async GET_USERS(): Promise<User[]> {
    const response = await this.get<ApiResponse<User[]>>('/admin/users');
    return response.data ?? [];
  }
}

export const service = new ConexionService();
