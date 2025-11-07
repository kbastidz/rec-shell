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
      console.log('Estudiantes');
      console.log(data);
      setEstudiantes(data);
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
      setEstudiantes((prev) => {
        const existe = prev.some(
          (e) => e.id === data.id || e.identificador === data.identificador
        );
        if (existe) {
          return prev.map((e) =>
            e.id === data.id || e.identificador === data.identificador
              ? data
              : e
          );
        } else {
          return [...prev, data];
        }
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar estudiante');
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
