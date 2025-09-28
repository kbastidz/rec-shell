import { useState, useEffect } from 'react';
import { TipoDesafio } from '../../types/model';
import { service } from '../services/gamificacion.service';

interface TipoDesafioInput {
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  esIndividual: boolean;
  esGrupal: boolean;
}

// Hook para obtener tipos individuales
export const useTiposIndividuales = () => {
  const [data, setData] = useState<TipoDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposIndividuales = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.obtenerTiposIndividuales();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposIndividuales();
  }, []);

  return { data, loading, error, refetch: fetchTiposIndividuales };
};

// Hook para obtener tipos grupales
export const useTiposGrupales = () => {
  const [data, setData] = useState<TipoDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposGrupales = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.obtenerTiposGrupales();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposGrupales();
  }, []);

  return { data, loading, error, refetch: fetchTiposGrupales };
};

// Hook para buscar por nombre
export const useBuscarTipoPorNombre = () => {
  const [data, setData] = useState<TipoDesafio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarPorNombre = async (nombre: string) => {
    if (!nombre.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await service.buscarPorNombre(nombre);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, buscarPorNombre };
};

// Hook para crear tipo de desafío
export const useCrearTipoDesafio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearTipoDesafio = async (tipoDesafio: TipoDesafioInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.crearTipoDesafio(tipoDesafio);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearTipoDesafio, loading, error };
};

// Hook para actualizar tipo de desafío
export const useActualizarTipoDesafio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarTipoDesafio = async (id: string, tipoDesafio: TipoDesafioInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.actualizarTipoDesafio(id, tipoDesafio);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { actualizarTipoDesafio, loading, error };
};

// Hook para eliminar tipo de desafío
export const useEliminarTipoDesafio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarTipoDesafio = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await service.eliminarTipoDesafio(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarTipoDesafio, loading, error };
};