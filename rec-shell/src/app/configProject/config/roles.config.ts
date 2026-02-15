import { RoleConfig } from "../type/permissions.types";

// Solo ADMIN tiene acceso al panel de administración hasAdminPanel: true,
export const ROLES_CONFIG: Record<string, RoleConfig> = {
  // Roles globales
  ADMIN: {
    name: 'Administrador',
    hasAdminPanel: true,
    //allowedProjects: ['agricultura', 'gamificacion', 'educacion'],
    allowedProjects: [ 'educacion'],
    isGlobalRole: true
  },
  USER: {
    name: 'UsuarioComun',
    hasAdminPanel: false,
    allowedProjects: ['agricultura', 'gamificacion', 'educacion'],
    isGlobalRole: true
  },
  
  // Roles específicos de Agricultura
  EST: {
    name: 'Estudiante',
    hasAdminPanel: false,
    allowedProjects: ['gamificacion', 'educacion'],
    isGlobalRole: false
  },
  
  // Roles específicos de Gamificación
  JUGADOR: {
    name: 'Jugador',
    hasAdminPanel: false,
    allowedProjects: ['gamificacion'],
    isGlobalRole: false
  },
  
  // Roles específicos de Educación
  PROFESOR: {
    name: 'Profesor',
    hasAdminPanel: false,
    allowedProjects: ['educacion'],
    isGlobalRole: false
  }
};