import { useState, useEffect } from 'react';
import { TipoDesafio } from '../../types/model';
import { service } from '../services/gamificacion.service';
import { TipoDesafioInput } from '../../types/dto';

export const useListarTiposDesafios = () => {
  const [data, setData] = useState<TipoDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LISTAR = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.GET();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    LISTAR();
  }, []);

  return { data, loading, error, LISTAR };
};

export const useTiposIndividuales = () => {
  const [data, setData] = useState<TipoDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposIndividuales = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.GET_INDIVIDUALES();
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

export const useTiposGrupales = () => {
  const [data, setData] = useState<TipoDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposGrupales = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.GET_GRUPALES();
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

export const useBuscarTipoPorNombre = () => {
  const [data, setData] = useState<TipoDesafio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarPorNombre = async (nombre: string) => {
    if (!nombre.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await service.GET_BY_NAME(nombre);
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

export const useCrear = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CREAR = async (tipoDesafio: TipoDesafioInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.POST(tipoDesafio);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { CREAR, loading, error };
};

export const useActualizar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ACTUALIZAR = async (id: string, tipoDesafio: TipoDesafioInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.PUT(id, tipoDesafio);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { ACTUALIZAR, loading, error };
};

export const useEliminar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ELIMINAR = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await service.DELETE(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { ELIMINAR, loading, error };
};