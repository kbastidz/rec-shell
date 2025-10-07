import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  SimpleGrid,
  Stack,
  Group,
  ThemeIcon,
  Box,
  Button,
} from '@mantine/core';

import { CategoriaAdmin } from './UI_CATEGORIA_LOGRO/components/CategoriaAdmin';
import { DesafiosAdmin } from './UI_DESAFIOS/components/DesafiosAdmin';
import { LogrosAdmin } from './UI_LOGROS/components/LogrosAdmin';
import { RecompensasAdmin } from './UI_RECOMPENSA/components/RecompensasAdmin';
import { TablaLideresAdmin } from './UI_TABLA_LIDERES/compoments/TablaLideresAdmin';
import { TiposDesafioAdmin } from './UI_TIPO_DESAFIO/component/TiposDesafioAdmin';
import { TipoRecompensaAdmin } from './UI_TIPO_RECOMPENSA/component/TipoRecompensaAdmin';

interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

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
    icon: '📊', 
    label: 'Tabla de Líderes', 
    value: 'tabla-lideres',
    color: 'orange',
    description: 'Visualiza rankings y estadísticas',
    component: TablaLideresAdmin
  }
];

export function MenuPague({ onNavigate }: ComponentWithNavigation) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (activeSection) {
    const currentItem = menuItems.find(item => item.value === activeSection);
    const Component = currentItem?.component;

    return (
      <Container fluid p="xl">
        <Stack gap="md">
          <Button
            variant="subtle"
            onClick={() => setActiveSection(null)}
            leftSection={<span>←</span>}
          >
            Volver al menú
          </Button>
          
          {Component && <Component />}
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid p="xl">
      <Stack gap="xl">
        <Box>         
          <Text c="dimmed" size="lg">
            Bienvenido al centro de control. Selecciona una sección para comenzar.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="xl">
          {menuItems.map((item) => (
            <Card
              key={item.value}
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
              onClick={() => {
                console.log('Navegando a:', item.value);
                setActiveSection(item.value);
              }}
            >
              <Stack gap="md">
                <Group>
                  <ThemeIcon size="xl" radius="md" variant="light" color={item.color}>
                    <Text size="xl">{item.icon}</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {item.label}
                    </Text>
                  </Box>
                </Group>
                <Text size="sm" c="dimmed">
                  {item.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export {
  CategoriaAdmin,
  DesafiosAdmin,
  LogrosAdmin,
  RecompensasAdmin,
  TablaLideresAdmin,
  TiposDesafioAdmin,
  TipoRecompensaAdmin
};