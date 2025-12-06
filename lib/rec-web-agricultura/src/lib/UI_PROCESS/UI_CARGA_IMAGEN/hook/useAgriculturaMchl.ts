import { useState } from 'react';
import {  AnalisisImagenMCHLDTO } from '../../../types/dto';
import { service } from '../service/agriculturaMCHL.service';
import { AnalisisImagenMCHL } from '../../../types/model';
import { GET_ERROR } from '../../../utils/utils';

export const useAnalisisImagen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analisisList, setAnalisisList] = useState<AnalisisImagenMCHLDTO[]>([]);

  const REGISTRAR = async (
    analisisData: AnalisisImagenMCHLDTO
  ): Promise<AnalisisImagenMCHL | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.POST(analisisData);
      return response;
    } catch (err: unknown) {
      setError(GET_ERROR(error));
      console.error('Error guardando análisis:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /*const obtenerAnalisis = async (id: string): Promise<AnalisisImagenMCHL | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.GET(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al obtener el análisis');
      console.error('Error obteniendo análisis:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  */

  const OBTENER = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET();
      setAnalisisList(response);
    } catch (err: unknown) {
      setError(GET_ERROR(error));
      console.error('Error obteniendo análisis:', err);
    } finally {
      setLoading(false);
    }
  };

  /*
  const eliminarAnalisis = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await service.DELETE(id);
      setAnalisisList(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el análisis');
      console.error('Error eliminando análisis:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };*/

  return {
    loading,
    error,
    analisisList,
    REGISTRAR,
    //obtenerAnalisis,
    OBTENER,
    //eliminarAnalisis*/
  };
};