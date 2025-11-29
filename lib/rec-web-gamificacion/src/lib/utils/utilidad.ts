import { TipoRecompensa } from "../types/model";

export const getBadgeColor = (item: TipoRecompensa) => {
    if (item.esFisico && item.esDigital) return 'blue';
    if (item.esFisico) return 'green';
    if (item.esDigital) return 'orange';
    return 'gray';
  };

export const getBadgeText = (item: TipoRecompensa) => {
    if (item.esFisico && item.esDigital) return 'Física & Digital';
    if (item.esFisico) return 'Física';
    if (item.esDigital) return 'Digital';
    return 'Sin tipo';
};

export function GET_ERROR(error: unknown, defaultMessage = "Error al cargar los registros"): string {
  return error instanceof Error ? error.message : defaultMessage;
}

export function ST_GET_USER_ID(): string {
  const userStr = window.sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr).id : ''; 
}

export const rarezaOptions = [
  { value: 'COMUN', label: 'Común' },
  { value: 'POCO_COMUN', label: 'Poco Común' },
  { value: 'RARO', label: 'Raro' },
  { value: 'EPICO', label: 'Épico' },
  { value: 'LEGENDARIO', label: 'Legendario' }
];

export const rarezaColors: Record<string, string> = {
  COMUN: 'gray',
  POCO_COMUN: 'green',
  RARO: 'blue',
  EPICO: 'violet',
  LEGENDARIO: 'orange'
};

export const dificultadColors = {
  FACIL: 'green',
  MEDIO: 'yellow',
  DIFICIL: 'orange',
  EXTREMO: 'red',
  EXPERTO: 'blue'
};

export const tipoDesafioOptions = [
  { value: 'DIARIO', label: 'Diario' },
  { value: 'SEMANAL', label: 'Semanal' },
  { value: 'ESPECIAL', label: 'Especial' }
];

export const TIPOS_TABLA = [
  { value: 'PUNTUACION', label: 'Puntuación' },
  { value: 'TIEMPO', label: 'Tiempo' },
  { value: 'COMPLETADOS', label: 'Completados' },
  { value: 'RACHA', label: 'Racha' }
];

/*

const menuItems = [
  { 
    icon: '📁', 
    label: 'Categorías', 
    value: 'categorias',
    color: 'blue',
    description: 'Gestiona las categorías del sistema',
    component: CategoriaAdmin
  },
  { 
    icon: '🎯', 
    label: 'Tipos de Desafío', 
    value: 'tipos-desafio',
    color: 'violet',
    description: 'Configura los tipos de desafíos',
    component: TiposDesafioAdmin
  },
  { 
    icon: '🎁', 
    label: 'Tipos de Recompensa', 
    value: 'tipos-recompensa',
    color: 'pink',
    description: 'Define tipos de recompensas',
    component: TipoRecompensaAdmin
  },
  { 
    icon: '🏆', 
    label: 'Logros', 
    value: 'logros',
    color: 'yellow',
    description: 'Administra logros y medallas',
    component: LogrosAdmin
  },
  { 
    icon: '⚔️', 
    label: 'Desafíos', 
    value: 'desafios',
    color: 'red',
    description: 'Gestiona desafíos activos',
    component: DesafiosAdmin
  },
  { 
    icon: '📦', 
    label: 'Recompensas', 
    value: 'recompensas',
    color: 'green',
    description: 'Administra recompensas disponibles',
    component: RecompensasAdmin
  },
  { 
    icon: '⚙️', 
    label: 'Reglas por Puntos', 
    value: 'regla-puntos',
    color: 'orange',
    description: 'Gestiona las reglas de la asignación de puntos',
    component: ReglaPuntosAdmin //TablaLideresAdmin
  },
  { 
    icon: '💯', 
    label: 'Conciliación de actividades', 
    value: 'concialiacion',
    color: 'red',
    description: 'Administración de puntaje de usuarios',
    component: TransaccionPuntosAdmin
  },  
  { 
    icon: '🧩', 
    label: 'Centro de juegos', 
    value: 'juegos',
    color: 'blue',
    description: 'Centro de Juegos educativos',
    component: Juegos
  },
  
];
*/