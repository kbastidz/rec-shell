// rec-web-agricultura/src/components/CultivosManager.tsx
import React, { useState, createContext, useContext } from 'react';
import { ListarCultivos } from './components/GET/ListarCultivos';
import { CrearCultivo } from './components/POST/CrearCultivo';
import { EditarCultivo } from './components/PUT/EditarCultivo';


type View = 'listar' | 'crear' | 'editar' | 'detalle';

interface NavigationState {
  currentView: View;
  params?: Record<string, any>;
}

interface NavigationContextType {
  navigation: NavigationState;
  navigateTo: (view: View, params?: Record<string, any>) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const CultivosManager: React.FC = () => {
  const [navigation, setNavigation] = useState<NavigationState>({ 
    currentView: 'listar' 
  });
  const [history, setHistory] = useState<NavigationState[]>([]);

  const navigateTo = (view: View, params?: Record<string, any>) => {
    setHistory(prev => [...prev, navigation]);
    setNavigation({ currentView: view, params });
  };

  const goBack = () => {
    const previousView = history[history.length - 1];
    if (previousView) {
      setHistory(prev => prev.slice(0, -1));
      setNavigation(previousView);
    } else {
      setNavigation({ currentView: 'listar' });
    }
  };

  const renderCurrentView = () => {
    switch (navigation.currentView) {
      case 'crear':
        return <CrearCultivo />;
      case 'editar':
        return <EditarCultivo id={navigation.params?.id} />;
      /*case 'detalle':
        return <DetallesCultivo cultivoId={navigation.params?.id} />;*/
      case 'listar':
      default:
        return <ListarCultivos />;
    }
  };

  return (
    <NavigationContext.Provider value={{ navigation, navigateTo, goBack }}>
      <div className="cultivos-manager">
        {renderCurrentView()}
      </div>
    </NavigationContext.Provider>
  );
};

// Hook para usar la navegación
export const useCultivosNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useCultivosNavigation must be used within CultivosManager');
  }
  return context;
};