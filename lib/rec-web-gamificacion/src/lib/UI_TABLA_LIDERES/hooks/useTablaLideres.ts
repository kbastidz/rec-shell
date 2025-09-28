import { useState, useCallback } from 'react';
import { service } from '../services/gamificacion.service';
import { EntradaTablaLideres, TablaLideres } from '../../types/model';

export const useTablaLideres = () => {
  const [tablas, setTablas] = useState<TablaLideres[]>([]);
  const [entradas, setEntradas] = useState<EntradaTablaLideres[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearTabla = useCallback(async (tablaData: Omit<TablaLideres, 'id' | 'creadoEn' | 'actualizadoEn' | 'entradas'>) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaTabla = await service.crearTablaLideres(tablaData);
      setTablas(prev => [...prev, nuevaTabla]);
      return nuevaTabla;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tabla');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerTablasActivas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tablasActivas = await service.obtenerTablasActivas();
      setTablas(tablasActivas);
      return tablasActivas;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener tablas activas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerEntradasTabla = useCallback(async (tablaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const entradasTabla = await service.obtenerEntradasTabla(tablaId);
      setEntradas(entradasTabla);
      return entradasTabla;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener entradas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarTabla = useCallback(async (tablaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await service.actualizarTablaLideres(tablaId);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar tabla');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerEntradasPorPeriodo = useCallback(async (
    tablaId: string, 
    inicioPeriodo: string, 
    finPeriodo: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const entradasPeriodo = await service.obtenerEntradasPorPeriodo(
        tablaId, 
        inicioPeriodo, 
        finPeriodo
      );
      setEntradas(entradasPeriodo);
      return entradasPeriodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener entradas por período');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearEntradas = useCallback(() => {
    setEntradas([]);
  }, []);

  return {
    // State
    tablas,
    entradas,
    loading,
    error,
    
    // Actions
    crearTabla,
    obtenerTablasActivas,
    obtenerEntradasTabla,
    actualizarTabla,
    obtenerEntradasPorPeriodo,
    clearError,
    clearEntradas
  };
};