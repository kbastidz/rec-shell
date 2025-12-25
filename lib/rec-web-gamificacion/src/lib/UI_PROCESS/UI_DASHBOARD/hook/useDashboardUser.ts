import { useState } from 'react';
import { service, TransaccionesRecientesDTO  } from '../services/gamificacion.usuario.service';

// ==================== MOCK DATA ====================
//const mockTransacciones: TransaccionesRecientesDTO  = {};
/*
{
  transacciones: [
    {
      id: 1,
      usuario_id: 1,
      cantidad: 10,
      balanceDespues: 10,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'TRIVIA',
      id_origen: 1,
      id_tipo_punto: 1,
      descripcion: 'Puntos obtenidos en Trivia Relámpago - 7 preguntas',
      metadatos: {
        precision: 129,
        mejor_racha: 3,
        fecha_completado: '2025-10-29T02:37:59.060Z',
        preguntas_respondidas: 7
      },
      creado_en: '2025-10-28T21:38:07.556600',
      expira_en: null
    },
    {
      id: 2,
      usuario_id: 1,
      cantidad: 4,
      balanceDespues: 14,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'RULETA',
      id_origen: 1,
      id_tipo_punto: 1,
      descripcion: 'Ruleta del Saber - Historia y Sociedad',
      metadatos: {
        emoji: '📜',
        materia: 'Historia y Sociedad',
        actividad: '🐦 X/Twitter Hilo: El día que [evento histórico] cambió el mundo',
        fecha_giro: '2025-10-29T03:13:33.436Z'
      },
      creado_en: '2025-10-28T22:13:42.933039',
      expira_en: null
    },
    {
      id: 3,
      usuario_id: 1,
      cantidad: 10,
      balanceDespues: 24,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'BINGO',
      id_origen: 13,
      id_tipo_punto: 3,
      descripcion: 'Completó acción: Escuchar una pieza musical clásica',
      metadatos: {
        accion: 'Escuchar una pieza musical clásica o contemporánea',
        materia: 'ARTES',
        evidencia: 'Completado con éxito',
        archivo_nombre: 'images.jpg'
      },
      creado_en: '2025-10-29T21:41:32.539357',
      expira_en: null
    },
    {
      id: 4,
      usuario_id: 1,
      cantidad: 35,
      balanceDespues: 55,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'MATERIA_COMPLETA',
      id_origen: 1,
      id_tipo_punto: 1,
      descripcion: '¡Completó todas las misiones de Matemáticas!',
      metadatos: {
        materia: 'Matemáticas',
        materia_id: 'math',
        puntos_materia: 35,
        total_misiones: 3,
        progreso_general: 20,
        progreso_materia: 100
      },
      creado_en: '2025-11-01T13:02:24.188100',
      expira_en: null
    },
    {
      id: 5,
      usuario_id: 1,
      cantidad: -5,
      balanceDespues: 50,
      tipo_transaccion: 'GASTAR',
      tipo_origen: 'RECOMPENSA',
      id_origen: 2,
      id_tipo_punto: 1,
      descripcion: 'Canjeó recompensa: Avatar personalizado',
      metadatos: {
        recompensa: 'Avatar personalizado',
        categoria: 'Personalización'
      },
      creado_en: '2025-11-02T10:15:00.000000',
      expira_en: null
    },
    {
      id: 6,
      usuario_id: 1,
      cantidad: 8,
      balanceDespues: 58,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'TRIVIA',
      id_origen: 2,
      id_tipo_punto: 1,
      descripcion: 'Trivia de Ciencias - 5 preguntas correctas',
      metadatos: {
        precision: 100,
        mejor_racha: 5,
        preguntas_respondidas: 5
      },
      creado_en: '2025-11-03T14:20:00.000000',
      expira_en: null
    },
    {
      id: 7,
      usuario_id: 1,
      cantidad: 6,
      balanceDespues: 64,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'RULETA',
      id_origen: 2,
      id_tipo_punto: 1,
      descripcion: 'Ruleta del Saber - Ciencias Naturales',
      metadatos: {
        emoji: '🔬',
        materia: 'Ciencias Naturales',
        actividad: 'Experimento: Fotosíntesis'
      },
      creado_en: '2025-11-03T16:45:00.000000',
      expira_en: null
    },
    {
      id: 8,
      usuario_id: 1,
      cantidad: 12,
      balanceDespues: 76,
      tipo_transaccion: 'GANAR',
      tipo_origen: 'DESAFIO',
      id_origen: 5,
      id_tipo_punto: 1,
      descripcion: 'Completó desafío semanal: 10 actividades',
      metadatos: {
        desafio: 'Actividades semanales',
        completado: true
      },
      creado_en: '2025-11-04T09:00:00.000000',
      expira_en: null
    }
  ]
};
*/
// ==================== CONFIGURACIÓN ====================
const USE_MOCK = false; // ⚠️ Cambiar a false para usar el servicio real

// ==================== HOOK ====================
export const useDashboardUser = () => {
  const [transaccionesRecientes, setTransaccionesRecientes] = 
    useState<TransaccionesRecientesDTO  | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardCompleto = async (usuarioId: number) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // ========== MODO MOCK ==========
        console.log('🔵 Usando datos MOCK para usuario:', usuarioId);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        //setTransaccionesRecientes(mockTransacciones);
                
      } else {
        // ========== MODO REAL ==========
        console.log('🟢 Llamando al servicio REAL para usuario:', usuarioId);
        
        // Llamada al servicio real
        const data = await service.getTransaccionesUsuario(usuarioId);
        setTransaccionesRecientes(data);
        
        console.log('✅ Datos REALES cargados:', data.transacciones.length, 'transacciones');
      }
    } catch (err) {
      console.error('❌ Error al cargar dashboard:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Fallback a mock en caso de error (solo en modo real)
      if (!USE_MOCK) {
        console.warn('⚠️ Error en servicio real, usando datos MOCK como fallback');
        //setTransaccionesRecientes(mockTransacciones);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener solo transacciones recientes (últimas N)
   */
  const fetchTransaccionesRecientes = async (usuarioId: number, limite = 50) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const limitadas = {
          //transacciones: mockTransacciones.transacciones.slice(0, limite)
        };
        //setTransaccionesRecientes(limitadas);
      } else {
        const data = await service.getTransaccionesRecientes(usuarioId, limite);
        setTransaccionesRecientes(data);
      }
    } catch (err) {
      console.error('❌ Error al cargar transacciones recientes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener transacciones filtradas por tipo
   */
  const fetchTransaccionesPorTipo = async (
    usuarioId: number, 
    tipo: 'GANAR' | 'GASTAR'
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        /*const filtradas = {
          transacciones: mockTransacciones.transacciones.filter(
            t => t.tipo_transaccion === tipo
          )
        };
        setTransaccionesRecientes(filtradas);*/
      } else {
        const data = await service.getTransaccionesPorTipo(usuarioId, tipo);
        setTransaccionesRecientes(data);
      }
    } catch (err) {
      console.error('❌ Error al cargar transacciones por tipo:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    transaccionesRecientes,
    loading,
    error,
    
    // Métodos
    fetchDashboardCompleto,
    fetchTransaccionesRecientes,
    fetchTransaccionesPorTipo,
  };
};