import { useState, useCallback } from 'react';
import { Desafio, ParticipacionDesafio, UnirseDesafioRequest, ActualizarProgresoRequest } from '../../types/model';
import { service } from '../services/gamificacion.service';

export const useDesafio = () => {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [participaciones, setParticipaciones] = useState<ParticipacionDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any) => {
    console.error('Error en useDesafio:', error);
    setError(error?.message || 'Ha ocurrido un error');
    setLoading(false);
  }, []);

  const crearDesafio = useCallback(async (desafio: Partial<Desafio>) => {
    try {
      setLoading(true);
      setError(null);
      console.log('desafio', desafio);
      const nuevoDesafio = await service.crearDesafio(desafio);
      setDesafios(prev => [...prev, nuevoDesafio]);
      return nuevoDesafio;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const obtenerDesafiosActivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const desafiosActivos = await service.obtenerDesafiosActivos();
      setDesafios(desafiosActivos);
      return desafiosActivos;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const obtenerDesafiosDisponibles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const desafiosDisponibles = await service.obtenerDesafiosDisponibles();
      setDesafios(desafiosDisponibles);
      return desafiosDisponibles;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const obtenerDesafiosDiarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const desafiosDiarios = await service.obtenerDesafiosDiarios();
      setDesafios(desafiosDiarios);
      return desafiosDiarios;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const obtenerDesafiosSemanales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const desafiosSemanales = await service.obtenerDesafiosSemanales();
      setDesafios(desafiosSemanales);
      return desafiosSemanales;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const unirseADesafio = useCallback(async (desafioId: string, request: UnirseDesafioRequest) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await service.unirseADesafio(desafioId, request);
      return resultado;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const actualizarProgresoDesafio = useCallback(async (participacionId: string, request: ActualizarProgresoRequest) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await service.actualizarProgresoDesafio(participacionId, request);
      return resultado;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const obtenerParticipacionesUsuario = useCallback(async (usuarioId: string) => {
    try {
      setLoading(true);
      setError(null);
      const participacionesUsuario = await service.obtenerParticipacionesUsuario(usuarioId);
      setParticipaciones(participacionesUsuario);
      return participacionesUsuario;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const obtenerDesafiosCompletadosUsuario = useCallback(async (usuarioId: string) => {
    try {
      setLoading(true);
      setError(null);
      const desafiosCompletados = await service.obtenerDesafiosCompletadosUsuario(usuarioId);
      setParticipaciones(desafiosCompletados);
      return desafiosCompletados;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const procesarDesafiosVencidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await service.procesarDesafiosVencidos();
      return resultado;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    desafios,
    participaciones,
    loading,
    error,
    
    // Acciones
    crearDesafio,
    obtenerDesafiosActivos,
    obtenerDesafiosDisponibles,
    obtenerDesafiosDiarios,
    obtenerDesafiosSemanales,
    unirseADesafio,
    actualizarProgresoDesafio,
    obtenerParticipacionesUsuario,
    obtenerDesafiosCompletadosUsuario,
    procesarDesafiosVencidos,
    clearError
  };
};