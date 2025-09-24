import { Cultivo, CultivoFilters } from '../types/model';
import { EstadoCultivo } from '../enums/Enums';
import { InvokeApi } from '@rec-shell/rec-web-shared';

const API_URL = `/cultivos`;

export class ConexionService extends InvokeApi {

  // POST - Crear cultivo
  async crearCultivo(model: Cultivo): Promise<Cultivo> {
    const response = await this.post<Cultivo>(API_URL, model, {});
    return response;
  }

  // GET - Obtener cultivo por ID
  async obtenerCultivoPorId(id: string): Promise<Cultivo> {
    const response = await this.get<Cultivo>(`${API_URL}/${id}`);
    return response;
  }

  // GET - Obtener todos los cultivos
  async obtenerTodosLosCultivos(): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}`);
    return response;
  }

  // GET - Obtener cultivos por usuario
  async obtenerCultivosPorUsuario(usuarioId: string): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/usuario/${usuarioId}`);
    return response;
  }

  // GET - Obtener cultivos por estado
  async obtenerCultivosPorEstado(estadoCultivo: EstadoCultivo): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/estado/${estadoCultivo}`);
    return response;
  }

  // GET - Obtener cultivos por usuario y estado
  async obtenerCultivosPorUsuarioYEstado(
    usuarioId: string, 
    estadoCultivo: EstadoCultivo
  ): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/usuario/${usuarioId}/estado/${estadoCultivo}`);
    return response;
  }

  // GET - Obtener cultivos por variedad
  async obtenerCultivosPorVariedad(variedadCacao: string): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/variedad/${variedadCacao}`);
    return response;
  }

  // GET - Obtener área total activa por usuario
  async obtenerAreaTotalActivaPorUsuario(): Promise<number> {
    const response = await this.get<number>(`${API_URL}/usuario/${this.getUserId()}/area-total-activa`);
    return response;
  }

  // GET - Verificar existencia de cultivo
  async verificarExistenciaCultivo(id: string): Promise<boolean> {
    const response = await this.get<boolean>(`${API_URL}/${id}/exists`);
    return response;
  }

  // PUT - Actualizar cultivo
  async actualizarCultivo(id: string, cultivo: Cultivo): Promise<Cultivo> {
    const response = await this.put<Cultivo>(`${API_URL}/${id}`, cultivo);
    return response;
  }

  // DELETE - Eliminar cultivo
  async eliminarCultivo(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  // PATCH - Cambiar estado del cultivo
  async cambiarEstadoCultivo(id: string, nuevoEstado: EstadoCultivo): Promise<Cultivo> {
    const response = await this.put<Cultivo>(`${API_URL}/${id}/estado`, nuevoEstado, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  }

  // Método helper para filtros combinados
  async obtenerCultivosConFiltros(filtros: CultivoFilters): Promise<Cultivo[]> {
    if (filtros.usuarioId && filtros.estadoCultivo) {
      return this.obtenerCultivosPorUsuarioYEstado(filtros.usuarioId, filtros.estadoCultivo);
    }
    
    if (filtros.usuarioId) {
      return this.obtenerCultivosPorUsuario(filtros.usuarioId);
    }
    
    if (filtros.estadoCultivo) {
      return this.obtenerCultivosPorEstado(filtros.estadoCultivo);
    }
    
    if (filtros.variedadCacao) {
      return this.obtenerCultivosPorVariedad(filtros.variedadCacao);
    }
    
    return this.obtenerTodosLosCultivos();
  }
}

export const service = new ConexionService();