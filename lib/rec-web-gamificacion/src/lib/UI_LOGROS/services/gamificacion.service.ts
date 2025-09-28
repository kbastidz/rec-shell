import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Logro, LogroUsuario, EstadisticasLogrosDTO } from '../../types/model';
import { Rareza } from '../../enums/Enums';

const API_URL = `/gamificacion/logros`;

export class LogroService extends InvokeApi {
  
  async crearLogro(logro: Logro): Promise<Logro> {
    const response = await this.post<Logro>(API_URL, logro);
    return response;
  }

  async actualizarLogro(id: string, logro: Logro): Promise<Logro> {
    const response = await this.put<Logro>(`${API_URL}/${id}`, logro);
    return response;
  }

  async eliminarLogro(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async obtenerLogrosActivos(): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/activos`);
    return response;
  }

  async obtenerLogrosVisibles(): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/visibles`);
    return response;
  }

  async obtenerPorId(id: string): Promise<Logro> {
    const response = await this.getById<Logro>(API_URL, id);
    return response;
  }

  async buscarPorNombre(nombre: string): Promise<Logro> {
    const response = await this.get<Logro>(`${API_URL}/nombre/${encodeURIComponent(nombre)}`);
    return response;
  }

  async existePorNombre(nombre: string): Promise<boolean> {
    const response = await this.get<boolean>(`${API_URL}/exists/${encodeURIComponent(nombre)}`);
    return response;
  }

  async obtenerLogrosPorCategoria(categoriaId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/categoria/${categoriaId}`);
    return response;
  }

  async obtenerLogrosVisiblesPorCategoria(categoriaId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/categoria/${categoriaId}/visibles`);
    return response;
  }

  async obtenerLogrosPorCategoriaOrdenados(categoriaId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/categoria/${categoriaId}/ordenados`);
    return response;
  }

  async obtenerLogrosPorRareza(rareza: Rareza): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/rareza/${rareza}`);
    return response;
  }

  async obtenerLogrosPorRarezas(rarezas: Rareza[]): Promise<Logro[]> {
    const response = await this.post<Logro[]>(`${API_URL}/rareza/filtrar`, rarezas);
    return response;
  }

  async obtenerLogrosPorPuntosMayoresA(puntos: number): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/puntos/mayores/${puntos}`);
    return response;
  }

  async obtenerLogrosPorRangoPuntos(min: number, max: number): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/puntos/rango?min=${min}&max=${max}`);
    return response;
  }

  async buscarPorTexto(texto: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/buscar?texto=${encodeURIComponent(texto)}`);
    return response;
  }

  async obtenerLogrosOrdenadosPorRecompensa(): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/ordenados/recompensa`);
    return response;
  }

  async obtenerLogrosNoObtenidosPorUsuario(usuarioId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/usuario/${usuarioId}/no-obtenidos`);
    return response;
  }

  async obtenerLogrosVisiblesNoObtenidosPorUsuario(usuarioId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/usuario/${usuarioId}/no-obtenidos/visibles`);
    return response;
  }

  async obtenerLogrosObtenidosPorUsuario(usuarioId: string): Promise<LogroUsuario[]> {
    const response = await this.get<LogroUsuario[]>(`${API_URL}/usuario/${usuarioId}/obtenidos`);
    return response;
  }

  async obtenerLogrosEnProgresoPorUsuario(usuarioId: string): Promise<Logro[]> {
    const response = await this.get<Logro[]>(`${API_URL}/usuario/${usuarioId}/progreso`);
    return response;
  }

  async otorgarLogro(
    usuarioId: string, 
    logroId: string, 
    datosProgreso?: Record<string, any>
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

  async obtenerEstadisticasGenerales(): Promise<EstadisticasLogrosDTO> {
    const response = await this.get<EstadisticasLogrosDTO>(`${API_URL}/estadisticas`);
    return response;
  }

  async obtenerEstadisticasUsuario(usuarioId: string): Promise<EstadisticasLogrosDTO> {
    const response = await this.get<EstadisticasLogrosDTO>(`${API_URL}/usuario/${usuarioId}/estadisticas`);
    return response;
  }

  async contarLogrosPorCategoria(categoriaId: string): Promise<number> {
    const response = await this.get<number>(`${API_URL}/categoria/${categoriaId}/count`);
    return response;
  }

  async contarLogrosPorRareza(rareza: Rareza): Promise<number> {
    const response = await this.get<number>(`${API_URL}/rareza/${rareza}/count`);
    return response;
  }
}

export const service = new LogroService();