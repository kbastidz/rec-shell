import { useState } from 'react';
import { CrearTransaccionDTO } from '../../../types/dto';
import { TransaccionPuntos } from '../../../types/model';
import { service } from '../service/gamificacion.service';

interface UseTransaccionPuntosResult {
  crearTransaccion: (data: CrearTransaccionDTO) => Promise<TransaccionPuntos | null>;
  loading: boolean;
  error: string | null;
  transaccion: TransaccionPuntos | null;
}

export const useTransaccionPuntos = (): UseTransaccionPuntosResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaccion, setTransaccion] = useState<TransaccionPuntos | null>(null);

  const crearTransaccion = async (data: CrearTransaccionDTO): Promise<TransaccionPuntos | null> => {
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

  return {
    crearTransaccion,
    loading,
    error,
    transaccion
  };
};