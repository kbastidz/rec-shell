import { useState, useCallback } from 'react';
import { service } from '../services/gamificacion.service';
import { EntradaTablaLideres, TablaLideres } from '../../types/model';

export const useTablaLideres = () => {
  const [tablas, setTablas] = useState<TablaLideres[]>([]);
  const [entradas, setEntradas] = useState<EntradaTablaLideres[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CREAR = useCallback(async (tablaData: Omit<TablaLideres, 'id' | 'creadoEn' | 'actualizadoEn' | 'entradas'>) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaTabla = await service.POST(tablaData);
      setTablas(prev => [...prev, nuevaTabla]);
      return nuevaTabla;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tabla');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const ACTUALIZAR = useCallback(async (
  id: string, 
  tablaData: Partial<Omit<TablaLideres, 'id' | 'creadoEn' | 'actualizadoEn' | 'entradas'>>
  ) => {
  setLoading(true);
  setError(null);
  try {
    const tablaActualizada = await service.PUT(id, tablaData);
    setTablas(prev => prev.map(tabla => 
      tabla.id === id ? tablaActualizada : tabla
    ));
    return tablaActualizada;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al actualizar tabla');
    throw err;
  } finally {
    setLoading(false);
  }
  }, []);

  const BUSCAR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tablasActivas = await service.GET_ACTIVE();
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
      const entradasTabla = await service.GET_ENTRADAS(tablaId);
      setEntradas(entradasTabla);
      return entradasTabla;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener entradas');
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
      const entradasPeriodo = await service.GET_BY_PERIODO(
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
    tablas,
    entradas,
    loading,
    error,
    
    CREAR,
    BUSCAR,
    obtenerEntradasTabla,
    ACTUALIZAR,
    obtenerEntradasPorPeriodo,
    clearError,
    clearEntradas
  };
};