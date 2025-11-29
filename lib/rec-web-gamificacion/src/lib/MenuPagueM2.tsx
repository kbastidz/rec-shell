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

import { CategoriaAdmin } from './UI_CATEGORIA_LOGRO/components/CategoriaAdmin';
import { DesafiosAdmin } from './UI_DESAFIOS/components/DesafiosAdmin';
import { LogrosAdmin } from './UI_LOGROS/components/LogrosAdmin';
import { RecompensasAdmin } from './UI_RECOMPENSA/components/RecompensasAdmin';
import { TablaLideresAdmin } from './UI_TABLA_LIDERES/compoments/TablaLideresAdmin';
import { TiposDesafioAdmin } from './UI_TIPO_DESAFIO/component/TiposDesafioAdmin';
import { TipoRecompensaAdmin } from './UI_TIPO_RECOMPENSA/component/TipoRecompensaAdmin';
import { Juegos } from './UI_PROCESS/UI_JUEGOS/components/Juegos';
import { ReglaPuntosAdmin } from './UI_REGLA_PUNTOS/components/ReglaPuntosAdmin';
import { TransaccionPuntosAdmin } from './UI_PROCESS/UI_TRANSACIONPUNTOS/components/TransaccionPuntosAdmin';

import { useOpciones } from '@rec-shell/rec-web-auth';
import { OpcionDTO, ST_GET_ROLE_USER_ID } from '@rec-shell/rec-web-shared';

interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  'categorias': CategoriaAdmin,
  'tipos-desafio': TiposDesafioAdmin,
  'tipos-recompensa': TipoRecompensaAdmin,
  'logros': LogrosAdmin,
  'desafios': DesafiosAdmin,
  'recompensas': RecompensasAdmin,
  'regla-puntos': ReglaPuntosAdmin,
  'concialiacion': TransaccionPuntosAdmin,
  'juegos': Juegos,
};

const colorMap: Record<string, string> = {
  'categorias': 'blue',
  'tipos-desafio': 'violet',
  'tipos-recompensa': 'pink',
  'logros': 'yellow',
  'desafios': 'red',
  'recompensas': 'green',
  'regla-puntos': 'orange',
  'concialiacion': 'red',
  'juegos': 'blue',
};

export function MenuPagueM2({ onNavigate }: ComponentWithNavigation) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { opciones, loading, error, OBTENER_OPCIONES_BY_ROL } = useOpciones();

  useEffect(() => {
    const roleId = ST_GET_ROLE_USER_ID();
    if (roleId) {
      OBTENER_OPCIONES_BY_ROL(roleId, 'GAMIFICACION');
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
            Sistema de Gamificación
          </Title>
          <Text c="dimmed" size="lg">
            Bienvenido al panel de administración. Selecciona una sección para comenzar.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="xl">
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
  CategoriaAdmin,
  DesafiosAdmin,
  LogrosAdmin,
  RecompensasAdmin,
  TablaLideresAdmin,
  TiposDesafioAdmin,
  TipoRecompensaAdmin
};