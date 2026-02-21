import { useState, useCallback } from 'react';
import { AnalisisRespuestasDTO, ComparativaEstudiantesDTO, DashboardGeneralDTO, EstudianteDetalleDTO, EstudianteMetricasDTO, EvolucionDTO, FiltroEstudiantesRequest, MateriaEstadisticasDTO, RangoFechasRequest } from '../dto/dto';
import { service } from '../services/educacion.service';

const USE_MOCK_DATA = false; 

interface UseDashboardState {
  loading: boolean;
  error: string | null;
}

// Mock data basado en tu API
const mockDashboardGeneral: DashboardGeneralDTO = {
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


const mockDistribucionNiveles: Record<string, number> = {
  'EXCELENTE': 8,
  'BUENO': 20,
  'REGULAR': 12,
  'NECESITA_APOYO': 5
};


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useDashboard = () => {
  const [state, setState] = useState<UseDashboardState>({
    loading: false,
    error: null
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // Función helper para manejar llamadas mock/real
  const executeCall = async <T>(
    realCall: () => Promise<T>,
    mockData: T,
    mockDelay = 500
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        await delay(mockDelay);
        return mockData;
      } else {
        return await realCall();
      }
    } catch (error: any) {
      setError(error?.message || 'Error en la operación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardGeneral = useCallback(async (ciclo?: string): Promise<DashboardGeneralDTO | null> => {
    return executeCall(
      () => service.GET_DASHBOARD_GENERAL(ciclo),
      mockDashboardGeneral
    );
  }, []);

  const getMetricasEstudiante = useCallback(async (id: number, ciclo?: string): Promise<EstudianteMetricasDTO | null> => {
    const mockData: EstudianteMetricasDTO = {
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
    };

    return executeCall(
      () => service.GET_METRICAS_ESTUDIANTE(id, ciclo),
      mockData
    );
  }, []);

  const getDetalleEstudiante = useCallback(async (id: number, ciclo?: string): Promise<EstudianteDetalleDTO | null> => {
    const mockData: EstudianteDetalleDTO = {
      id: 1,
      nombreCompleto: "García López María",
      calificaciones: [
        {
          materiaId: 1,
          codigoMateria: "MAT101",
          nombreMateria: "Matemáticas",
          trimestre1: 9.2,
          trimestre2: 9.5,
          trimestre3: 9.8,
          promedioFinal: 9.5,
          tendencia: "MEJORANDO"
        }
      ],
      evaluaciones: [
        {
          evaluacionId: 1,
          resultadoId: 101,
          fechaRealizacion: "2024-01-15T10:30:00",
          puntuacionObtenida: 85,
          puntuacionMaxima: 100,
          porcentajeAciertos: 85.0,
          tiempoTotalSegundos: 1800,
          estado: "completado",
          totalPreguntas: 20,
          respuestasCorrectas: 17
        }
      ],
      estadisticas: {
        promedioCalificaciones: 9.3,
        promedioEvaluaciones: 92.5,
        totalEvaluacionesCompletadas: 12,
        totalMaterias: 8,
        mejorCalificacion: 9.8,
        peorCalificacion: 8.7,
        materiaFuerte: "Matemáticas",
        materiaDebil: "Historia"
      },
      evolucion: {
        evolucionTrimestral: [
          { periodo: "Trimestre 1", valor: 8.9 , fecha: ""},
          { periodo: "Trimestre 2", valor: 9.2 , fecha: ""},
          { periodo: "Trimestre 3", valor: 9.5 , fecha: ""}
        ],
        evolucionEvaluaciones: [
          { periodo: "Evaluación", fecha: "2024-01-15T10:30:00", valor: 85.0 }
        ],
        tendenciaGeneral: 0.6
      }
    };

    return executeCall(
      () => service.GET_DETALLE_ESTUDIANTE(id, ciclo),
      mockData
    );
  }, []);

  const getEvolucionEstudiante = useCallback(async (
    id: number,
    rango: RangoFechasRequest,
    ciclo?: string
  ): Promise<EvolucionDTO | null> => {
    const mockData: EvolucionDTO = {
      evolucionTrimestral: [
        { periodo: "Enero", fecha: "2024-01-31T00:00:00", valor: 8.5 },
        { periodo: "Febrero", fecha: "2024-02-29T00:00:00", valor: 8.8 },
        { periodo: "Marzo", fecha: "2024-03-31T00:00:00", valor: 9.2 }
      ],
      evolucionEvaluaciones: [
        { periodo: "Evaluación Diagnóstica", fecha: "2024-01-15T10:30:00", valor: 78.0 }
      ],
      tendenciaGeneral: 0.7
    };

    return executeCall(
      () => service.POST_EVOLUCION_ESTUDIANTE(id, rango, ciclo),
      mockData
    );
  }, []);

  const getAnalisisRespuestas = useCallback(async (resultadoId: number): Promise<AnalisisRespuestasDTO | null> => {
    const mockData: AnalisisRespuestasDTO = {
      evaluacionId: 1,
      estudianteId: 1,
      nombreEstudiante: "García López María",
      respuestas: [
        {
          numeroPregunta: 1,
          preguntaTexto: "¿Cuál es la capital de Francia?",
          respuestaCorrecta: 2,
          respuestaSeleccionada: 2,
          esCorrecta: true,
          tiempoRespuestaSegundos: 45,
          fechaRespuesta: "2024-01-15T10:31:00"
        }
      ],
      estadisticas: {
        totalPreguntas: 20,
        respuestasCorrectas: 17,
        respuestasIncorrectas: 3,
        porcentajeAciertos: 85.0,
        tiempoPromedioRespuesta: 42,
        tiempoTotal: 840
      }
    };

    return executeCall(
      () => service.GET_ANALISIS_RESPUESTAS(resultadoId),
      mockData
    );
  }, []);

  const getComparativa = useCallback(async (
    criterio = 'PROMEDIO_GENERAL',
    ciclo?: string
  ): Promise<ComparativaEstudiantesDTO | null> => {
    const mockData: ComparativaEstudiantesDTO = {
      estudiantes: [
        {
          id: 1,
          nombreCompleto: "García López María",
          valor: 9.5,
          posicion: 1
        }
      ],
      criterio: "PROMEDIO_GENERAL"
    };

    return executeCall(
      () => service.GET_COMPARATIVA(criterio, ciclo),
      mockData
    );
  }, []);

  const getEstudiantesFiltrados = useCallback(async (
    filtro: FiltroEstudiantesRequest
  ): Promise<EstudianteMetricasDTO[] | null> => {
    const mockData: EstudianteMetricasDTO[] = [
      {
        id: 5,
        nombreCompleto: "Díaz Mendoza Laura",
        apellidos: "Díaz Mendoza",
        nombres: "Laura",
        promedioGeneral: 8.2,
        acompaniamientoIntegral: 7.8,
        animacionLectura: 8.5,
        totalEvaluacionesRealizadas: 10,
        promedioEvaluaciones: 81.5,
        estadoGeneral: "BUENO"
      }
    ];

    return executeCall(
      () => service.POST_ESTUDIANTES_FILTRADOS(filtro),
      mockData
    );
  }, []);

  const getEstadisticasMaterias = useCallback(async (ciclo?: string): Promise<MateriaEstadisticasDTO[] | null> => {
    const mockData: MateriaEstadisticasDTO[] = [
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
    ];

    return executeCall(
      () => service.GET_ESTADISTICAS_MATERIAS(ciclo),
      mockData
    );
  }, []);

  const getTopEstudiantes = useCallback(async (limite = 10, ciclo?: string): Promise<EstudianteMetricasDTO[] | null> => {
    const mockData: EstudianteMetricasDTO[] = [
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
      }
    ];

    return executeCall(
      () => service.GET_TOP_ESTUDIANTES(limite, ciclo),
      mockData
    );
  }, []);

  const getEstudiantesRiesgo = useCallback(async (ciclo?: string): Promise<EstudianteMetricasDTO[] | null> => {
    const mockData: EstudianteMetricasDTO[] = [
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
    ];

    return executeCall(
      () => service.GET_ESTUDIANTES_RIESGO(ciclo),
      mockData
    );
  }, []);

  const getDistribucionNiveles = useCallback(async (ciclo?: string): Promise<Record<string, number> | null> => {
    return executeCall(
      () => service.GET_DISTRIBUCION_NIVELES(ciclo),
      mockDistribucionNiveles
    );
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    getDashboardGeneral,
    getMetricasEstudiante,
    getDetalleEstudiante,
    getEvolucionEstudiante,
    getAnalisisRespuestas,
    getComparativa,
    getEstudiantesFiltrados,
    getEstadisticasMaterias,
    getTopEstudiantes,
    getEstudiantesRiesgo,
    getDistribucionNiveles
  };
};