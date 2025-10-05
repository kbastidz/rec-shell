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
  GET: () => Promise<void>;
  obtenerLogrosVisibles: () => Promise<void>;
  obtenerPorId: (id: string) => Promise<void>;
  buscarPorNombre: (nombre: string) => Promise<void>;
  verificarExistencia: (nombre: string) => Promise<void>;
  
  obtenerLogrosPorCategoria: (categoriaId: string) => Promise<void>;
  obtenerLogrosVisiblesPorCategoria: (categoriaId: string) => Promise<void>;
  obtenerLogrosPorCategoriaOrdenados: (categoriaId: string) => Promise<void>;
  
  obtenerLogrosPorRareza: (rareza: Rareza) => Promise<void>;
  filtrarPorRarezas: (rarezas: Rareza[]) => Promise<void>;
  
  obtenerLogrosPorPuntosMayoresA: (puntos: number) => Promise<void>;
  obtenerLogrosPorRangoPuntos: (min: number, max: number) => Promise<void>;
  
  buscarPorTexto: (texto: string) => Promise<void>;
  obtenerLogrosOrdenadosPorRecompensa: () => Promise<void>;
  
  obtenerLogrosNoObtenidosPorUsuario: (usuarioId: string) => Promise<void>;
  obtenerLogrosVisiblesNoObtenidosPorUsuario: (usuarioId: string) => Promise<void>;
  obtenerLogrosObtenidosPorUsuario: (usuarioId: string) => Promise<void>;
  obtenerLogrosEnProgresoPorUsuario: (usuarioId: string) => Promise<void>;
  otorgarLogro: (usuarioId: string, logroId: string, datosProgreso?: Record<string, any>) => Promise<LogroUsuario | null>;
  toggleExhibirLogro: (usuarioId: string, logroId: string) => Promise<void>;
  
  obtenerEstadisticasGenerales: () => Promise<void>;
  obtenerEstadisticasUsuario: (usuarioId: string) => Promise<void>;
  
  contarLogrosPorCategoria: (categoriaId: string) => Promise<void>;
  contarLogrosPorRareza: (rareza: Rareza) => Promise<void>;
  
  CREAR: (logro: Logro) => Promise<Logro | null>;
  ACTUALIZAR: (id: string, logro: Logro) => Promise<Logro | null>;
  ELIMINAR: (id: string) => Promise<void>;
  
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


  const GET = useCallback(async () => {
    await handleAsync(
      () => service.GET_ACTIVE(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosVisibles = useCallback(async () => {
    await handleAsync(
      () => service.GET_VISIBLE(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerPorId = useCallback(async (id: string) => {
    await handleAsync(
      () => service.GET_BY_ID(id),
      (logro) => setState(prev => ({ ...prev, logro }))
    );
  }, [handleAsync]);

  const buscarPorNombre = useCallback(async (nombre: string) => {
    await handleAsync(
      () => service.BET_BY_NAME(nombre),
      (logro) => setState(prev => ({ ...prev, logro }))
    );
  }, [handleAsync]);

  const verificarExistencia = useCallback(async (nombre: string) => {
    await handleAsync(
      () => service.isEXISTS_BY_NAME(nombre),
      (exists) => setState(prev => ({ ...prev, exists }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorCategoria = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.GET_BY_CATEGORY(categoriaId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosVisiblesPorCategoria = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.GET_VISIBLE_BY_CATEGORY(categoriaId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorCategoriaOrdenados = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.GET_ORDERED_BY_CATEGORY(categoriaId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorRareza = useCallback(async (rareza: Rareza) => {
    await handleAsync(
      () => service.GET_BY_RAREZA(rareza),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const filtrarPorRarezas = useCallback(async (rarezas: Rareza[]) => {
    await handleAsync(
      () => service.GET_BY_RAREZAS(rarezas),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorPuntosMayoresA = useCallback(async (puntos: number) => {
    await handleAsync(
      () => service.GET_BY_POINTS(puntos),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosPorRangoPuntos = useCallback(async (min: number, max: number) => {
    await handleAsync(
      () => service.GET_BY_RANGE(min, max),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const buscarPorTexto = useCallback(async (texto: string) => {
    await handleAsync(
      () => service.GET_BY_TEXT(texto),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosOrdenadosPorRecompensa = useCallback(async () => {
    await handleAsync(
      () => service.GET_ORDERED_BY_RECOMPENSA(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);


  const obtenerLogrosNoObtenidosPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.GET_NOT_OBTENDED_BY_USER(usuarioId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosVisiblesNoObtenidosPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.GET_VISIBLE_NOT_OBTENDED_BY_USER(usuarioId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const obtenerLogrosObtenidosPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.GET_OBTENDED_BY_USER(usuarioId),
      (logrosUsuario) => setState(prev => ({ ...prev, logrosUsuario }))
    );
  }, [handleAsync]);

  const obtenerLogrosEnProgresoPorUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.GET_PROGRESS_BY_USER(usuarioId),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleAsync]);

  const otorgarLogro = useCallback(async (
    usuarioId: string, 
    logroId: string, 
    datosProgreso?: Record<string, any>
  ): Promise<LogroUsuario | null> => {
    return await handleAsync(() => service.POST_OTORGAR_LOGRO(usuarioId, logroId, datosProgreso));
  }, [handleAsync]);

  const toggleExhibirLogro = useCallback(async (usuarioId: string, logroId: string) => {
    await handleAsync(() => service.toggleExhibirLogro(usuarioId, logroId));
  }, [handleAsync]);

  const obtenerEstadisticasGenerales = useCallback(async () => {
    await handleAsync(
      () => service.GET_ESTATISTICAS(),
      (estadisticas) => setState(prev => ({ ...prev, estadisticas }))
    );
  }, [handleAsync]);

  const obtenerEstadisticasUsuario = useCallback(async (usuarioId: string) => {
    await handleAsync(
      () => service.GET_ESTATISTICAS_BY_USER(usuarioId),
      (estadisticas) => setState(prev => ({ ...prev, estadisticas }))
    );
  }, [handleAsync]);


  const contarLogrosPorCategoria = useCallback(async (categoriaId: string) => {
    await handleAsync(
      () => service.COUNT_BY_CATEGORY(categoriaId),
      (count) => setState(prev => ({ ...prev, count }))
    );
  }, [handleAsync]);

  const contarLogrosPorRareza = useCallback(async (rareza: Rareza) => {
    await handleAsync(
      () => service.COUNT_BY_RAREZA(rareza),
      (count) => setState(prev => ({ ...prev, count }))
    );
  }, [handleAsync]);

  const CREAR = useCallback(async (logro: Logro): Promise<Logro | null> => {
    return await handleAsync(() => service.POST(logro));
  }, [handleAsync]);

  const ACTUALIZAR = useCallback(async (id: string, logro: Logro): Promise<Logro | null> => {
    return await handleAsync(() => service.UPDATE(id, logro));
  }, [handleAsync]);

  const ELIMINAR = useCallback(async (id: string) => {
    await handleAsync(() => service.DELETE(id));
  }, [handleAsync]);

  return {
    ...state,
    GET,
    obtenerLogrosVisibles,
    obtenerPorId,
    buscarPorNombre,
    verificarExistencia,
    obtenerLogrosPorCategoria,
    obtenerLogrosVisiblesPorCategoria,
    obtenerLogrosPorCategoriaOrdenados,
    obtenerLogrosPorRareza,
    filtrarPorRarezas,
    obtenerLogrosPorPuntosMayoresA,
    obtenerLogrosPorRangoPuntos,
    buscarPorTexto,
    obtenerLogrosOrdenadosPorRecompensa,
    obtenerLogrosNoObtenidosPorUsuario,
    obtenerLogrosVisiblesNoObtenidosPorUsuario,
    obtenerLogrosObtenidosPorUsuario,
    obtenerLogrosEnProgresoPorUsuario,
    otorgarLogro,
    toggleExhibirLogro,
    obtenerEstadisticasGenerales,
    obtenerEstadisticasUsuario,
    contarLogrosPorCategoria,
    contarLogrosPorRareza,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    clearError,
    resetState,
  };
};

export default useLogros;