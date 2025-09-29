import { useState, useEffect } from 'react';
import { MedidaPreventiva } from '../../types/model';
import { MedidaPreventivaInput, service } from '../services/agricultura.service';

export const useMedidaPreventiva = () => {
  const [medidas, setMedidas] = useState<MedidaPreventiva[]>([]);
  const [medida, setMedida] = useState<MedidaPreventiva | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    setError(error.message || 'Error inesperado');
    setLoading(false);
  };

  const crearMedidaPreventiva = async (input: MedidaPreventivaInput) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaMedida = await service.crearMedidaPreventiva(input);
      setMedidas(prev => [...prev, nuevaMedida]);
      return nuevaMedida;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerMedidaPorId = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const medida = await service.obtenerMedidaPorId(id);
      setMedida(medida);
      return medida;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerTodasLasMedidas = async () => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.obtenerTodasLasMedidas();
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerMedidasPorDeficiencia = async (deficienciaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.obtenerMedidasPorDeficiencia(deficienciaId);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerMedidasActivas = async () => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.obtenerMedidasActivas();
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerMedidasPorTipo = async (tipoMedida: string) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.obtenerMedidasPorTipo(tipoMedida);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerMedidasActivasPorDeficiencia = async (deficienciaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.obtenerMedidasActivasPorDeficiencia(deficienciaId);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerMedidasPorEfectividadMinima = async (efectividadMinima: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.obtenerMedidasPorEfectividadMinima(efectividadMinima);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarMedida = async (id: number, input: MedidaPreventivaInput) => {
    try {
      setLoading(true);
      setError(null);
      const medidaActualizada = await service.actualizarMedida(id, input);
      setMedidas(prev => prev.map(m => m.id === id ? medidaActualizada : m));
      setMedida(medidaActualizada);
      return medidaActualizada;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarMedida = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await service.eliminarMedida(id);
      setMedidas(prev => prev.filter(m => m.id !== id));
      if (medida?.id === id) {
        setMedida(null);
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const activarMedida = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidaActivada = await service.activarMedida(id);
      setMedidas(prev => prev.map(m => m.id === id ? medidaActivada : m));
      setMedida(medidaActivada);
      return medidaActivada;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const desactivarMedida = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidaDesactivada = await service.desactivarMedida(id);
      setMedidas(prev => prev.map(m => m.id === id ? medidaDesactivada : m));
      setMedida(medidaDesactivada);
      return medidaDesactivada;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearMedida = () => setMedida(null);
  const clearMedidas = () => setMedidas([]);

  return {
    // Estados
    medidas,
    medida,
    loading,
    error,

    // Métodos CRUD
    crearMedidaPreventiva,
    obtenerMedidaPorId,
    obtenerTodasLasMedidas,
    actualizarMedida,
    eliminarMedida,

    // Métodos de filtrado
    obtenerMedidasPorDeficiencia,
    obtenerMedidasActivas,
    obtenerMedidasPorTipo,
    obtenerMedidasActivasPorDeficiencia,
    obtenerMedidasPorEfectividadMinima,

    // Métodos de activación/desactivación
    activarMedida,
    desactivarMedida,

    // Utilidades
    clearError,
    clearMedida,
    clearMedidas
  };
};