import React, { useState, useMemo } from 'react';
import {
  Group,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
  Box,
  Indicator,
  ActionIcon,
  Paper,
  Title,
  useMantineTheme,
  Tooltip,
  Badge,
  Container,
  Center,
  Transition,
  Stack,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import {
  IconLayoutDashboard,
  IconUsers,
  IconSettings,
  IconSearch,
  IconBell,
  IconChevronDown,
  IconUser,
  IconLogout,
  IconLeaf,
  IconTrophy,
  IconBook,
  IconSparkles,
} from '@tabler/icons-react';

// Interfaz para componentes que pueden recibir navegación
interface ComponentWithNavigation {
  onNavigate?: (tabKey: string) => void;
}

type NavigableComponent = React.ComponentType<ComponentWithNavigation>;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; stroke?: number }>;
  component?: NavigableComponent;
  description?: string;
  gradient?: { from: string; to: string };
  badge?: string;
}

interface AdminTemplateProps {
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
    initials: 'AU',
  },
}: AdminTemplateProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useMantineTheme();

  // Elementos del menú con gradientes personalizados
  const allMenuItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: IconLayoutDashboard,
      component: LayoutDashboardComponent,
      description: 'Vista general',
      gradient: { from: 'blue', to: 'cyan' },
    },
    {
      key: 'users',
      label: 'Usuarios',
      icon: IconUsers,
      component: AdminUserComponent,
      description: 'Gestión de usuarios',
      gradient: { from: 'violet', to: 'grape' },
      
    },
    {
      key: 'cultivo',
      label: 'Agricultura',
      icon: IconLeaf,
      component: AgriculturaComponent,
      description: 'Cultivos',
      gradient: { from: 'teal', to: 'green' },
    },
    {
      key: 'gamificacion',
      label: 'Gamificación',
      icon: IconTrophy,
      component: GamificacionComponent,
      description: 'Logros',
      gradient: { from: 'yellow', to: 'orange' },
     
    },
    {
      key: 'educacion',
      label: 'Educación',
      icon: IconBook,
      component: EducacionComponent,
      description: 'Recursos',
      gradient: { from: 'orange', to: 'red' },
    },
  ];

  // Filtrar elementos del menú
  const menuItems = useMemo(() => {
    return allMenuItems.filter((item) => {
      if (item.key === 'dashboard') return true;
      return item.component !== undefined;
    });
  }, [
    LayoutDashboardComponent,
    AdminUserComponent,
    AgriculturaComponent,
    GamificacionComponent,
    EducacionComponent,
  ]);

  React.useEffect(() => {
    const isActiveTabAvailable = menuItems.some((item) => item.key === activeTab);
    if (!isActiveTabAvailable && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  }, [menuItems, activeTab]);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  // Componente de ítem del dock
  const DockItem = ({ item }: { item: MenuItem }) => {
    const { hovered, ref } = useHover();
    const isActive = activeTab === item.key;

    return (
      <Tooltip
        label={
          <Box>
            <Text size="sm" fw={600}>
              {item.label}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </Box>
        }
        position="top"
        offset={15}
      >
        <Box
          ref={ref}
          style={{
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {item.badge && !isActive && (
            <Badge
              size="xs"
              variant="filled"
              color={item.gradient?.from}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                zIndex: 10,
                boxShadow: `0 2px 8px ${theme.colors[item.gradient?.from || 'blue'][4]}`,
              }}
            >
              {item.badge}
            </Badge>
          )}
          <UnstyledButton
            onClick={() => setActiveTab(item.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: hovered ? 72 : 64,
              height: hovered ? 72 : 64,
              borderRadius: theme.radius.xl,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              background: isActive
                ? `linear-gradient(135deg, ${theme.colors[item.gradient?.from || 'blue'][5]} 0%, ${
                    theme.colors[item.gradient?.to || 'cyan'][6]
                  } 100%)`
                : hovered
                ? `linear-gradient(135deg, ${theme.colors[item.gradient?.from || 'blue'][1]} 0%, ${
                    theme.colors[item.gradient?.to || 'cyan'][1]
                  } 100%)`
                : theme.colors.gray[0],
              color: isActive ? 'white' : theme.colors.gray[7],
              transform: hovered ? 'translateY(-12px) scale(1.05)' : isActive ? 'translateY(-4px)' : 'none',
              boxShadow: isActive
                ? `0 12px 24px ${theme.colors[item.gradient?.from || 'blue'][3]}`
                : hovered
                ? `0 8px 16px ${theme.colors.gray[3]}`
                : '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <item.icon size={hovered ? 28 : 24} stroke={isActive ? 2.5 : 1.8} />
          </UnstyledButton>
          
          {/* Indicador de activo */}
          <Transition
            mounted={isActive}
            transition="scale"
            duration={200}
          >
            {(styles) => (
              <Box
                style={{
                  ...styles,
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.colors[item.gradient?.from || 'blue'][5]} 0%, ${
                    theme.colors[item.gradient?.to || 'cyan'][6]
                  } 100%)`,
                }}
              />
            )}
          </Transition>
        </Box>
      </Tooltip>
    );
  };

  // Renderizar contenido
  const renderContent = () => {
    const currentItem = allMenuItems.find((item) => item.key === activeTab);

    if (currentItem?.component) {
      const Component = currentItem.component;
      return <Component onNavigate={setActiveTab} />;
    }

    if (activeTab === 'dashboard') {
      return (
        <Paper
          shadow="md"
          p="xl"
          radius="xl"
          style={{
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.colors.blue[0]} 0%, ${theme.colors.cyan[0]} 100%)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.colors.blue[1]} 0%, ${theme.colors.cyan[2]} 100%)`,
              opacity: 0.4,
              filter: 'blur(40px)',
            }}
          />
          <Avatar
            size={120}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
            style={{
              boxShadow: `0 12px 24px ${theme.colors.blue[3]}`,
              position: 'relative',
            }}
          >
            <IconSparkles size={60} stroke={1.5} />
          </Avatar>
          <Title order={1} mt="xl" c="blue.8" style={{ position: 'relative' }}>
            Dashboard Principal
          </Title>
          <Text c="dimmed" size="lg" mt="md" ta="center" maw={500} style={{ position: 'relative' }}>
            Bienvenido al panel de administración. Usa el dock inferior para navegar.
          </Text>
        </Paper>
      );
    }

    return (
      <Paper
        shadow="md"
        p="xl"
        radius="xl"
        style={{
          minHeight: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar
          size={110}
          radius="xl"
          variant="gradient"
          gradient={{
            from: currentItem?.gradient?.from || 'gray',
            to: currentItem?.gradient?.to || 'gray',
            deg: 135,
          }}
          style={{
            boxShadow: `0 12px 24px ${theme.colors[currentItem?.gradient?.from || 'gray'][3]}`,
          }}
        >
          {currentItem?.icon && <currentItem.icon size={55} stroke={1.5} />}
        </Avatar>
        <Title order={2} mt="xl">
          {currentItem?.label}
        </Title>
        <Text c="dimmed" mt="xs" mb="xl" ta="center">
          No tienes permisos para acceder a esta sección
        </Text>
        <UnstyledButton
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '12px 28px',
            borderRadius: theme.radius.md,
            background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.cyan[6]} 100%)`,
            color: 'white',
            fontWeight: 600,
            fontSize: 15,
            boxShadow: `0 8px 16px ${theme.colors.blue[3]}`,
          }}
        >
          Volver al Dashboard
        </UnstyledButton>
      </Paper>
    );
  };

  return (
    <Box style={{ minHeight: '100vh',  paddingRight: 120 }}>

      {/* Header superior */}
      <Paper
        shadow="sm"
        p="md"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container size="xl">
          <Group justify="space-between">
            <Group gap="sm">
              <Avatar
                size={42}
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
              >
                <IconSparkles size={24} />
              </Avatar>
              <Box>
                <Text
                  size="lg"
                  fw={700}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 135 }}
                  style={{ lineHeight: 1.2 }}
                >
                  Panel Admin
                </Text>
                <Text size="xs" c="dimmed" style={{ lineHeight: 1.2 }}>
                  Sistema de Gestión Inteligente
                </Text>
              </Box>
            </Group>

            <Group gap="xs">
              <Tooltip label="Buscar (Ctrl+K)">
                <ActionIcon variant="light" color="gray" size="lg" radius="md">
                  <IconSearch size={20} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="3 notificaciones nuevas">
                <Indicator inline processing color="red" size={8} offset={5}>
                  <ActionIcon variant="light" color="gray" size="lg" radius="md">
                    <IconBell size={20} />
                  </ActionIcon>
                </Indicator>
              </Tooltip>

              <Menu shadow="xl" width={240} position="bottom-end" offset={12}>
                <Menu.Target>
                  <UnstyledButton
                    style={{
                      padding: '4px 12px 4px 4px',
                      borderRadius: theme.radius.md,
                    }}
                  >
                    <Group gap="xs">
                      <Avatar
                        color="blue"
                        radius="xl"
                        size="md"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan' }}
                      >
                        {userInfo.initials}
                      </Avatar>
                      <Box visibleFrom="sm">
                        <Text size="sm" fw={600} style={{ lineHeight: 1.2 }}>
                          {userInfo.name}
                        </Text>
                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.2 }}>
                          {userInfo.email}
                        </Text>
                      </Box>
                      <IconChevronDown size={16} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Mi Cuenta</Menu.Label>
                  <Menu.Item leftSection={<IconUser size={18} />}>Mi Perfil</Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={18} />}>Configuración</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={18} />}
                    onClick={handleSignOut}
                  >
                    Cerrar Sesión
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Contenido principal */}
      <Container size="xl" py="xl" px="md">
        {renderContent()}
      </Container>

      {/* Dock flotante inferior */}
      <Box
  style={{
    position: 'fixed',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
  }}
>
        <Paper
          shadow="xl"
          p="lg"
          radius="xl"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.colors.gray[2]}`,
          }}
        >
          <Stack gap="lg" align="center">
  {menuItems.map((item) => (
    <DockItem key={item.key} item={item} />
  ))}
</Stack>
        </Paper>
      </Box>
    </Box>
  );
}