import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Progress,
  Radio,
  Badge,
  ThemeIcon,
  Transition,
  Card,
  Center,
  RingProgress,
  Loader,
  Alert,
  TextInput,
  Modal,
  ScrollArea,
  Table,
} from '@mantine/core';
import {
  IconRocket,
  IconCheck,
  IconTrophy,
  IconStarFilled,
  IconBrain,
  IconAlertCircle,
  IconLock,
  IconKey,
  IconSearch,
} from '@tabler/icons-react';
import { useResultadoEvaluacion } from '../hook/useEducacionEvaluacion';
import { useEducacion } from '../hook/useEducacion';
import { useGenericUsers } from '@rec-shell/rec-web-usuario';
import { ST_GET_USER_ID } from '../../../utils/utilidad';

interface EvaluacionInteractivaProps {
  onCompletado?: (resultado: any) => void;
}

// Interfaz para los datos del modal
interface CodigoItem {
  codigo: string;
  fecha: string;
}

type PantallaEstado = 'validacion' | 'inicio' | 'evaluacion' | 'finalizado';

export function Evaluacion({ onCompletado }: EvaluacionInteractivaProps) {
  const [pantalla, setPantalla] = useState<PantallaEstado>('validacion');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [validando, setValidando] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [cuestionarioInfo, setCuestionarioInfo] = useState<any>(null);
  const [cargandoCodigos, setCargandoCodigos] = useState(false);
  const [errorCargandoCodigos, setErrorCargandoCodigos] = useState<string | null>(null);

  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<
    number | null
  >(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);

  // Estado para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [datosTabla, setDatosTabla] = useState<CodigoItem[]>([]);

  const {
    OBTENER_POR_CODIGO,
    BUSCAR_BY_CEDULA,
    loading: loadingPreguntas,
    error: errorPreguntas,
    preguntas,
    cuestionario,
    listadoEvaluacion
  } = useEducacion();

  const {
    loading,
    error,
    resultado,
    iniciarEvaluacion: iniciarCronometro,
    registrarRespuesta,
    guardarResultado,
    obtenerResumen,
    reiniciar: reiniciarHook,
  } = useResultadoEvaluacion({
    totalPreguntas: preguntas.length,
  });

  /*Obtener infoUser */
  const {users,loading: loadingUsers,error: errorUsers,fetchUsers,} = useGenericUsers();
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const obtenerCedula = () => {
    const idUsuario = Number(ST_GET_USER_ID());
    const usuario = users.find((u) => u.id === idUsuario);
      return usuario?.phoneNumber;
  };
  /*Obtener infoUser */
 
  // Handler para el clic en "Ver Códigos"
  const handleVerCodigosClick = async () => {
    setErrorCargandoCodigos(null);
    setCargandoCodigos(true);
    
    try {
      setModalAbierto(true);
      const cedula = obtenerCedula();
      
      if (!cedula) {
        setErrorCargandoCodigos('No se pudo obtener la cédula del usuario');
        return;
      }      
      await BUSCAR_BY_CEDULA(cedula);
    } catch (err: any) {
      console.error('Error al cargar códigos:', err);
      setErrorCargandoCodigos(
        err.message || 'Error al cargar los códigos disponibles'
      );
    } finally {
      setCargandoCodigos(false);
    }
  };



  useEffect(() => {
    if (pantalla === 'evaluacion' && preguntaActual >= 0) {
      setMostrarAnimacion(true);
    }
  }, [preguntaActual, pantalla]);

  const validarCodigo = async () => {
    if (!codigoIngresado || codigoIngresado.trim().length === 0) {
      setErrorCodigo('Por favor ingresa un código');
      return;
    }

    setValidando(true);
    setErrorCodigo(null);

    try {
      // Llamar al hook para obtener el cuestionario por código
      await OBTENER_POR_CODIGO(codigoIngresado.trim().toUpperCase());

      // Si llega aquí, el código es válido
      setCuestionarioInfo(cuestionario);
      setPantalla('inicio');
    } catch (err: any) {
      setErrorCodigo(
        err.message || 'Código inválido o evaluación no encontrada'
      );
    } finally {
      setValidando(false);
    }
  };

  const iniciarEvaluacion = () => {
    setPantalla('evaluacion');
    setPreguntaActual(0);
    setRespuestaSeleccionada(null);
    iniciarCronometro();
  };

  const siguientePregunta = () => {
    if (respuestaSeleccionada === null) return;

    const pregunta = preguntas[preguntaActual];

    registrarRespuesta(
      preguntaActual + 1,
      pregunta.pregunta,
      pregunta.opciones,
      pregunta.respuestaCorrecta,
      respuestaSeleccionada
    );

    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setRespuestaSeleccionada(null);
      setMostrarAnimacion(false);
    } else {
      finalizarEvaluacion();
    }
  };

  const finalizarEvaluacion = async () => {
    setPantalla('finalizado');

    try {
      const resultadoFinal = await guardarResultado();

      if (onCompletado) {
        onCompletado(resultadoFinal);
      }
    } catch (err) {
      console.error('Error al guardar la evaluación:', err);
    }
  };

  const reiniciarEvaluacion = () => {
    setPantalla('validacion');
    setPreguntaActual(0);
    setRespuestaSeleccionada(null);
    setCodigoIngresado('');
    setErrorCodigo(null);
    setCuestionarioInfo(null);
    reiniciarHook();
  };

  const obtenerMensaje = () => {
    const resumen = obtenerResumen();
    const porcentaje = resumen.porcentajeAciertos;

    if (porcentaje === 100) return '¡Perfecto! 🌟 ¡Eres un genio!';
    if (porcentaje >= 80) return '¡Excelente trabajo! 🎉';
    if (porcentaje >= 60) return '¡Bien hecho! 👏 Sigue practicando';
    return '¡Buen intento! 💪 Sigue aprendiendo';
  };

  const obtenerColor = () => {
    const resumen = obtenerResumen();
    const porcentaje = resumen.porcentajeAciertos;

    if (porcentaje >= 80) return 'teal';
    if (porcentaje >= 60) return 'blue';
    return 'orange';
  };

  // PANTALLA DE VALIDACIÓN DE CÓDIGO
  if (pantalla === 'validacion') {
    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: '70vh' }}>
          <Paper
            shadow="xl"
            p={50}
            radius="xl"
            withBorder
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              maxWidth: 500,
              width: '100%',
            }}
          >
            <Stack align="center" gap="xl">
              <ThemeIcon size={100} radius="xl" variant="light" color="white">
                <IconLock size={60} stroke={1.5} />
              </ThemeIcon>

              <Title
                order={1}
                c="white"
                ta="center"
                style={{ fontSize: '2rem' }}
              >
                Acceso a Evaluación
              </Title>

              <Text size="lg" c="white" ta="center" fw={400}>
                Ingresa el código único proporcionado por tu profesor
              </Text>

              <Stack gap="md" style={{ width: '100%' }}>
                <TextInput
                  size="xl"
                  placeholder="Ej: ABC123"
                  value={codigoIngresado}
                  onChange={(e) => {
                    setCodigoIngresado(e.target.value.toUpperCase());
                    setErrorCodigo(null);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') validarCodigo();
                  }}
                  leftSection={<IconKey size={20} />}
                  styles={{
                    input: {
                      backgroundColor: 'white',
                      fontSize: '1.2rem',
                      textAlign: 'center',
                      letterSpacing: '2px',
                      fontWeight: 600,
                    },
                  }}
                  error={errorCodigo}
                  disabled={validando}
                />

                {errorCodigo && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="filled"
                  >
                    {errorCodigo}
                  </Alert>
                )}

                <Button
                  size="xl"
                  radius="xl"
                  onClick={validarCodigo}
                  color="white"
                  c="grape"
                  loading={validando}
                  disabled={!codigoIngresado.trim()}
                  style={{
                    transform: 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    !validando &&
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  Validar Código
                </Button>

                <Button
                  size="xl"
                  radius="xl"
                  variant="outline"
                  color="white"
                  leftSection={<IconSearch size={20} />}
                  onClick={handleVerCodigosClick}
                  style={{
                    borderWidth: 2,
                    transform: 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                >
                  Ver Códigos
                </Button>
              </Stack>

              <Text size="sm" c="rgba(255,255,255,0.8)" ta="center">
                El código es sensible a mayúsculas y debe ser exacto
              </Text>
            </Stack>
          </Paper>
        </Center>

        {/* Modal para la tabla de códigos */}
        <Modal
          opened={modalAbierto}
          onClose={() => setModalAbierto(false)}
          title="Códigos Disponibles"
          size="xl"
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Selecciona un código de la lista para usarlo en la evaluación
            </Text>

            <ScrollArea h={400}>
              <Table stickyHeader striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: '50%' }}>Código</Table.Th>
                    <Table.Th style={{ width: '50%' }}>
                      Fecha de Creación
                    </Table.Th>
                    <Table.Th>Acción</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {listadoEvaluacion.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Badge
                          size="lg"
                          variant="light"
                          color="blue"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setCodigoIngresado(item.codigo);
                            setModalAbierto(false);
                          }}
                        >
                          {item.codigo}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{item.fecha}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={() => {
                            setCodigoIngresado(item.codigo);
                            setModalAbierto(false);
                          }}
                        >
                          Usar
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Group justify="space-between" mt="md">
              <Text size="xs" c="dimmed">
                Total: {datosTabla.length} códigos disponibles
              </Text>
              <Button variant="light" onClick={() => setModalAbierto(false)}>
                Cerrar
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    );
  }

  // PANTALLA DE INICIO (después de validar código)
  if (pantalla === 'inicio') {
    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: '60vh' }}>
          <Paper
            shadow="xl"
            p={50}
            radius="xl"
            withBorder
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            <Stack align="center" gap="xl">
              <Badge
                size="lg"
                variant="light"
                color="white"
                leftSection={<IconCheck size={16} />}
              >
                Código Validado ✓
              </Badge>

              <ThemeIcon size={100} radius="xl" variant="light" color="white">
                <IconBrain size={60} stroke={1.5} />
              </ThemeIcon>

              <Title
                order={1}
                c="white"
                ta="center"
                style={{ fontSize: '2.5rem' }}
              >
                {cuestionario?.titulo || 'Evaluación de IA'}
              </Title>

              {cuestionario?.descripcion && (
                <Text size="lg" c="white" ta="center" fw={400}>
                  {cuestionario.descripcion}
                </Text>
              )}

              <Group>
                <Badge size="xl" variant="light" color="white">
                  {preguntas.length} Preguntas
                </Badge>
                <Badge size="xl" variant="light" color="white">
                  Estado: {cuestionario?.estado}
                </Badge>
              </Group>

              {cuestionario?.resumen && (
                <Text
                  size="md"
                  c="white"
                  ta="center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '15px 20px',
                    borderRadius: '12px',
                  }}
                >
                  {cuestionario.resumen}
                </Text>
              )}

              <Button
                size="xl"
                radius="xl"
                leftSection={<IconRocket size={24} />}
                onClick={iniciarEvaluacion}
                color="white"
                c="grape"
                style={{
                  transform: 'scale(1)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.05)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                ¡Comenzar Evaluación!
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  // PANTALLA FINALIZADO
  if (pantalla === 'finalizado') {
    const resumen = obtenerResumen();
    const porcentaje = resumen.porcentajeAciertos;
    const minutos = Math.floor(resumen.tiempoTotalSegundos / 60);
    const segundos = resumen.tiempoTotalSegundos % 60;

    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: '60vh' }}>
          <Paper shadow="xl" p={50} radius="xl" withBorder>
            <Stack align="center" gap="xl">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error"
                  color="red"
                  variant="filled"
                >
                  {error}
                </Alert>
              )}

              {loading && (
                <Group>
                  <Loader size="sm" />
                  <Text>Guardando tu evaluación...</Text>
                </Group>
              )}

              <ThemeIcon
                size={120}
                radius="xl"
                color={obtenerColor()}
                variant="light"
              >
                <IconTrophy size={70} />
              </ThemeIcon>

              <Title order={1} ta="center" c={obtenerColor()}>
                {obtenerMensaje()}
              </Title>

              <RingProgress
                size={200}
                thickness={16}
                sections={[{ value: porcentaje, color: obtenerColor() }]}
                label={
                  <Center>
                    <Stack gap={0} align="center">
                      <Text size="xl" fw={700} c={obtenerColor()}>
                        {resumen.puntuacionObtenida}/{resumen.puntuacionMaxima}
                      </Text>
                      <Text size="sm" c="dimmed">
                        correctas
                      </Text>
                    </Stack>
                  </Center>
                }
              />

              <Card withBorder radius="md" p="xl" style={{ width: '100%' }}>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="lg" fw={500}>
                      Puntuación Final:
                    </Text>
                    <Badge size="xl" color={obtenerColor()}>
                      {porcentaje.toFixed(0)}%
                    </Badge>
                  </Group>
                  <Progress
                    value={porcentaje}
                    color={obtenerColor()}
                    size="xl"
                    radius="xl"
                    animated
                  />

                  <Group justify="space-between" mt="md">
                    <Text size="sm" c="dimmed">
                      Tiempo total:
                    </Text>
                    <Badge variant="light" size="lg">
                      {minutos}m {segundos}s
                    </Badge>
                  </Group>

                  {resultado && (
                    <Text size="xs" c="dimmed" ta="center" mt="sm">
                      Resultado guardado exitosamente
                    </Text>
                  )}
                </Stack>
              </Card>

              <Button
                size="lg"
                radius="xl"
                onClick={reiniciarEvaluacion}
                leftSection={<IconRocket size={20} />}
                variant="gradient"
                gradient={{ from: 'grape', to: 'blue', deg: 90 }}
              >
                Realizar Otra Evaluación
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  // PANTALLA DE EVALUACIÓN
  const resumen = obtenerResumen();
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  return (
    <Container size="md" py={40}>
      <Stack gap="xl">
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Badge
              size="lg"
              variant="light"
              leftSection={<IconStarFilled size={14} />}
            >
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </Badge>
            <Badge size="md" variant="light" color="grape">
              {cuestionario?.titulo}
            </Badge>
          </Group>
          <Progress
            value={progreso}
            color="grape"
            size="lg"
            radius="xl"
            animated
          />
        </Paper>

        <Transition
          mounted={mostrarAnimacion}
          transition="slide-up"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Paper shadow="xl" p="xl" radius="xl" withBorder style={styles}>
              <Stack gap="xl">
                <Title order={2} style={{ lineHeight: 1.4 }}>
                  {preguntas[preguntaActual].pregunta}
                </Title>

                <Radio.Group
                  value={respuestaSeleccionada?.toString()}
                  onChange={(value) =>
                    setRespuestaSeleccionada(parseInt(value))
                  }
                >
                  <Stack gap="md">
                    {preguntas[preguntaActual].opciones.map((opcion, index) => {
                      const esSeleccionada = index === respuestaSeleccionada;

                      return (
                        <Card
                          key={index}
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            borderColor: esSeleccionada ? 'blue' : 'gray',
                            borderWidth: 2,
                            backgroundColor: esSeleccionada
                              ? 'rgba(121, 80, 242, 0.1)'
                              : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: esSeleccionada
                              ? 'scale(1.02)'
                              : 'scale(1)',
                          }}
                          onClick={() => setRespuestaSeleccionada(index)}
                        >
                          <Group wrap="nowrap" gap="md">
                            <Radio
                              value={index.toString()}
                              size="md"
                              color="blue"
                            />
                            <Text size="md" style={{ flex: 1 }}>
                              {opcion}
                            </Text>
                          </Group>
                        </Card>
                      );
                    })}
                  </Stack>
                </Radio.Group>

                <Group justify="flex-end" mt="md">
                  <Button
                    size="lg"
                    radius="xl"
                    onClick={siguientePregunta}
                    disabled={respuestaSeleccionada === null}
                    rightSection={<IconCheck size={20} />}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'teal', deg: 90 }}
                    loading={loading && preguntaActual === preguntas.length - 1}
                  >
                    {preguntaActual < preguntas.length - 1
                      ? 'Siguiente Pregunta'
                      : 'Finalizar Evaluación'}
                  </Button>
                </Group>
              </Stack>
            </Paper>
          )}
        </Transition>
      </Stack>
    </Container>
  );
}
