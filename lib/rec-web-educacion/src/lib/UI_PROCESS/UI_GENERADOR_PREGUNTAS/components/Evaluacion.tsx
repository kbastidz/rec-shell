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
  Alert
} from '@mantine/core';
import { 
  IconRocket, 
  IconCheck, 
  IconTrophy,
  IconStarFilled,
  IconBrain,
  IconAlertCircle
} from '@tabler/icons-react';
import { useResultadoEvaluacion } from '../hook/useEducacionEvaluacion';
import { useEducacion } from '../hook/useEducacion';

interface EvaluacionInteractivaProps {
  evaluacionId: number;
  estudianteId: number;
  onCompletado?: (resultado: any) => void;
}

export function Evaluacion({ 
  evaluacionId, 
  estudianteId,
  onCompletado 
}: EvaluacionInteractivaProps) {
  const [iniciado, setIniciado] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [finalizado, setFinalizado] = useState(false);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);

  const { 
    OBTENER, 
    loading: loadingPreguntas, 
    error: errorPreguntas,
    preguntas 
  } = useEducacion();

  const {
    loading,
    error,
    resultado,
    iniciarEvaluacion: iniciarCronometro,
    registrarRespuesta,
    guardarResultado,
    obtenerResumen,
    reiniciar: reiniciarHook
  } = useResultadoEvaluacion({
    evaluacionId,
    estudianteId,
    totalPreguntas: preguntas.length
  });

  // Cargar preguntas al montar el componente
  useEffect(() => {
    OBTENER();
  }, []);

  useEffect(() => {
    if (iniciado && !finalizado) {
      setMostrarAnimacion(true);
    }
  }, [preguntaActual, iniciado, finalizado]);

  const iniciarEvaluacion = () => {
    setIniciado(true);
    setPreguntaActual(0);
    setRespuestaSeleccionada(null);
    setFinalizado(false);
    iniciarCronometro();
  };

  const siguientePregunta = () => {
    if (respuestaSeleccionada === null) return;
    
    const pregunta = preguntas[preguntaActual];
    
    // Registrar la respuesta en el hook
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
    setFinalizado(true);
    
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
    setIniciado(false);
    setPreguntaActual(0);
    setRespuestaSeleccionada(null);
    setFinalizado(false);
    reiniciarHook();
  };

  const obtenerMensaje = () => {
    const resumen = obtenerResumen();
    const porcentaje = resumen.porcentajeAciertos;
    
    if (porcentaje === 100) return "¡Perfecto! 🌟 ¡Eres un genio!";
    if (porcentaje >= 80) return "¡Excelente trabajo! 🎉";
    if (porcentaje >= 60) return "¡Bien hecho! 👏 Sigue practicando";
    return "¡Buen intento! 💪 Sigue aprendiendo";
  };

  const obtenerColor = () => {
    const resumen = obtenerResumen();
    const porcentaje = resumen.porcentajeAciertos;
    
    if (porcentaje >= 80) return "teal";
    if (porcentaje >= 60) return "blue";
    return "orange";
  };

  if (!iniciado) {
    return (
      <Container size="md" py={60}>
        <Center style={{ minHeight: '60vh' }}>
          <Paper shadow="xl" p={50} radius="xl" withBorder style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}>
            <Stack align="center" gap="xl">
              <ThemeIcon size={100} radius="xl" variant="light" color="white">
                <IconBrain size={60} stroke={1.5} />
              </ThemeIcon>
              <Title order={1} c="white" ta="center" style={{ fontSize: '2.5rem' }}>
                Evaluación de IA
              </Title>
              <Text size="xl" c="white" ta="center" fw={500}>
                ¡Demuestra todo lo que sabes sobre Inteligencia Artificial en la Educación!
              </Text>
              <Group>
                <Badge size="xl" variant="light" color="white" >
                  {preguntas.length} Preguntas
                </Badge>
                <Badge size="xl" variant="light" color="white" >
                  Nivel Escolar
                </Badge>
              </Group>
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
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ¡Comenzar Evaluación!
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  if (finalizado) {
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
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="filled">
                  {error}
                </Alert>
              )}

              {loading && (
                <Group>
                  <Loader size="sm" />
                  <Text>Guardando tu evaluación...</Text>
                </Group>
              )}

              <ThemeIcon size={120} radius="xl" color={obtenerColor()} variant="light">
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
                    <Text size="lg" fw={500}>Puntuación Final:</Text>
                    <Badge size="xl" color={obtenerColor()}>
                      {porcentaje.toFixed(0)}%
                    </Badge>
                  </Group>
                  <Progress value={porcentaje} color={obtenerColor()} size="xl" radius="xl" animated />
                  
                  <Group justify="space-between" mt="md">
                    <Text size="sm" c="dimmed">Tiempo total:</Text>
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
                Intentar de Nuevo
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  const resumen = obtenerResumen();
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  return (
    <Container size="md" py={40}>
      <Stack gap="xl">
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Badge size="lg" variant="light" leftSection={<IconStarFilled size={14} />}>
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </Badge>
          </Group>
          <Progress value={progreso} color="grape" size="lg" radius="xl" animated />
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
                <Title order={2}  style={{ lineHeight: 1.4 }}>
                  {preguntas[preguntaActual].pregunta}
                </Title>

                <Radio.Group
                  value={respuestaSeleccionada?.toString()}
                  onChange={(value) => setRespuestaSeleccionada(parseInt(value))}
                >
                  <Stack gap="md">
                    {preguntas[preguntaActual].opciones.map((opcion, index) => {
                      const esSeleccionada = index === respuestaSeleccionada;
                      
                      let borderColor = 'gray';
                      let bgColor = 'transparent';
                      
                      if (esSeleccionada) {
                        borderColor = 'blue';
                        bgColor = 'rgba(121, 80, 242, 0.1)';
                      }

                      return (
                        <Card
                          key={index}
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            borderColor,
                            borderWidth: 2,
                            backgroundColor: bgColor,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: esSeleccionada ? 'scale(1.02)' : 'scale(1)',
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
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transform"

                    loading={loading && preguntaActual === preguntas.length - 1}
                  >
                    {preguntaActual < preguntas.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación'}
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