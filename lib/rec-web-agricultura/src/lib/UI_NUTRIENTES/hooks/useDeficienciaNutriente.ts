import { useState, useEffect } from 'react';

import { DeficienciaNutriente } from '../../types/model';
import { DeficienciaNutrienteInput, service } from '../services/agricultura.service';

export const useDeficienciaNutriente = () => {
  const [deficiencias, setDeficiencias] = useState<DeficienciaNutriente[]>([]);
  const [deficiencia, setDeficiencia] = useState<DeficienciaNutriente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any) => {
    console.error('Error en DeficienciaNutriente:', err);
    setError(err.message || 'Ha ocurrido un error');
  };

  const clearError = () => setError(null);

  // Crear deficiencia
  const crearDeficiencia = async (data: DeficienciaNutrienteInput): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const nuevaDeficiencia = await service.crearDeficienciaNutriente(data);
      setDeficiencias(prev => [...prev, nuevaDeficiencia]);
      return nuevaDeficiencia;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener por ID
  const obtenerPorId = async (id: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaEncontrada = await service.obtenerDeficienciaPorId(id);
      setDeficiencia(deficienciaEncontrada);
      return deficienciaEncontrada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener por código
  const obtenerPorCodigo = async (codigo: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaEncontrada = await service.obtenerDeficienciaPorCodigo(codigo);
      setDeficiencia(deficienciaEncontrada);
      return deficienciaEncontrada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas
  const obtenerTodas = async () => {
    try {
      setLoading(true);
      clearError();
      const todasDeficiencias = await service.obtenerTodasLasDeficiencias();
      setDeficiencias(todasDeficiencias);
      return todasDeficiencias;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener activas
  const obtenerActivas = async () => {
    try {
      setLoading(true);
      clearError();
      const deficienciasActivas = await service.obtenerDeficienciasActivas();
      setDeficiencias(deficienciasActivas);
      return deficienciasActivas;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener por nutriente
  const obtenerPorNutriente = async (nutriente: string) => {
    try {
      setLoading(true);
      clearError();
      const deficienciasPorNutriente = await service.obtenerDeficienciasPorNutriente(nutriente);
      setDeficiencias(deficienciasPorNutriente);
      return deficienciasPorNutriente;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener activas ordenadas
  const obtenerActivasOrdenadas = async () => {
    try {
      setLoading(true);
      clearError();
      const deficienciasOrdenadas = await service.obtenerDeficienciasActivasOrdenadas();
      setDeficiencias(deficienciasOrdenadas);
      return deficienciasOrdenadas;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Contar activas
  const contarActivas = async (): Promise<number> => {
    try {
      setLoading(true);
      clearError();
      const count = await service.contarDeficienciasActivas();
      return count;
    } catch (err) {
      handleError(err);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar
  const actualizar = async (id: string, data: DeficienciaNutrienteInput): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaActualizada = await service.actualizarDeficiencia(id, data);
      setDeficiencias(prev => 
        prev.map(def => def.id.toString() === id ? deficienciaActualizada : def)
      );
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(deficienciaActualizada);
      }
      return deficienciaActualizada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar
  const eliminar = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      await service.eliminarDeficiencia(id);
      setDeficiencias(prev => prev.filter(def => def.id.toString() !== id));
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(null);
      }
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Activar
  const activar = async (id: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaActivada = await service.activarDeficiencia(id);
      setDeficiencias(prev => 
        prev.map(def => def.id.toString() === id ? deficienciaActivada : def)
      );
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(deficienciaActivada);
      }
      return deficienciaActivada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Desactivar
  const desactivar = async (id: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaDesactivada = await service.desactivarDeficiencia(id);
      setDeficiencias(prev => 
        prev.map(def => def.id.toString() === id ? deficienciaDesactivada : def)
      );
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(deficienciaDesactivada);
      }
      return deficienciaDesactivada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estados
    deficiencias,
    deficiencia,
    loading,
    error,
    
    // Acciones
    crearDeficiencia,
    obtenerPorId,
    obtenerPorCodigo,
    obtenerTodas,
    obtenerActivas,
    obtenerPorNutriente,
    obtenerActivasOrdenadas,
    contarActivas,
    actualizar,
    eliminar,
    activar,
    desactivar,
    clearError
  };
};