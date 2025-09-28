import { useState, useCallback } from 'react';
import { TipoRecompensa } from '../../types/model';
import { service } from '../services/gamificacion.service';

export const useTipoRecompensa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearTipoRecompensa = useCallback(async (tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.crearTipoRecompensa(tipoRecompensa);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerRecompensasFisicas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.obtenerRecompensasFisicas();
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas físicas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerRecompensasDigitales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.obtenerRecompensasDigitales();
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas digitales');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorNombre = useCallback(async (nombre: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.buscarPorNombre(nombre);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarTipoRecompensa = useCallback(async (id: string, tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.actualizarTipoRecompensa(id, tipoRecompensa);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarTipoRecompensa = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await service.eliminarTipoRecompensa(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    crearTipoRecompensa,
    obtenerRecompensasFisicas,
    obtenerRecompensasDigitales,
    buscarPorNombre,
    actualizarTipoRecompensa,
    eliminarTipoRecompensa,
  };
};