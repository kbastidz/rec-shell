import { useState } from 'react';
import { useNotifications, NOTIFICATION_MESSAGES } from '@rec-shell/rec-web-shared';
import { service } from '../services/educacion.service';

interface GuardarCuestionarioParams {
  preguntas: Array<{
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
  }>;
  resumen?: string;
  nombreArchivo?: string;
}

export const useEducacion = () => {
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CREAR = async (data: GuardarCuestionarioParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.POST(data);
      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
        'Cuestionario guardado exitosamente'
      );
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el cuestionario';
      setError(errorMessage);
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        errorMessage
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    CREAR,
    loading,
    error
  };
};