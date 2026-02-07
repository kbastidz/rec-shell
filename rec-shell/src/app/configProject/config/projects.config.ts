
import { ProjectConfig } from "../type/permissions.types";
import { DashboardAdminM1, MenuPagueM1 } from '@rec-shell/rec-web-agricultura';
import { DashboardAdminM2, MenuPagueM2 } from '@rec-shell/rec-web-gamificacion';
import { DashboardAdminM3, MenuPagueM3 } from '@rec-shell/rec-web-educacion';

export const PROJECTS: Record<string, ProjectConfig> = {
  agricultura: {
    id: 'agricultura',
    name: 'Agricultura',
    menuComponent: MenuPagueM1,
    dashboardComponent: DashboardAdminM1,
    roles: ['ADMIN', 'USER']
  },
  gamificacion: {
    id: 'gamificacion',
    name: 'Gamificación',
    menuComponent: MenuPagueM2,
    dashboardComponent: DashboardAdminM2,
    roles: ['ADMIN', 'USER', 'EST']
  },
  educacion: {
    id: 'educacion',
    name: 'Educación',
    menuComponent: MenuPagueM3,
    dashboardComponent: DashboardAdminM3,
    roles: ['ADMIN', 'USER', 'EST']
  }
};

// Roles globales del sistema
export const SYSTEM_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  EST: 'EST'
} as const;