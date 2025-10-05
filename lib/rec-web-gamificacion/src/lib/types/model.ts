import { Dificultad, EstadoParticipacion, PeriodoTiempo, Rareza, TipoTransaccion } from "../enums/Enums";
import { User } from '@rec-shell/rec-web-usuario';
export interface PerfilUsuario {
  id: string;
  usuario: User;
  urlAvatar?: string;
  biografia?: string;
  ubicacion?: string;
  zonaHoraria: string;
  idioma: string;
  preferenciaTema: string;
  nivelPrivacidad: string;
  preferenciasNotificaciones: Record<string, any>;
  enlacesSociales: Record<string, any>;
  camposPersonalizados: Record<string, any>;
  creadoEn: string; 
  actualizadoEn?: string; 
}

export interface RegistroActividadUsuario {
  id: string;
  usuario: User;
  tipoActividad: string;
  descripcionActividad?: string;
  metadatos: Record<string, any>;
  direccionIp?: string;
  agenteUsuario?: string;
  creadoEn: string; 
}

export interface TipoPunto {
  id: string;
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  urlIcono?: string;
  color?: string;
  estaActivo: boolean;
  creadoEn: string; 
  balancesUsuario: BalancePuntosUsuario[];
}

export interface BalancePuntosUsuario {
  id: string;
  usuario: User;
  tipoPunto: TipoPunto;
  balanceActual: number;
  totalGanado: number;
  totalGastado: number;
  actualizadoEn: string; 
}

export interface TransaccionPuntos {
  id: string;
  usuario: User;
  tipoPunto: TipoPunto;
  tipoTransaccion: TipoTransaccion;
  cantidad: number;
  balanceDespues: number;
  tipoOrigen?: string;
  idOrigen?: string;
  descripcion?: string;
  metadatos: Record<string, any>;
  creadoEn: string; 
  expiraEn?: string; 
}

export interface ReglaPuntos {
  id: string;
  nombre: string;
  descripcion?: string;
  tipoPunto: TipoPunto;
  eventoDisparador: string;
  puntosOtorgados: number;
  condiciones: Record<string, any>;
  estaActivo: boolean;
  prioridad: number;
  creadoEn: string; 
  actualizadoEn?: string; 
}

export interface CategoriaLogro {
  id: string;
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  urlIcono?: string;
  color?: string;
  ordenClasificacion: number;
  estaActivo: boolean;
  creadoEn: string; 
  logros: Logro[];
}

export interface Logro {
  id: string;
  categoria?: CategoriaLogro;
  nombre: string;
  descripcion: string;
  urlImagenInsignia?: string;
  rareza: Rareza;
  criterioDesbloqueo: string; //Record<string, any>;
  recompensaPuntos: number;
  esSecreto: boolean;
  estaActivo: boolean;
  mensajeDesbloqueo?: string;
  creadoEn: string; 
  actualizadoEn?: string; 
  logrosUsuario: LogroUsuario[];
  progresosLogro: ProgresoLogro[];
}

export interface LogroUsuario {
  id: string;
  usuario: User;
  logro: Logro;
  desbloqueadoEn: string; 
  datosProgreso: Record<string, any>;
  estaExhibido: boolean;
}

export interface ProgresoLogro {
  id: string;
  usuario: User;
  logro: Logro;
  progresoActual: number;
  progresoObjetivo: number;
  datosProgreso: Record<string, any>;
  actualizadoEn: string; 
}

export interface TipoDesafio {
  id: string;
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  esIndividual: boolean;
  esGrupal: boolean;
  creadoEn: string; 
  desafios: Desafio[];
}

export interface Desafio {
  id: string;
  tipoDesafio?: TipoDesafio;
  titulo: string;
  descripcion: string;
  dificultad: Dificultad;
  categoria?: string;
  fechaInicio?: string; 
  fechaFin?: string; 
  maxParticipantes?: number;
  //criterioCompletado: Record<string, any>;
  //recompensas: Record<string, any>;
  criterioCompletado: string;
  recompensas: string;
  esDiario: boolean;
  esSemanal: boolean;
  esEspecial: boolean;
  estaActivo: boolean;
  creadoPor?: string;
  creadoEn: string; 
  actualizadoEn?: string; 
  participaciones: ParticipacionDesafio[];
}

export interface ParticipacionDesafio {
  id: string;
  desafio: Desafio;
  usuario: User;
  estado: EstadoParticipacion;
  datosProgreso: Record<string, any>;
  porcentajeCompletado: number;
  iniciadoEn: string; 
  completadoEn?: string; 
}


export interface TablaLideres {
  id: string;
  nombre: string;
  descripcion?: string;
  tipoTablaLideres: string;
  criterio: Record<string, any>;
  periodoTiempo?: PeriodoTiempo;
  maxEntradas: number;
  estaActivo: boolean;
  creadoEn: string; 
  actualizadoEn?: string; 
  entradas: EntradaTablaLideres[];
}

export interface EntradaTablaLideres {
  id: string;
  tablaLideres: TablaLideres;
  usuario: User;
  posicion: number;
  puntuacion: number;
  metadatos: Record<string, any>;
  inicioPeriodo?: string; 
  finPeriodo?: string; 
  actualizadoEn: string; 
}


export interface TipoRecompensa {
  id: string;
  nombre: string;
  nombreMostrar: string;
  descripcion?: string;
  esFisico: boolean;
  esDigital: boolean;
  creadoEn: string; 
  recompensas: Recompensa[];
}

export interface Recompensa {
  id: string;
  tipoRecompensa?: TipoRecompensa;
  nombre: string;
  descripcion?: string;
  urlImagen?: string;
  costoPuntos?: number;
  cantidadStock?: number;
  esIlimitado?: boolean;
  estaActivo?: boolean;
  terminosCondiciones?: string;
  validoDesde?: string; 
  validoHasta?: string; 
  creadoEn: string; 
  actualizadoEn: string; 
}

// =============================================
// TIPOS DE UTILIDAD PARA REACT
// =============================================

export interface CrearUsuarioDTO {
  nombreUsuario: string;
  email: string;
  contrasenaHash: string;
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  telefono?: string;
}

export interface ActualizarPerfilUsuarioDTO {
  urlAvatar?: string;
  biografia?: string;
  ubicacion?: string;
  zonaHoraria?: string;
  idioma?: string;
  preferenciaTema?: string;
  nivelPrivacidad?: string;
  preferenciasNotificaciones?: Record<string, any>;
  enlacesSociales?: Record<string, any>;
  camposPersonalizados?: Record<string, any>;
}

export interface CrearDesafioDTO {
  tipoDesafioId?: string;
  titulo: string;
  descripcion: string;
  dificultad: Dificultad;
  categoria?: string;
  fechaInicio?: string;
  fechaFin?: string;
  maxParticipantes?: number;
  criterioCompletado: Record<string, any>;
  recompensas?: Record<string, any>;
  esDiario?: boolean;
  esSemanal?: boolean;
  esEspecial?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface FiltroUsuarios {
  nombreUsuario?: string;
  email?: string;
  estaActivo?: boolean;
  estaVerificado?: boolean;
  fechaCreacionDesde?: string;
  fechaCreacionHasta?: string;
}

export interface FiltroDesafios {
  titulo?: string;
  dificultad?: Dificultad;
  categoria?: string;
  estaActivo?: boolean;
  esDiario?: boolean;
  esSemanal?: boolean;
  esEspecial?: boolean;
}

export interface FiltroLogros {
  nombre?: string;
  categoriaId?: string;
  rareza?: Rareza;
  estaActivo?: boolean;
  esSecreto?: boolean;
}

export interface EstadisticasLogrosDTO {
  totalLogrosActivos: number | null;
  totalLogrosVisibles: number | null;
  logrosObtenidos: number | null;
  logrosExhibidos: number | null;
  porcentajeCompletado: number | null;
}

export const getLogrosPendientes = (dto: EstadisticasLogrosDTO): number | null => {
  if (dto.totalLogrosActivos != null && dto.logrosObtenidos != null) {
    return dto.totalLogrosActivos - dto.logrosObtenidos;
  }
  return null;
};

export const getPorcentajeFormateado = (dto: EstadisticasLogrosDTO): string => {
  if (dto.porcentajeCompletado != null) {
    return `${dto.porcentajeCompletado.toFixed(1)}%`;
  }
  return "0.0%";
};

export interface UnirseDesafioRequest {
  usuarioId: string;
}

export interface ActualizarProgresoRequest {
  datosProgreso: Record<string, any>;
  porcentajeCompletado: number;      
}