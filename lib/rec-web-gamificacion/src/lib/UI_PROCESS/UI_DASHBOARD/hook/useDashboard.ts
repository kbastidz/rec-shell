import { useState, useEffect, useMemo } from 'react';
import { DatosGraficos, MetadatosTrivia, TransaccionPuntos } from '../dtos/dashboard';
import { FiltrosTransaccionesDTO } from '../services/gamificacion.service';
import { service } from '../services/gamificacion.service';

// DATOS MOCK
const MOCK_TRANSACCIONES: TransaccionPuntos[] = [
  {
    cantidad: 10,
    creado_en: "2025-10-28 21:38:07.5566",
    usuario_id: 1,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 7 preguntas",
    metadatos: { precision: 129, mejor_racha: 3, preguntas_respondidas: 7 }
  },
  {
    cantidad: 4,
    creado_en: "2025-10-28 22:13:42.933039",
    usuario_id: 1,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Historia y Sociedad",
    metadatos: { emoji: "📜", materia: "Historia y Sociedad" }
  },
  {
    cantidad: 15,
    creado_en: "2025-10-29 10:20:15.123",
    usuario_id: 1,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 10 preguntas",
    metadatos: { precision: 180, mejor_racha: 5, preguntas_respondidas: 10 }
  },
  {
    cantidad: 8,
    creado_en: "2025-10-29 14:30:22.456",
    usuario_id: 2,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Ciencias",
    metadatos: { emoji: "🔬", materia: "Ciencias" }
  },
  {
    cantidad: 12,
    creado_en: "2025-10-30 09:15:33.789",
    usuario_id: 2,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 8 preguntas",
    metadatos: { precision: 150, mejor_racha: 4, preguntas_respondidas: 8 }
  },
  {
    cantidad: 6,
    creado_en: "2025-10-30 16:45:11.234",
    usuario_id: 3,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Arte",
    metadatos: { emoji: "🎨", materia: "Arte" }
  },
  {
    cantidad: 20,
    creado_en: "2025-10-31 11:22:44.567",
    usuario_id: 3,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 15 preguntas",
    metadatos: { precision: 200, mejor_racha: 7, preguntas_respondidas: 15 }
  },
  {
    cantidad: 5,
    creado_en: "2025-10-31 18:30:55.891",
    usuario_id: 1,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Deportes",
    metadatos: { emoji: "⚽", materia: "Deportes" }
  },
  {
    cantidad: 18,
    creado_en: "2025-11-01 08:10:20.345",
    usuario_id: 2,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 12 preguntas",
    metadatos: { precision: 195, mejor_racha: 6, preguntas_respondidas: 12 }
  },
  {
    cantidad: 7,
    creado_en: "2025-11-01 20:50:30.678",
    usuario_id: 3,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Geografía",
    metadatos: { emoji: "🌍", materia: "Geografía" }
  },
  {
    cantidad: 3,
    creado_en: "2025-11-01 13:25:15.234",
    usuario_id: 4,
    tipo_origen: "RULETA",
    descripcion: "Ruleta del Saber - Música",
    metadatos: { emoji: "🎵", materia: "Música" }
  },
  {
    cantidad: 14,
    creado_en: "2025-11-02 15:40:50.567",
    usuario_id: 4,
    tipo_origen: "TRIVIA",
    descripcion: "Puntos obtenidos en Trivia Relámpago - 9 preguntas",
    metadatos: { precision: 165, mejor_racha: 5, preguntas_respondidas: 9 }
  }
];

interface UseTransaccionesPuntosOptions {
  useMockData?: boolean;
  filtros?: FiltrosTransaccionesDTO;
  autoLoad?: boolean;
}

interface UseTransaccionesPuntosReturn extends DatosGraficos {
  transacciones: TransaccionPuntos[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTransaccionesPuntos = (
  options: UseTransaccionesPuntosOptions = {}
): UseTransaccionesPuntosReturn => {
  
  const { 
    useMockData = false, 
    filtros, 
    autoLoad = true 
  } = options;

  const [transacciones, setTransacciones] = useState<TransaccionPuntos[]>(
    useMockData ? MOCK_TRANSACCIONES : []
  );
  const [loading, setLoading] = useState(!useMockData && autoLoad);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos desde la API
  const fetchTransacciones = async () => {
    if (useMockData) {
      setTransacciones(MOCK_TRANSACCIONES);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: TransaccionPuntos[];

      if (filtros) {
        data = await service.getTransaccionesFiltradas(filtros);
      } else {
        data = await service.getAllTransacciones();
      }

      setTransacciones(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar transacciones';
      setError(errorMessage);
      console.error('Error al cargar transacciones:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (autoLoad) {
      fetchTransacciones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMockData, JSON.stringify(filtros), autoLoad]);

  // ====================================
  // CÁLCULOS DE DATOS (tu lógica original)
  // ====================================

  // 1. Distribución por tipo de origen
  const datosPorTipo = useMemo(() => {
    const agrupado = transacciones.reduce((acc, t) => {
      acc[t.tipo_origen] = (acc[t.tipo_origen] || 0) + t.cantidad;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(agrupado).map(([name, value]) => ({ name, value }));
  }, [transacciones]);

  // 2. Evolución temporal
  const evolucionTemporal = useMemo(() => {
    const sorted = [...transacciones].sort((a, b) => 
      new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime()
    );
    
    let acumulado = 0;
    return sorted.map(t => {
      acumulado += t.cantidad;
      const fecha = new Date(t.creado_en);
      return {
        fecha: `${fecha.getDate()}/${fecha.getMonth() + 1}`,
        puntos: acumulado,
        hora: `${fecha.getHours()}:${fecha.getMinutes().toString().padStart(2, '0')}`
      };
    });
  }, [transacciones]);

  // 3. Puntos por período del día
  const puntosPorPeriodo = useMemo(() => {
    const porPeriodo = transacciones.reduce((acc, t) => {
      const hora = new Date(t.creado_en).getHours();
      const periodo = hora < 12 ? 'Mañana' : hora < 18 ? 'Tarde' : 'Noche';
      acc[periodo] = (acc[periodo] || 0) + t.cantidad;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(porPeriodo).map(([periodo, puntos]) => ({ periodo, puntos }));
  }, [transacciones]);

  // 4. Ranking de usuarios
  const rankingUsuarios = useMemo(() => {
    const porUsuario = transacciones.reduce((acc, t) => {
      acc[t.usuario_id] = (acc[t.usuario_id] || 0) + t.cantidad;
      return acc;
    }, {} as Record<number, number>);
    
    return Object.entries(porUsuario)
      .map(([usuario, puntos]) => ({ usuario: `Usuario ${usuario}`, puntos }))
      .sort((a, b) => b.puntos - a.puntos);
  }, [transacciones]);

  // 5. Análisis TRIVIA: precisión vs puntos
  const triviaPrecision = useMemo(() => {
    return transacciones
      .filter(t => t.tipo_origen === 'TRIVIA' && 'precision' in t.metadatos)
      .map(t => {
        const meta = t.metadatos as MetadatosTrivia;
        return {
          precision: meta.precision,
          puntos: t.cantidad,
          racha: meta.mejor_racha || 0
        };
      });
  }, [transacciones]);

  // 6. Frecuencia de transacciones
  const frecuenciaTipo = useMemo(() => {
    const conteo = transacciones.reduce((acc, t) => {
      acc[t.tipo_origen] = (acc[t.tipo_origen] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(conteo).map(([tipo, cantidad]) => ({ tipo, cantidad }));
  }, [transacciones]);

  // 7. Distribución de cantidad de puntos (histograma)
  const distribucionPuntos = useMemo(() => {
    const rangos: Record<string, number> = { 
      '0-5': 0, 
      '6-10': 0, 
      '11-15': 0, 
      '16-20': 0, 
      '20+': 0 
    };
    
    transacciones.forEach(t => {
      if (t.cantidad <= 5) rangos['0-5']++;
      else if (t.cantidad <= 10) rangos['6-10']++;
      else if (t.cantidad <= 15) rangos['11-15']++;
      else if (t.cantidad <= 20) rangos['16-20']++;
      else rangos['20+']++;
    });
    
    return Object.entries(rangos).map(([rango, frecuencia]) => ({ rango, frecuencia }));
  }, [transacciones]);

  // Estadísticas de resumen
  const estadisticasResumen = useMemo(() => {
    const totalPuntos = transacciones.reduce((sum, t) => sum + t.cantidad, 0);
    const totalTransacciones = transacciones.length;
    const usuariosActivos = new Set(transacciones.map(t => t.usuario_id)).size;
    const promedioPorTransaccion = totalTransacciones > 0 
      ? totalPuntos / totalTransacciones 
      : 0;

    return {
      totalPuntos,
      totalTransacciones,
      usuariosActivos,
      promedioPorTransaccion
    };
  }, [transacciones]);

  return {
    // Datos procesados
    datosPorTipo,
    evolucionTemporal,
    puntosPorPeriodo,
    rankingUsuarios,
    triviaPrecision,
    frecuenciaTipo,
    distribucionPuntos,
    estadisticasResumen,
    // Datos adicionales
    transacciones,
    loading,
    error,
    refetch: fetchTransacciones
  };
};