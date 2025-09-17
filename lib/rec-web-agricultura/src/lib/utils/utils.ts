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