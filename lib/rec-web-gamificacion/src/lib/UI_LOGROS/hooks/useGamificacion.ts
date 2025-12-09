import { useState, useCallback } from 'react';
import { Logro } from '../../types/model';
import { service } from '../services/gamificacion.service';

interface UseLogrosState {
  logros: Logro[];
  loading: boolean;
  procesando: boolean;
  error: string | null;
}

interface UseLogrosActions {
  GET: () => Promise<void>;
  CREAR: (logro: Logro) => Promise<Logro | null>;
  ACTUALIZAR: (id: string, logro: Logro) => Promise<Logro | null>;
  ELIMINAR: (id: string) => Promise<void>;
  clearError: () => void;
}

const initialState: UseLogrosState = {
  logros: [],
  loading: false,
  procesando: false,
  error: null
};

export const useLogros = (): UseLogrosState & UseLogrosActions => {
  const [state, setState] = useState<UseLogrosState>(initialState);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setProcesando = useCallback((procesando: boolean) => {
    setState(prev => ({ ...prev, procesando }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false, procesando: false }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const handleGetAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (data: T) => void
  ): Promise<T | null> => {
    try {
      setLoading(true);
      clearError();
      const result = await asyncFn();
      onSuccess?.(result);
      setLoading(false);
      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      setError(msg);
      return null;
    }
  }, [clearError]);

  const handleProcesandoAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setProcesando(true);
      clearError();
      const result = await asyncFn();
      setProcesando(false);
      return result;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      setError(msg);
      return null;
    }
  }, [clearError]);


  const GET = useCallback(async () => {
    await handleGetAsync(
      () => service.GET_ACTIVE(),
      (logros) => setState(prev => ({ ...prev, logros }))
    );
  }, [handleGetAsync]);

  const CREAR = useCallback(async (logro: Logro): Promise<Logro | null> => {
    return await handleProcesandoAsync(() => service.POST(logro));
  }, [handleProcesandoAsync]);

  const ACTUALIZAR = useCallback(async (id: string, logro: Logro): Promise<Logro | null> => {
    return await handleProcesandoAsync(() => service.UPDATE(id, logro));
  }, [handleProcesandoAsync]);

  const ELIMINAR = useCallback(async (id: string) => {
    await handleProcesandoAsync(() => service.DELETE(id));
  }, [handleProcesandoAsync]);

  return {
    ...state,
    GET,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    clearError
  };
};

export default useLogros;
