import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Text, 
  Badge, 
  Stack, 
  Group, 
  Title, 
  Container, 
  Paper, 
  Alert,
  List,
  ThemeIcon,
  Divider,
  Loader,
  Center
} from '@mantine/core';
import { IconCircleCheck, IconPlayerPlay } from '@tabler/icons-react';

import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TipoTransaccion } from '../../../enums/Enums';
import { CrearTransaccionDTO } from '../../../types/dto';
import { useTransaccionPuntos } from '../hooks/useGamificacion';
import { handleModelResponse, useGemini } from '@rec-shell/rec-web-shared';
import { MATERIAS, promptTemplateRuleta } from '../../../utils/CONSTANTE';
import { ResultadoType, Materia } from '../interface/interface';

export function Ruleta() {
  const [modoJuego, setModoJuego] = useState<'reglas' | 'jugando'>('reglas');
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoType | null>(null);
  const [rotacion, setRotacion] = useState(0);
  const [yaGiro, setYaGiro] = useState(false);
  const [puntosTotal, setPuntosTotal] = useState(0);
  const usuarioId = ST_GET_USER_ID();

  //Hook para invocar las reglas del juego
  const { CREAR, OBTENER_REGLA_POR_TIPO, regla, loading, error } = useTransaccionPuntos();

  useEffect(() => {
    const cargarRegla = async () => {
      await OBTENER_REGLA_POR_TIPO('RULETA');
    };
    cargarRegla();
  }, []);

  // Hook de Gemini
  const [materiasGeneradas, setMateriasGeneradas] = useState<Materia[]>(MATERIAS);
  const [cargandoActividades, setCargandoActividades] = useState(false);
  const [errorGemini, setErrorGemini] = useState<string | null>(null);
  
  const { loading: loadingGemini, generateText } = useGemini({
    temperature: 0.8,
    maxTokens: 8000,
    onSuccess: (result: any) => {
      handleModelResponse<Materia[]>({
        text: result,
        onParsed: (materiasIA) => {
          if (Array.isArray(materiasIA) && materiasIA.length > 0) {
            setMateriasGeneradas(materiasIA);
            sessionStorage.setItem(`materias_${usuarioId}`, JSON.stringify(materiasIA));
          } else {
            console.warn('Array vacío recibido, usando materias por defecto');
            setMateriasGeneradas(MATERIAS);
          }
          setCargandoActividades(false);
          setModoJuego('jugando');
        },
        onError: (err) => {
          console.error('Error al parsear respuesta de Gemini:', err);
          setMateriasGeneradas(MATERIAS);
          setErrorGemini('Error al generar actividades. Usando actividades por defecto.');
          setCargandoActividades(false);
          setModoJuego('jugando');
        },
        onFinally: () => {
          setCargandoActividades(false);
        }
      });
    },
    onError: (errorMsg: string) => {
      console.error('Error de Gemini:', errorMsg);
      setErrorGemini(errorMsg);
      setMateriasGeneradas(MATERIAS);
      setCargandoActividades(false);
      setModoJuego('jugando');
    }
  });

  // Verificar si ya giró hoy
  useEffect(() => {
    if (modoJuego === 'jugando') {
      const lastSpin = sessionStorage.getItem(`ultimoGiro_${usuarioId}`);
      const puntos = sessionStorage.getItem(`puntosTotal_${usuarioId}`);
      
      if (lastSpin) {
        const lastDate = new Date(lastSpin);
        const today = new Date();
        if (lastDate.toDateString() === today.toDateString()) {
          //setYaGiro(true);
        }
      }
      
      if (puntos) {
        setPuntosTotal(parseInt(puntos));
      }
    }
  }, [modoJuego, usuarioId]);

  const iniciarJuego = async () => {
    // Verificar si ya hay actividades guardadas para hoy
    const materiasGuardadas = sessionStorage.getItem(`materias_${usuarioId}`);
    const fechaGeneracion = sessionStorage.getItem(`fecha_materias_${usuarioId}`);
    const hoy = new Date().toDateString();
    
    if (materiasGuardadas && fechaGeneracion === hoy) {
      // Usar actividades guardadas del día
      try {
        const materias = JSON.parse(materiasGuardadas);
        setMateriasGeneradas(materias);
        setModoJuego('jugando');
        return;
      } catch (err) {
        console.error('Error al cargar materias guardadas:', err);
      }
    }
    
    // Si no hay actividades guardadas o son de otro día, generar nuevas
    setCargandoActividades(true);
    setErrorGemini(null);
    sessionStorage.setItem(`fecha_materias_${usuarioId}`, hoy);
    
    // Invocar a Gemini solo cuando el usuario decide iniciar
    await generateText(promptTemplateRuleta);
  };

  const girarRuleta = async () => {
    if (girando || yaGiro) return;

    setGirando(true);
    setResultado(null);

    const materiaSeleccionada = materiasGeneradas[Math.floor(Math.random() * materiasGeneradas.length)];
    const actividadSeleccionada = materiaSeleccionada.actividades[Math.floor(Math.random() * materiaSeleccionada.actividades.length)];

    const vueltasExtra = 5 + Math.floor(Math.random() * 3);
    const anguloFinal = vueltasExtra * 360 + Math.random() * 360;
    
    setRotacion(prev => prev + anguloFinal);

    setTimeout(async () => {
      const resultadoFinal = {
        materia: materiaSeleccionada,
        actividad: actividadSeleccionada
      };
      
      setResultado(resultadoFinal);
      setGirando(false);
      //setYaGiro(true);

      // Crear transacción de puntos en la base de datos
      try {
        const nuevoBalance = puntosTotal + actividadSeleccionada.puntos;
        
        const tipoPunto = { id: regla?.id_tipo_punto || 1, nombre: "", nombreMostrar: "" };
        const puntosCalculados = regla?.puntosOtorgados ? regla.puntosOtorgados : actividadSeleccionada.puntos;

        const transaccionData: CrearTransaccionDTO = {
          usuarioId: ST_GET_USER_ID(),
          tipoPunto: tipoPunto,
          tipoTransaccion: TipoTransaccion.GANAR,
          cantidad: puntosCalculados,
          descripcion: `Ruleta del Saber - ${materiaSeleccionada.nombre}`,
          tipoOrigen: 'RULETA',
          idOrigen: materiaSeleccionada.id,
          metadatos: {
            materia: materiaSeleccionada.nombre,
            actividad: actividadSeleccionada.texto.substring(0, 100),
            emoji: materiaSeleccionada.emoji,
            fecha_giro: new Date().toISOString()
          }
        };

        await CREAR(transaccionData);

        setPuntosTotal(nuevoBalance);
        
        // Guardar en sessionStorage para la sesión actual
        const now = new Date();
        sessionStorage.setItem(`ultimoGiro_${usuarioId}`, now.toISOString());
        sessionStorage.setItem(`puntosTotal_${usuarioId}`, nuevoBalance.toString());
      } catch (err) {
        console.error('Error al registrar puntos:', err);
      }
    }, 3000);
  };

  const resetearDia = () => {
    setYaGiro(false);
    setResultado(null);
    sessionStorage.removeItem(`ultimoGiro_${usuarioId}`);
  };

  // Pantalla de reglas
  if (modoJuego === 'reglas') {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Group justify="space-between" align="center">
              <Title order={2} c="white">
                <span role="img" aria-label="rueda de la fortuna">🎡</span> Ruleta del Saber
              </Title>
              <Badge size="xl" variant="white" color="violet">
                <span role="img" aria-label="estrella">⭐</span>{' '}
                {regla?.puntosOtorgados || '?'} puntos por giro
              </Badge>
            </Group>
          </Paper>

          <Card shadow="md" padding="xl" radius="md">
            <Stack gap="xl">
              <Title order={3} ta="center" c="blue">
                <span role="img" aria-label="libro">📚</span> Reglas del Juego
              </Title>
              
              <Divider />
              
              <Stack gap="md">
                <Title order={4}>Cómo jugar:</Title>
                <List
                  spacing="sm"
                  size="md"
                  center
                  icon={
                    <ThemeIcon color="green" size={24} radius="xl">
                      <IconCircleCheck size="1rem" />
                    </ThemeIcon>
                  }
                >
                  <List.Item>
                    <Text fw={500}>Gira la ruleta</Text>
                    <Text size="sm" c="dimmed">Haz clic en el botón girar para seleccionar una materia al azar</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Recibe tu desafío</Text>
                    <Text size="sm" c="dimmed">Obtendrás una actividad específica de la materia seleccionada</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Gana puntos</Text>
                    <Text size="sm" c="dimmed">Completa la actividad para sumar puntos a tu total</Text>
                  </List.Item>
                  <List.Item>
                    <Text fw={500}>Un giro por día</Text>
                    <Text size="sm" c="dimmed">Puedes girar la ruleta una vez cada 24 horas</Text>
                  </List.Item>
                </List>

                <Divider />

                <Title order={4}>Materias disponibles:</Title>
                <Group gap="xs">
                  {MATERIAS.map(materia => (
                    <Badge 
                      key={materia.id} 
                      variant="light" 
                      size="lg"
                      style={{ background: `${materia.color}22`, color: materia.color }}
                    >
                      <span role="img" aria-label={materia.nombre}>{materia.emoji}</span> {materia.nombre}
                    </Badge>
                  ))}
                </Group>

                <Paper p="md" radius="md" bg="blue.0" mt="md">
                  <Group gap="xs">
                    <ThemeIcon color="blue" size="lg">
                      <IconPlayerPlay size="1.2rem" />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>
                      ¡Las actividades son generadas con IA para que cada día sea un nuevo reto!
                    </Text>
                  </Group>
                </Paper>
              </Stack>

              <Divider />

              {error && (
                <Alert color="red" title="Error al cargar reglas">
                  {error}
                </Alert>
              )}

              <Button
                size="xl"
                radius="xl"
                onClick={iniciarJuego}
                disabled={loading || cargandoActividades}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: 20,
                  height: 60,
                  marginTop: 20
                }}
              >
                {cargandoActividades ? (
                  <Center>
                    <Loader size="sm" color="white" mr="md" />
                    Generando actividades con IA...
                  </Center>
                ) : (
                  <>
                    <IconPlayerPlay size="1.5rem" style={{ marginRight: 10 }} />
                    ¡Comenzar a Jugar!
                  </>
                )}
              </Button>

              {loading && (
                <Alert color="blue" title="Cargando">
                  <Group gap="sm">
                    <Loader size="sm" />
                    <Text>Cargando reglas del juego...</Text>
                  </Group>
                </Alert>
              )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    );
  }

  // Pantalla del juego (cuando ya se cargaron las actividades)
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Group justify="space-between" align="center">
            <Title order={2} c="white">
              <span role="img" aria-label="rueda de la fortuna">🎡</span> ¡Gira la Ruleta del Saber!
            </Title>
            <Badge size="xl" variant="white" color="violet">
              <span role="img" aria-label="estrella">⭐</span>{' '}
              {puntosTotal} puntos
            </Badge>
          </Group>
        </Paper>

        

        <Card shadow="md" padding="xl" radius="md">
          <Stack align="center" gap="xl">
            <div style={{ 
              width: 280, 
              height: 280, 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: -20,
                fontSize: 40,
                zIndex: 10
              }}>
                <span role="img" aria-label="apuntando abajo">👇</span>
              </div>
              
              <div style={{
                width: 260,
                height: 260,
                borderRadius: '50%',
                border: '8px solid #667eea',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                transform: `rotate(${rotacion}deg)`,
                transition: girando ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                background: 'white',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                {materiasGeneradas.map((materia, index) => (
                  <div
                    key={materia.id}
                    style={{
                      background: materia.color,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      color: 'white',
                      fontWeight: 'bold',
                      borderRight: index % 3 !== 2 ? '2px solid white' : 'none',
                      borderBottom: index < 3 ? '2px solid white' : 'none',
                      padding: 8
                    }}
                  >
                    <span role="img" aria-label={materia.nombre}>{materia.emoji}</span>
                    <Text size="xs" c="white" ta="center" mt={4} style={{ fontSize: 10 }}>
                      {materia.nombre}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="xl"
              radius="xl"
              disabled={girando || yaGiro || loading || cargandoActividades}
              onClick={girarRuleta}
              style={{
                background: (yaGiro || cargandoActividades) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: 20,
                height: 60,
                paddingLeft: 40,
                paddingRight: 40
              }}
            >
              {cargandoActividades ? (
                <><span role="img" aria-label="robot">🤖</span> Generando actividades...</>
              ) : loading ? (
                <><span role="img" aria-label="guardando">💾</span> Guardando...</>
              ) : yaGiro ? (
                <><span role="img" aria-label="check">✅</span> Ya giraste hoy</>
              ) : girando ? (
                <><span role="img" aria-label="carpa">🎪</span> Girando...</>
              ) : (
                <><span role="img" aria-label="diana">🎯</span> ¡GIRAR RULETA!</>
              )}
            </Button>

            {yaGiro && !resultado && (
              <Text size="sm" c="dimmed">
                Vuelve mañana para un nuevo reto <span role="img" aria-label="estrella brillante">🌟</span>
              </Text>
            )}

            <Button
              variant="subtle"
              color="gray"
              onClick={() => setModoJuego('reglas')}
            >
              ← Volver a ver las reglas
            </Button>
          </Stack>
        </Card>

        {resultado && (
          <Card shadow="lg" padding="xl" radius="md" style={{ 
            background: `linear-gradient(135deg, ${resultado.materia.color}22 0%, ${resultado.materia.color}44 100%)`,
            border: `3px solid ${resultado.materia.color}`
          }}>
            <Stack gap="md">
              <Group>
                <Text size="48px">
                  <span role="img" aria-label={resultado.materia.nombre}>{resultado.materia.emoji}</span>
                </Text>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Materia</Text>
                  <Title order={3} c={resultado.materia.color}>{resultado.materia.nombre}</Title>
                </div>
              </Group>

              <Paper p="md" radius="md" bg="white">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={8}>
                  <span role="img" aria-label="mensaje">💬</span> Tu reto de hoy
                </Text>
                <Text size="lg" fw={500} style={{ lineHeight: 1.6 }}>
                  {resultado.actividad.texto}
                </Text>
              </Paper>

              <Group justify="space-between" align="center">
                <Badge size="xl" variant="filled" color="yellow" leftSection={<span role="img" aria-label="estrella">⭐</span>}>
                  +{resultado.actividad.puntos} puntos ganados
                </Badge>
                <Button 
                  variant="light" 
                  color="gray" 
                  onClick={resetearDia}
                  size="sm"
                >
                  <span role="img" aria-label="recargar">🔄</span> Simular nuevo día
                </Button>
              </Group>

              <Paper p="sm" radius="md" bg="rgba(255,255,255,0.5)">
                <Text size="sm" c="dimmed" ta="center">
                  <span role="img" aria-label="bombilla">💡</span> <strong>Tip:</strong> Completa tu actividad y compártela en el muro del aula para sumar tus puntos
                </Text>
              </Paper>
            </Stack>
          </Card>
        )}

        <Card shadow="sm" padding="md" radius="md" bg="gray.0">
          <Stack gap="xs">
            <Text size="sm" fw={700}>
              <span role="img" aria-label="portapapeles">📋</span> Materias disponibles:
            </Text>
            <Group gap="xs">
              {materiasGeneradas.map(materia => (
                <Badge 
                  key={materia.id} 
                  variant="light" 
                  style={{ background: `${materia.color}22`, color: materia.color }}
                >
                  <span role="img" aria-label={materia.nombre}>{materia.emoji}</span> {materia.nombre}
                </Badge>
              ))}
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              <span role="img" aria-label="robot">🤖</span> Actividades generadas con IA
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}