import { useState } from 'react';
import { ReglaPuntosInput, TipoPunto } from '../../types/dto';
import { ReglaPuntos } from '../../types/model';
import { service } from '../service/gamificacion.service';
import {  NOTIFICATION_MESSAGES, useNotifications} from '@rec-shell/rec-web-shared';
export const useReglaPuntos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reglasPuntos, setReglasPuntos] = useState<ReglaPuntos[]>([]);
  const [tipoPuntos, setTipoPuntos] = useState<TipoPunto[]>([]);
  const [reglaPuntos, setReglaPuntos] = useState<ReglaPuntos | null>(null);
  const notifications = useNotifications();

  const crear = async (data: ReglaPuntosInput): Promise<ReglaPuntos | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.POST(data);
      notifications.success();
      setReglasPuntos((prev) => [...prev, response]);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear la regla de puntos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obtenerTodos = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET();
      setReglasPuntos(response);
    } catch (err: any) {
      setError(err.message || 'Error al obtener las reglas de puntos');
    } finally {
      setLoading(false);
    }
  };

  const obtenerTipoPuntos = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET_TIPO_PUNTO();
      setTipoPuntos(response);
    } catch (err: any) {
      setError(err.message || 'Error al obtener las reglas de puntos');
    } finally {
      setLoading(false);
    }
  };

  const obtenerPorId = async (id: string): Promise<ReglaPuntos | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET_ID(id);
      setReglaPuntos(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al obtener la regla de puntos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const actualizar = async (id: string, data: ReglaPuntosInput): Promise<ReglaPuntos | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.PUT(id, data);
       notifications.success();
      setReglasPuntos((prev) =>
        prev.map((regla) => (regla.id === id ? response : regla))
      );
      setReglaPuntos(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la regla de puntos');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.DELETE(id);
      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
        NOTIFICATION_MESSAGES.GENERAL.DELETE.message
      );
      setReglasPuntos((prev) => prev.filter((regla) => regla.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la regla de puntos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    reglasPuntos,
    reglaPuntos,
    tipoPuntos,
    crear,
    obtenerTodos,
    obtenerPorId,
    obtenerTipoPuntos,
    actualizar,
    eliminar,
  };
};