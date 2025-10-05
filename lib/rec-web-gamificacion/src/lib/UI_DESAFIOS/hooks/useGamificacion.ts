import { useState, useCallback } from 'react';
import { Desafio, ParticipacionDesafio, UnirseDesafioRequest, ActualizarProgresoRequest } from '../../types/model';
import { service } from '../services/gamificacion.service';
import { GET_ERROR } from '../../utils/utilidad';

export const useDesafio = () => {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [participaciones, setParticipaciones] = useState<ParticipacionDesafio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown) => {
    console.log('Error en useDesafio:', error);
    setError(GET_ERROR(error));
    setLoading(false);
  }, []);

  const CREAR = useCallback(async (desafio: Partial<Desafio>) => {
    try {
      setLoading(true);
      setError(null);
      const nuevoDesafio = await service.POST(desafio);
      setDesafios(prev => [...prev, nuevoDesafio]);
      return nuevoDesafio;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

   const ACTUALIZAR = useCallback(async (Id: string, desafio: Partial<Desafio>) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await service.PUT(Id, desafio);
      return resultado;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const BUSCAR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const desafiosActivos = await service.GET();
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
      const desafiosDisponibles = await service.GET_VISIBLE();
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
      const desafiosDiarios = await service.GET_DIARIO();
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
      const desafiosSemanales = await service.GET_SEMANAL();
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
      const resultado = await service.POST_UNIRSE_DESAFIO(desafioId, request);
      return resultado;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const ACTUALIZAR_PROGRESO = useCallback(async (participacionId: string, request: ActualizarProgresoRequest) => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await service.PUT_PROGRESO(participacionId, request);
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
      const participacionesUsuario = await service.GET_PARTICIPACIONES_USERS(usuarioId);
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
      const desafiosCompletados = await service.GET_COMPLECT_USERS(usuarioId);
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
      const resultado = await service.POST_PROCESSAR_VENCIDOS();
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
    desafios,
    participaciones,
    loading,
    error,
    
    CREAR,
    BUSCAR,
    obtenerDesafiosDisponibles,
    obtenerDesafiosDiarios,
    obtenerDesafiosSemanales,
    unirseADesafio,
    ACTUALIZAR,
    ACTUALIZAR_PROGRESO,
    obtenerParticipacionesUsuario,
    obtenerDesafiosCompletadosUsuario,
    procesarDesafiosVencidos,
    clearError
  };
};