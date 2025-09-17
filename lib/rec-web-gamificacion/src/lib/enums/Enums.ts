export enum TipoTransaccion {
  GANAR = 'GANAR',
  GASTAR = 'GASTAR',
  BONUS = 'BONUS',
  PENALIZACION = 'PENALIZACION',
  TRANSFERIR = 'TRANSFERIR'
}

export enum Rareza {
  COMUN = 'COMUN',
  POCO_COMUN = 'POCO_COMUN',
  RARO = 'RARO',
  EPICO = 'EPICO',
  LEGENDARIO = 'LEGENDARIO'
}

export enum Dificultad {
  FACIL = 'FACIL',
  MEDIO = 'MEDIO',
  DIFICIL = 'DIFICIL',
  EXPERTO = 'EXPERTO'
}

export enum EstadoParticipacion {
  ACTIVO = 'ACTIVO',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
  ABANDONADO = 'ABANDONADO'
}

export enum PeriodoTiempo {
  DIARIO = 'DIARIO',
  SEMANAL = 'SEMANAL',
  MENSUAL = 'MENSUAL',
  ANUAL = 'ANUAL',
  HISTORICO = 'HISTORICO'
}