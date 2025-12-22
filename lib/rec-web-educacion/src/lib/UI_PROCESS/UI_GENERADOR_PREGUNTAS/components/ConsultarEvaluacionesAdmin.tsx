import React, { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Badge,
  ActionIcon,
  Group,
  Stack,
  Modal,
  Paper,
  ThemeIcon,
  Grid,
  Card,
  Progress,
  Divider,
  Accordion,
  Box,
  Tooltip,
  Center,
  Loader,
  Alert,
  LoadingOverlay,
  Flex,
} from '@mantine/core';
import {
  Eye,
  Trophy,
  BarChart3,
  Clock,
  Calendar,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { useResultadosEvaluaciones } from '../hook/useEducacionEvaluacion';
import { Respuesta, Resultado } from '../interfaces/dto';
import { formatearTiempo, formatearFecha } from '../../../utils/utilidad';
import { useGenericUsers } from '@rec-shell/rec-web-usuario';
import {
  PaginatedTable,
  ActionButtons,
  useNotifications,
} from '@rec-shell/rec-web-shared';

const EstadisticasGenerales = ({ resultado }: { resultado: Resultado }) => {
  const stats = [
    {
      icon: Trophy,
      label: 'Puntuación',
      value: `${resultado.puntuacion_obtenida}/${resultado.puntuacion_maxima}`,
      color:
        resultado.porcentaje_aciertos >= 70
          ? 'green'
          : resultado.porcentaje_aciertos >= 50
          ? 'yellow'
          : 'red',
    },
    {
      icon: BarChart3,
      label: 'Porcentaje',
      value: `${resultado.porcentaje_aciertos.toFixed(1)}%`,
      color:
        resultado.porcentaje_aciertos >= 70
          ? 'green'
          : resultado.porcentaje_aciertos >= 50
          ? 'yellow'
          : 'red',
    },
    {
      icon: Clock,
      label: 'Tiempo Total',
      value: formatearTiempo(resultado.tiempo_total_segundos),
      color: 'blue',
    },
    {
      icon: Calendar,
      label: 'Fecha',
      value: formatearFecha(resultado.fecha_realizacion),
      color: 'violet',
    },
  ];

  return (
    <Grid>
      {stats.map((stat, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
          <Paper p="md" withBorder>
            <Group>
              <ThemeIcon size="lg" variant="light" color={stat.color}>
                <stat.icon size={20} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {stat.label}
                </Text>
                <Text fw={700} size="sm">
                  {stat.value}
                </Text>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  );
};

const RespuestaDetalle = ({ respuesta }: { respuesta: Respuesta }) => {
  return (
    <Card withBorder radius="md" mb="md">
      <Group justify="space-between" mb="xs">
        <Group>
          <Badge
            size="lg"
            variant="filled"
            color={respuesta.es_correcta ? 'green' : 'red'}
            leftSection={
              respuesta.es_correcta ? <Check size={14} /> : <X size={14} />
            }
          >
            Pregunta {respuesta.numero_pregunta}
          </Badge>
          <Text size="xs" c="dimmed">
            <Clock size={14} style={{ verticalAlign: 'middle' }} />{' '}
            {respuesta.tiempo_respuesta_segundos}s
          </Text>
        </Group>
      </Group>

      <Text fw={500} mb="md">
        {respuesta.pregunta_texto}
      </Text>

      <Stack gap="xs">
        {respuesta.opciones.map((opcion, index) => {
          const esCorrecta = index === respuesta.respuesta_correcta;
          const fueSeleccionada = index === respuesta.respuesta_seleccionada;

          let color = 'gray';
          let variant = 'light';

          if (esCorrecta) {
            color = 'green';
            variant = 'filled';
          } else if (fueSeleccionada && !esCorrecta) {
            color = 'red';
            variant = 'filled';
          }

          return (
            <Paper
              key={index}
              p="sm"
              withBorder
              style={{
                borderColor: esCorrecta
                  ? 'var(--mantine-color-green-6)'
                  : fueSeleccionada
                  ? 'var(--mantine-color-red-6)'
                  : undefined,
                borderWidth: esCorrecta || fueSeleccionada ? 2 : 1,
                backgroundColor: esCorrecta
                  ? 'var(--mantine-color-green-0)'
                  : fueSeleccionada
                  ? 'var(--mantine-color-red-0)'
                  : undefined,
              }}
            >
              <Group gap="xs">
                {(esCorrecta || fueSeleccionada) && (
                  <ThemeIcon
                    size="sm"
                    color={color}
                    variant={variant}
                    radius="xl"
                  >
                    {esCorrecta ? <Check size={12} /> : <X size={12} />}
                  </ThemeIcon>
                )}
                <Text size="sm" flex={1}>
                  {opcion}
                </Text>
                {esCorrecta && (
                  <Badge size="xs" color="green" variant="light">
                    Correcta
                  </Badge>
                )}
                {fueSeleccionada && !esCorrecta && (
                  <Badge size="xs" color="red" variant="light">
                    Tu respuesta
                  </Badge>
                )}
              </Group>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );
};

interface DetalleResultadoModalProps {
  opened: boolean;
  onClose: () => void;
  resultado: Resultado | null;
}

const DetalleResultadoModal = ({
  opened,
  onClose,
  resultado,
}: DetalleResultadoModalProps) => {
  if (!resultado) return null;

  const correctas = resultado.respuestas.filter((r) => r.es_correcta).length;
  const total = resultado.respuestas.length;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="full"
      title={
        <Group>
          <Title order={3}>Evaluación #{resultado.evaluacion_id}</Title>
          <Badge
            size="lg"
            variant="filled"
            color={resultado.estado === 'completado' ? 'green' : 'gray'}
          >
            {resultado.estado.toUpperCase()}
          </Badge>
        </Group>
      }
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Estudiante ID: {resultado.estudiante_id}
        </Text>

        <EstadisticasGenerales resultado={resultado} />

        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>
              Progreso: {correctas} de {total} correctas
            </Text>
            <Text size="sm" fw={500}>
              {resultado.porcentaje_aciertos.toFixed(1)}%
            </Text>
          </Group>
          <Progress
            value={resultado.porcentaje_aciertos}
            size="xl"
            radius="xl"
            color={
              resultado.porcentaje_aciertos >= 70
                ? 'green'
                : resultado.porcentaje_aciertos >= 50
                ? 'yellow'
                : 'red'
            }
          />
        </Box>

        <Divider />

        <Accordion variant="separated" radius="md" defaultValue="respuestas">
          <Accordion.Item value="respuestas">
            <Accordion.Control>
              <Group>
                <BarChart3 size={20} />
                <Text fw={500}>Ver Respuestas Detalladas ({total})</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md" mt="md">
                {resultado.respuestas.map((respuesta) => (
                  <RespuestaDetalle key={respuesta.id} respuesta={respuesta} />
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Modal>
  );
};

export function ConsultarEvaluacionesAdmin() {
  const [selectedResultado, setSelectedResultado] = useState<Resultado | null>(
    null
  );
  const [modalOpened, setModalOpened] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, resultados, recargar } = useResultadosEvaluaciones();
  const {
    users,
    loading: loadingUsers,
    error: errorUsers,
    fetchUsers,
  } = useGenericUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  const obtenerNombreCompleto = (id: number) => {
    const usuario = users.find((u) => u.id === id);
    return usuario
      ? `${usuario.firstName} ${usuario.lastName}`
      : 'Estudiante desconocido';
  };

  const handleVerDetalle = (resultado: Resultado) => {
    setSelectedResultado(resultado);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedResultado(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await recargar();
    } catch (error: unknown) {
      console.error('Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Definición de columnas dinámicas
  const columns = [
    {
      key: 'estudiante_id',
      label: 'Estudiante',
      render: (r: Resultado) => (
        <Text size="sm">{obtenerNombreCompleto(r.estudiante_id)}</Text>
      ),
    },
    {
      key: 'fecha_realizacion',
      label: 'Fecha',
      render: (r: Resultado) => (
        <Text size="sm">
          {new Date(r.fecha_realizacion).toLocaleDateString('es-ES')}
        </Text>
      ),
    },
    {
      key: 'puntuacion_obtenida',
      label: 'Puntuación',
      render: (r: Resultado) => (
        <Text size="sm" fw={500}>
          {r.puntuacion_obtenida}/{r.puntuacion_maxima}
        </Text>
      ),
    },
    {
      key: 'porcentaje_aciertos',
      label: 'Porcentaje',
      render: (r: Resultado) => (
        <Badge
          size="lg"
          variant="filled"
          color={
            r.porcentaje_aciertos >= 70
              ? 'green'
              : r.porcentaje_aciertos >= 50
              ? 'yellow'
              : 'red'
          }
        >
          {r.porcentaje_aciertos.toFixed(1)}%
        </Badge>
      ),
    },
    {
      key: 'tiempo_total_segundos',
      label: 'Tiempo',
      render: (r: Resultado) => (
        <Text size="sm">{formatearTiempo(r.tiempo_total_segundos)}</Text>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (r: Resultado) => (
        <Badge
          variant="light"
          color={r.estado === 'completado' ? 'green' : 'gray'}
        >
          {r.estado}
        </Badge>
      ),
    },
  ];

  // Definición de acciones
  const actions = [
    {
      icon: <Eye size={18} />,
      label: 'Ver detalle',
      color: 'blue',
      onClick: handleVerDetalle,
    },
  ];

  if (loading && !refreshing) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text c="dimmed">Cargando resultados...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<X size={16} />} title="Error" color="red" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box p="md">
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <div>
            <Title order={1} mb="xs">
              Resultados de Evaluaciones
            </Title>
            <Text c="dimmed">
              Consulta y analiza los resultados de tus evaluaciones
            </Text>
          </div>
          <ActionButtons.Refresh onClick={handleRefresh} loading={refreshing} />
        </Flex>

        {resultados.length === 0 ? (
          <Paper p="xl" withBorder radius="md">
            <Center>
              <Stack align="center" gap="md">
                <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                  <BarChart3 size={30} />
                </ThemeIcon>
                <Text size="lg" fw={500} c="dimmed">
                  No hay resultados disponibles
                </Text>
                <Text size="sm" c="dimmed">
                  Los resultados de las evaluaciones aparecerán aquí
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <Card withBorder>
            <LoadingOverlay visible={loading || refreshing} />
            <PaginatedTable
              data={resultados}
              columns={columns}
              actions={actions}
              loading={loading || refreshing}
              searchFields={['estudiante_id', 'estado']}
              itemsPerPage={10}
              searchPlaceholder="Buscar por estudiante o estado..."
              getRowKey={(item) => item.id}
            />
          </Card>
        )}
      </Stack>

      <DetalleResultadoModal
        opened={modalOpened}
        onClose={handleCloseModal}
        resultado={selectedResultado}
      />
    </Box>
  );
}