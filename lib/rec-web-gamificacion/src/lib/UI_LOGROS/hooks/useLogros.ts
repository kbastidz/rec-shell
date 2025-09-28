import { useState, useCallback } from 'react';
import { Logro, LogroUsuario, EstadisticasLogrosDTO } from '../../types/model';
import { service } from '../services/gamificacion.service';
import { Rareza } from '../../enums/Enums';

interface UseLogrosState {
  logros: Logro[];
  logro: Logro | null;
  logrosUsuario: LogroUsuario[];
  estadisticas: EstadisticasLogrosDTO | null;
  loading: boolean;
  error: string | null;
  count: number;
  exists: boolean;
}

interface UseLogrosActions {
  // Consultas básicas
  obtenerLogrosActivos: () => Promise<void>;
  obtenerLogrosVisibles: () => Promise<void>;
  obtenerPorId: (id: string) => Promise<void>;
  buscarPorNombre: (nombre: string) => Promise<void>;
  verificarExistencia: (nombre: string) => Promise<void>;
  
  // Consultas por categoría
  obtenerLogrosPorCategoria: (categoriaId: string) => Promise<void>;
  obtenerLogrosVisiblesPorCategoria: (categoriaId: string) => Promise<void>;
  obtenerLogrosPorCategoriaOrdenados: (categoriaId: string) => Promise<void>;
  
  // Consultas por rareza
  obtenerLogrosPorRareza: (rareza: Rareza) => Promise<void>;
  filtrarPorRarezas: (rarezas: Rareza[]) => Promise<void>;
  
  // Consultas por puntos
  obtenerLogrosPorPuntosMayoresA: (puntos: number) => Promise<void>;
  obtenerLogrosPorRangoPuntos: (min: number, max: number) => Promise<void>;
  
  // Búsquedas y ordenamiento
  buscarPorTexto: (texto: string) => Promise<void>;
  obtenerLogrosOrdenadosPorRecompensa: () => Promise<void>;
  
  // Gestión de usuario
  obtenerLogrosNoObtenidosPorUsuario: (usuarioId: string) => Promise<void>;
  obtenerLogrosVisiblesNoObtenidosPorUsuario: (usuarioId: string) => Promise<void>;
  obtenerLogrosObtenidosPorUsuario: (usuarioId: string) => Promise<void>;
  obtenerLogrosEnProgresoPorUsuario: (usuarioId: string) => Promise<void>;
  otorgarLogro: (usuarioId: string, logroId: string, datosProgreso?: Record<string, any>) => Promise<LogroUsuario | null>;
  toggleExhibirLogro: (usuarioId: string, logroId: string) => Promise<void>;
  
  // Estadísticas
  obtenerEstadisticasGenerales: () => Promise<void>;
  obtenerEstadisticasUsuario: (usuarioId: string) => Promise<void>;
  
  // Conteos
  contarLogrosPorCategoria: (categoriaId: string) => Promise<void>;
  contarLogrosPorRareza: (rareza: Rareza) => Promise<void>;
  
  // CRUD Operations
  crearLogro: (logro: Logro) => Promise<Logro | null>;
  actualizarLogro: (id: string, logro: Logro) => Promise<Logro | null>;
  eliminarLogro: (id: string) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  resetState: () => void;
}

const initialState: UseLogrosState = {
  logros: [],
  logro: null,
  logrosUsuario: [],
  estadisticas: null,
  loading: false,
  error: null,
  count: 0,
  exists: false,
};

export const useLogros = (): UseLogrosState & UseLogrosActions => {
  const [state, setState] = useState<UseLogrosState>(initialState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  // Helper para manejar errores
  const handleAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (data: T) => void
  ): Promise<T | null> => {
    try {
      setLoading(true);
      clearError();
      const result = await asyncFn();
      if (onSuccess) {
        onSuccess(result);
      }
      setLoading(false);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setError, clearError]);

  // Consultas básicas
  const obtenerLogrosActivos = useCallback(async () => {
    await handleAsync(
      () => service.obtenerLogrosActivos(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosVisibles = useCallback(async () => {
    await handleAsync(
      () => service.obtenerLogrosVisibles(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerPorId = useCallback(async (id: string) => {
    await handleAsync(
      () => service.obtenerPorId(id),
      (logro) => setState(prev => ({ ...prev, logro }))
    );
  }, [handleAsync]);

  const buscarPorNombre = useCallback(async (nombre: string) => {
    await handleAsync(
      () => service.buscarPorNombre(nombre),
      (logro) => setState(prev => ({ ...prev, logro }))
    );
  }, [handleAsync]);

  const verificarExistencia = useCallback(async (nombre: string) => {
    await handleAsync(
      () => service.existePorNombre(nombre),
      (exists) => setState(prev => ({ ...prev, exists }))
    );
  }, [handleAsync]);

  // Consultas por categoría
  const obtenerLogrosPorCategoria = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.obtenerLogrosPorCategoria(categoriaId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosVisiblesPorCategoria = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.obtenerLogrosVisiblesPorCategoria(categoriaId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorCategoriaOrdenados = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.obtenerLogrosPorCategoriaOrdenados(categoriaId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  // Consultas por rareza
  const obtenerLogrosPorRareza = useCallback(async (rareza: Rareza) => {
    await handleAsync(
      () => service.obtenerLogrosPorRareza(rareza),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const filtrarPorRarezas = useCallback(async (rarezas: Rareza[]) => {
    await handleAsync(
      () => service.obtenerLogrosPorRarezas(rarezas),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  // Consultas por puntos
  const obtenerLogrosPorPuntosMayoresA = useCallback(async (puntos: number) => {
    await handleAsync(
      () => service.obtenerLogrosPorPuntosMayoresA(puntos),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorRangoPuntos = useCallback(async (min: number, max: number) => {
    await handleAsync(
      () => service.obtenerLogrosPorRangoPuntos(min, max),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  // Búsquedas y ordenamiento
  const buscarPorTexto = useCallback(async (texto: string) => {
    await handleAsync(
      () => service.buscarPorTexto(texto),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosOrdenadosPorRecompensa = useCallback(async () => {
    await handleAsync(
      () => service.obtenerLogrosOrdenadosPorRecompensa(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  // Gestión de usuario
  const obtenerLogrosNoObtenidosPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.obtenerLogrosNoObtenidosPorUsuario(usuarioId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosVisiblesNoObtenidosPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.obtenerLogrosVisiblesNoObtenidosPorUsuario(usuarioId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosObtenidosPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.obtenerLogrosObtenidosPorUsuario(usuarioId),
      (logrosUsuario) => setState(prev => ({ ...prev, logrosUsuario }))
    );
  }, [handleAsync]);

  const obtenerLogrosEnProgresoPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.obtenerLogrosEnProgresoPorUsuario(usuarioId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const otorgarLogro = useCallback(async (
    usuarioId: string, 
    logroId: string, 
    datosProgreso?: Record<string, any>
  ): Promise<LogroUsuario | null> => {
    return await handleAsync(() => service.otorgarLogro(usuarioId, logroId, datosProgreso));
  }, [handleAsync]);

  const toggleExhibirLogro = useCallback(async (usuarioId: string, logroId: string) => {
    await handleAsync(() => service.toggleExhibirLogro(usuarioId, logroId));
  }, [handleAsync]);

  // Estadísticas
  const obtenerEstadisticasGenerales = useCallback(async () => {
    await handleAsync(
      () => service.obtenerEstadisticasGenerales(),
      (estadisticas) => setState(prev => ({ ...prev, estadisticas }))
    );
  }, [handleAsync]);

  const obtenerEstadisticasUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.obtenerEstadisticasUsuario(usuarioId),
      (estadisticas) => setState(prev => ({ ...prev, estadisticas }))
    );
  }, [handleAsync]);

  // Conteos
  const contarLogrosPorCategoria = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.contarLogrosPorCategoria(categoriaId),
      (count) => setState(prev => ({ ...prev, count }))
    );
  }, [handleAsync]);

  const contarLogrosPorRareza = useCallback(async (rareza: Rareza) => {
    await handleAsync(
      () => service.contarLogrosPorRareza(rareza),
      (count) => setState(prev => ({ ...prev, count }))
    );
  }, [handleAsync]);

  // CRUD Operations
  const crearLogro = useCallback(async (logro: Logro): Promise<Logro | null> => {
    return await handleAsync(() => service.crearLogro(logro));
  }, [handleAsync]);

  const actualizarLogro = useCallback(async (id: string, logro: Logro): Promise<Logro | null> => {
    return await handleAsync(() => service.actualizarLogro(id, logro));
  }, [handleAsync]);

  const eliminarLogro = useCallback(async (id: string) => {
    await handleAsync(() => service.eliminarLogro(id));
  }, [handleAsync]);

  return {
    ...state,
    // Consultas básicas
    obtenerLogrosActivos,
    obtenerLogrosVisibles,
    obtenerPorId,
    buscarPorNombre,
    verificarExistencia,
    // Consultas por categoría
    obtenerLogrosPorCategoria,
    obtenerLogrosVisiblesPorCategoria,
    obtenerLogrosPorCategoriaOrdenados,
    // Consultas por rareza
    obtenerLogrosPorRareza,
    filtrarPorRarezas,
    // Consultas por puntos
    obtenerLogrosPorPuntosMayoresA,
    obtenerLogrosPorRangoPuntos,
    // Búsquedas y ordenamiento
    buscarPorTexto,
    obtenerLogrosOrdenadosPorRecompensa,
    // Gestión de usuario
    obtenerLogrosNoObtenidosPorUsuario,
    obtenerLogrosVisiblesNoObtenidosPorUsuario,
    obtenerLogrosObtenidosPorUsuario,
    obtenerLogrosEnProgresoPorUsuario,
    otorgarLogro,
    toggleExhibirLogro,
    // Estadísticas
    obtenerEstadisticasGenerales,
    obtenerEstadisticasUsuario,
    // Conteos
    contarLogrosPorCategoria,
    contarLogrosPorRareza,
    // CRUD Operations
    crearLogro,
    actualizarLogro,
    eliminarLogro,
    // Utilidades
    clearError,
    resetState,
  };
};

export default useLogros;