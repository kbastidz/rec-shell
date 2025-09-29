import { useState, useEffect, useCallback } from 'react';
import { Tratamiento } from '../../types/model';
import { service } from '../services/agricultura.service';


export const useTratamientos = () => {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [tratamiento, setTratamiento] = useState<Tratamiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTodosLosTratamientos();
      setTratamientos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamientos');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerPorId = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTratamientoPorId(id);
      setTratamiento(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamiento');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerPorDeficiencia = useCallback(async (deficienciaId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTratamientosPorDeficiencia(deficienciaId);
      setTratamientos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamientos por deficiencia');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTratamientosActivos();
      setTratamientos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamientos activos');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerPorTipo = useCallback(async (tipoTratamiento: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTratamientosPorTipo(tipoTratamiento);
      setTratamientos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamientos por tipo');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActivosPorDeficiencia = useCallback(async (deficienciaId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTratamientosActivosPorDeficiencia(deficienciaId);
      setTratamientos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamientos activos por deficiencia');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerRapidos = useCallback(async (diasMaximos: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTratamientosRapidos(diasMaximos);
      setTratamientos(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener tratamientos rápidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (tratamiento: Omit<Tratamiento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.crearTratamiento(tratamiento);
      setTratamientos(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al crear tratamiento');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizar = useCallback(async (id: number, tratamiento: Omit<Tratamiento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.actualizarTratamiento(id, tratamiento);
      setTratamientos(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar tratamiento');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminar = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await service.eliminarTratamiento(id);
      setTratamientos(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar tratamiento');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tratamientos,
    tratamiento,
    loading,
    error,
    obtenerTodos,
    obtenerPorId,
    obtenerPorDeficiencia,
    obtenerActivos,
    obtenerPorTipo,
    obtenerActivosPorDeficiencia,
    obtenerRapidos,
    crear,
    actualizar,
    eliminar,
  };
};