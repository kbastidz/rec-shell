import { useState } from 'react';
import {
  useNotifications,
  NOTIFICATION_MESSAGES,
} from '@rec-shell/rec-web-shared';
import { service } from '../services/educacion.service';

interface GuardarCuestionarioParams {
  preguntas: Array<{
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
  }>;
  titulo: string;
  descripcion?: string;
  codigoUnico: string;
  fechaCreacion: string;
  estado: 'activo' | 'inactivo' | 'borrador';
  idCurso: string;
  fechaEvaluacion: string;
  resumen?: string;
  nombreArchivo?: string;
}

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

interface Cuestionario {
  preguntas: Pregunta[];
  titulo: string;
  descripcion?: string;
  codigoUnico: string;
  fechaCreacion: string;
  estado: 'activo' | 'inactivo' | 'borrador';
  resumen?: string;
  nombreArchivo?: string;
}

interface EvaluacionBackendResponse {
  id: number;
  fechaCreacion: string;
  titulo: string;
  descripcion: string | null;
  codigoUnico: string;
  fechaEvaluacion: string,
  estado: 'activo' | 'inactivo' | 'borrador';
  nombreArchivo: string | null;
  datosEvaluacion: string; // JSON string que contiene resumen y preguntas
}

interface CodigoItem {
  codigo: string;
  fecha: string;
}

export const useEducacion = () => {
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [listadoEvaluacion, setListadoEvaluacion] = useState<CodigoItem[]>([]);

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
      const errorMessage =
        err instanceof Error ? err.message : 'Error al guardar el cuestionario';
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

  const OBTENER = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.GET();
      setPreguntas(response);
      console.log(response);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al obtener las preguntas';
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

  const BUSCAR_BY_CEDULA = async (cedula: string) => {
    try {
      setLoading(true);
      const data = await service.GET_BY_ID_USUARIO(cedula);
      const normalizado = Array.isArray(data[0]) ? data.flat() : data;
      const datosFormateados: CodigoItem[] = normalizado.map((item: any) => ({
        codigo: item.codigoUnico,
        fecha: new Date(item.fechaEvaluacion).toLocaleDateString()
      }));

      setListadoEvaluacion(datosFormateados);

    } catch (err: any) {
      setError(err.message || 'Error al buscar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const OBTENER_POR_CODIGO = async (codigo: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.GET_BY_CODE(codigo);

      // Validar que el cuestionario esté activo
      if (response.estado !== 'activo') {
        throw new Error('Este cuestionario no está disponible actualmente');
      }

      setPreguntas(response.preguntas);
      setCuestionario(response);

      notifications.success(
        'Código Válido',
        'Cuestionario cargado correctamente'
      );

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Código inválido o evaluación no encontrada';
      setError(errorMessage);
      notifications.error('Error de Validación', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    CREAR,
    OBTENER,
    OBTENER_POR_CODIGO,
    BUSCAR_BY_CEDULA,
    loading,
    error,
    preguntas,
    cuestionario,
    listadoEvaluacion
  };
};
