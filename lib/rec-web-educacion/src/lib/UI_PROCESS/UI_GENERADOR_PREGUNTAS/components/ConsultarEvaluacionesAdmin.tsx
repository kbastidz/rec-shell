import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Table,
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
  Alert
} from '@mantine/core';
import {
  Eye,
  Trophy,
  BarChart3,
  Clock,
  Calendar,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { useResultadosEvaluaciones } from '../hook/useEducacionEvaluacion';
import { Respuesta, Resultado } from '../interfaces/dto';
import { formatearTiempo, formatearFecha } from '../../../utils/utilidad';

const EstadisticasGenerales = ({ resultado }: { resultado: Resultado }) => {
  const stats = [
    {
      icon: Trophy,
      label: 'Puntuación',
      value: `${resultado.puntuacion_obtenida}/${resultado.puntuacion_maxima}`,
      color: resultado.porcentaje_aciertos >= 70 ? 'green' : resultado.porcentaje_aciertos >= 50 ? 'yellow' : 'red'
    },
    {
      icon: BarChart3,
      label: 'Porcentaje',
      value: `${resultado.porcentaje_aciertos.toFixed(1)}%`,
      color: resultado.porcentaje_aciertos >= 70 ? 'green' : resultado.porcentaje_aciertos >= 50 ? 'yellow' : 'red'
    },
    {
      icon: Clock,
      label: 'Tiempo Total',
      value: formatearTiempo(resultado.tiempo_total_segundos),
      color: 'blue'
    },
    {
      icon: Calendar,
      label: 'Fecha',
      value: formatearFecha(resultado.fecha_realizacion),
      color: 'violet'
    }
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
              respuesta.es_correcta ? (
                <Check size={14} />
              ) : (
                <X size={14} />
              )
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
                borderColor: esCorrecta ? 'var(--mantine-color-green-6)' : 
                            fueSeleccionada ? 'var(--mantine-color-red-6)' : undefined,
                borderWidth: (esCorrecta || fueSeleccionada) ? 2 : 1,
                backgroundColor: esCorrecta ? 'var(--mantine-color-green-0)' :
                               fueSeleccionada ? 'var(--mantine-color-red-0)' : undefined
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

const DetalleResultadoModal = ({ opened, onClose, resultado }: DetalleResultadoModalProps) => {
  if (!resultado) return null;

  const correctas = resultado.respuestas.filter(r => r.es_correcta).length;
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

export  function ConsultarEvaluacionesAdmin() {
  const [selectedResultado, setSelectedResultado] = useState<Resultado | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  
  // Simular el hook - reemplaza esto con tu hook real: useResultadosEvaluaciones()
  /*const loading = false;
  const error = null;
  const resultados = resultadosMock;
  const recargar = () => console.log('Recargando...');*/

  const { loading, error, resultados, recargar } = useResultadosEvaluaciones();


  const handleVerDetalle = (resultado: Resultado) => {
    setSelectedResultado(resultado);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedResultado(null);
  };

  if (loading) {
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
        <Alert
          icon={<X size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box p="md">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} mb="xs">
            Resultados de Evaluaciones
          </Title>
          <Text c="dimmed">
            Consulta y analiza los resultados de tus evaluaciones
          </Text>
        </div>
        <Tooltip label="Recargar resultados">
          <ActionIcon
            size="lg"
            variant="light"
            color="blue"
            onClick={recargar}
          >
            <RefreshCw size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

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
        <Paper shadow="sm" radius="md" withBorder>
          <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Estudiante</Table.Th>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Puntuación</Table.Th>
                  <Table.Th>Porcentaje</Table.Th>
                  <Table.Th>Tiempo</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {resultados.map((resultado) => (
                  <Table.Tr key={resultado.id}>
                    
                    <Table.Td>
                      <Text size="sm">ID: {resultado.estudiante_id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(resultado.fecha_realizacion).toLocaleDateString('es-ES')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {resultado.puntuacion_obtenida}/{resultado.puntuacion_maxima}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="lg"
                        variant="filled"
                        color={
                          resultado.porcentaje_aciertos >= 70
                            ? 'green'
                            : resultado.porcentaje_aciertos >= 50
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {resultado.porcentaje_aciertos.toFixed(1)}%
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatearTiempo(resultado.tiempo_total_segundos)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={resultado.estado === 'completado' ? 'green' : 'gray'}
                      >
                        {resultado.estado}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Ver detalle">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleVerDetalle(resultado)}
                        >
                          <Eye size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      )}

      <DetalleResultadoModal
        opened={modalOpened}
        onClose={handleCloseModal}
        resultado={selectedResultado}
      />
    </Box>
  );
}