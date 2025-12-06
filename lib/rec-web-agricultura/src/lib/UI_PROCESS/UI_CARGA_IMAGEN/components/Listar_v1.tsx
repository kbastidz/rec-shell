import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  TextInput,
  Select,
  Grid,
  ActionIcon,
  Loader,
  Center,
  Paper,
  Menu,
  Divider,
  Modal,
  Timeline,
  ThemeIcon,
  Progress,
  Alert,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconDownload,
  IconDots,
  IconRefresh,
  IconPlant,
  IconCalendar,
  IconClock,
  IconAlertTriangle,
  IconLeaf,
  IconMapPin,
  IconCloudRain,
  IconFileText,
  IconChartBar,
  IconDroplet,
  IconX,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useGuardarAnalisis } from '../hook/useAgricultura';
import { AnalisisResponse, ResultadoDetalle } from '../../../types/dto';

export function Listar() {
  const { 
    loading, 
    listaAnalisis, 
    obtenerTodosAnalisis,
    obtenerResultados
  } = useGuardarAnalisis();

  const [busqueda, setBusqueda] = useState('');
  const [filtroSeveridad, setFiltroSeveridad] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [resultadoDetalle, setResultadoDetalle] = useState<ResultadoDetalle | null>(null);
  const [analisisSeleccionado, setAnalisisSeleccionado] = useState<AnalisisResponse | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    obtenerTodosAnalisis();
  }, []);

  const handleRefresh = () => {
    obtenerTodosAnalisis();
  };

  const handleVerDetalles = async (id: number) => {
    setLoadingDetalle(true);
    setModalAbierto(true);
    
    const analisis = (listaAnalisis as any as AnalisisResponse[]).find(a => a.id === id);
    setAnalisisSeleccionado(analisis || null);
    
    try {
      const resultados = await obtenerResultados(id);
      if (resultados) {
        
        setResultadoDetalle(resultados);
      } else {
        setResultadoDetalle(null);
      }
      
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setResultadoDetalle(null);
    setAnalisisSeleccionado(null);
  };

  const getSeveridadColor = (severidad?: string) => {
    if (!severidad) return 'gray';
    const sev = severidad.toUpperCase();
    switch (sev) {
      case 'SEVERA':
        return 'red';
      case 'MODERADA':
        return 'orange';
      case 'LEVE':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getEstadoColor = (estado: string) => {
    const est = estado.toUpperCase();
    switch (est) {
      case 'COMPLETADO':
        return 'green';
      case 'PROCESANDO':
        return 'blue';
      case 'FALLIDO':
        return 'red';
      case 'PENDIENTE':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearTamano = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const analisisFiltrados = (listaAnalisis as any as AnalisisResponse[]).filter((analisis) => {
    const cumpleBusqueda = 
      busqueda === '' ||
      analisis.nombreImagen?.toLowerCase().includes(busqueda.toLowerCase()) ||
      analisis.nombreCultivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      analisis.diagnosticoPrincipal?.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleSeveridad = 
      !filtroSeveridad || 
      analisis.severidad?.toUpperCase() === filtroSeveridad.toUpperCase();

    const cumpleEstado = 
      !filtroEstado || 
      analisis.estadoProcesamiento?.toUpperCase() === filtroEstado.toUpperCase();

    return cumpleBusqueda && cumpleSeveridad && cumpleEstado;
  });

  if (loading && listaAnalisis.length === 0) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text c="dimmed">Cargando análisis...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Análisis de Cultivos</Title>
            <Text c="dimmed" size="sm">
              Gestiona y visualiza todos los análisis realizados
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={handleRefresh}
            loading={loading}
            variant="light"
          >
            Actualizar
          </Button>
        </Group>

        {/* Filtros y búsqueda */}
        <Paper shadow="xs" p="md" radius="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                placeholder="Buscar por nombre, cultivo o diagnóstico..."
                leftSection={<IconSearch size={16} />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.currentTarget.value)}
                rightSectionPointerEvents="all"
                rightSection={
                  busqueda && (
                    <ActionIcon
                      variant="subtle"
                      onClick={() => setBusqueda('')}
                    >
                      ×
                    </ActionIcon>
                  )
                }
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                placeholder="Filtrar por severidad"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'LEVE', label: 'Leve' },
                  { value: 'MODERADA', label: 'Moderada' },
                  { value: 'SEVERA', label: 'Severa' },
                ]}
                value={filtroSeveridad}
                onChange={setFiltroSeveridad}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                placeholder="Filtrar por estado"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'COMPLETADO', label: 'Completado' },
                  { value: 'PROCESANDO', label: 'Procesando' },
                  { value: 'FALLIDO', label: 'Fallido' },
                  { value: 'PENDIENTE', label: 'Pendiente' },
                ]}
                value={filtroEstado}
                onChange={setFiltroEstado}
                clearable
              />
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Contador de resultados */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {analisisFiltrados.length} {analisisFiltrados.length === 1 ? 'resultado' : 'resultados'}
          </Text>
        </Group>

        {/* Lista de análisis */}
        {analisisFiltrados.length === 0 ? (
          <Paper shadow="xs" p="xl" radius="md">
            <Center>
              <Stack align="center" gap="md">
                <IconPlant size={48} stroke={1.5} color="gray" />
                <Text c="dimmed">No se encontraron análisis</Text>
                {(busqueda || filtroSeveridad || filtroEstado) && (
                  <Button
                    variant="light"
                    onClick={() => {
                      setBusqueda('');
                      setFiltroSeveridad(null);
                      setFiltroEstado(null);
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </Stack>
            </Center>
          </Paper>
        ) : (
          <Grid>
            {analisisFiltrados.map((analisis) => {
              const baseUrl = '';
              const imagenUrl = analisis.rutaImagenProcesada 
                ? `${baseUrl}${analisis.rutaImagenProcesada}`
                : `${baseUrl}${analisis.rutaImagenOriginal}`;

              return (
                <Grid.Col key={analisis.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                    <Card.Section>
                      <div
                        style={{
                          height: 200,
                          backgroundImage: `url(${imagenUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#f1f3f5',
                        }}
                      />
                    </Card.Section>

                    <Stack gap="md" mt="md">
                      <Group justify="space-between" wrap="nowrap">
                        {analisis.severidad && (
                          <Badge
                            color={getSeveridadColor(analisis.severidad)}
                            variant="light"
                            leftSection={<IconAlertTriangle size={12} />}
                            style={{ textTransform: 'capitalize' }}
                          >
                            {analisis.severidad}
                          </Badge>
                        )}
                        <Badge
                          color={getEstadoColor(analisis.estadoProcesamiento)}
                          variant="dot"
                          ml="auto"
                        >
                          {analisis.estadoProcesamiento}
                        </Badge>
                      </Group>

                      <div>
                        <Text fw={600} size="lg" lineClamp={1}>
                          {analisis.nombreImagen}
                        </Text>
                        {analisis.diagnosticoPrincipal && (
                          <Text size="sm" c="blue" fw={500} mt={4}>
                            {analisis.diagnosticoPrincipal}
                          </Text>
                        )}
                        {analisis.observacionesIa && (
                          <Text size="sm" c="dimmed" lineClamp={2} mt={4}>
                            {analisis.observacionesIa}
                          </Text>
                        )}
                      </div>

                      <Divider />

                      <Stack gap="xs">
                        <Group gap="xs">
                          <IconLeaf size={14} stroke={1.5} color="gray" />
                          <Text size="xs" c="dimmed" fw={500}>
                            {analisis.nombreCultivo}
                          </Text>
                        </Group>
                        
                        <Group gap="xs">
                          <IconCalendar size={14} stroke={1.5} color="gray" />
                          <Text size="xs" c="dimmed">
                            {formatearFecha(analisis.fechaAnalisis)}
                          </Text>
                        </Group>
                        
                        {analisis.tiempoProcesamintoSegundos && (
                          <Group gap="xs">
                            <IconClock size={14} stroke={1.5} color="gray" />
                            <Text size="xs" c="dimmed">
                              {analisis.tiempoProcesamintoSegundos}s de procesamiento
                            </Text>
                          </Group>
                        )}

                        {analisis.confianzaPrediccion !== undefined && (
                          <Group gap="xs" justify="space-between">
                            <Text size="xs" c="dimmed">
                              Confianza de predicción:
                            </Text>
                            <Badge size="sm" variant="light" color="teal">
                              {(analisis.confianzaPrediccion * 100).toFixed(1)}%
                            </Badge>
                          </Group>
                        )}

                        {analisis.metadatosImagen && (
                          <>
                            {analisis.metadatosImagen.resolucion && (
                              <Group gap="xs" justify="space-between">
                                <Text size="xs" c="dimmed">Resolución:</Text>
                                <Text size="xs" fw={500}>{analisis.metadatosImagen.resolucion}</Text>
                              </Group>
                            )}
                            {analisis.metadatosImagen.tamanoBytes && (
                              <Group gap="xs" justify="space-between">
                                <Text size="xs" c="dimmed">Tamaño:</Text>
                                <Text size="xs" fw={500}>
                                  {formatearTamano(analisis.metadatosImagen.tamanoBytes)}
                                </Text>
                              </Group>
                            )}
                          </>
                        )}

                        {analisis.ubicacionEspecifica && (
                          <Group gap="xs">
                            <IconMapPin size={14} stroke={1.5} color="gray" />
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {analisis.ubicacionEspecifica}
                            </Text>
                          </Group>
                        )}

                        {analisis.condicionesClima && (
                          <Group gap="xs">
                            <IconCloudRain size={14} stroke={1.5} color="gray" />
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {analisis.condicionesClima}
                            </Text>
                          </Group>
                        )}

                        {analisis.notasUsuario && (
                          <Group gap="xs" align="flex-start">
                            <IconFileText size={14} stroke={1.5} color="gray" />
                            <Text size="xs" c="dimmed" lineClamp={2}>
                              {analisis.notasUsuario}
                            </Text>
                          </Group>
                        )}
                      </Stack>

                      <Group gap="xs" mt="auto">
                        <Button
                          variant="light"
                          size="xs"
                          flex={1}
                          leftSection={<IconEye size={14} />}
                          onClick={() => handleVerDetalles(analisis.id)}
                        >
                          Ver detalles
                        </Button>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="light" size="lg">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item 
                              leftSection={<IconDownload size={14} />}
                              onClick={() => console.log('Descargar reporte:', analisis.id)}
                            >
                              Descargar reporte
                            </Menu.Item>
                            <Menu.Item 
                              leftSection={<IconEye size={14} />}
                              onClick={() => window.open(imagenUrl, '_blank')}
                            >
                              Ver imagen original
                            </Menu.Item>
                            {analisis.rutaImagenProcesada && (
                              <Menu.Item 
                                leftSection={<IconEye size={14} />}
                                onClick={() => window.open(`${baseUrl}${analisis.rutaImagenProcesada}`, '_blank')}
                              >
                                Ver imagen procesada
                              </Menu.Item>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        )}
      </Stack>

      {/* Modal de Detalles */}
      <Modal
        opened={modalAbierto}
        onClose={cerrarModal}
        title={
          <Group gap="sm">
            <ThemeIcon size="lg" variant="light" color="blue">
              <IconChartBar size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg">Detalles del Análisis</Text>
              {analisisSeleccionado && (
                <Text size="xs" c="dimmed">{analisisSeleccionado.nombreImagen}</Text>
              )}
            </div>
          </Group>
        }
        size="xl"
        centered
      >
        {loadingDetalle ? (
          <Center p="xl">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">Cargando detalles...</Text>
            </Stack>
          </Center>
        ) : resultadoDetalle ? (
          <Stack gap="lg">
            {/* Alert principal */}
            <Alert
              icon={resultadoDetalle.diagnosticoPrincipal ? <IconCheck size={16} /> : <IconInfoCircle size={16} />}
              title={resultadoDetalle.nombreDeficiencia}
              color={getSeveridadColor(resultadoDetalle.severidad)}
              variant="light"
            >
              <Text size="sm">{resultadoDetalle.observacionesIa}</Text>
            </Alert>

            {/* Métricas principales */}
            <Paper shadow="xs" p="md" radius="md" withBorder>
              <Grid>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Confianza de Predicción
                    </Text>
                    <Group gap="xs" align="center">
                      <Text size="xl" fw={700} c="blue">
                        {resultadoDetalle.confianzaPrediccion}%
                      </Text>
                      <Badge size="sm" variant="dot" color="blue">
                        Alta precisión
                      </Badge>
                    </Group>
                    <Progress 
                      value={resultadoDetalle.confianzaPrediccion} 
                      color="blue" 
                      size="sm"
                      radius="xl"
                    />
                  </Stack>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Severidad
                    </Text>
                    <Badge
                      size="xl"
                      color={getSeveridadColor(resultadoDetalle.severidad)}
                      variant="light"
                      leftSection={<IconAlertTriangle size={16} />}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {resultadoDetalle.severidad}
                    </Badge>
                  </Stack>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Información del nutriente */}
            <Paper shadow="xs" p="md" radius="md" withBorder>
              <Stack gap="md">
                <Group gap="sm">
                  <ThemeIcon size="lg" variant="light" color="teal">
                    <IconDroplet size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} size="sm">Nutriente Faltante</Text>
                    <Text size="lg" fw={700} c="teal">
                      {resultadoDetalle.nutrienteFaltante}
                    </Text>
                  </div>
                </Group>

                <Divider />

                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
                    Estado de las áreas afectadas
                  </Text>
                  <Badge size="lg" variant="light" color="orange">
                    {resultadoDetalle.areasAfectadas.estado}
                  </Badge>
                </div>
              </Stack>
            </Paper>

            {/* Características detectadas */}
            <Paper shadow="xs" p="md" radius="md" withBorder>
              <Stack gap="md">
                <Text fw={600} size="sm">Características Detectadas</Text>
                
                <Timeline active={-1} bulletSize={24} lineWidth={2}>
                  <Timeline.Item
                    bullet={<IconLeaf size={12} />}
                    title="Color Principal"
                  >
                    <Text c="dimmed" size="sm">
                      {resultadoDetalle.areasAfectadas.caracteristicas.color_principal}
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={<IconPlant size={12} />}
                    title="Textura"
                  >
                    <Text c="dimmed" size="sm">
                      {resultadoDetalle.areasAfectadas.caracteristicas.textura}
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={<IconAlertTriangle size={12} />}
                    title="Bordes"
                  >
                    <Text c="dimmed" size="sm">
                      {resultadoDetalle.areasAfectadas.caracteristicas.borde}
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={resultadoDetalle.areasAfectadas.caracteristicas.deformaciones ? <IconX size={12} /> : <IconCheck size={12} />}
                    title="Deformaciones"
                    color={resultadoDetalle.areasAfectadas.caracteristicas.deformaciones ? 'red' : 'green'}
                  >
                    <Text c="dimmed" size="sm">
                      {resultadoDetalle.areasAfectadas.caracteristicas.deformaciones ? 'Detectadas' : 'No detectadas'}
                    </Text>
                  </Timeline.Item>

                  <Timeline.Item
                    bullet={<IconInfoCircle size={12} />}
                    title="Manchas"
                  >
                    <Text c="dimmed" size="sm">
                      {resultadoDetalle.areasAfectadas.caracteristicas.manchas}
                    </Text>
                  </Timeline.Item>
                </Timeline>
              </Stack>
            </Paper>

            {/* Información adicional */}
            <Paper shadow="xs" p="md" radius="md" withBorder bg="gray.0">
              <Group gap="xs">
                <IconCalendar size={16} color="gray" />
                <Text size="sm" c="dimmed">
                  Fecha del resultado: {formatearFecha(resultadoDetalle.fechaResultado)}
                </Text>
              </Group>
              {resultadoDetalle.diagnosticoPrincipal && (
                <Group gap="xs" mt="xs">
                  <IconCheck size={16} color="green" />
                  <Text size="sm" fw={500} c="green">
                    Diagnóstico Principal
                  </Text>
                </Group>
              )}
            </Paper>

            {/* Botones de acción */}
            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() => console.log('Descargar reporte detallado')}
              >
                Descargar Reporte
              </Button>
              <Button onClick={cerrarModal}>
                Cerrar
              </Button>
            </Group>
          </Stack>
        ) : (
          <Center p="xl">
            <Stack align="center" gap="md">
              <IconAlertTriangle size={48} color="orange" />
              <Text c="dimmed">No se pudieron cargar los detalles</Text>
              <Button variant="light" onClick={cerrarModal}>
                Cerrar
              </Button>
            </Stack>
          </Center>
        )}
      </Modal>
    </Container>
  );
}