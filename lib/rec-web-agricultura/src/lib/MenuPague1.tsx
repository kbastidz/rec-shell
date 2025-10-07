import React, { useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  Stack,
  Container,
  Title,
  Card,
  SimpleGrid,
  ThemeIcon,
  Box,
  Badge,
  Paper,
  Avatar,
  Menu,
  UnstyledButton,
  rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCategory,
  IconTarget,
  IconGift,
  IconTrophy,
  IconSword,
  IconPackage,
  IconChartBar,
  IconHome,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconUser
} from '@tabler/icons-react';

const menuItems = [
  { 
    icon: IconCategory, 
    label: 'Categorías', 
    value: 'categorias',
    color: 'blue',
    description: 'Gestiona las categorías del sistema'
  },
  { 
    icon: IconTarget, 
    label: 'Tipos de Desafío', 
    value: 'tipos-desafio',
    color: 'violet',
    description: 'Configura los tipos de desafíos'
  },
  { 
    icon: IconGift, 
    label: 'Tipos de Recompensa', 
    value: 'tipos-recompensa',
    color: 'pink',
    description: 'Define tipos de recompensas'
  },
  { 
    icon: IconTrophy, 
    label: 'Logros', 
    value: 'logros',
    color: 'yellow',
    description: 'Administra logros y medallas'
  },
  { 
    icon: IconSword, 
    label: 'Desafíos', 
    value: 'desafios',
    color: 'red',
    description: 'Gestiona desafíos activos'
  },
  { 
    icon: IconPackage, 
    label: 'Recompensas', 
    value: 'recompensas',
    color: 'green',
    description: 'Administra recompensas disponibles'
  },
  { 
    icon: IconChartBar, 
    label: 'Tabla de Líderes', 
    value: 'tabla-lideres',
    color: 'orange',
    description: 'Visualiza rankings y estadísticas'
  }
];

export function MenuPague1() {
  const [opened, { toggle }] = useDisclosure();
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    if (activeSection === 'home') {
      return (
        <Container size="xl" py="xl">
          <Stack gap="xl">
            <Box>
              <Title order={1} mb="xs">
                Panel de Administración
              </Title>
              <Text c="dimmed" size="lg">
                Bienvenido al centro de control. Selecciona una sección para comenzar.
              </Text>
            </Box>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {menuItems.map((item) => (
                <Card
                  key={item.value}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => setActiveSection(item.value)}
                >
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon size="xl" radius="md" variant="light" color={item.color}>
                        <item.icon style={{ width: rem(24), height: rem(24) }} />
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

            <Paper p="xl" radius="md" withBorder style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Box>
                    <Text size="lg" fw={600} c="white">
                      Sistema de Gamificación
                    </Text>
                    <Text size="sm" c="white" opacity={0.9} mt={4}>
                      Gestiona todos los aspectos de tu plataforma desde aquí
                    </Text>
                  </Box>
                  <Badge size="lg" variant="light" color="white">
                    v1.0
                  </Badge>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      );
    }

    const currentItem = menuItems.find(item => item.value === activeSection);
    
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Group>
            <ThemeIcon size="xl" radius="md" variant="light" color={currentItem?.color}>
              <currentItem.icon style={{ width: rem(24), height: rem(24) }} />
            </ThemeIcon>
            <Box>
              <Title order={2}>{currentItem?.label}</Title>
              <Text c="dimmed">{currentItem?.description}</Text>
            </Box>
          </Group>

          <Paper p="xl" radius="md" withBorder style={{ minHeight: '400px' }}>
            <Stack align="center" justify="center" h="100%">
              <currentItem.icon size={80} stroke={1.5} color="#868e96" />
              <Text size="lg" c="dimmed" ta="center">
                Aquí se cargará el componente <strong>{currentItem?.label}Admin</strong>
              </Text>
              <Text size="sm" c="dimmed" ta="center" maw={500}>
                Importa y renderiza tu componente existente aquí. Por ejemplo:
                <br />
                <code style={{ background: '#f1f3f5', padding: '2px 6px', borderRadius: '4px' }}>
                  {`import ${currentItem?.label.replace(/\s/g, '')}Admin from './lib/${currentItem?.label.replace(/\s/g, '')}Admin'`}
                </code>
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="xs">
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconTrophy style={{ width: rem(20), height: rem(20) }} />
              </ThemeIcon>
              <Text size="xl" fw={700}>
                Admin Panel
              </Text>
            </Group>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar color="blue" radius="xl" size="sm">
                    <IconUser size={18} />
                  </Avatar>
                  <Text size="sm" fw={500}>
                    Administrador
                  </Text>
                  <IconChevronDown size={16} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Configuración
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={16} />} color="red">
                Cerrar sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <NavLink
            label="Inicio"
            leftSection={<IconHome size={20} />}
            active={activeSection === 'home'}
            onClick={() => setActiveSection('home')}
            variant="light"
          />
          
          <Text size="xs" fw={600} c="dimmed" mt="md" mb="xs" px="xs">
            GESTIÓN
          </Text>

          {menuItems.map((item) => (
            <NavLink
              key={item.value}
              label={item.label}
              leftSection={<item.icon size={20} />}
              active={activeSection === item.value}
              onClick={() => setActiveSection(item.value)}
              variant="light"
              color={item.color}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {renderContent()}
      </AppShell.Main>
    </AppShell>
  );
}