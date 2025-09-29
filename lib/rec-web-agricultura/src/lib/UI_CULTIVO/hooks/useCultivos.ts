import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { EstadoCultivo } from '../../enums/Enums';
import { Cultivo, CultivoFilters } from '../../types/model';
import { service } from '../services/agricultura.service';

interface UseCultivosState {
  cultivos: Cultivo[];
  cultivo: Cultivo | null;
  loading: boolean;
  error: string | null;
  areaTotalActiva: number | null;
}

interface UseCultivosActions {
  // GET actions
  fetchCultivos: (filtros?: CultivoFilters) => Promise<void>;
  fetchCultivo: (id: string) => Promise<void>;
  fetchAreaTotalActiva: () => Promise<void>;
  verificarExistencia: (id: string) => Promise<boolean>;
  
  // POST actions
  crearCultivo: (cultivo: Cultivo) => Promise<Cultivo | null>;
  
  // PUT actions
  actualizarCultivo: (id: string, cultivo: Cultivo) => Promise<Cultivo | null>;
  
  // PATCH actions
  cambiarEstadoCultivo: (id: string, nuevoEstado: EstadoCultivo) => Promise<Cultivo | null>;
  
  // DELETE actions
  eliminarCultivo: (id: string) => Promise<boolean>;
  
  // Utility actions
  clearError: () => void;
  clearCultivo: () => void;
  refetchCultivos: () => Promise<void>;
}

export const useCultivos = (filtrosIniciales?: CultivoFilters): UseCultivosState & UseCultivosActions => {
  const [state, setState] = useState<UseCultivosState>({
    cultivos: [],
    cultivo: null,
    loading: false,
    error: null,
    areaTotalActiva: null
  });

  const [currentFilters, setCurrentFilters] = useState<CultivoFilters | undefined>(filtrosIniciales);

  // GET Actions
  const fetchCultivos = useCallback(async (filtros?: CultivoFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const filtrosToUse = filtros || currentFilters;
      setCurrentFilters(filtrosToUse);
      
      const data = await service.obtenerCultivosConFiltros(filtrosToUse || {});
      setState(prev => ({ ...prev, cultivos: Array.isArray(data) ? data : []  , loading: false }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los cultivos';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
    }
  }, [currentFilters]);

  const fetchCultivo = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.obtenerCultivoPorId(id);
      setState(prev => ({ ...prev, cultivo: data, loading: false }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el cultivo';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
    }
  }, []);

  const fetchAreaTotalActiva = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.obtenerAreaTotalActivaPorUsuario();
      setState(prev => ({ ...prev, areaTotalActiva: data, loading: false }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el área total';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  const verificarExistencia = useCallback(async (id: string): Promise<boolean> => {
    try {
      return await service.verificarExistenciaCultivo(id);
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'Error al verificar la existencia del cultivo',
        color: 'red'
      });
      return false;
    }
  }, []);

  // POST Actions
  const crearCultivo = useCallback(async (cultivoData: Cultivo): Promise<Cultivo | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const nuevoCultivo = await service.crearCultivo(cultivoData);
      setState(prev => ({ 
        ...prev, 
        cultivos: [...prev.cultivos, nuevoCultivo],
        loading: false 
      }));
      
      notifications.show({
        title: 'Éxito',
        message: 'Cultivo creado correctamente',
        color: 'green'
      });
      
      return nuevoCultivo;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear el cultivo';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
      return null;
    }
  }, []);

  // PUT Actions
  const actualizarCultivo = useCallback(async (id: string, cultivoData: Cultivo): Promise<Cultivo | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const cultivoActualizado = await service.actualizarCultivo(id, cultivoData);
      setState(prev => ({
        ...prev,
        cultivos: prev.cultivos.map(c => c.id === id ? cultivoActualizado : c),
        cultivo: prev.cultivo?.id === id ? cultivoActualizado : prev.cultivo,
        loading: false
      }));
      
      notifications.show({
        title: 'Éxito',
        message: 'Cultivo actualizado correctamente',
        color: 'green'
      });
      
      return cultivoActualizado;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el cultivo';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
      return null;
    }
  }, []);

  // PATCH Actions
  const cambiarEstadoCultivo = useCallback(async (id: string, nuevoEstado: EstadoCultivo): Promise<Cultivo | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const cultivoActualizado = await service.cambiarEstadoCultivo(id, nuevoEstado);
      setState(prev => ({
        ...prev,
        cultivos: prev.cultivos.map(c => c.id === id ? cultivoActualizado : c),
        cultivo: prev.cultivo?.id === id ? cultivoActualizado : prev.cultivo,
        loading: false
      }));
      
      notifications.show({
        title: 'Éxito',
        message: `Estado del cultivo cambiado a ${nuevoEstado}`,
        color: 'green'
      });
      
      return cultivoActualizado;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cambiar el estado del cultivo';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
      return null;
    }
  }, []);

  // DELETE Actions
  const eliminarCultivo = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await service.eliminarCultivo(id);
      setState(prev => ({
        ...prev,
        cultivos: prev.cultivos.filter(c => c.id !== id),
        cultivo: prev.cultivo?.id === id ? null : prev.cultivo,
        loading: false
      }));
      
      notifications.show({
        title: 'Éxito',
        message: 'Cultivo eliminado correctamente',
        color: 'green'
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el cultivo';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
      return false;
    }
  }, []);

  // Utility Actions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearCultivo = useCallback(() => {
    setState(prev => ({ ...prev, cultivo: null }));
  }, []);

  const refetchCultivos = useCallback(async () => {
    await fetchCultivos(currentFilters);
  }, [fetchCultivos, currentFilters]);

  // Initial fetch
  useEffect(() => {
    if (filtrosIniciales) {
      fetchCultivos(filtrosIniciales);
    }
  }, []);

  return {
    ...state,
    fetchCultivos,
    fetchCultivo,
    fetchAreaTotalActiva,
    verificarExistencia,
    crearCultivo,
    actualizarCultivo,
    cambiarEstadoCultivo,
    eliminarCultivo,
    clearError,
    clearCultivo,
    refetchCultivos
  };
};