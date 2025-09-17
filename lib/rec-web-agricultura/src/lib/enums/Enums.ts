export enum EstadoCultivo {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  COSECHADO = 'COSECHADO'
}

export enum EstadoProcesamiento {
  PENDIENTE = 'PENDIENTE',
  PROCESANDO = 'PROCESANDO',
  COMPLETADO = 'COMPLETADO',
  ERROR = 'ERROR'
}

export enum Severidad {
  LEVE = 'LEVE',
  MODERADA = 'MODERADA',
  SEVERA = 'SEVERA'
}

export enum Prioridad {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

export enum EstadoPlan {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export enum EstadoActividad {
  PENDIENTE = 'PENDIENTE',
  EJECUTADA = 'EJECUTADA',
  OMITIDA = 'OMITIDA'
}

export enum SeveridadAlerta {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

export enum EstadoAlerta {
  ACTIVA = 'ACTIVA',
  VISTA = 'VISTA',
  RESUELTA = 'RESUELTA',
  IGNORADA = 'IGNORADA'
}

export enum EstadoImplementacion {
  PLANIFICADA = 'PLANIFICADA',
  IMPLEMENTADA = 'IMPLEMENTADA',
  DESCARTADA = 'DESCARTADA'
}

export enum EstadoReporte {
  GENERANDO = 'GENERANDO',
  COMPLETADO = 'COMPLETADO',
  ERROR = 'ERROR'
}

export enum Operacion {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}
