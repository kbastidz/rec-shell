import { useState } from 'react';
import { PerfilUsuario } from '../../../types/model';
import { service } from '../service/gamificacion.service';


interface CrearPerfilDefectoRequest {
  usuarioId: number;
}

interface CambiarPrivacidadRequest {
  nivelPrivacidad: string;
}

interface ActualizarNotificacionesRequest {
  preferenciasNotificaciones: string;
}

export const usePerfilUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [perfiles, setPerfiles] = useState<PerfilUsuario[]>([]);

  const crearPerfilPorDefecto = async (request: PerfilUsuario) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.crearPerfilPorDefecto(request);
      setPerfil(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al crear perfil por defecto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerPerfilPorUsuario = async (usuarioId: number) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.obtenerPerfilPorUsuario(usuarioId);
      setPerfil(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al obtener perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async (usuarioId: number, perfilActualizado: Partial<PerfilUsuario>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.actualizarPerfil(usuarioId, perfilActualizado);
      setPerfil(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerPerfilesPublicos = async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.obtenerPerfilesPublicos();
      setPerfiles(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al obtener perfiles públicos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarPorUbicacion = async (ubicacion: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.buscarPorUbicacion(ubicacion);
      setPerfiles(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al buscar por ubicación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cambiarPrivacidad = async (usuarioId: number, request: CambiarPrivacidadRequest) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.cambiarPrivacidad(usuarioId, request);
      setPerfil(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al cambiar privacidad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarPreferenciasNotificaciones = async (
    usuarioId: number,
    request: ActualizarNotificacionesRequest
  ) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.actualizarPreferenciasNotificaciones(
        usuarioId,
        request
      );
      setPerfil(resultado);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar preferencias de notificaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => setError(null);
  const resetPerfil = () => setPerfil(null);
  const resetPerfiles = () => setPerfiles([]);

  return {
    loading,
    error,
    perfil,
    perfiles,
    crearPerfilPorDefecto,
    obtenerPerfilPorUsuario,
    actualizarPerfil,
    obtenerPerfilesPublicos,
    buscarPorUbicacion,
    cambiarPrivacidad,
    actualizarPreferenciasNotificaciones,
    resetError,
    resetPerfil,
    resetPerfiles,
  };
};