import { useState, useEffect, useCallback } from 'react';
import { Recompensa } from '../../types/model';
import { service } from '../services/gamificacion.service';


// Hook para obtener todas las recompensas activas
export const useRecompensasActivas = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTodasActivas();
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

// Hook para obtener una recompensa por ID
export const useRecompensa = (id: string) => {
  const [recompensa, setRecompensa] = useState<Recompensa | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensa = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerPorId(id);
      setRecompensa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensa');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecompensa();
  }, [fetchRecompensa]);

  return { recompensa, loading, error, refetch: fetchRecompensa };
};

// Hook para crear recompensa
export const useCrearRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const crear = async (recompensa: Recompensa): Promise<Recompensa | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.crear(recompensa);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear recompensa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { crear, loading, error };
};

// Hook para actualizar recompensa
export const useActualizarRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const actualizar = async (id: string, recompensa: Recompensa): Promise<Recompensa | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.actualizar(id, recompensa);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar recompensa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { actualizar, loading, error };
};

// Hook para eliminar recompensa
export const useEliminarRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const eliminar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.eliminar(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar recompensa');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { eliminar, loading, error };
};

// Hook para obtener recompensas disponibles
export const useRecompensasDisponibles = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerDisponibles();
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas disponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

// Hook para obtener recompensas vigentes
export const useRecompensasVigentes = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerVigentes();
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas vigentes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

// Hook para obtener recompensas expiradas
export const useRecompensasExpiradas = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerExpiradas();
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas expiradas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

// Hook para obtener recompensas por tipo
export const useRecompensasPorTipo = (tipoId: string) => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    if (!tipoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerPorTipo(tipoId);
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas por tipo');
    } finally {
      setLoading(false);
    }
  }, [tipoId]);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

// Hook para obtener recompensas por rango de costo
export const useRecompensasPorRangoCosto = (minCosto: number, maxCosto: number) => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerPorRangoCosto(minCosto, maxCosto);
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas por rango de costo');
    } finally {
      setLoading(false);
    }
  }, [minCosto, maxCosto]);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};

// Hook para contar recompensas por tipo
export const useContarRecompensasPorTipo = (tipoId: string) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    if (!tipoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.contarPorTipo(tipoId);
      setCount(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al contar recompensas');
    } finally {
      setLoading(false);
    }
  }, [tipoId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount };
};

// Hook para verificar disponibilidad
export const useVerificarDisponibilidad = (id: string) => {
  const [disponible, setDisponible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verificar = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await service.verificarDisponibilidad(id);
      setDisponible(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar disponibilidad');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    verificar();
  }, [verificar]);

  return { disponible, loading, error, refetch: verificar };
};

// Hook para activar recompensa
export const useActivarRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.activar(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar recompensa');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { activar, loading, error };
};

// Hook para desactivar recompensa
export const useDesactivarRecompensa = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const desactivar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.desactivar(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar recompensa');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { desactivar, loading, error };
};

// Hook para reducir stock
export const useReducirStock = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reducirStock = async (id: string, cantidad: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.reducirStock(id, cantidad);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reducir stock');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reducirStock, loading, error };
};

// Hook para obtener todas las recompensas (admin)
export const useRecompensasAdmin = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecompensas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTodasAdmin();
      setRecompensas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recompensas admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecompensas();
  }, [fetchRecompensas]);

  return { recompensas, loading, error, refetch: fetchRecompensas };
};