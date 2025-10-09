import { InvokeApi } from '@rec-shell/rec-web-shared';
import { PerfilUsuario } from '../../../types/model';

const API_URL = `/perfil-usuario`;

interface CrearPerfilDefectoRequest {
  usuarioId: number;
}

interface CambiarPrivacidadRequest {
  nivelPrivacidad: string;
}

interface ActualizarNotificacionesRequest {
  preferenciasNotificaciones: string;
}

export class PerfilUsuarioService extends InvokeApi {

  async crearPerfilPorDefecto(request: PerfilUsuario): Promise<PerfilUsuario> {
    const response = await this.post<PerfilUsuario>(`${API_URL}/crear-defecto`, request);
    return response;
  }

  async obtenerPerfilPorUsuario(usuarioId: number): Promise<PerfilUsuario> {
    const response = await this.get<PerfilUsuario>(`${API_URL}/usuario/${usuarioId}`);
    return response;
  }

  async actualizarPerfil(usuarioId: number, perfilActualizado: Partial<PerfilUsuario>): Promise<PerfilUsuario> {
    const response = await this.put<PerfilUsuario>(`${API_URL}/usuario/${usuarioId}`, perfilActualizado);
    return response;
  }

  async obtenerPerfilesPublicos(): Promise<PerfilUsuario[]> {
    const response = await this.get<PerfilUsuario[]>(`${API_URL}/publicos`);
    return response;
  }

  async buscarPorUbicacion(ubicacion: string): Promise<PerfilUsuario[]> {
    const response = await this.get<PerfilUsuario[]>(
      `${API_URL}/buscar/ubicacion?ubicacion=${encodeURIComponent(ubicacion)}`
    );
    return response;
  }

  async cambiarPrivacidad(usuarioId: number, request: CambiarPrivacidadRequest): Promise<PerfilUsuario> {
    const response = await this.put<PerfilUsuario>(
      `${API_URL}/usuario/${usuarioId}/privacidad`,
      request
    );
    return response;
  }

  async actualizarPreferenciasNotificaciones(
    usuarioId: number,
    request: ActualizarNotificacionesRequest
  ): Promise<PerfilUsuario> {
    const response = await this.put<PerfilUsuario>(
      `${API_URL}/usuario/${usuarioId}/notificaciones`,
      request
    );
    return response;
  }
}

export const service = new PerfilUsuarioService();