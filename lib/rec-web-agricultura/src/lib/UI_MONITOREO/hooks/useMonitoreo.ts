import { useState, useEffect, useCallback } from 'react';
import { ParametroMonitoreo } from '../../types/model';
import { service } from '../services/agricultura.service';


// Hook para obtener todos los parámetros
export const useParametrosMonitoreo = () => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerParametros = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerTodosLosParametros();
      setParametros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener parámetros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    obtenerParametros();
  }, [obtenerParametros]);

  return {
    parametros,
    loading,
    error,
    refetch: obtenerParametros
  };
};

// Hook para obtener un parámetro por ID
export const useParametroMonitoreoPorId = (id: string | null) => {
  const [parametro, setParametro] = useState<ParametroMonitoreo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerParametro = useCallback(async (parametroId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerParametroPorId(parametroId);
      setParametro(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener parámetro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      obtenerParametro(id);
    }
  }, [id, obtenerParametro]);

  return {
    parametro,
    loading,
    error,
    refetch: () => id && obtenerParametro(id)
  };
};

// Hook para obtener parámetros por cultivo
export const useParametrosPorCultivo = (cultivoId: string | null) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerParametrosPorCultivo = useCallback(async (cultivo: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerParametrosPorCultivo(cultivo);
      setParametros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener parámetros por cultivo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId) {
      obtenerParametrosPorCultivo(cultivoId);
    }
  }, [cultivoId, obtenerParametrosPorCultivo]);

  return {
    parametros,
    loading,
    error,
    refetch: () => cultivoId && obtenerParametrosPorCultivo(cultivoId)
  };
};

// Hook para obtener parámetros por fuente de datos
export const useParametrosPorFuente = (fuenteDatos: string | null) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerParametrosPorFuente = useCallback(async (fuente: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerParametrosPorFuente(fuente);
      setParametros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener parámetros por fuente');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fuenteDatos) {
      obtenerParametrosPorFuente(fuenteDatos);
    }
  }, [fuenteDatos, obtenerParametrosPorFuente]);

  return {
    parametros,
    loading,
    error,
    refetch: () => fuenteDatos && obtenerParametrosPorFuente(fuenteDatos)
  };
};

// Hook para obtener parámetros por cultivo ordenados
export const useParametrosPorCultivoOrdenados = (cultivoId: string | null) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerParametrosOrdenados = useCallback(async (cultivo: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerParametrosPorCultivoOrdenados(cultivo);
      setParametros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener parámetros ordenados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId) {
      obtenerParametrosOrdenados(cultivoId);
    }
  }, [cultivoId, obtenerParametrosOrdenados]);

  return {
    parametros,
    loading,
    error,
    refetch: () => cultivoId && obtenerParametrosOrdenados(cultivoId)
  };
};

// Hook para obtener parámetros por rango de fechas
export const useParametrosPorRangoFechas = (
  cultivoId: string | null,
  fechaInicio: string | null,
  fechaFin: string | null
) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerParametrosPorRango = useCallback(async (
    cultivo: string,
    inicio: string,
    fin: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerParametrosPorRangoFechas(cultivo, inicio, fin);
      setParametros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener parámetros por rango de fechas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId && fechaInicio && fechaFin) {
      obtenerParametrosPorRango(cultivoId, fechaInicio, fechaFin);
    }
  }, [cultivoId, fechaInicio, fechaFin, obtenerParametrosPorRango]);

  return {
    parametros,
    loading,
    error,
    refetch: () => cultivoId && fechaInicio && fechaFin && 
      obtenerParametrosPorRango(cultivoId, fechaInicio, fechaFin)
  };
};

// Hook para obtener temperatura promedio
export const useTemperaturaPromedio = (
  cultivoId: string | null,
  fechaInicio: string | null
) => {
  const [temperatura, setTemperatura] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerTemperaturaPromedio = useCallback(async (
    cultivo: string,
    inicio: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.obtenerTemperaturaPromedio(cultivo, inicio);
      setTemperatura(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener temperatura promedio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId && fechaInicio) {
      obtenerTemperaturaPromedio(cultivoId, fechaInicio);
    }
  }, [cultivoId, fechaInicio, obtenerTemperaturaPromedio]);

  return {
    temperatura,
    loading,
    error,
    refetch: () => cultivoId && fechaInicio && 
      obtenerTemperaturaPromedio(cultivoId, fechaInicio)
  };
};

// Hook para operaciones CRUD (crear, actualizar, eliminar)
export const useParametrosMonitoreoCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearParametro = async (parametro: Omit<ParametroMonitoreo, 'id'>): Promise<ParametroMonitoreo | null> => {
    try {
      setLoading(true);
      setError(null);
      const nuevoParametro = await service.crearParametroMonitoreo(parametro);
      return nuevoParametro;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear parámetro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const actualizarParametro = async (
    id: string,
    parametro: Omit<ParametroMonitoreo, 'id'>
  ): Promise<ParametroMonitoreo | null> => {
    try {
      setLoading(true);
      setError(null);
      const parametroActualizado = await service.actualizarParametro(id, parametro);
      return parametroActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar parámetro');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const eliminarParametro = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await service.eliminarParametro(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar parámetro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    crearParametro,
    actualizarParametro,
    eliminarParametro,
    clearError: () => setError(null)
  };
};