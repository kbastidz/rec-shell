import { useEffect, useState } from 'react';
import { TransaccionPuntos } from '../../../types/model';
import { service } from '../service/gamificacion.service';
import { User } from '@rec-shell/rec-web-usuario';

interface UseTransaccionPuntosResult {
  transaccion: TransaccionPuntos | null;
  transacciones: TransaccionPuntos[];
  loading: boolean;
  error: string | null;
  users: User[];
  getTransaccionById: (id: string) => Promise<void>;
  getTransaccionesActivas: () => Promise<void>;
  updateTransaccion: (id: string, data: TransaccionPuntos) => Promise<void>;
}

export const useTransaccionPuntos = (): UseTransaccionPuntosResult => {
  const [transaccion, setTransaccion] = useState<TransaccionPuntos | null>(null);
  const [transacciones, setTransacciones] = useState<TransaccionPuntos[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const getTransaccionById = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET_ID(id);
      setTransaccion(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la transacción');
      console.error('Error en getTransaccionById:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransaccionesActivas = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET();
      setTransacciones(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las transacciones');
      console.error('Error en getTransaccionesActivas:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaccion = async (id: string, data: TransaccionPuntos): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.PUT(id, data);
      setTransaccion(response);
      
      setTransacciones(prev => 
        prev.map(t => t.id === id ? response : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la transacción');
      console.error('Error en updateTransaccion:', err);
    } finally {
      setLoading(false);
    }
  };

  /*Consumo de hook userdata*/
   const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await service.GET_USERS();
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchUsers();
      }, []);

  
  return {
    transaccion,
    transacciones,
    loading,
    error,
    users,
    getTransaccionById,
    getTransaccionesActivas,
    updateTransaccion,
  };
};