import { useState, useEffect, useCallback } from 'react';
import { Recompensa } from '../../types/model';
import { service } from '../services/gamificacion.service';
import { GET_ERROR } from '../../utils/utilidad';

export const useRecompensasActivas = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET();
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

export const useRecompensa = (id: string) => {
  const [recompensa, setRecompensa] = useState<Recompensa | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensa = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_ID(id);
      setRecompensa(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecompensa();
  }, [fetchRecompensa]);

  return { recompensa, loading, error, refetch: fetchRecompensa };
};

export const useCrear = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const CREAR = async (recompensa: Recompensa): Promise<Recompensa | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.POST(recompensa);
      return data;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { CREAR, loading, error };
};

export const useActualizar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const ACTUALIZAR = async (id: string, recompensa: Recompensa): Promise<Recompensa | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.PUT(id, recompensa);
      return data;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { ACTUALIZAR, loading, error };
};

export const useEliminar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const eliminar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.DELETE(id);
      return true;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { eliminar, loading, error };
};

export const useRecompensasDisponibles = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_DISPONIBLES();
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

export const useRecompensasVigentes = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_VIGENTES();
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

export const useRecompensasExpiradas = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_EXPIRADAS();
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

export const useRecompensasPorTipo = (tipoId: string) => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    if (!tipoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_BY_TYPE(tipoId);
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, [tipoId]);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

export const useRecompensasPorRangoCosto = (minCosto: number, maxCosto: number) => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_RANGE_COSTO(minCosto, maxCosto);
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, [minCosto, maxCosto]);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

export const useContarRecompensasPorTipo = (tipoId: string) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    if (!tipoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_COUNT_TYPE(tipoId);
      setCount(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, [tipoId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount };
};

export const useVerificarDisponibilidad = (id: string) => {
  const [disponible, setDisponible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verificar = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.VERIFY_DISPONIBLE(id);
      setDisponible(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    verificar();
  }, [verificar]);

  return { disponible, loading, error, refetch: verificar };
};

export const useActivarRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.GET_ACTIVE(id);
      return true;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { activar, loading, error };
};

export const useDesactivarRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const desactivar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.GET_INACTIVE(id);
      return true;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { desactivar, loading, error };
};

export const useReducirStock = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reducirStock = async (id: string, cantidad: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.GET_REDICIR_STOCK(id, cantidad);
      return true;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reducirStock, loading, error };
};

export const useRecompensasAdmin = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_ADMIN();
      setRecompensas(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};