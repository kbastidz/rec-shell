import { AdminTemplate } from '@rec-shell/rec-web-layout';
import { MenuUser} from '@rec-shell/rec-web-usuario';
import { AuthContainer, useAuth } from '@rec-shell/rec-web-auth';
import { useCallback, useMemo } from 'react';
import { DashboardAdminM1, MenuPagueM1 } from '@rec-shell/rec-web-agricultura';
import { DashboardAdminM2, MenuPagueM2 } from '@rec-shell/rec-web-gamificacion';
import { DashboardAdminM3, MenuPagueM3 } from '@rec-shell/rec-web-educacion';
/*
const ROLES = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR'
} as const;
type UserRole = typeof ROLES[keyof typeof ROLES];

const rolePermissions = {
  [ROLES.ADMIN]: {
    AgriculturaComponent: MenuPagueM1,
    GamificacionComponent: MenuPagueM2,
    EducacionComponent: MenuPagueM3, 
    AdminUserComponent: MenuUser
  },
  [ROLES.MODERATOR]: {
    AgriculturaComponent: MenuPagueM1,
    GamificacionComponent: MenuPagueM2,
    EducacionComponent: MenuPagueM3,
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
        EducacionComponent={listMenu.EducacionComponent}
        LayoutDashboardComponent={DashboardAdminM2}
        onSignOut={signOut}
        userInfo={userInfo}
      />      
    </>
  );
}

export default App;
*/
/*
<SimpleSessionExpiryModal
        onRefreshToken={handleRefreshToken}
        onLogout={handleLogout}
        onAutoLogout={handleAutoLogout}
        criticalThreshold={60} // 15 segundos antes
      />
       */