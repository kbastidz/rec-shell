import React, { useState, useEffect } from 'react';
import { Button, Card, Text, Badge, Stack, Group, Title, Container, Paper, rem } from '@mantine/core';

const MATERIAS = [
  { 
    id: 1, 
    nombre: 'Matemáticas', 
    emoji: '🔢', 
    color: '#4A90E2',
    actividades: [
      { texto: '📸 Post estilo Instagram: Crea una historia visual resolviendo una ecuación paso a paso. Usa stickers y texto creativo para hacerla viral entre tus compañeros.', puntos: 4 },
      { texto: '🎬 TikTok educativo: Graba un video de 60 segundos explicando un "hack matemático" que uses para calcular porcentajes rápido. Usa música de fondo y transiciones.', puntos: 5 },
      { texto: '📊 Reto viral: Publica una encuesta en el grupo preguntando "¿Cuál es tu fórmula matemática favorita?" y comparte los resultados con un gráfico creativo.', puntos: 3 },
      { texto: '💬 Thread educativo: Crea una secuencia de 3 posts explicando cómo usar las fracciones en la vida real (cocina, videojuegos, etc.). Usa emojis y ejemplos cool.', puntos: 4 },
    ]
  },
  { 
    id: 2, 
    nombre: 'Lenguaje', 
    emoji: '📚', 
    color: '#E24A4A',
    actividades: [
      { texto: '📖 BookTok: Graba un video estilo TikTok recomendando tu libro favorito en 30 segundos. Hazlo dramático y emocionante para enganchar a tus seguidores.', puntos: 5 },
      { texto: '✍️ Escritura viral: Escribe un micro-relato de terror o suspenso de máximo 280 caracteres (estilo Twitter/X) y publícalo con hashtags creativos.', puntos: 3 },
      { texto: '🎭 Trend literario: Graba un video actuando una escena de tu obra literaria favorita. Usa efectos y filtros para hacerlo más épico.', puntos: 5 },
      { texto: '📝 Meme educativo: Crea un meme usando figuras literarias (metáfora, hipérbole, etc.) que sea gracioso y educativo. Compártelo en el grupo.', puntos: 3 },
    ]
  },
  { 
    id: 3, 
    nombre: 'Ciencias', 
    emoji: '🔬', 
    color: '#50C878',
    actividades: [
      { texto: '🧪 Experimento viral: Graba un experimento científico casero estilo YouTube (volcán de bicarbonato, etc.) y explica la reacción química. Bonus: efectos de edición.', puntos: 5 },
      { texto: '🌍 Post informativo: Crea un carrusel de Instagram con 5 datos impactantes sobre el cambio climático. Usa diseño atractivo y fuentes que llamen la atención.', puntos: 4 },
      { texto: '🔬 Challenge científico: Inicia un reto: "Menciona un científico que admires y por qué". Etiqueta a 3 compañeros para que continúen la cadena.', puntos: 3 },
      { texto: '⚡ Dato curioso viral: Graba un video tipo "Sabías que..." con un dato científico sorprendente. Usa música épica y revelación dramática al final.', puntos: 4 },
    ]
  },
  { 
    id: 4, 
    nombre: 'Historia', 
    emoji: '📜', 
    color: '#D4A574',
    actividades: [
      { texto: '🎥 Documental express: Graba un mini-documental de 2 minutos sobre un evento histórico importante usando fotos, narración y música de fondo dramática.', puntos: 5 },
      { texto: '📱 Historia en Stories: Crea 5 stories contando un evento histórico como si fuera noticia de última hora con encuestas interactivas y preguntas.', puntos: 4 },
      { texto: '🕰️ Time travel post: Publica qué época histórica visitarías y por qué, con una imagen o video editado donde "aparezcas" en esa época.', puntos: 4 },
      { texto: '👥 Trend histórico: Recrea un meme famoso pero con personajes históricos. Ejemplo: "Expectativa vs Realidad" con Simón Bolívar o Cleopatra.', puntos: 3 },
    ]
  },
  { 
    id: 5, 
    nombre: 'Arte', 
    emoji: '🎨', 
    color: '#E67EB4',
    actividades: [
      { texto: '🎨 Speed art video: Graba en timelapse cómo creas una obra de arte (dibujo, pintura, digital). Usa música trending y muestra el antes/después.', puntos: 5 },
      { texto: '🖼️ Galería virtual: Crea un carrusel de Instagram mostrando 3 obras de arte que te inspiran y explica por qué en los captions.', puntos: 3 },
      { texto: '✨ Desafío artístico: Inicia el "Art Challenge": dibuja algo con los ojos cerrados, grábate y reta a tus compañeros a hacerlo mejor.', puntos: 4 },
      { texto: '🎭 Filtro creativo: Usa o crea un filtro de Instagram/Snapchat inspirado en un movimiento artístico (surrealismo, pop art) y tómate una selfie creativa.', puntos: 4 },
    ]
  },
  { 
    id: 6, 
    nombre: 'Educación Física', 
    emoji: '⚽', 
    color: '#FF8C42',
    actividades: [
      { texto: '💪 Fitness Challenge: Graba un video haciendo un reto físico (plancha, sentadillas, etc.) y reta a tus amigos a superarte. Usa hashtags fitness.', puntos: 4 },
      { texto: '⚽ Trick shot: Graba tu mejor jugada o truco deportivo en cámara lenta con música épica. Puede ser con cualquier deporte o actividad física.', puntos: 5 },
      { texto: '🏃 Rutina viral: Crea y comparte una rutina de ejercicios de 1 minuto que se pueda hacer en casa. Hazlo dinámico con cortes rápidos de video.', puntos: 4 },
      { texto: '📊 Progreso deportivo: Publica tu "antes y después" de alguna habilidad deportiva que hayas mejorado. Inspira a otros con tu dedicación.', puntos: 3 },
    ]
  },
];

export default function RuletaDelSaber() {
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [rotacion, setRotacion] = useState(0);
  const [ultimoGiro, setUltimoGiro] = useState(null);
  const [puntosTotal, setPuntosTotal] = useState(0);
  const [yaGiro, setYaGiro] = useState(false);

  useEffect(() => {
    const lastSpin = localStorage.getItem('ultimoGiro');
    const puntos = localStorage.getItem('puntosTotal');
    
    if (lastSpin) {
      const lastDate = new Date(lastSpin);
      const today = new Date();
      if (lastDate.toDateString() === today.toDateString()) {
        setYaGiro(true);
      }
    }
    
    if (puntos) {
      setPuntosTotal(parseInt(puntos));
    }
  }, []);

  const girarRuleta = () => {
    if (girando || yaGiro) return;

    setGirando(true);
    setResultado(null);

    const materiaSeleccionada = MATERIAS[Math.floor(Math.random() * MATERIAS.length)];
    const actividadSeleccionada = materiaSeleccionada.actividades[Math.floor(Math.random() * materiaSeleccionada.actividades.length)];

    const vueltasExtra = 5 + Math.floor(Math.random() * 3);
    const anguloFinal = vueltasExtra * 360 + Math.random() * 360;
    
    setRotacion(prev => prev + anguloFinal);

    setTimeout(() => {
      setResultado({
        materia: materiaSeleccionada,
        actividad: actividadSeleccionada
      });
      setGirando(false);
      setYaGiro(true);
      
      const nuevosPuntos = puntosTotal + actividadSeleccionada.puntos;
      setPuntosTotal(nuevosPuntos);
      
      const now = new Date();
      localStorage.setItem('ultimoGiro', now.toISOString());
      localStorage.setItem('puntosTotal', nuevosPuntos.toString());
      setUltimoGiro(now);
    }, 3000);
  };

  const resetearDia = () => {
    setYaGiro(false);
    setResultado(null);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Paper p="md" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Group justify="space-between" align="center">
            <Title order={2} c="white">🎡 ¡Gira la Ruleta del Saber!</Title>
            <Badge size="xl" variant="white" color="violet">
              ⭐ {puntosTotal} puntos
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
                👇
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
                {MATERIAS.map((materia, index) => (
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
                    <div>{materia.emoji}</div>
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
              disabled={girando || yaGiro}
              onClick={girarRuleta}
              style={{
                background: yaGiro ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: 20,
                height: 60,
                paddingLeft: 40,
                paddingRight: 40
              }}
            >
              {yaGiro ? '✅ Ya giraste hoy' : girando ? '🎪 Girando...' : '🎯 ¡GIRAR RULETA!'}
            </Button>

            {yaGiro && !resultado && (
              <Text size="sm" c="dimmed">
                Vuelve mañana para un nuevo reto 🌟
              </Text>
            )}
          </Stack>
        </Card>

        {resultado && (
          <Card shadow="lg" padding="xl" radius="md" style={{ 
            background: `linear-gradient(135deg, ${resultado.materia.color}22 0%, ${resultado.materia.color}44 100%)`,
            border: `3px solid ${resultado.materia.color}`
          }}>
            <Stack gap="md">
              <Group>
                <Text size="48px">{resultado.materia.emoji}</Text>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Materia</Text>
                  <Title order={3} c={resultado.materia.color}>{resultado.materia.nombre}</Title>
                </div>
              </Group>

              <Paper p="md" radius="md" bg="white">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={8}>
                  💬 Tu reto de hoy
                </Text>
                <Text size="lg" fw={500} style={{ lineHeight: 1.6 }}>
                  {resultado.actividad.texto}
                </Text>
              </Paper>

              <Group justify="space-between" align="center">
                <Badge size="xl" variant="filled" color="yellow" leftSection="⭐">
                  +{resultado.actividad.puntos} puntos ganados
                </Badge>
                <Button 
                  variant="light" 
                  color="gray" 
                  onClick={resetearDia}
                  size="sm"
                >
                  🔄 Simular nuevo día
                </Button>
              </Group>

              <Paper p="sm" radius="md" bg="rgba(255,255,255,0.5)">
                <Text size="sm" c="dimmed" ta="center">
                  💡 <strong>Tip:</strong> Completa tu actividad y compártela en el muro del aula para sumar tus puntos
                </Text>
              </Paper>
            </Stack>
          </Card>
        )}

        <Card shadow="sm" padding="md" radius="md" bg="gray.0">
          <Stack gap="xs">
            <Text size="sm" fw={700}>📋 Materias disponibles:</Text>
            <Group gap="xs">
              {MATERIAS.map(materia => (
                <Badge 
                  key={materia.id} 
                  variant="light" 
                  style={{ background: `${materia.color}22`, color: materia.color }}
                >
                  {materia.emoji} {materia.nombre}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}