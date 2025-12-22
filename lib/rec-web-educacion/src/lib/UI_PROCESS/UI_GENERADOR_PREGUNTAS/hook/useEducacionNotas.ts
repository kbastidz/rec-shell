import { useState, useEffect } from 'react';
import { Estudiante } from '../interfaces/interface';
import { service } from '../services/educacion.notas.service';

export const useEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const data = await service.GET();
      setEstudiantes(data);
      console.log(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

 

  const saveEstudiante = async (
    estudiante: Estudiante,
    modo: 'insert' | 'update'
  ) => {
    try {
      setLoading(true);
      console.log(`Guardando estudiante (${modo})`, estudiante);
      let data;

      if (modo === 'update') {
        data = await service.PUT(
          estudiante.identificador || estudiante.id,
          estudiante
        );
      } else {
        data = await service.POST(estudiante);
      }
      
      // SOLUCIÓN: Actualizar solo el estudiante específico usando su ID único
      setEstudiantes((prev) => {
        const estudianteId = estudiante.id || estudiante.identificador;
        const dataId = data.id || data.identificador;
        
        const existe = prev.some(
          (e) => (e.id === estudianteId || e.identificador === estudianteId)
        );
        
        if (existe) {
          // Actualizar solo el estudiante que coincide exactamente
          return prev.map((e) => {
            const eId = e.id || e.identificador;
            const matchId = eId === estudianteId || eId === dataId;
            
            return matchId ? { ...data } : e;
          });
        } else {
          return [...prev, { ...data }];
        }
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar estudiante');
      throw err; // Re-lanzar el error para manejarlo en el componente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  return {
    estudiantes,
    loading,
    error,
    fetchEstudiantes,
    saveEstudiante,
  };
};