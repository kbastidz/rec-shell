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
  ThemeIcon,
  Loader,
  Alert,
  RingProgress,
  ActionIcon,
  Tooltip,
  Paper,
  SimpleGrid,
  Box,
  Divider,
  Select,
  Button
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
  IconEye,
  IconRefresh
} from '@tabler/icons-react';
import { useDashboard } from '../hooks/useDashboard';

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
const CultivoCard = ({ cultivo, onVerDetalle }) => {
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
            {cultivo.parametrosActuales?.temperatura ?? '—'}°C
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconDroplet size={14} color="blue" />
            <Text size="xs" c="dimmed">Humedad</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales?.humedadSuelo ?? 0}%
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconFlask size={14} color="purple" />
            <Text size="xs" c="dimmed">pH</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales?.phSuelo ?? 0}
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconSun size={14} color="yellow" />
            <Text size="xs" c="dimmed">Sol</Text>
          </Group>
          <Text size="sm" fw={600}>
            {cultivo.parametrosActuales?.horasSol ?? 0}h
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

      <Button 
        fullWidth 
        mt="md" 
        variant="light"
        onClick={() => onVerDetalle(cultivo.id)}
      >
        Ver Detalle
      </Button>
    </Card>
  );
};

// Componente principal
export const DashboardAdmin = () => {
  const {
    resumen,
    estadisticasGenerales,
    cultivosActivos,
    cultivoDetalle,
    alertas,
    proximasActividades,
    estadisticasDeficiencias,
    estadisticasTratamientos,
    loading,
    error,
    obtenerResumen,
    obtenerEstadisticasGenerales,
    obtenerCultivosActivos,
    obtenerDetalleCultivo,
    obtenerAlertas,
    obtenerProximasActividades,
    obtenerEstadisticasDeficiencias,
    obtenerEstadisticasTratamientos,
    clearError
  } = useDashboard();

  const [filtros, setFiltros] = useState({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    fechaFin: new Date().toISOString(),
    cultivoIds: [],
    estadoCultivo: 'ACTIVO',
    severidadMinima: 'BAJA'
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      // Cargar resumen principal (incluye estadísticas, cultivos, alertas y actividades)
      await obtenerResumen(filtros);
      
      // Cargar datos adicionales específicos si es necesario
      await obtenerEstadisticasGenerales({
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      });
      
      await obtenerCultivosActivos(filtros.cultivoIds);
      
      await obtenerAlertas({
        tipo: '',
        severidad: '',
        soloNoLeidas: false
      });
      
      await obtenerProximasActividades({
        dias: 30,
        soloPrioridadAlta: false
      });
      
      await obtenerEstadisticasDeficiencias({
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      });
      
      await obtenerEstadisticasTratamientos({
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin
      });
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const handleVerDetalleCultivo = async (id) => {
    try {
      await obtenerDetalleCultivo(id);
    } catch (err) {
      console.error('Error obteniendo detalle:', err);
    }
  };

  const handleRefresh = () => {
    cargarDatosIniciales();
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" style={{ minHeight: 400 }}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Cargando dashboard...</Text>
          </Stack>
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert 
          color="red" 
          title="Error al cargar datos" 
          icon={<IconAlertTriangle />}
          withCloseButton
          onClose={clearError}
        >
          {error}
          <Button 
            variant="light" 
            size="xs" 
            mt="md"
            onClick={handleRefresh}
          >
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  // Si tenemos resumen, usamos sus datos anidados
  const stats = resumen?.estadisticasGenerales || estadisticasGenerales;
  const cultivos = resumen?.cultivosActivos || cultivosActivos;
  const alertasData = resumen?.alertasRecientes || alertas;
  const actividades = resumen?.proximasActividades || proximasActividades;
  const deficiencias = resumen?.estadisticasDeficiencias || estadisticasDeficiencias;
  const tratamientos = resumen?.estadisticasTratamientos || estadisticasTratamientos;

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>
          Dashboard Agrícola de Cacao
        </Title>
        <Button 
          leftSection={<IconRefresh size={16} />}
          variant="light"
          onClick={handleRefresh}
          loading={loading}
        >
          Actualizar
        </Button>
      </Group>

      {/* Estadísticas Generales */}
      {stats && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
          <StatCard
            title="Cultivos Activos"
            value={stats.cultivosActivos}
            icon={IconPlant}
            color="green"
            subtitle={`${stats.areaTotal} hectáreas`}
          />
          <StatCard
            title="Análisis del Mes"
            value={stats.analisisMesActual}
            icon={IconChartBar}
            color="blue"
            subtitle={`${stats.totalAnalisis} total`}
          />
          <StatCard
            title="Deficiencias"
            value={stats.deficienciasDetectadas}
            icon={IconAlertTriangle}
            color="orange"
            subtitle="Detectadas actualmente"
          />
          <StatCard
            title="Costos Tratamientos"
            value={`$${stats.costoTotalTratamientos.toFixed(2)}`}
            icon={IconCurrencyDollar}
            color="teal"
            subtitle={`${stats.tratamientosActivos} activos`}
          />
        </SimpleGrid>
      )}

      <Grid gutter="lg">
        {/* Cultivos Activos */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Cultivos Activos
            </Title>
            {cultivos && cultivos.length > 0 ? (
              <Stack gap="md">
                {cultivos.map((cultivo) => (
                  <CultivoCard 
                    key={cultivo.id} 
                    cultivo={cultivo}
                    onVerDetalle={handleVerDetalleCultivo}
                  />
                ))}
              </Stack>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No hay cultivos activos
              </Text>
            )}
          </Card>
        </Grid.Col>

        {/* Alertas y Actividades */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            {/* Alertas */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Alertas Recientes</Title>
                {alertasData && (
                  <Badge color="red" variant="filled">
                    {alertasData.filter(a => !a.leida).length}
                  </Badge>
                )}
              </Group>
              {alertasData && alertasData.length > 0 ? (
                <Stack gap="sm">
                  {alertasData.slice(0, 5).map((alerta) => (
                    <AlertCard key={alerta.id} alerta={alerta} />
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed" ta="center" py="md">
                  No hay alertas recientes
                </Text>
              )}
            </Card>

            {/* Próximas Actividades */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Próximas Actividades
              </Title>
              {actividades && actividades.length > 0 ? (
                <Stack gap="sm">
                  {actividades.map((actividad) => (
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
                          ${actividad.costoReal != null ? actividad.costoReal.toFixed(2) : '0.00'}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">
                        Responsable: {actividad.responsable}
                      </Text>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Text c="dimmed" ta="center" py="md">
                  No hay actividades programadas
                </Text>
              )}
            </Card>
          </Stack>
        </Grid.Col>

        {/* Estadísticas de Deficiencias */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Estadísticas de Deficiencias
            </Title>
            {deficiencias ? (
              <>
                <Group justify="space-between" mb="lg">
                  <Box>
                    <Text size="sm" c="dimmed">Total Detectadas</Text>
                    <Text size="xl" fw={700}>
                      {deficiencias.totalDeficienciasDetectadas}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Confianza Promedio</Text>
                    <Text size="xl" fw={700}>
                      {deficiencias.promedioConfianza.toFixed(1)}%
                    </Text>
                  </Box>
                </Group>

                {deficiencias.deficienciasMasFrecuentes && deficiencias.deficienciasMasFrecuentes.length > 0 && (
                  <>
                    <Text size="sm" fw={600} mb="xs">
                      Más Frecuentes
                    </Text>
                    <Stack gap="xs">
                      {deficiencias.deficienciasMasFrecuentes.map((def, idx) => (
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
                  </>
                )}
              </>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No hay estadísticas de deficiencias
              </Text>
            )}
          </Card>
        </Grid.Col>

        {/* Estadísticas de Tratamientos */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Estadísticas de Tratamientos
            </Title>
            
            {tratamientos ? (
              <>
                <SimpleGrid cols={3} spacing="md" mb="lg">
                  <Box>
                    <Text size="xs" c="dimmed" mb={4}>Total</Text>
                    <Text size="lg" fw={700}>
                      {tratamientos.totalTratamientos}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed" mb={4}>Completados</Text>
                    <Group gap={4}>
                      <IconCheck size={16} color="green" />
                      <Text size="lg" fw={700}>
                        {tratamientos.tratamientosCompletados}
                      </Text>
                    </Group>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed" mb={4}>Pendientes</Text>
                    <Group gap={4}>
                      <IconClock size={16} color="orange" />
                      <Text size="lg" fw={700}>
                        {tratamientos.tratamientosPendientes}
                      </Text>
                    </Group>
                  </Box>
                </SimpleGrid>

                <Divider mb="md" />

                <Group justify="space-between" mb="md">
                  <Text size="sm" fw={600}>Costo Total</Text>
                  <Text size="xl" fw={700} c="teal">
                    ${tratamientos.costoTotal.toFixed(2)}
                  </Text>
                </Group>

                {tratamientos.tratamientosPorTipo && tratamientos.tratamientosPorTipo.length > 0 && (
                  <>
                    <Text size="sm" fw={600} mb="xs">
                      Por Tipo de Tratamiento
                    </Text>
                    <Stack gap="xs">
                      {tratamientos.tratamientosPorTipo.map((tipo, idx) => (
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
                  </>
                )}
              </>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No hay estadísticas de tratamientos
              </Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};