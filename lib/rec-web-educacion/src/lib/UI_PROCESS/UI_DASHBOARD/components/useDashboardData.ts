// hooks/useDashboardData.ts
import { useState, useEffect } from 'react';

// Interfaces basadas en tu API
export interface Estudiante {
  id: number;
  nombreCompleto: string;
  apellidos: string;
  nombres: string;
  promedioGeneral: number;
  acompaniamientoIntegral: number;
  animacionLectura: number;
  totalEvaluacionesRealizadas: number;
  promedioEvaluaciones: number;
  estadoGeneral: string;
}

export interface DashboardData {
  totalEstudiantes: number;
  promedioGeneral: number;
  estudiantesExcelentes: number;
  estudiantesBuenos: number;
  estudiantesRegulares: number;
  estudiantesNecesitanApoyo: number;
  topEstudiantes: Estudiante[];
  estudiantesRiesgo: Estudiante[];
  estadisticasPorMateria: any[];
}

export interface DistribucionEstados {
  EXCELENTE: number;
  BUENO: number;
  REGULAR: number;
  NECESITA_APOYO: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [distribucion, setDistribucion] = useState<DistribucionEstados | null>(null);

  useEffect(() => {
    // Mock data basado en tu API
    const mockDashboardData: DashboardData = {
      totalEstudiantes: 45,
      promedioGeneral: 7.8,
      estudiantesExcelentes: 8,
      estudiantesBuenos: 20,
      estudiantesRegulares: 12,
      estudiantesNecesitanApoyo: 5,
      topEstudiantes: [
        {
          id: 1,
          nombreCompleto: "García López María",
          apellidos: "García López",
          nombres: "María",
          promedioGeneral: 9.5,
          acompaniamientoIntegral: 8.7,
          animacionLectura: 9.2,
          totalEvaluacionesRealizadas: 12,
          promedioEvaluaciones: 92.5,
          estadoGeneral: "EXCELENTE"
        },
        {
          id: 2,
          nombreCompleto: "Martínez Ruiz Juan",
          apellidos: "Martínez Ruiz",
          nombres: "Juan",
          promedioGeneral: 9.2,
          acompaniamientoIntegral: 9.0,
          animacionLectura: 9.4,
          totalEvaluacionesRealizadas: 11,
          promedioEvaluaciones: 90.8,
          estadoGeneral: "EXCELENTE"
        }
      ],
      estudiantesRiesgo: [
        {
          id: 45,
          nombreCompleto: "Rodríguez Pérez Carlos",
          apellidos: "Rodríguez Pérez",
          nombres: "Carlos",
          promedioGeneral: 4.2,
          acompaniamientoIntegral: 3.8,
          animacionLectura: 4.5,
          totalEvaluacionesRealizadas: 8,
          promedioEvaluaciones: 42.0,
          estadoGeneral: "NECESITA_APOYO"
        }
      ],
      estadisticasPorMateria: [
        {
          materiaId: 1,
          codigoMateria: "MAT101",
          nombreMateria: "Matemáticas",
          promedioGeneral: 8.2,
          totalEstudiantes: 45,
          mejorNota: 10.0,
          peorNota: 4.5,
          aprobados: 40,
          reprobados: 5
        }
      ]
    };

    const mockDistribucion: DistribucionEstados = {
      EXCELENTE: 8,
      BUENO: 20,
      REGULAR: 12,
      NECESITA_APOYO: 5
    };

    // Simular carga de API
    setTimeout(() => {
      setData(mockDashboardData);
      setDistribucion(mockDistribucion);
      setLoading(false);
    }, 1000);
  }, []);

  return { data, distribucion, loading };
};