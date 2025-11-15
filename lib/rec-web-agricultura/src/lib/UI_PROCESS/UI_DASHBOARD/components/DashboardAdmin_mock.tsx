import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Badge,
  Stack,
  Progress,
  ThemeIcon,
  Loader,
  Alert,
  Tabs,
  RingProgress,
  Table,
  ActionIcon,
  Tooltip,
  Paper,
  SimpleGrid,
  Box,
  Divider
} from '@mantine/core';
import {
  IconPlant,
  IconAlertTriangle,
  IconCalendarEvent,
  IconChartBar,
  IconDroplet,
  IconSun,
  IconTemperature,
  IconFlask,
  IconCurrencyDollar,
  IconCheck,
  IconClock,
  IconEye
} from '@tabler/icons-react';

// Simulación del hook (reemplaza con tu hook real)
const useDashboard = () => {
  const [state, setState] = useState({
    resumen: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setState({
        resumen: {
          estadisticasGenerales: {
            totalCultivos: 1,
            cultivosActivos: 1,
            areaTotal: 5.5,
            totalAnalisis: 1,
            analisisMesActual: 1,
            deficienciasDetectadas: 1,
            tratamientosActivos: 1,
            actividadesPendientes: 1,
            costoTotalTratamientos: 500.00
          },
          cultivosActivos: [
            {
              id: 1,
              nombreCultivo: "Cacao Nacional",
              variedadCacao: "Nacional Arriba",
              areaHectareas: 5.5,
              estadoCultivo: "ACTIVO",
              ubicacionNombre: "Finca Los Ríos",
              analisisRealizados: 1,
              deficienciasActivas: 1,
              ultimoAnalisis: "2025-11-10T12:00:00",
              saludGeneral: "REGULAR",
              parametrosActuales: {
                temperatura: 28.7,
                humedadSuelo: 55.3,
                phSuelo: 6.5,
                horasSol: 8.5,
                fechaMedicion: "2025-11-10T12:00:00"
              }
            }
          ],
          alertasRecientes: [
            {
              id: 1,
              tipo: "DEFICIENCIA",
              severidad: "ALTA",
              mensaje: "Deficiencia severa detectada: Nitrógeno bajo",
              cultivoNombre: "Cacao Nacional",
              cultivoId: 1,
              fechaGeneracion: "2025-11-10T12:00:00",
              leida: false
            },
            {
              id: 2,
              tipo: "ACTIVIDAD",
              severidad: "MEDIA",
              mensaje: "Actividad vencida: Aplicación Fertilizante",
              cultivoNombre: "Cacao Nacional",
              cultivoId: 1,
              fechaGeneracion: "2025-03-05T00:00:00",
              leida: false
            }
          ],
          proximasActividades: [
            {
              id: 1,
              nombreActividad: "Aplicación Fertilizante",
              descripcion: "Primera aplicación de fertilizante",
              fechaProgramada: "2025-03-05T00:00:00",
              estado: "PENDIENTE",
              prioridad: "ALTA",
              cultivoNombre: "Cacao Nacional",
              cultivoId: 1,
              costoReal: 120.00,
              responsable: "Técnico Agrícola",
              diasRestantes: -250
            }
          ],
          estadisticasDeficiencias: {
            totalDeficienciasDetectadas: 1,
            deficienciasMasFrecuentes: [
              {
                nombreDeficiencia: "Nitrógeno bajo",
                nutrienteDeficiente: "Nitrógeno",
                cantidadDetecciones: 1,
                porcentaje: 100
              }
            ],
            tendenciaMensual: [
              {
                mes: 11,
                anio: 2025,
                cantidad: 1,
                nombreMes: "Noviembre"
              }
            ],
            promedioConfianza: 95.50
          },
          estadisticasTratamientos: {
            totalTratamientos: 1,
            tratamientosCompletados: 0,
            tratamientosPendientes: 1,
            tratamientosEnProceso: 0,
            costoTotal: 500.00,
            costoPromedio: 500.00,
            tratamientosPorTipo: [
              {
                tipoTratamiento: "Foliar",
                cantidad: 1,
                costoTotal: 500.00
              }
            ]
          }
        },
        loading: false,
        error: null
      });
    }, 1000);
  }, []);

  return state;
};

// Componente de estadística
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="space-between" mb="xs">
      <ThemeIcon size="xl" radius="md" color={color} variant="light">
        <Icon size={24} />
      </ThemeIcon>
      <Box style={{ flex: 1, marginLeft: 16 }}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {title}
        </Text>
        <Text size="xl" fw={700}>
          {value}
        </Text>
        {subtitle && (
          <Text size="xs" c="dimmed" mt={4}>
            {subtitle}
          </Text>
        )}
      </Box>
    </Group>
  </Card>
);

// Componente de alerta
const AlertCard = ({ alerta }) => {
  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'ALTA': return 'red';
      case 'MEDIA': return 'yellow';
      case 'BAJA': return 'blue';
      default: return 'gray';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'DEFICIENCIA': return IconAlertTriangle;
      case 'ACTIVIDAD': return IconCalendarEvent;
      default: return IconAlertTriangle;
    }
  };

  const Icon = getTipoIcon(alerta.tipo);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" wrap="nowrap">
        <Group wrap="nowrap">
          <ThemeIcon 
            size="lg" 
            radius="md" 
            color={getSeverityColor(alerta.severidad)}
            variant="light"
          >
            <Icon size={20} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={600}>
              {alerta.mensaje}
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xs" c="dimmed">
                {alerta.cultivoNombre}
              </Text>
              <Badge size="xs" color={getSeverityColor(alerta.severidad)}>
                {alerta.severidad}
              </Badge>
            </Group>
          </Box>
        </Group>
        {!alerta.leida && (
          <Tooltip label="Marcar como leída">
            <ActionIcon variant="subtle" color="gray">
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Card>
  );
};

// Componente de cultivo
const CultivoCard = ({ cultivo }) => {
  const getSaludColor = (salud) => {
    switch (salud) {
      case 'BUENA': return 'green';
      case 'REGULAR': return 'yellow';
      case 'CRITICA': return 'red';
      default: return 'gray';
    }
  };

  const getSaludValue = (salud) => {
    switch (salud) {
      case 'BUENA': return 85;
      case 'REGULAR': return 55;
      case 'CRITICA': return 25;
      default: return 50;
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Box>
          <Text size="lg" fw={700}>
            {cultivo.nombreCultivo}
          </Text>
          <Text size="sm" c="dimmed">
            {cultivo.variedadCacao}
          </Text>
        </Box>
        <Badge color={cultivo.estadoCultivo === 'ACTIVO' ? 'green' : 'gray'}>
          {cultivo.estadoCultivo}
        </Badge>
      </Group>

      <Group mb="md">
        <RingProgress
          size={80}
          thickness={8}
          sections={[{ value: getSaludValue(cultivo.saludGeneral), color: getSaludColor(cultivo.saludGeneral) }]}
          label={
            <Text size="xs" ta="center" fw={700}>
              {cultivo.saludGeneral}
            </Text>
          }
        />
        <Box style={{ flex: 1 }}>
          <Group gap="xs">
            <IconPlant size={16} />
            <Text size="sm">
              {cultivo.areaHectareas} ha
            </Text>
          </Group>
          <Group gap="xs" mt={4}>
            <Text size="sm" c="dimmed">
              {cultivo.ubicacionNombre}
            </Text>
          </Group>
        </Box>
      </Group>

      <Divider mb="md" />

      <SimpleGrid cols={2} spacing="xs">
        <Box>
          <Group gap={4}>
            <IconTemperature size={14} color="orange" />
            <Text size="xs" c="dimmed">Temp</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales.temperatura}°C
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconDroplet size={14} color="blue" />
            <Text size="xs" c="dimmed">Humedad</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales.humedadSuelo}%
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconFlask size={14} color="purple" />
            <Text size="xs" c="dimmed">pH</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales.phSuelo}
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconSun size={14} color="yellow" />
            <Text size="xs" c="dimmed">Sol</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales.horasSol}h
          </Text>
        </Box>
      </SimpleGrid>

      <Group justify="space-between" mt="md">
        <Text size="xs" c="dimmed">
          Análisis: {cultivo.analisisRealizados}
        </Text>
        <Text size="xs" c="dimmed">
          Deficiencias: {cultivo.deficienciasActivas}
        </Text>
      </Group>
    </Card>
  );
};

// Componente principal
export const DashboardAdmin_mock = () => {
  const { resumen, loading, error } = useDashboard();

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" style={{ minHeight: 400 }}>
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="Error" icon={<IconAlertTriangle />}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!resumen) return null;

  const { estadisticasGenerales, cultivosActivos, alertasRecientes, proximasActividades, estadisticasDeficiencias, estadisticasTratamientos } = resumen;

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Dashboard Agrícola de Cacao
      </Title>

      {/* Estadísticas Generales */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        <StatCard
          title="Cultivos Activos"
          value={estadisticasGenerales.cultivosActivos}
          icon={IconPlant}
          color="green"
          subtitle={`${estadisticasGenerales.areaTotal} hectáreas`}
        />
        <StatCard
          title="Análisis del Mes"
          value={estadisticasGenerales.analisisMesActual}
          icon={IconChartBar}
          color="blue"
          subtitle={`${estadisticasGenerales.totalAnalisis} total`}
        />
        <StatCard
          title="Deficiencias"
          value={estadisticasGenerales.deficienciasDetectadas}
          icon={IconAlertTriangle}
          color="orange"
          subtitle="Detectadas actualmente"
        />
        <StatCard
          title="Costos Tratamientos"
          value={`$${estadisticasGenerales.costoTotalTratamientos.toFixed(2)}`}
          icon={IconCurrencyDollar}
          color="teal"
          subtitle={`${estadisticasGenerales.tratamientosActivos} activos`}
        />
      </SimpleGrid>

      <Grid gutter="lg">
        {/* Cultivos Activos */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Cultivos Activos
            </Title>
            <Stack gap="md">
              {cultivosActivos.map((cultivo) => (
                <CultivoCard key={cultivo.id} cultivo={cultivo} />
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Alertas y Actividades */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            {/* Alertas */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Alertas Recientes</Title>
                <Badge color="red" variant="filled">
                  {alertasRecientes.filter(a => !a.leida).length}
                </Badge>
              </Group>
              <Stack gap="sm">
                {alertasRecientes.slice(0, 3).map((alerta) => (
                  <AlertCard key={alerta.id} alerta={alerta} />
                ))}
              </Stack>
            </Card>

            {/* Próximas Actividades */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Próximas Actividades
              </Title>
              <Stack gap="sm">
                {proximasActividades.map((actividad) => (
                  <Card key={actividad.id} padding="md" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={600}>
                        {actividad.nombreActividad}
                      </Text>
                      <Badge color={actividad.prioridad === 'ALTA' ? 'red' : 'blue'}>
                        {actividad.prioridad}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed" mb="xs">
                      {actividad.descripcion}
                    </Text>
                    <Group justify="space-between">
                      <Group gap="xs">
                        <IconCalendarEvent size={14} />
                        <Text size="xs">
                          {new Date(actividad.fechaProgramada).toLocaleDateString()}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        ${actividad.costoReal.toFixed(2)}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Estadísticas de Deficiencias */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Estadísticas de Deficiencias
            </Title>
            <Group justify="space-between" mb="lg">
              <Box>
                <Text size="sm" c="dimmed">Total Detectadas</Text>
                <Text size="xl" fw={700}>
                  {estadisticasDeficiencias.totalDeficienciasDetectadas}
                </Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Confianza Promedio</Text>
                <Text size="xl" fw={700}>
                  {estadisticasDeficiencias.promedioConfianza.toFixed(1)}%
                </Text>
              </Box>
            </Group>

            <Text size="sm" fw={600} mb="xs">
              Más Frecuentes
            </Text>
            <Stack gap="xs">
              {estadisticasDeficiencias.deficienciasMasFrecuentes.map((def, idx) => (
                <Paper key={idx} p="sm" withBorder>
                  <Group justify="space-between">
                    <Box>
                      <Text size="sm" fw={500}>
                        {def.nombreDeficiencia}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {def.nutrienteDeficiente}
                      </Text>
                    </Box>
                    <Box ta="right">
                      <Text size="sm" fw={600}>
                        {def.cantidadDetecciones}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {def.porcentaje}%
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Estadísticas de Tratamientos */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Estadísticas de Tratamientos
            </Title>
            
            <SimpleGrid cols={3} spacing="md" mb="lg">
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Total</Text>
                <Text size="lg" fw={700}>
                  {estadisticasTratamientos.totalTratamientos}
                </Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Completados</Text>
                <Group gap={4}>
                  <IconCheck size={16} color="green" />
                  <Text size="lg" fw={700}>
                    {estadisticasTratamientos.tratamientosCompletados}
                  </Text>
                </Group>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Pendientes</Text>
                <Group gap={4}>
                  <IconClock size={16} color="orange" />
                  <Text size="lg" fw={700}>
                    {estadisticasTratamientos.tratamientosPendientes}
                  </Text>
                </Group>
              </Box>
            </SimpleGrid>

            <Divider mb="md" />

            <Group justify="space-between" mb="md">
              <Text size="sm" fw={600}>Costo Total</Text>
              <Text size="xl" fw={700} c="teal">
                ${estadisticasTratamientos.costoTotal.toFixed(2)}
              </Text>
            </Group>

            <Text size="sm" fw={600} mb="xs">
              Por Tipo de Tratamiento
            </Text>
            <Stack gap="xs">
              {estadisticasTratamientos.tratamientosPorTipo.map((tipo, idx) => (
                <Paper key={idx} p="sm" withBorder>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      {tipo.tipoTratamiento}
                    </Text>
                    <Group gap="lg">
                      <Text size="xs" c="dimmed">
                        Cant: {tipo.cantidad}
                      </Text>
                      <Text size="sm" fw={600}>
                        ${tipo.costoTotal.toFixed(2)}
                      </Text>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

