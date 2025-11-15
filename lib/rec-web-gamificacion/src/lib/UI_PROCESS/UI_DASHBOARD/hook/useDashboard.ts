import { useState, useCallback } from 'react';

import { service } from '../services/gamificacion.service';
import {
  EstadisticasGeneralesDTO,
  ResumenUsuarioDTO,
  DistribucionPuntosDTO,
  EstadisticasLogrosDTO,
  DesafiosActivosDTO,
  TransaccionesRecientesDTO,
  ActividadUsuarioDTO,
} from '../dtos/dtos';
import { mockData } from '../../../utils/CONSTANTE';

interface UseGamificacionDashboardState {
  estadisticasGenerales: EstadisticasGeneralesDTO | null;
  resumenUsuario: ResumenUsuarioDTO | null;
  distribucionPuntos: DistribucionPuntosDTO | null;
  estadisticasLogros: EstadisticasLogrosDTO | null;
  desafiosActivos: DesafiosActivosDTO | null;
  transaccionesRecientes: TransaccionesRecientesDTO | null;
  actividadUsuario: ActividadUsuarioDTO | null;
  loading: boolean;
  error: string | null;
}

export const useDashboard = () => {
  const [state, setState] = useState<UseGamificacionDashboardState>({
    estadisticasGenerales: null,
    resumenUsuario: null,
    distribucionPuntos: null,
    estadisticasLogros: null,
    desafiosActivos: null,
    transaccionesRecientes: null,
    actividadUsuario: null,
    loading: false,
    error: null,
  });

  const USE_MOCK = true;

  // Obtener estadísticas generales
  const fetchEstadisticasGenerales = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getEstadisticasGenerales();
      setState((prev) => ({
        ...prev,
        estadisticasGenerales: data,
        loading: false,
      }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener estadísticas generales',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Obtener resumen de usuario
  const fetchResumenUsuario = useCallback(async (usuarioId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getResumenUsuario(usuarioId);
      setState((prev) => ({ ...prev, resumenUsuario: data, loading: false }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener resumen de usuario',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Obtener distribución de puntos
  const fetchDistribucionPuntos = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getDistribucionPuntos();
      setState((prev) => ({
        ...prev,
        distribucionPuntos: data,
        loading: false,
      }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener distribución de puntos',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Obtener estadísticas de logros
  const fetchEstadisticasLogros = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getEstadisticasLogros();
      setState((prev) => ({
        ...prev,
        estadisticasLogros: data,
        loading: false,
      }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener estadísticas de logros',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Obtener desafíos activos
  const fetchDesafiosActivos = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getDesafiosActivos();
      setState((prev) => ({ ...prev, desafiosActivos: data, loading: false }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener desafíos activos',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Obtener transacciones recientes
  const fetchTransaccionesRecientes = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getTransaccionesRecientes();
      setState((prev) => ({
        ...prev,
        transaccionesRecientes: data,
        loading: false,
      }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener transacciones recientes',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Obtener actividad de usuario
  const fetchActividadUsuario = useCallback(async (usuarioId: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.getActividadUsuario(usuarioId);
      setState((prev) => ({ ...prev, actividadUsuario: data, loading: false }));
      return data;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al obtener actividad de usuario',
        loading: false,
      }));
      throw error;
    }
  }, []);

  const fetchDashboardCompleto = useCallback(async (usuarioId?: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    if (USE_MOCK) {
      console.warn('🟡 Dashboard cargado con MOCK DATA');
      await new Promise((res) => setTimeout(res, 500));
      setState({
        ...mockData,
        loading: false,
        error: null,
      });
      return;
    }

    //Si NO está usando mock: consumir API real
    try {
      if (usuarioId) {
        const [
          estadisticasGenerales,
          distribucionPuntos,
          estadisticasLogros,
          desafiosActivos,
          transaccionesRecientes,
          resumenUsuario,
          actividadUsuario,
        ] = await Promise.all([
          service.getEstadisticasGenerales(),
          service.getDistribucionPuntos(),
          service.getEstadisticasLogros(),
          service.getDesafiosActivos(),
          service.getTransaccionesRecientes(),
          service.getResumenUsuario(usuarioId),
          service.getActividadUsuario(usuarioId),
        ]);

        setState((prev) => ({
          ...prev,
          estadisticasGenerales,
          distribucionPuntos,
          estadisticasLogros,
          desafiosActivos,
          transaccionesRecientes,
          resumenUsuario,
          actividadUsuario,
          loading: false,
        }));
      } else {
        const [
          estadisticasGenerales,
          distribucionPuntos,
          estadisticasLogros,
          desafiosActivos,
          transaccionesRecientes,
        ] = await Promise.all([
          service.getEstadisticasGenerales(),
          service.getDistribucionPuntos(),
          service.getEstadisticasLogros(),
          service.getDesafiosActivos(),
          service.getTransaccionesRecientes(),
        ]);

        setState((prev) => ({
          ...prev,
          estadisticasGenerales,
          distribucionPuntos,
          estadisticasLogros,
          desafiosActivos,
          transaccionesRecientes,
          resumenUsuario: null,
          actividadUsuario: null,
          loading: false,
        }));
      }
    } catch (error: any) {
      console.log('❌ Error API:', error);

      // Si quieres usar mock SOLO cuando falla la API, activa esto:
      /*
    setState({
      ...mockData,
      loading: false,
      error: null,
    });
    return;
    */

      setState((prev) => ({
        ...prev,
        error: error.message || 'Error al cargar el dashboard',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchEstadisticasGenerales,
    fetchResumenUsuario,
    fetchDistribucionPuntos,
    fetchEstadisticasLogros,
    fetchDesafiosActivos,
    fetchTransaccionesRecientes,
    fetchActividadUsuario,
    fetchDashboardCompleto,
    clearError,
  };
};
