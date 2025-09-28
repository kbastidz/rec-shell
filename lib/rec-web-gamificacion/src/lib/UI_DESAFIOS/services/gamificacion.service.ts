import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ActualizarProgresoRequest, Desafio, ParticipacionDesafio, UnirseDesafioRequest } from '../../types/model';

const API_URL = `/gamificacion/desafios`;

export class DesafioService extends InvokeApi {
  
  async crearDesafio(desafio: Partial<Desafio>): Promise<Desafio> {
    const response = await this.post<Desafio>(API_URL, desafio);
    return response;
  }

  async obtenerDesafiosActivos(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/activos`);
    return response;
  }

  async obtenerDesafiosDisponibles(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/disponibles`);
    return response;
  }

  async obtenerDesafiosDiarios(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/diarios`);
    return response;
  }

  async obtenerDesafiosSemanales(): Promise<Desafio[]> {
    const response = await this.get<Desafio[]>(`${API_URL}/semanales`);
    return response;
  }

  async unirseADesafio(desafioId: string, request: UnirseDesafioRequest): Promise<any> {
    const response = await this.post<any>(`${API_URL}/${desafioId}/unirse`, request);
    return response;
  }

  async actualizarProgresoDesafio(participacionId: string, request: ActualizarProgresoRequest): Promise<any> {
    const response = await this.put<any>(`${API_URL}/participaciones/${participacionId}/progreso`, request);
    return response;
  }

  async obtenerParticipacionesUsuario(usuarioId: string): Promise<ParticipacionDesafio[]> {
    const response = await this.get<ParticipacionDesafio[]>(`${API_URL}/usuarios/${usuarioId}/participaciones`);
    return response;
  }

  async obtenerDesafiosCompletadosUsuario(usuarioId: string): Promise<ParticipacionDesafio[]> {
    const response = await this.get<ParticipacionDesafio[]>(`${API_URL}/usuarios/${usuarioId}/completados`);
    return response;
  }

  async procesarDesafiosVencidos(): Promise<any> {
    const response = await this.post<any>(`${API_URL}/procesar-vencidos`, {});
    return response;
  }
}

export const service = new DesafioService();