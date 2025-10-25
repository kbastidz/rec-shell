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


import { MonitoreoAdmin } from './UI_MONITOREO/components/MonitoreoAdmin';
import { CultivosAdmin } from './UI_CULTIVO/components/CultivosAdmin';
import { MedidaAdmin } from './UI_MEDIDA/components/MedidaAdmin';
import { NutrienteAdmin } from './UI_NUTRIENTES/components/NutrienteAdmin';
import { SeguimientosAdmin } from './UI_SEGUIMIENTO/components/SeguimientosAdmin';
import { TratamientosAdmin } from './UI_TRATANIENTO/components/TratamientosAdmin';
import { Listar } from './UI_PROCESS/UI_CARGA_IMAGEN/components/Listar';
import { Analisis } from './UI_PROCESS/UI_CARGA_IMAGEN/components/Analisis';

interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

const menuItems = [
  { 
    icon: '🌱', 
    label: 'Cultivos', 
    value: 'cultivos',
    color: 'green',
    description: 'Gestiona los cultivos del sistema',
    component: CultivosAdmin
  },
  { 
    icon: '💧', 
    label: 'Nutrientes', 
    value: 'nutrientes',
    color: 'blue',
    description: 'Administra nutrientes y fertilizantes',
    component: NutrienteAdmin
  },
  { 
    icon: '💊', 
    label: 'Tratamientos', 
    value: 'tratamientos',
    color: 'violet',
    description: 'Configura tratamientos y aplicaciones',
    component: TratamientosAdmin
  },
  { 
    icon: '📏', 
    label: 'Medidas', 
    value: 'medidas',
    color: 'cyan',
    description: 'Define unidades de medida',
    component: MedidaAdmin
  },
  { 
    icon: '📋', 
    label: 'Seguimientos', 
    value: 'seguimientos',
    color: 'orange',
    description: 'Rastrea el progreso de cultivos',
    component: SeguimientosAdmin
  },
  { 
    icon: '📊', 
    label: 'Monitoreo', 
    value: 'monitoreo',
    color: 'teal',
    description: 'Visualiza datos y estadísticas',
    component: MonitoreoAdmin
  },
  { 
    icon: '🧪', 
    label: 'Análisis', 
    value: 'analisis',
    color: 'purple',
    description: 'Analiza el estado de las hojas de cacao (detección de enfermedades)',
    component: Analisis
  },
  { 
    icon: '📋', 
    label: 'Consultas de Análisis', 
    value: 'listar',
    color: 'blue',
    description: 'Consulta los resultados de los análisis realizados',
    component: Listar
  }
];

export function MenuPagueM1({ onNavigate }: ComponentWithNavigation) {
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
          <Title order={1} mb="xs">
            Sistema de Gestión Agrícola
          </Title>
          <Text c="dimmed" size="lg">
            Bienvenido al panel de administración. Selecciona una sección para comenzar.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 3 }} spacing="xl">
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
  NutrienteAdmin,
  TratamientosAdmin,
  MedidaAdmin,
  CultivosAdmin,
  SeguimientosAdmin,
  MonitoreoAdmin,
  Analisis,
  Listar
};