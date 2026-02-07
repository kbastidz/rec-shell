import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Leaf,
  GraduationCap
} from 'lucide-react';

// Interfaz para componentes que pueden recibir navegación
interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

// Tipo para componentes que pueden recibir la función de navegación
type NavigableComponent = React.ComponentType<ComponentWithNavigation>;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  component?: NavigableComponent;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: (key: string) => void;
  collapsed?: boolean;
}

interface AdminTemplateProps {
  // Props opcionales para inyectar componentes desde fuera
  AdminUserComponent?: NavigableComponent;
  AgriculturaComponent?: NavigableComponent;
  GamificacionComponent?: NavigableComponent;
  EducacionComponent?: NavigableComponent;
  LayoutDashboardComponent?: NavigableComponent;

  onSignOut?: () => void;
  userInfo?: {
    name?: string;
    email?: string;
    initials?: string;
  };
}

export function AdminTemplate({
  AdminUserComponent,
  AgriculturaComponent,
  GamificacionComponent,
  EducacionComponent,
  LayoutDashboardComponent,

  onSignOut,
  userInfo = {
    name: 'Admin User',
    email: 'admin@hotmail.com',
    initials: 'A'
  }
}: AdminTemplateProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Elementos del menú con sus componentes asociados
  const allMenuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: LayoutDashboardComponent },
    { key: 'users', label: 'Usuarios', icon: Users, component: AdminUserComponent },
    { key: 'cultivo', label: 'Agricultura', icon: Leaf, component: AgriculturaComponent },
    { key: 'gamificacion', label: 'Gamificación', icon: GraduationCap, component: GamificacionComponent },
    { key: 'educacion', label: 'Educación', icon: GraduationCap, component: EducacionComponent }
  ];

  // Filtrar elementos del menú según los componentes disponibles
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => {
      // Siempre mostrar el dashboard
      if (item.key === 'dashboard') return true;
      
      // Solo mostrar elementos que tienen componente asociado
      return item.component !== undefined;
    });
  }, [LayoutDashboardComponent, AdminUserComponent, AgriculturaComponent, GamificacionComponent, EducacionComponent]);

  // Verificar si la pestaña activa está disponible, si no, cambiar a dashboard
  React.useEffect(() => {
    const isActiveTabAvailable = menuItems.some(item => item.key === activeTab);
    if (!isActiveTabAvailable && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  }, [menuItems, activeTab]);

  const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isActive, onClick, collapsed }) => {
    const IconComponent = item.icon;
    return (
      <button
        onClick={() => {
          onClick(item.key);
          setMobileSidebarOpen(false);
        }}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-blue-100 text-blue-700 font-semibold' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title={collapsed ? item.label : ''}
      >
        <IconComponent size={20} />
        {!collapsed && <span className="text-sm">{item.label}</span>}
      </button>
    );
  };

  // Función para manejar el cerrar sesión
  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
    setDropdownOpen(false);
  };

  // Función para renderizar el contenido según la pestaña activa
  const renderContent = () => {
    const currentItem = allMenuItems.find(item => item.key === activeTab);
    
    if (currentItem?.component) {
      const Component = currentItem.component;
      return <Component onNavigate={setActiveTab} />;
    }

    // Contenido por defecto (Dashboard)
    if (activeTab === 'dashboard') {
      return (
        <>
          {/* Área de contenido principal */}
          <div className="min-h-96 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-8">
            <LayoutDashboard size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Dashboard Principal</h3>
            <p className="text-gray-500">Bienvenido al panel de administración</p>
          </div>
        </>
      );
    }

    // Placeholder para otras pestañas sin componente asignado
    return (
      <div className="min-h-96 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          {React.createElement(currentItem?.icon || LayoutDashboard, { size: 32 })}
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{currentItem?.label}</h3>
        <p className="text-gray-500 mb-4">No tienes permisos para acceder a esta sección</p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Logo y toggle */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-lg font-bold text-blue-600">Panel Admin</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.key}
              item={item}
              isActive={activeTab === item.key}
              onClick={setActiveTab}
              collapsed={!sidebarOpen}
            />
          ))}
        </nav>

        {/* Usuario info en sidebar */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">{userInfo.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{userInfo.name}</p>
                <p className="text-xs text-gray-600 truncate">{userInfo.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Sidebar - Mobile */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileSidebarOpen(false)}
        />
        
        {/* Sidebar content */}
        <aside className={`absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header con botón cerrar */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-lg font-bold text-blue-600">Panel Admin</h1>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.key}
                item={item}
                isActive={activeTab === item.key}
                onClick={setActiveTab}
                collapsed={false}
              />
            ))}
          </nav>

          {/* Usuario info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">{userInfo.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{userInfo.name}</p>
                <p className="text-xs text-gray-600 truncate">{userInfo.email}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botón menú móvil */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>

            {/* Título - visible en móvil cuando sidebar está cerrado */}
            <h1 className="lg:hidden text-lg font-bold text-blue-600">Panel Admin</h1>

            {/* Espaciador para desktop */}
            <div className="hidden lg:block flex-1" />

            {/* Controles del header */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Search size={20} className="text-gray-600" />
              </button>
              
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>

              {/* Dropdown de usuario - Desktop */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{userInfo.initials}</span>
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-gray-800">{userInfo.name}</p>
                    <p className="text-xs text-gray-600">{userInfo.email}</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        <User size={16} />
                        Mi Perfil
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        <Settings size={16} />
                        Configuración
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button 
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        onClick={handleSignOut}
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                  </>
                )}
              </div>

              {/* Botón usuario móvil */}
              <button 
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{userInfo.initials}</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              {/* Contenido dinámico */}
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}