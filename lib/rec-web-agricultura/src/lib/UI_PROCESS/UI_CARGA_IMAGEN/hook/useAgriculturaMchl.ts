import { useState } from 'react';
import {  AnalisisImagenMCHLDTO } from '../../../types/dto';
import { service } from '../service/agriculturaMCHL.service';
import { AnalisisImagenMCHL } from '../../../types/model';
import { GET_ERROR } from '../../../utils/utils';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';

export const useAnalisisImagen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analisisList, setAnalisisList] = useState<AnalisisImagenYOLO_DTO[]>([]);

  const REGISTRAR = async (
    analisisData: AnalisisImagenYOLO_DTO
  ): Promise<AnalisisImagenMCHL | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AnalisisData:',analisisData);
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

  const OBTENER = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.GET();
      console.log('🔄 Análisis obtenidos:', response);
      setAnalisisList(response);
    } catch (err: unknown) {
      setError(GET_ERROR(error));
      console.error('Error obteniendo análisis:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    analisisList,
    REGISTRAR,
    OBTENER
  };
};