import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  Calendar, 
  FileText, 
  Settings,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  MoreHorizontal,
  Shield, 
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

interface HorizontalMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: (key: string) => void;
}

interface AdminTemplateProps {
  // Props opcionales para inyectar componentes desde fuera
  AdminUserComponent?: NavigableComponent;
  AgriculturaComponent?: NavigableComponent;
  GamificacionComponent?: NavigableComponent;

  ProductsComponent?: NavigableComponent;
  CalendarComponent?: NavigableComponent;
  FilesComponent?: NavigableComponent;
  SettingsComponent?: NavigableComponent;
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
  

  ProductsComponent,
  CalendarComponent,
  FilesComponent,
  SettingsComponent,
  onSignOut,
  userInfo = {
    name: 'Admin User',
    email: 'admin@hotmail.com',
    initials: 'A'
  }
}: AdminTemplateProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

  // Elementos del menú con sus componentes asociados
  const allMenuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'users', label: 'Usuarios', icon: Users, component: AdminUserComponent },
    { key: 'cultivo', label: 'Agricultura', icon: Leaf, component: AgriculturaComponent },
    { key: 'educacion', label: 'Gamificacion', icon: GraduationCap, component: GamificacionComponent },
    


    { key: 'products', label: 'Productos', icon: ShoppingCart, component: ProductsComponent },
    { key: 'calendar', label: 'Calendario', icon: Calendar, component: CalendarComponent },
    { key: 'files', label: 'Archivos', icon: FileText, component: FilesComponent },
    { key: 'settings', label: 'Configuración', icon: Settings, component: SettingsComponent },
  ];

  // Filtrar elementos del menú según los componentes disponibles
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => {
      // Siempre mostrar el dashboard
      if (item.key === 'dashboard') return true;
      
      // Solo mostrar elementos que tienen componente asociado
      return item.component !== undefined;
    });
  }, [AdminUserComponent, AgriculturaComponent, GamificacionComponent, ProductsComponent, CalendarComponent, FilesComponent, SettingsComponent]);

  // Verificar si la pestaña activa está disponible, si no, cambiar a dashboard
  React.useEffect(() => {
    const isActiveTabAvailable = menuItems.some(item => item.key === activeTab);
    if (!isActiveTabAvailable && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  }, [menuItems, activeTab]);

  const HorizontalMenuItem: React.FC<HorizontalMenuItemProps> = ({ item, isActive, onClick }) => {
    const IconComponent = item.icon;
    return (
      <button
        onClick={() => onClick(item.key)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
          isActive 
            ? 'bg-blue-100 text-blue-700 font-semibold' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <IconComponent size={18} />
        <span className="text-sm hidden sm:block">{item.label}</span>
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
            
            {/* Mostrar información sobre permisos disponibles */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Módulos disponibles:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {menuItems.slice(1).map(item => (
                  <span key={item.key} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {item.label}
                  </span>
                ))}
              </div>
              {menuItems.length === 1 && (
                <p className="text-sm text-orange-600">
                  No tienes permisos para acceder a otros módulos.
                </p>
              )}
            </div>
          </div>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Estadísticas</h4>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 size={16} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-1">1,234</p>
              <p className="text-sm text-gray-600">Total de usuarios</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Ventas</h4>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={16} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">$45,678</p>
              <p className="text-sm text-gray-600">Este mes</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Tareas</h4>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar size={16} className="text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-1">23</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
          </div>
        </>
      );
    }

    // Placeholder para otras pestañas sin componente asignado (esto no debería ocurrir ahora)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Panel Administrativo</h1>
          </div>

          {/* Menú horizontal - visible en pantallas medianas y grandes */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-4xl mx-8">
            {menuItems.map((item) => (
              <HorizontalMenuItem
                key={item.key}
                item={item}
                isActive={activeTab === item.key}
                onClick={setActiveTab}
              />
            ))}
          </div>

          {/* Menú dropdown para móvil */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                menuDropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
            >
              <MoreHorizontal size={20} />
              <span className="text-sm hidden sm:block">Menú</span>
            </button>
            
            {menuDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        setMenuDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-colors ${
                        activeTab === item.key
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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

            {/* Dropdown de usuario */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{userInfo.initials}</span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{userInfo.name}</p>
                  <p className="text-xs text-gray-600">{userInfo.email}</p>
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {dropdownOpen && (
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
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Header del contenido */}
            
            {/*}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {allMenuItems.find(item => item.key === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-gray-600">Bienvenido al panel de administración</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center">
                {activeTab}
              </div>
            </div>
             <hr className="border-gray-200 mb-8" />
            */}

           

            {/* Contenido dinámico */}
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Overlay para cerrar dropdowns al hacer clic fuera */}
      {(dropdownOpen || menuDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
            setMenuDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}