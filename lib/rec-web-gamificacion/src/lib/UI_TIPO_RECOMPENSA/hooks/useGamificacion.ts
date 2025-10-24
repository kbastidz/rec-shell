import { useState, useCallback } from 'react';
import { TipoRecompensa } from '../../types/model';
import { service } from '../services/gamificacion.service';
import { GET_ERROR } from '../../utils/utilidad';

export const useTipoRecompensa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoRecompensas, setTratamientos] = useState<TipoRecompensa[]>([]);

  const CREAR = useCallback(async (tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.POST(tipoRecompensa);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarRecompensasFisicas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.GET_FISICAS();
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas físicas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarRecompensasDigitales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.GET_DIGITALES();
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas digitales');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const LISTAR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET();
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const buscarPorNombre = useCallback(async (nombre: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.GET_BY_NAME(nombre);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const ACTUALIZAR = useCallback(async (id: string, tipoRecompensa: Omit<TipoRecompensa, 'id' | 'creadoEn' | 'recompensas'>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.PUT(id, tipoRecompensa);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tipo de recompensa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const ELIMINAR = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await service.DELETE(id);
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
    tipoRecompensas,
    CREAR,
    buscarRecompensasFisicas,
    buscarRecompensasDigitales,
    buscarPorNombre,
    LISTAR,
    ACTUALIZAR,
    ELIMINAR,
  };
};