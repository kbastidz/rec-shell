// ================== EstadisticasGeneralesDTO ==================
export interface EstadisticasGeneralesDTO {
  totalUsuarios: number;
  totalTransacciones: number;
  totalLogros: number;
  totalDesafios: number;
  puntosDistribuidosTotal: number;
  tasaParticipacion: number;
  topUsuarios: TopUsuarioDTO[];
}

// ================== ResumenUsuarioDTO ==================
export interface ResumenUsuarioDTO {
  usuarioId: number;
  nombreUsuario: string;
  puntosPorTipo: PuntosPorTipoDTO[];
  logrosDesbloqueados: number;
  desafiosCompletados: number;
  ultimaActividad: string; 
  posicionRanking: number;
}

// ================== DistribucionPuntosDTO ==================
export interface DistribucionPuntosDTO {
  distribucionPorTipo: PuntosPorTipoDTO[];
  distribucionPorFecha: PuntosPorFechaDTO[];
  totalPuntosGanados: number;
  totalPuntosGastados: number;
  balanceTotal: number;
}

// ================== EstadisticasLogrosDTO ==================
export interface EstadisticasLogrosDTO {
  totalLogros: number;
  logrosActivos: number;
  logrosPorRareza: LogroPorRarezaDTO[];
  logrosPopulares: LogroPopularDTO[];
  tasaDesbloqueoPromedio: number;
}

// ================== DesafiosActivosDTO ==================
export interface DesafiosActivosDTO {
  desafiosDiarios: DesafioDetalleDTO[];
  desafiosSemanales: DesafioDetalleDTO[];
  desafiosEspeciales: DesafioDetalleDTO[];
  totalParticipantes: number;
}

// ================== TransaccionesRecientesDTO ==================
export interface TransaccionesRecientesDTO {
  transacciones: TransaccionDetalleDTO[];
  totalTransacciones: number;
}

// ================== ActividadUsuarioDTO ==================
export interface ActividadUsuarioDTO {
  usuarioId: number;
  actividadPorDia: ActividadDiariaDTO[];
  diasActivos: number;
  rachaActual: number;
  mejorRacha: number;
}

export interface TopUsuarioDTO {
  usuarioId: number;
  nombreUsuario: string;
  totalPuntos: number;
  posicion: number;
}

export interface PuntosPorTipoDTO {
  tipoId: number;
  tipoNombre: string;
  nombreMostrar: string;
  cantidad: number;
  porcentaje: number; 
}

export interface PuntosPorFechaDTO {
  fecha: string; 
  puntosGanados: number;
  puntosGastados: number;
  balance: number;
}

export interface LogroPorRarezaDTO {
  rareza: string;
  cantidad: number;
  porcentaje: number;
}

export interface LogroPopularDTO {
  logroId: number;
  nombre: string;
  descripcion: string;
  rareza: string;
  vecesDesbloqueado: number;
  tasaDesbloqueo: number;
}

export interface DesafioDetalleDTO {
  desafioId: number;
  titulo: string;
  descripcion: string;
  dificultad: string;
  participantesActuales: number;
  maxParticipantes: number;
  fechaInicio: string; 
  fechaFin: string;    
  tipoDesafio: string;
}

export interface TransaccionDetalleDTO {
  transaccionId: number;
  usuarioId: number;
  nombreUsuario: string;
  tipoTransaccion: string;
  cantidad: number;
  tipoPunto: string;
  descripcion: string;
  fecha: string; 
}

export interface ActividadDiariaDTO {
  fecha: string; 
  transacciones: number;
  puntosGanados: number;
  logrosDesbloqueados: number;
  activo: boolean;
}
