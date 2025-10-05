import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ActualizarProgresoRequest, Desafio, ParticipacionDesafio, UnirseDesafioRequest } from '../../types/model';

const API_URL = `/gamificacion/desafios`;

export class DesafioService extends InvokeApi {
  
  async POST(desafio: Partial<Desafio>): Promise<Desafio> {
    const response = await this.post<Desafio>(API_URL, desafio);
    return response;
  }

  async PUT(id: string, desafio: Partial<Desafio>): Promise<Desafio> {
    const response = await this.put<Desafio>(`${API_URL}/${id}`, desafio);
    return response;
  }

  async GET(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}`);
    return response;
  }

  async GET_ACTIVE(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/activos`);
    return response;
  }

  async GET_VISIBLE(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/disponibles`);
    return response;
  }

  async GET_DIARIO(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/diarios`);
    return response;
  }

  async GET_SEMANAL(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/semanales`);
    return response;
  }

  async POST_UNIRSE_DESAFIO(desafioId: string, request: UnirseDesafioRequest): Promise<any> {
    const response = await this.post<any>(`${API_URL}/${desafioId}/unirse`, request);
    return response;
  }

  async PUT_PROGRESO(participacionId: string, request: ActualizarProgresoRequest): Promise<any> {
    const response = await this.put<any>(`${API_URL}/participaciones/${participacionId}/progreso`, request);
    return response;
  }

  async GET_PARTICIPACIONES_USERS(usuarioId: string): Promise<ParticipacionDesafio[]> {
    const response = await this.get<ParticipacionDesafio[]>(`${API_URL}/usuarios/${usuarioId}/participaciones`);
    return response;
  }

  async GET_COMPLECT_USERS(usuarioId: string): Promise<ParticipacionDesafio[]> {
    const response = await this.get<ParticipacionDesafio[]>(`${API_URL}/usuarios/${usuarioId}/completados`);
    return response;
  }

  async POST_PROCESSAR_VENCIDOS(): Promise<any> {
    const response = await this.post<any>(`${API_URL}/procesar-vencidos`, {});
    return response;
  }
}

export const service = new DesafioService();