import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Progress,
  Table,
  Avatar,
  RingProgress,
  SimpleGrid,
  Tabs,
  ThemeIcon,
  Box,
  Paper,
  Center,
  Loader
} from '@mantine/core';
import {
  Trophy,
  Target,
  TrendingUp,
  Users,
  Award,
  Star,
  Zap,
  Calendar,
  Activity
} from 'lucide-react';
import { useDashboardUser } from '../hook/useDashboardUser';
import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TransaccionesTable } from './TransaccionesTable';


/*
// Simular el hook (reemplaza esto con tu hook real)
const useGamificacionDashboard = () => {
  const [state, setState] = useState({
    estadisticasGenerales: null,
    resumenUsuario: null,
    distribucionPuntos: null,
    estadisticasLogros: null,
    desafiosActivos: null,
    transaccionesRecientes: null,
    actividadUsuario: null,
    loading: false,
    error: null,
  });

  const fetchDashboardCompleto = async (usuarioId) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // Simular llamada a API que falla
      throw new Error('API no disponible');
    } catch (error) {
      // En caso de error, usar datos mockeados
      console.warn('Error al cargar datos, usando mock data:', error);
      setTimeout(() => {
        setState({
          ...mockData,
          loading: false,
          error: null,
        });
      }, 1000);
    }
  };
  

  return {
    ...state,
    fetchDashboardCompleto,
  };
};
*/
/*
export const DashboardAdmin = () => {
  const {
    estadisticasGenerales,
    resumenUsuario,
    distribucionPuntos,
    estadisticasLogros,
    desafiosActivos,
    transaccionesRecientes,
    actividadUsuario,
    loading,
    fetchDashboardCompleto,
  } = useGamificacionDashboard();*/

export const DashboardUser = () => {
  const {
    estadisticasGenerales,
    resumenUsuario,
    distribucionPuntos,
    estadisticasLogros,
    desafiosActivos,
    transaccionesRecientes,
    actividadUsuario,
    loading,
    error,
    fetchDashboardCompleto,
  } = useDashboardUser();

  useEffect(() => {
    const userId = Number(ST_GET_USER_ID());
    fetchDashboardCompleto(userId);
  }, []);

  console.log(resumenUsuario);

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="xl" />
          <Text size="lg" c="dimmed">
            Cargando dashboard...
          </Text>
        </Stack>
      </Center>
    );
  }

  const rarezaColor: Record<string, string> = {
    COMUN: 'gray',
    RARO: 'blue',
    EPICO: 'purple',
    LEGENDARIO: 'yellow',
  };

  const dificultadColor: Record<string, string> = {
    FACIL: 'green',
    MEDIO: 'yellow',
    DIFICIL: 'red',
  };

  //if (!transaccionesRecientes) return null;
  const transacciones = transaccionesRecientes?.transacciones ?? [];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Dashboard de Gamificación</Title>
            <Text c="dimmed" size="sm">
              Estadísticas y métricas generales del sistema
            </Text>
          </div>
        </Group>

        {/* Estadísticas Generales */}
        {estadisticasGenerales && (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Total Usuarios
                    </Text>
                    <Text size="xl" fw={700}>
                      {estadisticasGenerales.totalUsuarios.toLocaleString()}
                    </Text>
                  </div>
                  <ThemeIcon size={50} radius="md" variant="light" color="blue">
                    <Users size={28} />
                  </ThemeIcon>
                </Group>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Total Transacciones
                    </Text>
                    <Text size="xl" fw={700}>
                      {estadisticasGenerales.totalTransacciones.toLocaleString()}
                    </Text>
                  </div>
                  <ThemeIcon
                    size={50}
                    radius="md"
                    variant="light"
                    color="green"
                  >
                    <Activity size={28} />
                  </ThemeIcon>
                </Group>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Puntos Distribuidos
                    </Text>
                    <Text size="xl" fw={700}>
                      {estadisticasGenerales.puntosDistribuidosTotal.toLocaleString()}
                    </Text>
                  </div>
                  <ThemeIcon
                    size={50}
                    radius="md"
                    variant="light"
                    color="orange"
                  >
                    <Zap size={28} />
                  </ThemeIcon>
                </Group>
              </Card>

              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Tasa Participación
                    </Text>
                    <Text size="xl" fw={700}>
                      {estadisticasGenerales.tasaParticipacion}%
                    </Text>
                  </div>
                  <ThemeIcon
                    size={50}
                    radius="md"
                    variant="light"
                    color="grape"
                  >
                    <TrendingUp size={28} />
                  </ThemeIcon>
                </Group>
              </Card>
            </SimpleGrid>

            {/* Top Usuarios */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                <Group gap="xs">
                  <Trophy size={24} />
                  Top 5 Usuarios
                </Group>
              </Title>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Posición</Table.Th>
                    <Table.Th>Usuario</Table.Th>
                    <Table.Th align="right">Puntos</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {estadisticasGenerales.topUsuarios.map((usuario) => (
                    <Table.Tr key={usuario.usuarioId}>
                      <Table.Td>
                        <Badge
                          size="lg"
                          variant="filled"
                          color={
                            usuario.posicion === 1
                              ? 'yellow'
                              : usuario.posicion === 2
                              ? 'gray'
                              : usuario.posicion === 3
                              ? 'orange'
                              : 'blue'
                          }
                        >
                          #{usuario.posicion}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar color="blue" radius="xl">
                            {usuario.nombreUsuario.charAt(0)}
                          </Avatar>
                          <Text fw={500}>{usuario.nombreUsuario}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td align="right">
                        <Text fw={700} size="lg">
                          {usuario.totalPuntos.toLocaleString()}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </>
        )}

        {/* Resumen Usuario y Distribución */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {resumenUsuario && (
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Title order={3} mb="md">
                  <Group gap="xs">
                    <Star size={24} />
                    Resumen de Usuario
                  </Group>
                </Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text>Posición en Ranking:</Text>
                    <Badge size="lg" variant="filled" color="blue">
                      #{resumenUsuario.posicionRanking}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Logros Desbloqueados:</Text>
                    <Text fw={700}>{resumenUsuario.logrosDesbloqueados}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Desafíos Completados:</Text>
                    <Text fw={700}>{resumenUsuario.desafiosCompletados}</Text>
                  </Group>
                  <div>
                    <Text size="sm" fw={500} mb="xs">
                      Puntos por Tipo:
                    </Text>
                    {resumenUsuario.puntosPorTipo.map((tipo) => (
                      <Box key={tipo.tipoId} mb="sm">
                        <Group justify="space-between" mb={5}>
                          <Text size="sm">{tipo.nombreMostrar}</Text>
                          <Text size="sm" fw={500}>
                            {tipo.cantidad} ({tipo.porcentaje.toFixed(1)}%)
                          </Text>
                        </Group>
                        <Progress value={tipo.porcentaje} color="blue" />
                      </Box>
                    ))}
                  </div>
                </Stack>
              </Card>
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            {distribucionPuntos && (
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Title order={3} mb="md">
                  Distribución de Puntos
                </Title>
                <Stack gap="md">
                  <SimpleGrid cols={3}>
                    <Paper p="md" radius="md" withBorder>
                      <Text size="xs" c="dimmed" tt="uppercase">
                        Ganados
                      </Text>
                      <Text size="lg" fw={700} c="green">
                        {distribucionPuntos.totalPuntosGanados.toLocaleString()}
                      </Text>
                    </Paper>
                    <Paper p="md" radius="md" withBorder>
                      <Text size="xs" c="dimmed" tt="uppercase">
                        Gastados
                      </Text>
                      <Text size="lg" fw={700} c="red">
                        {distribucionPuntos.totalPuntosGastados.toLocaleString()}
                      </Text>
                    </Paper>
                    <Paper p="md" radius="md" withBorder>
                      <Text size="xs" c="dimmed" tt="uppercase">
                        Balance
                      </Text>
                      <Text size="lg" fw={700} c="blue">
                        {distribucionPuntos.balanceTotal.toLocaleString()}
                      </Text>
                    </Paper>
                  </SimpleGrid>
                  <div>
                    <Text size="sm" fw={500} mb="xs">
                      Por Tipo:
                    </Text>
                    <Group justify="center" mt="md">
                      <RingProgress
                        size={180}
                        thickness={20}
                        sections={distribucionPuntos.distribucionPorTipo.map(
                          (tipo, idx) => ({
                            value: tipo.porcentaje,
                            color: idx === 0 ? 'blue' : 'cyan',
                            tooltip: `${
                              tipo.nombreMostrar
                            }: ${tipo.cantidad.toLocaleString()}`,
                          })
                        )}
                        label={
                          <Center>
                            <Text size="xs" ta="center">
                              Total
                            </Text>
                          </Center>
                        }
                      />
                    </Group>
                  </div>
                </Stack>
              </Card>
            )}
          </Grid.Col>
        </Grid>

        {/* Estadísticas de Logros */}
        {estadisticasLogros && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              <Group gap="xs">
                <Award size={24} />
                Estadísticas de Logros
              </Group>
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text>Total Logros:</Text>
                    <Text fw={700}>{estadisticasLogros.totalLogros}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Logros Activos:</Text>
                    <Text fw={700}>{estadisticasLogros.logrosActivos}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Tasa Desbloqueo Promedio:</Text>
                    <Text fw={700}>
                      {estadisticasLogros.tasaDesbloqueoPromedio.toFixed(2)}%
                    </Text>
                  </Group>
                  <div>
                    <Text size="sm" fw={500} mb="xs">
                      Por Rareza:
                    </Text>
                    {estadisticasLogros.logrosPorRareza.map((rareza) => (
                      <Group
                        key={rareza.rareza}
                        justify="space-between"
                        mb="xs"
                      >
                        <Badge color={rarezaColor[rareza.rareza]}>
                          {rareza.rareza}
                        </Badge>
                        <Text size="sm">
                          {rareza.cantidad} ({rareza.porcentaje.toFixed(1)}%)
                        </Text>
                      </Group>
                    ))}
                  </div>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Text size="sm" fw={500} mb="xs">
                  Logros Populares:
                </Text>
                <Stack gap="xs">
                  {estadisticasLogros.logrosPopulares.map((logro) => (
                    <Paper key={logro.logroId} p="md" radius="md" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Group>
                          <ThemeIcon
                            color={rarezaColor[logro.rareza]}
                            variant="light"
                          >
                            <Trophy size={18} />
                          </ThemeIcon>
                          <div>
                            <Text fw={500}>{logro.nombre}</Text>
                            <Text size="xs" c="dimmed">
                              {logro.descripcion}
                            </Text>
                          </div>
                        </Group>
                        <Badge color={rarezaColor[logro.rareza]}>
                          {logro.rareza}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs">
                          Desbloqueado: {logro.vecesDesbloqueado} veces
                        </Text>
                        <Progress
                          value={logro.tasaDesbloqueo}
                          w={150}
                          size="sm"
                          color={rarezaColor[logro.rareza]}
                        />
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        )}

        {/* Desafíos Activos */}
        {desafiosActivos && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              <Group gap="xs">
                <Target size={24} />
                Desafíos Activos
              </Group>
            </Title>
            <Tabs defaultValue="diarios">
              <Tabs.List>
                <Tabs.Tab value="diarios">
                  Diarios ({desafiosActivos.desafiosDiarios.length})
                </Tabs.Tab>
                <Tabs.Tab value="semanales">
                  Semanales ({desafiosActivos.desafiosSemanales.length})
                </Tabs.Tab>
                <Tabs.Tab value="especiales">
                  Especiales ({desafiosActivos.desafiosEspeciales.length})
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="diarios" pt="md">
                <Stack gap="sm">
                  {desafiosActivos.desafiosDiarios.map((desafio) => (
                    <Paper
                      key={desafio.desafioId}
                      p="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" mb="xs">
                        <div>
                          <Text fw={500}>{desafio.titulo}</Text>
                          <Text size="sm" c="dimmed">
                            {desafio.descripcion}
                          </Text>
                        </div>
                        <Badge color={dificultadColor[desafio.dificultad]}>
                          {desafio.dificultad}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs">
                          <Calendar
                            size={14}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          {new Date(desafio.fechaFin).toLocaleDateString()}
                        </Text>
                        <Text size="xs">
                          <Users
                            size={14}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          {desafio.participantesActuales} participantes
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="semanales" pt="md">
                <Stack gap="sm">
                  {desafiosActivos.desafiosSemanales.map((desafio) => (
                    <Paper
                      key={desafio.desafioId}
                      p="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" mb="xs">
                        <div>
                          <Text fw={500}>{desafio.titulo}</Text>
                          <Text size="sm" c="dimmed">
                            {desafio.descripcion}
                          </Text>
                        </div>
                        <Badge color={dificultadColor[desafio.dificultad]}>
                          {desafio.dificultad}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs">
                          <Calendar
                            size={14}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          {new Date(desafio.fechaFin).toLocaleDateString()}
                        </Text>
                        <Text size="xs">
                          <Users
                            size={14}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          {desafio.participantesActuales} participantes
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="especiales" pt="md">
                <Stack gap="sm">
                  {desafiosActivos.desafiosEspeciales.map((desafio) => (
                    <Paper
                      key={desafio.desafioId}
                      p="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" mb="xs">
                        <div>
                          <Text fw={500}>{desafio.titulo}</Text>
                          <Text size="sm" c="dimmed">
                            {desafio.descripcion}
                          </Text>
                        </div>
                        <Badge color={dificultadColor[desafio.dificultad]}>
                          {desafio.dificultad}
                        </Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs">
                          <Calendar
                            size={14}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          {new Date(desafio.fechaFin).toLocaleDateString()}
                        </Text>
                        <Text size="xs">
                          <Users
                            size={14}
                            style={{
                              display: 'inline',
                              verticalAlign: 'middle',
                            }}
                          />{' '}
                          {desafio.participantesActuales}
                          {desafio.maxParticipantes &&
                            ` / ${desafio.maxParticipantes}`}{' '}
                          participantes
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        )}

        {/* Transacciones Recientes */}
        <TransaccionesTable transacciones={transacciones} />

        {/* Actividad del Usuario */}
        {actividadUsuario && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              <Group gap="xs">
                <TrendingUp size={24} />
                Actividad del Usuario
              </Group>
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Stack gap="md">
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Días Activos
                    </Text>
                    <Text size="xl" fw={700}>
                      {actividadUsuario.diasActivos}
                    </Text>
                  </Paper>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Racha Actual
                    </Text>
                    <Text size="xl" fw={700} c="orange">
                      {actividadUsuario.rachaActual} días
                    </Text>
                  </Paper>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Mejor Racha
                    </Text>
                    <Text size="xl" fw={700} c="blue">
                      {actividadUsuario.mejorRacha} días
                    </Text>
                  </Paper>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 9 }}>
                <Text size="sm" fw={500} mb="xs">
                  Actividad por Día:
                </Text>
                <Stack gap="xs">
                  {actividadUsuario.actividadPorDia.map((dia) => (
                    <Paper key={dia.fecha} p="sm" radius="md" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>
                          {new Date(dia.fecha).toLocaleDateString()}
                        </Text>
                        <Group gap="md">
                          <Text size="xs">
                            Transacciones:{' '}
                            <Text component="span" fw={600}>
                              {dia.transacciones}
                            </Text>
                          </Text>
                          <Text size="xs">
                            Puntos:{' '}
                            <Text component="span" fw={600} c="green">
                              {dia.puntosGanados}
                            </Text>
                          </Text>
                          <Text size="xs">
                            Logros:{' '}
                            <Text component="span" fw={600} c="yellow">
                              {dia.logrosDesbloqueados}
                            </Text>
                          </Text>
                        </Group>
                      </Group>
                      <Progress
                        value={(dia.puntosGanados / 1000) * 100}
                        color="blue"
                        size="sm"
                      />
                    </Paper>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        )}
      </Stack>
    </Container>
  );
};
