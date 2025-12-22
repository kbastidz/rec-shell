import { useEffect, useState } from 'react';
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
  Loader,
} from '@mantine/core';

import { GeneradorAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/GeneradorAdmin';
import { HistoricoNotasAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/HistoricoNotasAdmin';
import { DashboardNotasAcademico } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/DashboardNotasAcademico';
import { Evaluacion } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/Evaluacion';
import { RecomendacionesAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/RecomendacionesAdmin';
import { ConsultarEvaluacionesAdmin } from './UI_PROCESS/UI_GENERADOR_PREGUNTAS/components/ConsultarEvaluacionesAdmin';
import { DashboardAdminM3 } from './UI_PROCESS/UI_DASHBOARD/components/DashboardAdmin';

import { useOpciones } from '@rec-shell/rec-web-auth';
import { OpcionDTO, ST_GET_ROLE_USER_ID } from '@rec-shell/rec-web-shared';

interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  'generador': GeneradorAdmin,
  'historico': HistoricoNotasAdmin,
  'dashboard': DashboardNotasAcademico,
  'evaluacion': Evaluacion,
  'recomendaciones': RecomendacionesAdmin,
  'resultados': ConsultarEvaluacionesAdmin,
  'dashboard2': DashboardAdminM3,
};

const colorMap: Record<string, string> = {
  'generador': 'indigo',
  'historico': 'blue',
  'dashboard': 'teal',
  'evaluacion': 'violet',
  'recomendaciones': 'pink',
  'resultados': 'yellow',
  'dashboard2': 'yellow',
};

export function MenuPagueM3({ onNavigate }: ComponentWithNavigation) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { opciones, loading, error, OBTENER_OPCIONES_BY_ROL } = useOpciones();

  useEffect(() => {
    const roleId = ST_GET_ROLE_USER_ID();
    if (roleId) {
      OBTENER_OPCIONES_BY_ROL(roleId, 'EDUCACION');
    }
  }, []);

  if (loading) {
    return (
      <Container fluid p="xl">
        <Stack align="center" justify="center" style={{ minHeight: '400px' }}>
          <Loader size="lg" />
          <Text c="dimmed">Cargando opciones del menú...</Text>
        </Stack>
      </Container>
    );
  }

  if (activeSection) {
    const currentOption = opciones.find(opt => opt.codigo === activeSection);
    const Component = currentOption ? componentMap[currentOption.codigo] : null;

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
          {opciones.map((opcion: OpcionDTO) => (
            <Card
              key={opcion.id}
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
                console.log('Navegando a:', opcion.codigo);
                setActiveSection(opcion.codigo);
              }}
            >
              <Stack gap="md">
                <Group>
                  <ThemeIcon 
                    size="xl" 
                    radius="md" 
                    variant="light" 
                    color={colorMap[opcion.codigo] || 'gray'}
                  >
                    <Text size="xl">{opcion.icono}</Text>
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {opcion.nombre}
                    </Text>
                  </Box>
                </Group>
                <Text size="sm" c="dimmed">
                  {opcion.descripcion}
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