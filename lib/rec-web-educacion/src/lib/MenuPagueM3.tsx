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
import { GeneradorAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/GeneradorAdmin';
import { HistoricoNotasAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/HistoricoNotasAdmin';
import { DashboardNotasAcademico } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/DashboardNotasAcademico';
import { Evaluacion } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/Evaluacion';
import { RecomendacionesAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/RecomendacionesAdmin';
import { ConsultarEvaluacionesAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/ConsultarEvaluacionesAdmin';
import { DashboardAdmin } from './UI_PROCESS/UI_DASHBOARD/components/DashboardAdmin';

interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

const menuItems = [
  { 
    icon: '🧠', 
    label: 'Generador de Resúmenes y Preguntas IA', 
    value: 'generador',
    color: 'indigo',
    description: 'Analiza documentos PDF utilizando inteligencia artificial para generar automáticamente un resumen claro y conciso del contenido, junto con preguntas relevantes que facilitan la comprensión y evaluación del texto',
    component: GeneradorAdmin
  },
  { 
    icon: '📚', 
    label: 'Gestor de Notas Trimestrales', 
    value: 'historico',
    color: 'blue',
    description: 'Permite cargar, organizar y visualizar las calificaciones de los estudiantes por trimestre, facilitando la gestión histórica del rendimiento académico',
    component: HistoricoNotasAdmin
  },
  { 
    icon: '📊', 
    label: 'Panel de Análisis Académico', 
    value: 'dashboard',
    color: 'teal',
    description: 'Genera un dashboard interactivo que presenta métricas, gráficos y estadísticas detalladas sobre las notas de los estudiantes, brindando una visión global del desempeño académico',
    component: DashboardNotasAcademico
  },
  { 
    icon: '📝', 
    label: 'Módulo de Evaluaciones', 
    value: 'evaluacion',
    color: 'violet',
    description: 'Permite crear y realizar evaluaciones personalizadas, registrando respuestas y resultados para medir el aprendizaje de manera dinámica y eficiente',
    component: Evaluacion
  },
  { 
    icon: '🎥', 
    label: 'Generador IA de Recursos Educativos', 
    value: 'recomendaciones',
    color: 'pink',
    description: 'Utiliza inteligencia artificial para analizar textos y generar materiales de apoyo como videos recomendados y mapas conceptuales, potenciando el aprendizaje visual y contextual',
    component: RecomendacionesAdmin
  },
   { 
    icon: '📋', 
    label: 'Analisis de Evaluaciones', 
    value: 'resultados',
    color: 'yelow',
    description: 'Permite consultar y analizar de manera detallada los resultados de las evaluaciones.',
    component: ConsultarEvaluacionesAdmin
  },
  {
    icon: '📋',
    label: 'Dashboard',
    value: 'dashboard2',
    color: 'yelow',
    description: 'Permite consultar y analizar de manera detallada los resultados de las evaluaciones.',
    component: DashboardAdmin
  }
];

export function MenuPagueM3({ onNavigate }: ComponentWithNavigation) {
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
            Sistema de Gestión Educativa
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
  GeneradorAdmin,
  HistoricoNotasAdmin,
  DashboardNotasAcademico,
  Evaluacion,
  RecomendacionesAdmin
};