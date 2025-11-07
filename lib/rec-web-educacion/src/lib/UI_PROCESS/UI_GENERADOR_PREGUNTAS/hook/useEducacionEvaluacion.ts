import { useState, useCallback, useRef, useEffect } from 'react';
import { ResultadoEvaluacionResponse, RespuestaEstudiante, ResultadoEvaluacionData } from '../interfaces/interface';
import { service } from '../services/educacion.evaluacion.service';
import { ST_GET_USER_ID } from '../../../utils/utilidad';


interface UseResultadoEvaluacionProps {
  evaluacionId: number;
  estudianteId: number;
  totalPreguntas: number;
}

export const useResultadoEvaluacion = ({
  evaluacionId,
  estudianteId,
  totalPreguntas
}: UseResultadoEvaluacionProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoEvaluacionResponse | null>(null);
  
  // Almacena las respuestas del estudiante
  const respuestasRef = useRef<RespuestaEstudiante[]>([]);
  
  // Tiempo de inicio de la evaluación
  const tiempoInicioRef = useRef<number | null>(null);
  
  // Tiempo de inicio de la pregunta actual
  const tiempoPreguntaRef = useRef<number | null>(null);

  // Iniciar cronómetro de evaluación
  const iniciarEvaluacion = useCallback(() => {
    tiempoInicioRef.current = Date.now();
    tiempoPreguntaRef.current = Date.now();
    respuestasRef.current = [];
    setError(null);
  }, []);

  // Registrar respuesta de una pregunta
  const registrarRespuesta = useCallback((
    numeroPregunta: number,
    preguntaTexto: string,
    opciones: string[],
    respuestaCorrecta: number,
    respuestaSeleccionada: number
  ) => {
    const tiempoRespuesta = tiempoPreguntaRef.current 
      ? Math.floor((Date.now() - tiempoPreguntaRef.current) / 1000)
      : 0;

    const respuesta: RespuestaEstudiante = {
      numeroPregunta,
      preguntaTexto,
      opciones,
      respuestaCorrecta,
      respuestaSeleccionada,
      esCorrecta: respuestaCorrecta === respuestaSeleccionada,
      tiempoRespuestaSegundos: tiempoRespuesta
    };

    respuestasRef.current.push(respuesta);
    
    // Reiniciar cronómetro para la siguiente pregunta
    tiempoPreguntaRef.current = Date.now();

    return respuesta.esCorrecta;
  }, []);

  // Calcular puntuación
  const calcularPuntuacion = useCallback(() => {
    const correctas = respuestasRef.current.filter(r => r.esCorrecta).length;
    const porcentaje = (correctas / totalPreguntas) * 100;
    
    return {
      puntuacionObtenida: correctas,
      puntuacionMaxima: totalPreguntas,
      porcentajeAciertos: parseFloat(porcentaje.toFixed(2))
    };
  }, [totalPreguntas]);

  // Guardar resultado final
  const guardarResultado = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const tiempoTotal = tiempoInicioRef.current 
        ? Math.floor((Date.now() - tiempoInicioRef.current) / 1000)
        : 0;

      const { puntuacionObtenida, puntuacionMaxima, porcentajeAciertos } = calcularPuntuacion();

      const data: ResultadoEvaluacionData = {
        evaluacionId: 1,
        estudianteId: ST_GET_USER_ID(),
        tiempoTotalSegundos: tiempoTotal,
        puntuacionObtenida,
        puntuacionMaxima,
        porcentajeAciertos,
        estado: 'completado',
        respuestas: respuestasRef.current
      };

      console.log(data);
      const response = await service.guardarResultado(data);
      setResultado(response);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el resultado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [evaluacionId, estudianteId, calcularPuntuacion]);

  // Obtener resumen de respuestas
  const obtenerResumen = useCallback(() => {
    const { puntuacionObtenida, puntuacionMaxima, porcentajeAciertos } = calcularPuntuacion();
    const tiempoTotal = tiempoInicioRef.current 
      ? Math.floor((Date.now() - tiempoInicioRef.current) / 1000)
      : 0;

    return {
      puntuacionObtenida,
      puntuacionMaxima,
      porcentajeAciertos,
      tiempoTotalSegundos: tiempoTotal,
      totalRespuestas: respuestasRef.current.length,
      respuestas: [...respuestasRef.current]
    };
  }, [calcularPuntuacion]);

  // Reiniciar evaluación
  const reiniciar = useCallback(() => {
    tiempoInicioRef.current = null;
    tiempoPreguntaRef.current = null;
    respuestasRef.current = [];
    setResultado(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    resultado,
    iniciarEvaluacion,
    registrarRespuesta,
    guardarResultado,
    obtenerResumen,
    reiniciar,
    calcularPuntuacion
  };
};

// Hook para obtener historial y estadísticas
export const useEstadisticasEvaluacion = (evaluacionId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<any>(null);

  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await service.obtenerEstadisticas(evaluacionId);
      setEstadisticas(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [evaluacionId]);

  useEffect(() => {
    if (evaluacionId) {
      cargarEstadisticas();
    }
  }, [evaluacionId, cargarEstadisticas]);

  return {
    loading,
    error,
    estadisticas,
    recargar: cargarEstadisticas
  };
};