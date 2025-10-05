import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Logro, LogroUsuario, EstadisticasLogrosDTO } from '../../types/model';
import { Rareza } from '../../enums/Enums';

const API_URL = `/gamificacion/logros`;

export class ConexionService extends InvokeApi {
  
  async POST(logro: Logro): Promise<Logro> {
    const response = await this.post<Logro>(API_URL, logro);
    return response;
  }

  async UPDATE(id: string, logro: Logro): Promise<Logro> {
    const response = await this.put<Logro>(`${API_URL}/${id}`, logro);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async GET_ACTIVE(): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/activos`);
    return response;
  }

  async GET_VISIBLE(): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/visibles`);
    return response;
  }

  async GET_BY_ID(id: string): Promise<Logro> {
    const response = await this.getById<Logro>(API_URL, id);
    return response;
  }

  async BET_BY_NAME(nombre: string): Promise<Logro> {
    const response = await this.get<Logro>(`${API_URL}/nombre/${encodeURIComponent(nombre)}`);
    return response;
  }

  async isEXISTS_BY_NAME(nombre: string): Promise<boolean> {
    const response = await this.get<boolean>(`${API_URL}/exists/${encodeURIComponent(nombre)}`);
    return response;
  }

  async GET_BY_CATEGORY(categoriaId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/categoria/${categoriaId}`);
    return response;
  }

  async GET_VISIBLE_BY_CATEGORY(categoriaId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/categoria/${categoriaId}/visibles`);
    return response;
  }

  async GET_ORDERED_BY_CATEGORY(categoriaId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/categoria/${categoriaId}/ordenados`);
    return response;
  }

  async GET_BY_RAREZA(rareza: Rareza): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/rareza/${rareza}`);
    return response;
  }

  async GET_BY_RAREZAS(rarezas: Rareza[]): Promise<Logro[]> {
    const response = await this.post<Logro[]>(`${API_URL}/rareza/filtrar`, rarezas);
    return response;
  }

  async GET_BY_POINTS(puntos: number): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/puntos/mayores/${puntos}`);
    return response;
  }

  async GET_BY_RANGE(min: number, max: number): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/puntos/rango?min=${min}&max=${max}`);
    return response;
  }

  async GET_BY_TEXT(texto: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/buscar?texto=${encodeURIComponent(texto)}`);
    return response;
  }

  async GET_ORDERED_BY_RECOMPENSA(): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/ordenados/recompensa`);
    return response;
  }

  async GET_NOT_OBTENDED_BY_USER(usuarioId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/usuario/${usuarioId}/no-obtenidos`);
    return response;
  }

  async GET_VISIBLE_NOT_OBTENDED_BY_USER(usuarioId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/usuario/${usuarioId}/no-obtenidos/visibles`);
    return response;
  }

  async GET_OBTENDED_BY_USER(usuarioId: string): Promise<LogroUsuario[]> {
    const response = await this.get<LogroUsuario[]>(`${API_URL}/usuario/${usuarioId}/obtenidos`);
    return response;
  }

  async GET_PROGRESS_BY_USER(usuarioId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/usuario/${usuarioId}/progreso`);
    return response;
  }

  async POST_OTORGAR_LOGRO(usuarioId: string, logroId: string, datosProgreso?: Record<string, any>
  ): Promise<LogroUsuario> {
    const response = await this.post<LogroUsuario>(
      `${API_URL}/usuario/${usuarioId}/otorgar/${logroId}`,
      datosProgreso
    );
    return response;
  }

  async toggleExhibirLogro(usuarioId: string, logroId: string): Promise<void> {
    await this.patch(`${API_URL}/usuario/${usuarioId}/exhibir/${logroId}`);
  }

  async GET_ESTATISTICAS(): Promise<EstadisticasLogrosDTO> {
    const response = await this.get<EstadisticasLogrosDTO>(`${API_URL}/estadisticas`);
    return response;
  }

  async GET_ESTATISTICAS_BY_USER(usuarioId: string): Promise<EstadisticasLogrosDTO> {
    const response = await this.get<EstadisticasLogrosDTO>(`${API_URL}/usuario/${usuarioId}/estadisticas`);
    return response;
  }

  async COUNT_BY_CATEGORY(categoriaId: string): Promise<number> {
    const response = await this.get<number>(`${API_URL}/categoria/${categoriaId}/count`);
    return response;
  }

  async COUNT_BY_RAREZA(rareza: Rareza): Promise<number> {  
    const response = await this.get<number>(`${API_URL}/rareza/${rareza}/count`);
    return response;
  }
}

export const service = new ConexionService();