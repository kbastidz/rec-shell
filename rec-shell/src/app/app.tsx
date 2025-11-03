import { AdminTemplate } from '@rec-shell/rec-web-layout';
import { MenuUser, RoleManagement, UserManagement } from '@rec-shell/rec-web-usuario';
import { AuthContainer, useAuth } from '@rec-shell/rec-web-auth';
import { SimpleSessionExpiryModal } from '@rec-shell/rec-web-shared';
import { useCallback, useMemo } from 'react';
import {  MenuPagueM1 } from '@rec-shell/rec-web-agricultura';
import { MenuPagueM2 } from '@rec-shell/rec-web-gamificacion';
import { GeneradorAdmin } from '@rec-shell/rec-web-educacion';
const ROLES = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR'
} as const;
type UserRole = typeof ROLES[keyof typeof ROLES];

const rolePermissions = {
  [ROLES.ADMIN]: {
    AgriculturaComponent: GeneradorAdmin,//MenuPagueM1,
    GamificacionComponent: MenuPagueM2,
    AdminUserComponent: MenuUser
  },
  [ROLES.MODERATOR]: {
    AgriculturaComponent: MenuPagueM1,
    GamificacionComponent: MenuPagueM2,
    AdminUserComponent: MenuUser
  }
};

export function App() {
  const authState = useAuth();
  const { isAuthenticated, user, loading, error, signOut , refreshToken} = authState;
  
   const handleRefreshToken = useCallback(async () => {
    try {
      return await refreshToken();
    } catch (error) {
      console.error('Error al refrescar token desde App:', error);
      throw error;
    }
  }, [refreshToken]);


  const listMenu = useMemo(() => { 
    const userRole = user?.roles[0].toUpperCase() as UserRole;
    console.log(`Aplicando permisos para rol: ${userRole}`);
    return rolePermissions[userRole];
  }, [user?.roles[0]]);
  

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleAutoLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {    
    return <AuthContainer authState={authState} />;
  }

  const userInfo = {
    name: user?.username,
    email: user?.email,
    initials: user?.username.charAt(0).toUpperCase() 
  };

  return (
    <>
      <AdminTemplate 
        AdminUserComponent={listMenu.AdminUserComponent}
        AgriculturaComponent={listMenu.AgriculturaComponent}
        GamificacionComponent={listMenu.GamificacionComponent}
        
        onSignOut={signOut}
        userInfo={userInfo}
      />
      
      
    </>
  );
}

export default App;
/*
<SimpleSessionExpiryModal
        onRefreshToken={handleRefreshToken}
        onLogout={handleLogout}
        onAutoLogout={handleAutoLogout}
        criticalThreshold={60} // 15 segundos antes
      />
       */