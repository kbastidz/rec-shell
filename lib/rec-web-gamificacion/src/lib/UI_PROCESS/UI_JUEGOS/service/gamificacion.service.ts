import { InvokeApi } from '@rec-shell/rec-web-shared';
import { TransaccionPuntos } from '../../../types/model';
import { CrearTransaccionDTO, ReglaPuntosDTO } from '../../../types/dto';

const API_URL = `/gamificacion/transacciones-puntos`;


export class ConexionService extends InvokeApi {

  async GET(): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntos[]>(API_URL);
    return response;
  }

  async GET_ID(id: string): Promise<TransaccionPuntos> {
    const response = await this.getById<TransaccionPuntos>(API_URL, id);
    return response;
  }

  async POST(transaccion: CrearTransaccionDTO): Promise<TransaccionPuntos> {
    const response = await this.post<TransaccionPuntos>(API_URL, transaccion);
    return response;
  }

  async GET_BY_USUARIO(usuarioId: string): Promise<TransaccionPuntos[]> {
    const response = await this.get<TransaccionPuntos[]>(`${API_URL}/usuario/${usuarioId}`);
    return response;
  }

  async GET_REGLA_BY_TIPO(tipo: string): Promise<ReglaPuntosDTO> {
    const response = await this.get<ReglaPuntosDTO>(`${API_URL}/regla/${tipo}`);
    return response;
  }
}

export const service = new ConexionService();