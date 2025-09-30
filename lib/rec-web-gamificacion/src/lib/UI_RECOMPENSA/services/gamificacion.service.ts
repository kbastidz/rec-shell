import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Recompensa } from '../../types/model';

const API_URL = `/gamificacion/recompensas`;

export class ConexionService extends InvokeApi {
  // GET /api/recompensas - Obtener todas activas
  async obtenerTodasActivas(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(API_URL);
    return response;
  }

  // GET /api/recompensas/{id} - Obtener por ID
  async obtenerPorId(id: string): Promise<Recompensa> {
    const response = await this.getById<Recompensa>(API_URL, id);
    return response;
  }

  // POST /api/recompensas - Crear recompensa
  async crear(recompensa: Recompensa): Promise<Recompensa> {
    const response = await this.post<Recompensa>(API_URL, recompensa);
    return response;
  }

  // PUT /api/recompensas/{id} - Actualizar recompensa
  async actualizar(id: string, recompensa: Recompensa): Promise<Recompensa> {
    const response = await this.put<Recompensa>(`${API_URL}/${id}`, recompensa);
    return response;
  }

  // DELETE /api/recompensas/{id} - Eliminar recompensa
  async eliminar(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  // GET /api/recompensas/disponibles - Obtener disponibles
  async obtenerDisponibles(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/disponibles`);
    return response;
  }

  // GET /api/recompensas/vigentes - Obtener vigentes
  async obtenerVigentes(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/vigentes`);
    return response;
  }

  // GET /api/recompensas/expiradas - Obtener expiradas
  async obtenerExpiradas(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/expiradas`);
    return response;
  }

  // GET /api/recompensas/tipo/{tipoId} - Obtener por tipo
  async obtenerPorTipo(tipoId: string): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/tipo/${tipoId}`);
    return response;
  }

  // GET /api/recompensas/rango-costo - Obtener por rango de costo
  async obtenerPorRangoCosto(minCosto: number, maxCosto: number): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(
      `${API_URL}/rango-costo?minCosto=${minCosto}&maxCosto=${maxCosto}`
    );
    return response;
  }

  // GET /api/recompensas/tipo/{tipoId}/count - Contar por tipo
  async contarPorTipo(tipoId: string): Promise<number> {
    const response = await this.get<number>(`${API_URL}/tipo/${tipoId}/count`);
    return response;
  }

  // GET /api/recompensas/{id}/disponible - Verificar disponibilidad
  async verificarDisponibilidad(id: string): Promise<boolean> {
    const response = await this.get<boolean>(`${API_URL}/${id}/disponible`);
    return response;
  }

  // PATCH /api/recompensas/{id}/activar - Activar recompensa
  async activar(id: string): Promise<void> {
    await this.patch(`${API_URL}/${id}/activar`);
  }

  // PATCH /api/recompensas/{id}/desactivar - Desactivar recompensa
  async desactivar(id: string): Promise<void> {
    await this.patch(`${API_URL}/${id}/desactivar`);
  }

  // PATCH /api/recompensas/{id}/reducir-stock - Reducir stock
  async reducirStock(id: string, cantidad: number): Promise<void> {
    await this.patch(`${API_URL}/${id}/reducir-stock?cantidad=${cantidad}`);
  }

  // GET /api/recompensas/admin/todas - Obtener todas (admin)
  async obtenerTodasAdmin(): Promise<Recompensa[]> {
    const response = await this.get<Recompensa[]>(`${API_URL}/admin/todas`);
    return response;
  }
}

export const service = new ConexionService();