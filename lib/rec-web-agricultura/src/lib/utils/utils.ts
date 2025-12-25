import { EstadoActividad } from "../enums/Enums";
import { Cultivo, AnalisisImagen, ParametroMonitoreo, AlertaMonitoreo, ResultadoDiagnostico, DeficienciaNutriente, PlanTratamiento } from "../types/model";


// Para crear nuevos registros (sin IDs y campos auto-generados)
export type CultivoCreate = Omit<Cultivo, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'analisisImagenes' | 'parametrosMonitoreo' | 'alertasMonitoreo' | 'cultivoMedidasPreventivas' | 'reportesGenerados'> & {
  usuarioId: string;
};

export type AnalisisImagenCreate = Omit<AnalisisImagen, 'id' | 'fechaAnalisis' | 'resultadosDiagnostico'> & {
  cultivoId: string;
  usuarioId: string;
};

export type ParametroMonitoreoCreate = Omit<ParametroMonitoreo, 'id' | 'cultivo'> & {
  cultivoId: string;
};

export type AlertaMonitoreoCreate = Omit<AlertaMonitoreo, 'id' | 'cultivo' | 'usuario' | 'fechaCreacion'> & {
  cultivoId: string;
  usuarioId: string;
};

// Para actualizaciones (todos los campos opcionales excepto ID)
export type CultivoUpdate = Partial<Omit<Cultivo, 'id' | 'usuario' | 'fechaCreacion'>> & {
  id: string;
};

export type AnalisisImagenUpdate = Partial<Omit<AnalisisImagen, 'id' | 'cultivo' | 'usuario'>> & {
  id: string;
};

// Para respuestas de API que pueden incluir relaciones populadas o no
export type CultivoWithRelations = Cultivo & {
  analisisImagenes?: AnalisisImagen[];
  parametrosMonitoreo?: ParametroMonitoreo[];
  alertasMonitoreo?: AlertaMonitoreo[];
};

export type AnalisisImagenWithResults = AnalisisImagen & {
  resultadosDiagnostico?: (ResultadoDiagnostico & {
    deficienciaNutriente?: DeficienciaNutriente;
    planesTratamiento?: PlanTratamiento[];
  })[];
};

export const toLocalDateString = (date: Date | null): string | undefined => {
  return date ? date.toISOString().split('T')[0] : undefined;
};

export const fromLocalDateString = (dateString: string | undefined): Date | null => {
  return dateString ? new Date(dateString) : null;
};

export function ST_GET_USER_ID(): string {
  const userStr = window.sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr).id : ''; 
}



export function GET_ERROR(error: unknown, defaultMessage = "Error al cargar los registros"): string {
  return error instanceof Error ? error.message : defaultMessage;
}

export const estadoColors: Record<EstadoActividad, string> = {
  [EstadoActividad.PENDIENTE]: 'blue',
  [EstadoActividad.OMITIDA]: 'yellow',
  [EstadoActividad.EJECUTADA]: 'green'
};

 export const tiposMedida = [
    { value: 'PREVENTIVA', label: 'Preventiva' },
    { value: 'CORRECTIVA', label: 'Correctiva' },
    { value: 'CULTURAL', label: 'Cultural' },
    { value: 'QUIMICA', label: 'Química' },
    { value: 'BIOLOGICA', label: 'Biológica' }
  ];

export const temporadas = [
    { value: 'PRIMAVERA', label: 'Primavera' },
    { value: 'VERANO', label: 'Verano' },
    { value: 'OTOÑO', label: 'Otoño' },
    { value: 'INVIERNO', label: 'Invierno' },
    { value: 'TODO_AÑO', label: 'Todo el año' }
  ];

  export const getDeficienciaColor = (deficiencia: string): string => {
    const colors: Record<string, string> = {
      Nitrógeno: 'yellow',
      Nitrogeno: 'yellow',
      Fósforo: 'orange',
      Fosforo: 'orange',
      Potasio: 'red',
    };
    return colors[deficiencia] || 'gray';
  };

  export const getConfianzaColor = (confianza: number): string => {
    if (confianza >= 80) return 'teal';
    if (confianza >= 60) return 'yellow';
    return 'red';
  };

  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  
/*
const menuItems = [
  { 
    icon: '🌱', 
    label: 'Cultivos', 
    value: 'cultivos',
    color: 'green',
    description: 'Gestiona los cultivos del sistema',
    component: CultivosAdmin
  },
  { 
    icon: '💧', 
    label: 'Nutrientes', 
    value: 'nutrientes',
    color: 'blue',
    description: 'Administra nutrientes y fertilizantes',
    component: NutrienteAdmin
  },
  { 
    icon: '💊', 
    label: 'Tratamientos', 
    value: 'tratamientos',
    color: 'violet',
    description: 'Configura tratamientos y aplicaciones',
    component: TratamientosAdmin
  },
  { 
    icon: '📏', 
    label: 'Medidas', 
    value: 'medidas',
    color: 'cyan',
    description: 'Define unidades de medida',
    component: MedidaAdmin
  },
  { 
    icon: '🗓️', 
    label: 'Plan Tratamiento', 
    value: 'generacion',
    color: 'yellow',
    description: 'Generación de plan de tratamiento',
    component: ListarAdmin
  },
  { 
    icon: '📋', 
    label: 'Seguimientos', 
    value: 'seguimientos',
    color: 'orange',
    description: 'Rastrea el progreso de cultivos',
    component: PlanTratamientoListAdmin  //SeguimientosAdmin
  },
  { 
    icon: '📊', 
    label: 'Monitoreo', 
    value: 'monitoreo',
    color: 'teal',
    description: 'Visualiza datos y estadísticas',
    component: MonitoreoAdmin
  },
  { 
    icon: '🧪', 
    label: 'Análisis', 
    value: 'analisis',
    color: 'purple',
    description: 'Analiza el estado de las hojas de cacao (detección de enfermedades)',
    component: Analisis
  },
  { 
    icon: '🔍', 
    label: 'Consultas de Análisis', 
    value: 'listar',
    color: 'blue',
    description: 'Consulta los resultados de los análisis realizados',
    component: Listar
  }
];
*/