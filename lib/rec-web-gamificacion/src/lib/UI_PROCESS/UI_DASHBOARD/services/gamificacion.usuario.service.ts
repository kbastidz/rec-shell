import { InvokeApi } from '@rec-shell/rec-web-shared';

const API_URL = `/gamificacion/dashboard-usuario`;

// ==================== INTERFACES ====================
/*export interface TransaccionPunto {
  id: number;
  usuario_id: number;
  cantidad: number;
  balanceDespues: number;
  tipo_transaccion: 'GANAR' | 'GASTAR';
  tipo_origen: string;
  id_origen: number;
  id_tipo_punto: number;
  descripcion: string;
  metadatos: Record<string, any>;
  creado_en: string;
  expira_en: string | null;
}*/

export interface TransaccionPunto {
  // Propiedades en camelCase (del backend)
  id: number;
  usuarioId: number;
  cantidad: number;
  balanceDespues: number;
  tipoTransaccion: 'GANAR' | 'GASTAR';
  tipoOrigen: string;
  idOrigen: number;
  idTipoPunto: number;
  descripcion: string;
  metadatos: {
    emoji?: string;
    materia?: string;
    actividad?: string;
    fecha_giro?: string;
    [key: string]: any;
  };
  creadoEn: string;
  expiraEn: string | null;
  
  // Propiedades en snake_case (legacy/compatibilidad)
  usuario_id: number;
  tipo_transaccion: 'GANAR' | 'GASTAR';
  tipo_origen: string;
  id_origen: number;
  id_tipo_punto: number;
  creado_en: string;
  expira_en: string | null;
}

export interface TransaccionesRecientesDTO {
  transacciones: TransaccionPunto[];
}

export interface ResumenBalanceUsuarioDTO {
  balance_actual: number;
  total_ganado: number;
  total_gastado: number;
  puntos_por_expirar: number;
}

export interface EstadisticasActividadUsuarioDTO {
  dias_activos: number;
  racha_actual: number;
  mejor_racha: number;
  total_transacciones: number;
  actividades_por_origen: Array<{
    tipo_origen: string;
    cantidad: number;
    puntos_totales: number;
  }>;
}

export interface ActividadDiariaDTO {
  fecha: string;
  transacciones: number;
  puntos_ganados: number;
  puntos_gastados: number;
}

export interface DashboardUsuarioCompletoDTO {
  resumen_balance: ResumenBalanceUsuarioDTO;
  estadisticas_actividad: EstadisticasActividadUsuarioDTO;
  actividad_ultimos_dias: ActividadDiariaDTO[];
  transacciones_recientes: TransaccionesRecientesDTO;
}

// ==================== SERVICE CORREGIDO ====================
export class ConexionService extends InvokeApi {

  async getTransaccionesUsuario(usuarioId: number): Promise<TransaccionesRecientesDTO> {
    const response = await this.get<TransaccionesRecientesDTO>(
      `${API_URL}/${usuarioId}/transacciones`
    );
    return response;
  }

  async getTransaccionesRecientes(
    usuarioId: number, 
    limite = 50
  ): Promise<TransaccionesRecientesDTO> {
    const response = await this.get<TransaccionesRecientesDTO>(
      `${API_URL}/${usuarioId}/transacciones/recientes?limite=${limite}`
    );
    return response;
  }

  async getResumenBalance(usuarioId: number): Promise<ResumenBalanceUsuarioDTO> {
    const response = await this.get<ResumenBalanceUsuarioDTO>(
      `${API_URL}/${usuarioId}/balance`
    );
    return response;
  }

  async getEstadisticasActividad(usuarioId: number): Promise<EstadisticasActividadUsuarioDTO> {
    const response = await this.get<EstadisticasActividadUsuarioDTO>(
      `${API_URL}/${usuarioId}/estadisticas`
    );
    return response;
  }

  async getActividadDiaria(
    usuarioId: number, 
    dias = 7
  ): Promise<ActividadDiariaDTO[]> {
    const response = await this.get<ActividadDiariaDTO[]>(
      `${API_URL}/${usuarioId}/actividad-diaria?dias=${dias}`
    );
    return response;
  }

  async getDashboardCompleto(usuarioId: number): Promise<DashboardUsuarioCompletoDTO> {
    const response = await this.get<DashboardUsuarioCompletoDTO>(
      `${API_URL}/${usuarioId}/completo`
    );
    return response;
  }

  async getTransaccionesPorTipo(
    usuarioId: number, 
    tipo: 'GANAR' | 'GASTAR'
  ): Promise<TransaccionesRecientesDTO> {
    const response = await this.get<TransaccionesRecientesDTO>(
      `${API_URL}/${usuarioId}/transacciones/tipo/${tipo}`
    );
    return response;
  }

  async getTransaccionesPorOrigen(
    usuarioId: number, 
    origen: string
  ): Promise<TransaccionesRecientesDTO> {
    const response = await this.get<TransaccionesRecientesDTO>(
      `${API_URL}/${usuarioId}/transacciones/origen/${origen}`
    );
    return response;
  }

  async getTransaccionesPorRango(
    usuarioId: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<TransaccionesRecientesDTO> {
    const response = await this.get<TransaccionesRecientesDTO>(
      `${API_URL}/${usuarioId}/transacciones/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
    return response;
  }
}

export const service = new ConexionService();