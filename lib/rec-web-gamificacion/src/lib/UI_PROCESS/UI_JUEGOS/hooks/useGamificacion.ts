import { useState } from 'react';
import { CrearTransaccionDTO, ReglaPuntosDTO } from '../../../types/dto';
import { TransaccionPuntos } from '../../../types/model';
import { service } from '../service/gamificacion.service';

interface UseTransaccionPuntosResult {
  CREAR: (data: CrearTransaccionDTO) => Promise<TransaccionPuntos | null>;
  OBTENER_REGLA_POR_TIPO: (tipo: string) => Promise<ReglaPuntosDTO | null>;
  loading: boolean;
  error: string | null;
  transaccion: TransaccionPuntos | null;
  regla: ReglaPuntosDTO | null;
}

export const useTransaccionPuntos = (): UseTransaccionPuntosResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaccion, setTransaccion] = useState<TransaccionPuntos | null>(null);
  const [regla, setRegla] = useState<ReglaPuntosDTO | null>(null);

  // Crear transacción
  const CREAR = async (data: CrearTransaccionDTO): Promise<TransaccionPuntos | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.POST(data);
      setTransaccion(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear transacción';
      setError(errorMessage);
      console.error('Error creando transacción de puntos:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener regla por tipo
  const OBTENER_REGLA_POR_TIPO = async (tipo: string): Promise<ReglaPuntosDTO | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await service.GET_REGLA_BY_TIPO(tipo);
      setRegla(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener regla de puntos';
      setError(errorMessage);
      console.error('Error obteniendo regla de puntos por tipo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    CREAR,
    OBTENER_REGLA_POR_TIPO,
    loading,
    error,
    transaccion,
    regla
  };
};
