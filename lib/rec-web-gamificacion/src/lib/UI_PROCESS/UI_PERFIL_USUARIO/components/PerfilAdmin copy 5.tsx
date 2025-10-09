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
  ThemeIcon,
  Notification,
  FileButton,
  ActionIcon
} from '@mantine/core';

const MATERIAS = {
  ESPANOL: { nombre: 'Español', color: '#e74c3c', icon: '📚' },
  MATEMATICAS: { nombre: 'Matemáticas', color: '#3498db', icon: '🔢' },
  CIENCIAS: { nombre: 'Ciencias', color: '#2ecc71', icon: '🔬' },
  SOCIALES: { nombre: 'Sociales', color: '#f39c12', icon: '🌎' },
  ARTES: { nombre: 'Artes', color: '#9b59b6', icon: '🎨' }
};

const ACCIONES_BASE = {
  ESPANOL: [
    'Escribe una mini historia',
    'Lee un poema en voz alta',
    'Escribe 5 palabras nuevas',
    'Corrige un texto con errores',
    'Inventa un refrán',
    'Describe tu lugar favorito',
    'Escribe una carta a un amigo',
    'Crea un acróstico'
  ],
  MATEMATICAS: [
    'Resuelve 3 ejercicios de suma mental',
    'Aprende una tabla de multiplicar',
    'Calcula el perímetro de tu pupitre',
    'Juega con fracciones',
    'Resuelve un problema de división',
    'Mide 5 objetos de tu casa',
    'Crea un patrón numérico',
    'Cuenta de 3 en 3 hasta 60'
  ],
  CIENCIAS: [
    'Observa una planta y dibújala',
    'Describe el clima de hoy',
    'Mide la temperatura',
    'Explica cómo se forma la lluvia',
    'Identifica 3 animales locales',
    'Experimenta con agua y aceite',
    'Observa el cielo nocturno',
    'Clasifica 5 objetos por material'
  ],
  SOCIALES: [
    'Investiga un héroe local',
    'Menciona 3 provincias',
    'Busca un país en el mapa',
    'Habla de tu familia',
    'Describe una tradición local',
    'Dibuja tu árbol genealógico',
    'Investiga sobre Simón Bolívar',
    'Menciona 3 ríos de Ecuador'
  ],
  ARTES: [
    'Dibuja algo sobre tu día',
    'Crea una canción corta',
    'Haz una figura con papel',
    'Pinta una emoción',
    'Construye algo con material reciclado',
    'Diseña un logo para tu clase',
    'Crea un collage',
    'Baila una canción y descríbela'
  ]
};

function generarTablero() {
  const tablero = [];
  const materiasKeys = Object.keys(ACCIONES_BASE);
  
  for (let i = 0; i < 25; i++) {
    const materiaKey = materiasKeys[Math.floor(Math.random() * materiasKeys.length)];
    const acciones = ACCIONES_BASE[materiaKey];
    const accion = acciones[Math.floor(Math.random() * acciones.length)];
    
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

function detectarLineasCompletadas(tablero) {
  const lineas = [];
  
  // Filas
  for (let i = 0; i < 5; i++) {
    const fila = tablero.slice(i * 5, (i + 1) * 5);
    if (fila.every(c => c.completada)) {
      lineas.push({ tipo: 'fila', index: i, casillas: fila.map(c => c.id) });
    }
  }
  
  // Columnas
  for (let i = 0; i < 5; i++) {
    const columna = [0, 1, 2, 3, 4].map(row => tablero[row * 5 + i]);
    if (columna.every(c => c.completada)) {
      lineas.push({ tipo: 'columna', index: i, casillas: columna.map(c => c.id) });
    }
  }
  
  // Diagonales
  const diagonal1 = [0, 6, 12, 18, 24].map(i => tablero[i]);
  if (diagonal1.every(c => c.completada)) {
    lineas.push({ tipo: 'diagonal', index: 1, casillas: [0, 6, 12, 18, 24] });
  }
  
  const diagonal2 = [4, 8, 12, 16, 20].map(i => tablero[i]);
  if (diagonal2.every(c => c.completada)) {
    lineas.push({ tipo: 'diagonal', index: 2, casillas: [4, 8, 12, 16, 20] });
  }
  
  return lineas;
}

export  function PerfilAdmin() {
  const [tablero, setTablero] = useState(() => generarTablero());
  const [modalAbierto, setModalAbierto] = useState(false);
  const [casillaSeleccionada, setCasillaSeleccionada] = useState(null);
  const [evidenciaTexto, setEvidenciaTexto] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [lineasCompletadas, setLineasCompletadas] = useState([]);
  const [notificacion, setNotificacion] = useState(null);
  const [insignias, setInsignias] = useState([]);

  useEffect(() => {
    const lineas = detectarLineasCompletadas(tablero);
    const nuevasLineas = lineas.filter(
      linea => !lineasCompletadas.some(
        l => l.tipo === linea.tipo && l.index === linea.index
      )
    );
    
    if (nuevasLineas.length > 0) {
      const puntosNuevos = nuevasLineas.length * 5;
      setPuntos(p => p + puntosNuevos);
      setLineasCompletadas(lineas);
      
      setNotificacion({
        mensaje: `¡${nuevasLineas.length} línea(s) completada(s)! +${puntosNuevos} pts`,
        color: 'green'
      });
      
      setTimeout(() => setNotificacion(null), 3000);
    }
    
    // Verificar tablero completo
    if (tablero.every(c => c.completada) && !insignias.includes('bingo_completo')) {
      setPuntos(p => p + 15);
      setInsignias([...insignias, 'bingo_completo']);
      setNotificacion({
        mensaje: '🏆 ¡BINGO COMPLETO! +15 pts bonus',
        color: 'yellow'
      });
    }
  }, [tablero]);

  const abrirModal = (casilla) => {
    setCasillaSeleccionada(casilla);
    setModalAbierto(true);
    setEvidenciaTexto('');
    setArchivo(null);
  };

  const completarCasilla = () => {
    if (!evidenciaTexto && !archivo) {
      alert('Por favor agrega una evidencia (texto o archivo)');
      return;
    }
    
    const nuevoTablero = tablero.map(c => 
      c.id === casillaSeleccionada.id 
        ? { ...c, completada: true, evidencia: { texto: evidenciaTexto, archivo } }
        : c
    );
    
    setTablero(nuevoTablero);
    setModalAbierto(false);
  };

  const reiniciarBingo = () => {
    setTablero(generarTablero());
    setPuntos(0);
    setLineasCompletadas([]);
    setInsignias([]);
    setNotificacion({ mensaje: '🎲 Nuevo tablero generado', color: 'blue' });
    setTimeout(() => setNotificacion(null), 2000);
  };

  const completadas = tablero.filter(c => c.completada).length;
  const progreso = (completadas / 25) * 100;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Paper shadow="sm" p="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} c="white">🎲 Bingo Educativo Semanal</Title>
              <Text c="white" size="sm" mt={5}>Completa acciones de cada materia para ganar puntos</Text>
            </div>
            <Stack gap="xs" align="end">
              <Badge size="xl" variant="filled" color="yellow" style={{ fontSize: '1.2rem' }}>
                ⭐ {puntos} pts
              </Badge>
              {insignias.includes('bingo_completo') && (
                <Badge size="lg" variant="filled" color="orange">
                  🏆 Bingo Completo
                </Badge>
              )}
            </Stack>
          </Group>
        </Paper>

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
            <Button onClick={reiniciarBingo} variant="light" color="grape">
              🔄 Nuevo Tablero Semanal
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
                      style={{ lineHeight: 1.3 }}
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
                        ✅
                      </div>
                    )}
                  </Stack>
                </Paper>
              </Grid.Col>
            );
          })}
        </Grid>

        <Card shadow="sm" padding="lg">
          <Title order={3} mb="md">📊 Estadísticas</Title>
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
                    📎 {archivo ? archivo.name : 'Subir foto o documento'}
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
            >
              ✅ Marcar como completada
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}