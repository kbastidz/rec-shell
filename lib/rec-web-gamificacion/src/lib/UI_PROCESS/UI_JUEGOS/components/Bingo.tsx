import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Paper, 
  Badge, 
  Button, 
  Modal, 
  Textarea, 
  Group, 
  Text,
  Stack,
  Progress,
  Card,
  Notification,
  FileButton,
  Loader,
  Alert,
  Center,
} from '@mantine/core';

import { CrearTransaccionDTO } from '../../../types/dto';
import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TipoTransaccion } from '../../../enums/Enums';
import { useTransaccionPuntos } from '../hooks/useGamificacion';
import { ACCIONES_BASE, promptTemplateBingo } from '../../../utils/CONSTANTE';
import { useGemini } from '@rec-shell/rec-web-shared';


const MATERIAS = {
  ESPANOL: { nombre: 'Español', color: '#e74c3c', icon: '📚' },
  MATEMATICAS: { nombre: 'Matemáticas', color: '#3498db', icon: '🔢' },
  CIENCIAS: { nombre: 'Ciencias', color: '#2ecc71', icon: '🔬' },
  SOCIALES: { nombre: 'Sociales', color: '#f39c12', icon: '🌎' },
  ARTES: { nombre: 'Artes', color: '#9b59b6', icon: '🎨' }
};

type MateriaKey = keyof typeof MATERIAS;

interface Casilla {
  id: number;
  materia: MateriaKey;
  accion: string;
  completada: boolean;
  evidencia: { texto: string; archivo: File | null } | null;
}

interface Linea {
  tipo: string;
  index: number;
  casillas: number[];
}

interface Notificacion {
  mensaje: string;
  color: string;
}

interface AccionesGeneradas {
  ESPANOL: string[];
  MATEMATICAS: string[];
  CIENCIAS: string[];
  SOCIALES: string[];
  ARTES: string[];
}

function generarTablero(acciones: AccionesGeneradas): Casilla[] {
  const tablero: Casilla[] = [];
  const materiasKeys: MateriaKey[] = ['ESPANOL', 'MATEMATICAS', 'CIENCIAS', 'SOCIALES', 'ARTES'];
  
  for (let i = 0; i < 25; i++) {
    // Seleccionar una materia aleatoria
    const materiaKey = materiasKeys[Math.floor(Math.random() * materiasKeys.length)];
    const accionesMateria = acciones[materiaKey] || [];
    
    // Seleccionar una acción aleatoria de esa materia
    const accion = accionesMateria.length > 0
      ? accionesMateria[Math.floor(Math.random() * accionesMateria.length)]
      : 'Acción pendiente';
    
    tablero.push({
      id: i,
      materia: materiaKey,
      accion,
      completada: false,
      evidencia: null
    });
  }
  
  return tablero;
}

function detectarLineasCompletadas(tablero: Casilla[]): Linea[] {
  const lineas: Linea[] = [];
  
  if (tablero.length !== 25) return lineas;
  
  // Filas
  for (let i = 0; i < 5; i++) {
    const fila = tablero.slice(i * 5, (i + 1) * 5);
    if (fila.length === 5 && fila.every(c => c && c.completada)) {
      lineas.push({ tipo: 'fila', index: i, casillas: fila.map(c => c.id) });
    }
  }
  
  // Columnas
  for (let i = 0; i < 5; i++) {
    const columna = [0, 1, 2, 3, 4].map(row => tablero[row * 5 + i]).filter(c => c !== undefined);
    if (columna.length === 5 && columna.every(c => c && c.completada)) {
      lineas.push({ tipo: 'columna', index: i, casillas: columna.map(c => c.id) });
    }
  }
  
  // Diagonales
  const diagonal1 = [0, 6, 12, 18, 24].map(i => tablero[i]).filter(c => c !== undefined);
  if (diagonal1.length === 5 && diagonal1.every(c => c && c.completada)) {
    lineas.push({ tipo: 'diagonal', index: 1, casillas: [0, 6, 12, 18, 24] });
  }
  
  const diagonal2 = [4, 8, 12, 16, 20].map(i => tablero[i]).filter(c => c !== undefined);
  if (diagonal2.length === 5 && diagonal2.every(c => c && c.completada)) {
    lineas.push({ tipo: 'diagonal', index: 2, casillas: [4, 8, 12, 16, 20] });
  }
  
  return lineas;
}

export function Bingo() {
  const usuarioId = ST_GET_USER_ID();

  // Estado del juego
  const [tablero, setTablero] = useState<Casilla[]>([]);
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [casillaSeleccionada, setCasillaSeleccionada] = useState<Casilla | null>(null);
  const [evidenciaTexto, setEvidenciaTexto] = useState<string>('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [puntos, setPuntos] = useState<number>(0);
  const [lineasCompletadas, setLineasCompletadas] = useState<Linea[]>([]);
  const [notificacion, setNotificacion] = useState<Notificacion | null>(null);
  const [insignias, setInsignias] = useState<string[]>([]);
  
  const { CREAR, OBTENER_REGLA_POR_TIPO, regla, loading: loadingTransaccion } = useTransaccionPuntos();
  
  // Hook de Gemini
  const [accionesGeneradas, setAccionesGeneradas] = useState<AccionesGeneradas | null>(null);
  const [cargandoActividades, setCargandoActividades] = useState(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);
  const [bingoIniciado, setBingoIniciado] = useState(false);

  //Hook para invocar las reglas del juego
  useEffect(() => {
    const cargarRegla = async () => {
      console.log('🔄 Cargando regla BINGO...');
      await OBTENER_REGLA_POR_TIPO('BINGO');
    };
    cargarRegla();
  }, []);

  // Log cuando regla cambia
  useEffect(() => {
    if (regla) {
      console.log('✅ Regla cargada:', regla);
    }
  }, [regla]);
  
  const { loading: loadingGemini, error: errorGemini, generateText } = useGemini({
    temperature: 0.8,
    maxTokens: 8000,
    onSuccess: (result: any) => {
      try {
        let textoRespuesta = result;
        
        // Limpiar la respuesta si viene con markdown o texto adicional
        if (typeof textoRespuesta === 'string') {
          // Buscar JSON entre bloques de código
          const matchCodeBlock = textoRespuesta.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (matchCodeBlock) {
            textoRespuesta = matchCodeBlock[1];
          }
          
          // Buscar JSON directamente
          const matchJSON = textoRespuesta.match(/\{[\s\S]*\}/);
          if (matchJSON) {
            textoRespuesta = matchJSON[0];
          }
        }
        
        // Intentar parsear el JSON
        const accionesIA = JSON.parse(textoRespuesta);
        
        // Validar que tenga las 5 materias
        const materiasEsperadas = ['ESPANOL', 'MATEMATICAS', 'CIENCIAS', 'SOCIALES', 'ARTES'];
        const materiasValidas = materiasEsperadas.filter(m => 
          accionesIA[m] && Array.isArray(accionesIA[m]) && accionesIA[m].length > 0
        );
        
        if (materiasValidas.length === 5) {
          console.log('✅ Actividades generadas correctamente:', accionesIA);
          setAccionesGeneradas(accionesIA);
          sessionStorage.setItem(`acciones_bingo_${usuarioId}`, JSON.stringify(accionesIA));
          setErrorIA(null);
        } else {
          console.warn('⚠️ Respuesta incompleta de Gemini. Materias válidas:', materiasValidas.length);
          setAccionesGeneradas(ACCIONES_BASE);
          setErrorIA('Respuesta incompleta, usando actividades predefinidas');
        }
      } catch (error) {
        console.error('❌ Error al procesar respuesta de Gemini:', error);
        console.log('Respuesta recibida:', result);
        setAccionesGeneradas(ACCIONES_BASE);
        setErrorIA('Error al generar actividades, usando predefinidas');
      } finally {
        setCargandoActividades(false);
      }
    },
    onError: (errorMsg: string) => {
      console.error('Error de Gemini:', errorMsg);
      setCargandoActividades(false);
      setAccionesGeneradas(ACCIONES_BASE);
      setErrorIA('No se pudo conectar con IA, usando actividades predefinidas');
    }
  });

  // Verificar si hay un bingo guardado al montar
  useEffect(() => {
    const accionesGuardadas = sessionStorage.getItem(`acciones_bingo_${usuarioId}`);
    
    if (accionesGuardadas) {
      try {
        const acciones = JSON.parse(accionesGuardadas);
        setAccionesGeneradas(acciones);
        setBingoIniciado(true);
      } catch (error) {
        console.error('Error al cargar acciones guardadas:', error);
      }
    }
  }, [usuarioId]);

  // Generar tablero cuando las acciones estén listas
  useEffect(() => {
    if (accionesGeneradas && tablero.length === 0) {
      setTablero(generarTablero(accionesGeneradas));
    }
  }, [accionesGeneradas, tablero.length]);

  const iniciarBingoConIA = async () => {
    setBingoIniciado(true);
    setCargandoActividades(true);
    
    try {
      await generateText(promptTemplateBingo);
    } catch (error) {
      console.error('Error al generar actividades:', error);
      setAccionesGeneradas(ACCIONES_BASE);
      setCargandoActividades(false);
      setErrorIA('Error al generar actividades, usando predefinidas');
    }
  };

  // Efecto para detectar líneas completadas y bingo completo
  useEffect(() => {
    // Verificar que regla esté cargada
    if (!regla) {
      console.log('⏳ Esperando carga de regla...');
      return;
    }

    const lineas = detectarLineasCompletadas(tablero);
    const nuevasLineas = lineas.filter(
      linea => !lineasCompletadas.some(
        l => l.tipo === linea.tipo && l.index === linea.index
      )
    );
    
    if (nuevasLineas.length > 0) {
      console.log('🎉 Nuevas líneas detectadas:', nuevasLineas);
      
      const puntosNuevos = nuevasLineas.length * 5;
      setPuntos(p => p + puntosNuevos);
      setLineasCompletadas(lineas);
      
      const tipoPunto = { id: regla?.id_tipo_punto || 1 ,  nombre: "", nombreMostrar:""};
      const puntosCalculados = regla.puntosOtorgados || 1;

      // Usar Promise.all en lugar de forEach
      Promise.all(
        nuevasLineas.map(async (linea) => {
          const transaccionData: CrearTransaccionDTO = {
            usuarioId: ST_GET_USER_ID(),
            tipoPunto: tipoPunto,
            tipoTransaccion: TipoTransaccion.GANAR,
            cantidad: puntosCalculados,
            descripcion: `Completó ${linea.tipo} ${linea.index + 1} del Bingo`,
            tipoOrigen: 'BINGO_LINEA',
            idOrigen: linea.index,
            metadatos: {
              tipo_linea: linea.tipo,
              casillas: linea.casillas
            }
          };
          
          console.log('💾 Guardando transacción de línea:', transaccionData);
          const resultado = await CREAR(transaccionData);
          console.log('✅ Transacción de línea guardada:', resultado);
          return resultado;
        })
      ).catch(error => {
        console.error('❌ Error al guardar transacciones de líneas:', error);
      });
      
      setNotificacion({
        mensaje: `¡${nuevasLineas.length} línea(s) completada(s)! +${puntosNuevos} pts`,
        color: 'green'
      });
      
      setTimeout(() => setNotificacion(null), 3000);
    }
    
    // Verificar tablero completo
    if (tablero.length > 0 && tablero.every(c => c.completada) && !insignias.includes('bingo_completo')) {
      console.log('🏆 Bingo completo detectado');
      
      setPuntos(p => p + 15);
      setInsignias([...insignias, 'bingo_completo']);
      
      const tipoPunto = { id: regla.id_tipo_punto || 1 ,  nombre: "", nombreMostrar:""};
      const puntosCalculados = regla.puntosOtorgados || 1;

      const transaccionData: CrearTransaccionDTO = {
        usuarioId: ST_GET_USER_ID(),
        tipoPunto: tipoPunto,
        tipoTransaccion: TipoTransaccion.GANAR,
        cantidad: puntosCalculados,
        descripcion: '¡Bingo completo! Bonus especial',
        tipoOrigen: 'BINGO_COMPLETO',
        idOrigen: 1,
        metadatos: {
          achievement: 'bingo_completo',
          total_casillas: 25
        }
      };
      
      console.log('💾 Guardando transacción de bingo completo:', transaccionData);
      CREAR(transaccionData).then(resultado => {
        console.log('✅ Transacción de bingo completo guardada:', resultado);
      }).catch(error => {
        console.error('❌ Error al guardar transacción de bingo completo:', error);
      });
      
      setNotificacion({
        mensaje: '🏆 ¡BINGO COMPLETO!',
        color: 'yellow'
      });
    }
  }, [tablero, lineasCompletadas, insignias, regla, CREAR]);

  const abrirModal = (casilla: Casilla) => {
    setCasillaSeleccionada(casilla);
    setModalAbierto(true);
    setEvidenciaTexto('');
    setArchivo(null);
  };

  const completarCasilla = async () => {
    if (!casillaSeleccionada) return;

    if (!evidenciaTexto && !archivo) {
      alert('Por favor agrega una evidencia (texto o archivo)');
      return;
    }

    if (!regla) {
      console.error('❌ No se puede completar casilla: regla no cargada');
      alert('Error: Configuración del juego no cargada. Intenta recargar la página.');
      return;
    }
    
    const nuevoTablero = tablero.map(c => 
      c.id === casillaSeleccionada.id 
        ? { ...c, completada: true, evidencia: { texto: evidenciaTexto, archivo } }
        : c
    );
    
    setTablero(nuevoTablero);
    const tipoPunto = { id: regla?.id_tipo_punto || 1 ,  nombre: "", nombreMostrar:""};
    const puntosCalculados = regla.puntosOtorgados || 1;

    const transaccionData: CrearTransaccionDTO = {
      usuarioId: ST_GET_USER_ID(),
      tipoPunto: tipoPunto,
      tipoTransaccion: TipoTransaccion.GANAR,
      cantidad: puntosCalculados,
      descripcion: `Completó acción: ${casillaSeleccionada.accion}`,
      tipoOrigen: 'BINGO',
      idOrigen: casillaSeleccionada.id,
      metadatos: {
        materia: casillaSeleccionada.materia,
        accion: casillaSeleccionada.accion,
        evidencia: evidenciaTexto,
        archivo_nombre: archivo?.name || null
      }
    };
    
    console.log('💾 Guardando transacción de casilla:', transaccionData);
    
    try {
      const resultado = await CREAR(transaccionData);
      console.log('✅ Transacción de casilla guardada:', resultado);
    } catch (error) {
      console.error('❌ Error al guardar transacción de casilla:', error);
    }
    
    setModalAbierto(false);
  };

  const reiniciarBingo = () => {
    sessionStorage.removeItem(`acciones_bingo_${usuarioId}`);
    setTablero([]);
    setPuntos(0);
    setLineasCompletadas([]);
    setInsignias([]);
    setErrorIA(null);
    iniciarBingoConIA();
    setNotificacion({ mensaje: '🎲 Generando nuevo tablero...', color: 'blue' });
    setTimeout(() => setNotificacion(null), 2000);
  };

  // Pantalla inicial si no ha iniciado el bingo
  if (!bingoIniciado) {
    return (
      <Container size="xl" py="xl">
        <Center style={{ minHeight: '60vh' }}>
          <Paper shadow="lg" p="xl" style={{ maxWidth: 600, textAlign: 'center' }}>
            <Stack gap="xl">
              <div style={{ fontSize: '5rem' }}>
                <span role="img" aria-label="dice">🎲</span>
              </div>
              <Title order={1} style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Bingo Educativo Semanal
              </Title>
              <Text size="lg" c="dimmed">
                Completa actividades de diferentes materias, forma líneas y gana puntos. 
                ¡La IA generará actividades personalizadas para ti!
              </Text>
              
              <Stack gap="sm">
                <Paper p="sm" bg="blue.0">
                  <Text size="sm" fw={500}>✨ Actividades personalizadas con IA</Text>
                </Paper>
                <Paper p="sm" bg="green.0">
                  <Text size="sm" fw={500}>🏆 Gana puntos por líneas completadas</Text>
                </Paper>
                <Paper p="sm" bg="yellow.0">
                  <Text size="sm" fw={500}>📚 5 materias diferentes</Text>
                </Paper>
              </Stack>

              <Button 
                size="xl" 
                onClick={iniciarBingoConIA}
                gradient={{ from: 'grape', to: 'violet', deg: 90 }}
                variant="gradient"
                style={{ marginTop: '1rem' }}
              >
                🚀 Iniciar Bingo Educativo
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  // Mostrar loading mientras se cargan las actividades
  if (cargandoActividades) {
    return (
      <Container size="xl" py="xl">
        <Paper shadow="sm" p="xl" style={{ textAlign: 'center' }}>
          <Loader size="xl" mb="md" />
          <Title order={3} mb="xs">Generando tu Bingo Educativo...</Title>
          <Text c="dimmed">Estamos creando actividades personalizadas para ti</Text>
        </Paper>
      </Container>
    );
  }

  const completadas = tablero.filter(c => c.completada).length;
  const progreso = (completadas / 25) * 100;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Paper shadow="sm" p="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} c="white">
                <span role="img" aria-label="dado">🎲</span> Bingo Educativo Semanal
              </Title>
              <Text c="white" size="sm" mt={5}>Completa acciones de cada materia para ganar puntos</Text>
            </div>
            <Stack gap="xs" align="end">
              <Badge size="xl" variant="filled" color="yellow" style={{ fontSize: '1.2rem' }}>
                <span role="img" aria-label="estrella">⭐</span> {regla?.puntosOtorgados ?? puntos} pts
              </Badge>
              {insignias.includes('bingo_completo') && (
                <Badge size="lg" variant="filled" color="orange">
                  <span role="img" aria-label="trofeo">🏆</span> Bingo Completo
                </Badge>
              )}
            </Stack>
          </Group>
        </Paper>

        {errorIA && (
          <Alert color="yellow" title="Modo offline" icon="⚠️">
            {errorIA}
          </Alert>
        )}

        {notificacion && (
          <Notification 
            color={notificacion.color} 
            onClose={() => setNotificacion(null)}
            title="¡Logro desbloqueado!"
          >
            {notificacion.mensaje}
          </Notification>
        )}

        <Card shadow="sm" padding="lg">
          <Group justify="space-between" mb="md">
            <Text fw={600}>Progreso: {completadas}/25 casillas</Text>
            <Button onClick={reiniciarBingo} variant="light" color="grape" loading={cargandoActividades}>
              <span role="img" aria-label="recargar">🔄</span> Nuevo Tablero Semanal
            </Button>
          </Group>
          <Progress value={progreso} size="lg" radius="xl" 
            color={progreso === 100 ? 'yellow' : 'blue'} 
            animated={progreso < 100}
          />
        </Card>

        <Grid gutter="xs">
          {tablero.map((casilla) => {
            const materia = MATERIAS[casilla.materia];
            const enLineaCompletada = lineasCompletadas.some(
              linea => linea.casillas.includes(casilla.id)
            );
            
            return (
              <Grid.Col key={casilla.id} span={{ base: 12, xs: 6, sm: 4, md: 2.4 }}>
                <Paper
                  shadow="sm"
                  p="md"
                  h={140}
                  style={{
                    background: casilla.completada 
                      ? `linear-gradient(135deg, ${materia.color}dd, ${materia.color}aa)`
                      : '#fff',
                    border: enLineaCompletada ? '3px solid gold' : '1px solid #ddd',
                    cursor: casilla.completada ? 'default' : 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative'
                  }}
                  onClick={() => !casilla.completada && abrirModal(casilla)}
                >
                  <Stack gap="xs" h="100%" justify="space-between">
                    <Badge 
                      variant="filled" 
                      color={materia.color}
                      size="sm"
                      leftSection={materia.icon}
                    >
                      {materia.nombre}
                    </Badge>
                    
                    <Text 
                      size="xs" 
                      c={casilla.completada ? 'white' : 'dark'}
                      fw={500}
                      style={{ 
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word'
                      }}
                    >
                      {casilla.accion}
                    </Text>
                    
                    {casilla.completada && (
                      <div style={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5,
                        fontSize: '2rem'
                      }}>
                        <span role="img" aria-label="completada">✅</span>
                      </div>
                    )}
                  </Stack>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>

        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">
            <span role="img" aria-label="gráfica">📊</span> Estadísticas
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <Text c="dimmed" size="sm">Líneas completadas</Text>
              <Text size="xl" fw={700}>{lineasCompletadas.length}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text c="dimmed" size="sm">Puntos ganados</Text>
              <Text size="xl" fw={700} c="yellow.8">{puntos} pts</Text>
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={
          <Group>
            <Text fw={600}>Completar acción</Text>
            {casillaSeleccionada && (
              <Badge color={MATERIAS[casillaSeleccionada.materia].color}>
                {MATERIAS[casillaSeleccionada.materia].icon} {MATERIAS[casillaSeleccionada.materia].nombre}
              </Badge>
            )}
          </Group>
        }
        size="md"
      >
        {casillaSeleccionada && (
          <Stack gap="md">
            <Paper p="md" bg="gray.0">
              <Text fw={500}>{casillaSeleccionada.accion}</Text>
            </Paper>
            
            <Textarea
              label="Describe qué hiciste"
              placeholder="Escribe aquí tu evidencia o reflexión..."
              value={evidenciaTexto}
              onChange={(e) => setEvidenciaTexto(e.currentTarget.value)}
              minRows={3}
              required
            />
            
            <div>
              <Text size="sm" fw={500} mb={5}>Adjuntar evidencia (opcional)</Text>
              <FileButton onChange={setArchivo} accept="image/*,application/pdf">
                {(props) => (
                  <Button {...props} variant="light" fullWidth>
                    <span role="img" aria-label="clip">📎</span> {archivo ? archivo.name : 'Subir foto o documento'}
                  </Button>
                )}
              </FileButton>
            </div>
            
            <Button 
              fullWidth 
              onClick={completarCasilla}
              size="md"
              gradient={{ from: 'teal', to: 'blue', deg: 90 }}
              variant="gradient"
              loading={loadingTransaccion}
              disabled={loadingTransaccion}
            >
              <span role="img" aria-label="completada">✅</span> Marcar como completada
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}