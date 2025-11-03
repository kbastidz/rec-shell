import React, { useState, useRef, useEffect } from 'react';
import { Container, Title, Text, Card, Group, Stack, Badge, Button, Progress, Modal, Grid, ThemeIcon, Paper, TextInput, Tabs, Divider, Center, Box, RingProgress } from '@mantine/core';

import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { CrearTransaccionDTO } from '../../../types/dto';
import { TipoTransaccion } from '../../../enums/Enums';
import { useTransaccionPuntos } from '../hooks/useGamificacion';
import { handleModelResponse, useGemini } from '@rec-shell/rec-web-shared';
import { MATERIAS_DEFAULT, promptTemplateRaspa } from '../../../utils/CONSTANTE';
import { Loader } from 'lucide-react';


// Tipos de recompensas
const rewardTypes: RewardType[] = [
  { type: 'common', name: 'Común', emoji: '🎁', probability: 0.6, minPoints: 5, maxPoints: 10, color: 'gray' },
  { type: 'rare', name: 'Raro', emoji: '💎', probability: 0.3, minPoints: 10, maxPoints: 20, color: 'violet' },
  { type: 'epic', name: 'Épico', emoji: '🏆', probability: 0.1, minPoints: 20, maxPoints: 50, color: 'yellow' }
];

// Insignias por materia
const badges: Record<string, string[]> = {
  math: ['🧮 Calculador', '🎯 Preciso', '⚡ Rápido', '🧠 Genio'],
  language: ['📖 Lector', '✍️ Escritor', '🗣️ Orador', '📝 Poeta'],
  social: ['🗺️ Explorador', '🏛️ Historiador', '🌍 Viajero', '📚 Sabio'],
  science: ['🔭 Científico', '🧪 Químico', '🌱 Biólogo', '⚗️ Investigador'],
  art: ['🖌️ Artista', '🎭 Creativo', '🌈 Colorista', '✨ Maestro']
};

const ICON_MAP: Record<string, string> = {
  icon_math: "📗",
  icon_language: "📘",
  icon_social: "📙",
  icon_science: "📒",
  icon_art: "📕",
};

interface ScratchCardProps {
  reward: Reward;
  onComplete: () => void;
  onScratchComplete?: () => void;
}

function ScratchCard({ reward, onComplete, onScratchComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const scratchCompleteCalledRef = useRef(false); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Fondo plateado con textura
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#E8E8E8');
    gradient.addColorStop(1, '#A8A8A8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Texto "RASCA AQUÍ"
    ctx.fillStyle = '#666';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡RASCA AQUÍ!', rect.width / 2, rect.height / 2);
  }, []);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Calcular progreso
    const imageData = ctx.getImageData(0, 0, rect.width, rect.height);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    
    const progress = (transparent / (pixels.length / 4)) * 100;
    setScratchProgress(progress);
    
    if (progress > 70 && !scratchCompleteCalledRef.current) {
      scratchCompleteCalledRef.current = true; // Marcar como llamado
      if (onScratchComplete) {
        onScratchComplete(); // Llamar callback antes de onComplete
      }
      if (onComplete) {
        setTimeout(() => onComplete(), 500);
      }
    }
  };

  return (
    <Box style={{ position: 'relative', width: '100%', height: 300 }}>
      {/* Contenido debajo */}
      <Paper 
        p="xl" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: `linear-gradient(135deg, ${reward.rarity.color === 'yellow' ? '#FFD700' : reward.rarity.color === 'violet' ? '#9b59b6' : '#95a5a6'}, ${reward.rarity.color === 'yellow' ? '#FFA500' : reward.rarity.color === 'violet' ? '#8e44ad' : '#7f8c8d'})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8
        }}
      >
        <Text size="60px" mb="md">{reward.rarity.emoji}</Text>
        <Badge size="lg" color={reward.rarity.color} mb="xs">
          {reward.rarity.name}
        </Badge>
        <Title order={2} c="white" ta="center">+{reward.points} puntos</Title>
        {reward.badge && (
          <Badge size="lg" mt="md" variant="light">
            {reward.badge}
          </Badge>
        )}
      </Paper>
      
      {/* Canvas para rascar */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          cursor: 'pointer',
          borderRadius: 8,
          touchAction: 'none'
        }}
        onMouseDown={() => setIsScratching(true)}
        onMouseUp={() => setIsScratching(false)}
        onMouseMove={(e) => isScratching && scratch(e)}
        onMouseLeave={() => setIsScratching(false)}
        onTouchStart={() => setIsScratching(true)}
        onTouchEnd={() => setIsScratching(false)}
        onTouchMove={(e) => {
          e.preventDefault();
          isScratching && scratch(e);
        }}
      />
      
      <Progress 
        value={scratchProgress} 
        size="sm" 
        style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}
      />
    </Box>
  );
}

export  function RaspaGana() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>({});
  const [unlockedCards, setUnlockedCards] = useState<UnlockedCard[]>([]);
  const [collectedBadges, setCollectedBadges] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('missions');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const { CREAR, OBTENER_REGLA_POR_TIPO, regla } = useTransaccionPuntos();
  const [materiasCompletadas, setMateriasCompletadas] = useState<Set<string>>(new Set());

  //Hook para invocar las reglas del juego Ini
  useEffect(() => {
    const cargarRegla = async () => {
      await OBTENER_REGLA_POR_TIPO('RASPA_GANA');
    };
    cargarRegla();
  }, []);
  //Hook para invocar las reglas del juego Ini

  // Calcular puntos por misión basado en regla
  const calcularPuntosPorMision = () => {
    const totalMisiones = materiasGeneradas.reduce((acc, materia) => acc + materia.missions.length, 0);
    const puntosBase = regla?.puntosOtorgados ?? 10;
    return totalMisiones > 0 ? Math.max(1, Math.floor(puntosBase / totalMisiones)) : 1;
  };

  

  // Hook de Gemini Ini
  
  // Estados para Gemini
  const [materiasGeneradas, setMateriasGeneradas] = useState<Subject[]>(MATERIAS_DEFAULT);
  const [cargandoActividades, setCargandoActividades] = useState(true);
  const [errorCargaIA, setErrorCargaIA] = useState(false);
  
  const { loading, error, generateText } = useGemini({
    temperature: 0.8,
    maxTokens: 8000,
    onSuccess: (result: any) => {
      handleModelResponse<Subject[]>({
        text: result,
        onParsed: (materiasIA) => {
          if (Array.isArray(materiasIA) && materiasIA.length > 0) {
            setMateriasGeneradas(materiasIA);
            setErrorCargaIA(false);
          } else {
            console.warn('Array vacío recibido, usando materias por defecto');
            setMateriasGeneradas(MATERIAS_DEFAULT);
            setErrorCargaIA(true);
          }
        },
        onError: (err) => {
          console.error('Error al parsear respuesta de Gemini:', err);
          setMateriasGeneradas(MATERIAS_DEFAULT);
          setErrorCargaIA(true);
        },
        onFinally: () => {
          setCargandoActividades(false);
        }
      });
    },
    onError: (errorMsg: string) => {
      console.error('Error de Gemini:', errorMsg);
      setCargandoActividades(false);
      setMateriasGeneradas(MATERIAS_DEFAULT);
      setErrorCargaIA(true);
    }
  });

  // Cargar materias al montar el componente
  useEffect(() => {
    const cargarMaterias = async () => {
      await generateText(promptTemplateRaspa);
    };

    cargarMaterias();
  }, [generateText]);

  // Hook de Gemini Ini

  const generateReward = (subjectId: string): Reward => {
    const rand = Math.random();
    let cumulative = 0;
    let selectedRarity = rewardTypes[0];
    
    for (const rarity of rewardTypes) {
      cumulative += rarity.probability;
      if (rand <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }
    
    const points = Math.floor(Math.random() * (selectedRarity.maxPoints - selectedRarity.minPoints + 1)) + selectedRarity.minPoints;
    
    const badgePool = badges[subjectId] || badges.math;
    const badge = selectedRarity.type === 'epic' && Math.random() > 0.5 
      ? badgePool[Math.floor(Math.random() * badgePool.length)]
      : null;
    
    return {
      rarity: selectedRarity,
      points,
      badge,
      subjectId
    };
  };

  const checkAnswer = async () => {
    if (!selectedSubject) return;
    
    const currentMission = selectedSubject.missions.find(
      m => !completedMissions[`${selectedSubject.id}-${m.id}`]
    );
    
    if (!currentMission) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentMission.answer.toLowerCase().trim();
    
    if (isCorrect) {
      const missionKey = `${selectedSubject.id}-${currentMission.id}`;
      const newCompletedMissions = { ...completedMissions, [missionKey]: true };
      setCompletedMissions(newCompletedMissions);
      
      const reward = generateReward(selectedSubject.id);
      setCurrentReward(reward);

      // Sobrescribir los puntos con el cálculo proporcional
      const puntosCalculados = calcularPuntosPorMision();
      reward.points = puntosCalculados;
      
      // Agregar la nueva tarjeta a las desbloqueadas
      const newUnlockedCards = [...unlockedCards, { ...reward, timestamp: Date.now() }];
      setUnlockedCards(newUnlockedCards);
      
      setShowCard(true);
      setUserAnswer('');
      
      setNotification({ type: 'success', message: '¡Respuesta correcta! 🎉 Tarjeta desbloqueada' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: 'error', message: 'Respuesta incorrecta. ¡Intenta de nuevo! 💪' });
      setTimeout(() => setNotification(null), 3000);
    }
  };


  const handleCardComplete = () => {
    if (currentReward) {
      setTotalPoints(prev => prev + currentReward.points);

      if (currentReward.badge && !collectedBadges.includes(currentReward.badge)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setCollectedBadges(prev => [...prev, currentReward.badge!]);
      }
    }

    setTimeout(() => {
      setShowCard(false);
      setCurrentReward(null);
    }, 2000);
  };

  
useEffect(() => {
  // Verificar si alguna materia se acaba de completar
  materiasGeneradas.forEach(async (subject) => {
    const allMissionsCompleted = subject.missions.every(
      m => completedMissions[`${subject.id}-${m.id}`]
    );
    
    // Si la materia está completa y NO se ha guardado antes
    if (allMissionsCompleted && !materiasCompletadas.has(subject.id)) {
      // Marcar como completada
      setMateriasCompletadas(prev => new Set(prev).add(subject.id));
      
      const totalPuntosMateria = subject.missions.reduce(
        (sum, mission) => sum + mission.points, 
        0
      );
      
      const progresoGeneral = Math.round(
        materiasGeneradas.reduce((acc, s) => {
          const progress = (s.missions.filter(m => completedMissions[`${s.id}-${m.id}`]).length / s.missions.length) * 100;
          return acc + progress;
        }, 0) / materiasGeneradas.length
      );

      const progresoMaterias = materiasGeneradas.map(s => ({
        materia_id: s.id,
        materia_nombre: s.name,
        progreso: Math.round((s.missions.filter(m => completedMissions[`${s.id}-${m.id}`]).length / s.missions.length) * 100),
        misiones_completadas: s.missions.filter(m => completedMissions[`${s.id}-${m.id}`]).length,
        total_misiones: s.missions.length
      }));
      
      const tipoPunto = { id: regla?.id_tipo_punto?.toString() || '1' };
      const puntosCalculados = regla?.puntosOtorgados ? regla.puntosOtorgados : totalPuntosMateria;

        const transaccionData : CrearTransaccionDTO = {
          usuarioId: ST_GET_USER_ID(),
          tipoPunto: tipoPunto,
          tipoTransaccion: TipoTransaccion.GANAR,
          cantidad: puntosCalculados,
          descripcion: `¡Completó todas las misiones de ${subject.name}!`,
          tipoOrigen: 'MATERIA_COMPLETA',
          idOrigen: 1,
          metadatos: {
            materia: subject.name,
            materia_id: subject.id,
            total_misiones: subject.missions.length,
            puntos_materia: totalPuntosMateria,
            progreso_materia: 100,
            progreso_general: progresoGeneral,
            progreso_por_materia: progresoMaterias,
            insignias_totales: collectedBadges.length,
            insignias_obtenidas: collectedBadges,
            tarjetas_desbloqueadas: unlockedCards.length,
            tarjetas_detalle: unlockedCards.map(card => ({
              rareza: card.rarity.name,
              puntos: card.points,
              insignia: card.badge
            })),
            puntos_totales_acumulados: totalPoints,
            misiones_completadas_total: Object.keys(completedMissions).length
          }
        }
      await CREAR(transaccionData);
    }
  });
}, [completedMissions, collectedBadges, unlockedCards, totalPoints, materiasGeneradas]);



  const getSubjectProgress = (subjectId: string) => {
    const subject = materiasGeneradas.find(s => s.id === subjectId);
    if (!subject) return 0;
    const completed = subject.missions.filter(m => completedMissions[`${subjectId}-${m.id}`]).length;
    return (completed / subject.missions.length) * 100;
  };

  const getCurrentMission = (subject: Subject): Mission | undefined => {
    return subject.missions.find(m => !completedMissions[`${subject.id}-${m.id}`]);
  };

  // Mostrar loader mientras carga
  if (cargandoActividades) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ minHeight: '400px' }}>
          <Stack align="center" gap="md">
            <Loader size="xl" />
            <Text size="lg" fw={500}>Generando misiones con IA...</Text>
            <Text size="sm" c="dimmed">Esto puede tomar unos segundos</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return ( 
    <Container size="lg" py="xl">
      <Stack gap="lg">
        
        {/* Header */}
        <Paper p="xl" withBorder style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1} ta="center">
                  Misiones Educativas <span role="img" aria-label="celebración">🎓</span>
                </Title>
              <Text c="white" opacity={0.9}>Completa misiones y desbloquea tarjetas sorpresa</Text>
            </div>
            <Stack gap="xs" align="flex-end">
              <Group gap="xs">
                <ThemeIcon size="xl" radius="xl" color="yellow" variant="light">
                  <Text size="xl"><span role="img" aria-label="celebración">⭐</span></Text>
                </ThemeIcon>
                <div>
                  <Text size="xs" c="white" opacity={0.8}>Puntos totales</Text>
                  <Title order={2} c="white">{regla?.puntosOtorgados ?? totalPoints}</Title>
                </div>
              </Group>
              <Badge size="lg" color="cyan" variant="light">
                {Object.keys(completedMissions).length} misiones completadas
              </Badge>
            </Stack>
          </Group>
        </Paper>

        {/* Notificación */}
        {notification && (
          <Paper p="md" withBorder style={{ 
            background: notification.type === 'success' ? '#d4edda' : '#f8d7da',
            borderColor: notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'
          }}>
            <Text fw={500} ta="center">{notification.message}</Text>
          </Paper>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="missions">
              <span role="img" aria-label="hacha">📚</span> Misiones</Tabs.Tab>
            <Tabs.Tab value="collection">
              <span role="img" aria-label="medalla">🏆</span>Mi Colección</Tabs.Tab>
            <Tabs.Tab value="stats">
              <span role="img" aria-label="estadísticas">📊 </span>Estadísticas</Tabs.Tab>
          </Tabs.List>

          {/* Panel de Misiones */}
          <Tabs.Panel value="missions" pt="xl">
            <Grid>
              {materiasGeneradas.map(subject => {
                const currentMission = getCurrentMission(subject);
                const progress = getSubjectProgress(subject.id);
                const isComplete = progress === 100;
                
                return (
                  <Grid.Col key={subject.id} span={{ base: 12, sm: 6, md: 4 }}>
                    <Card 
                      withBorder 
                      padding="lg" 
                      style={{ height: '100%', cursor: currentMission ? 'pointer' : 'default' }}
                      onClick={() => currentMission && setSelectedSubject(subject)}
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Group gap="xs">
                            <Text size="30px">{ICON_MAP[subject.icon] ?? "📚"}</Text>
                            <div>
                              <Text fw={600}>{subject.name}</Text>
                              <Text size="xs" c="dimmed">
                                {subject.missions.filter(m => completedMissions[`${subject.id}-${m.id}`]).length}/{subject.missions.length} completadas
                              </Text>
                            </div>
                          </Group>
                          {isComplete && <Text size="25px"><span role="img" aria-label="celebración">✅</span></Text>}
                        </Group>
                        
                        <Progress value={progress} color={subject.color} size="sm" />
                        
                        {currentMission ? (
                          <Button 
                            fullWidth 
                            color={subject.color}
                            variant="light"
                          >
                            Iniciar misión
                          </Button>
                        ) : (
                          <Badge color="green" size="lg" fullWidth>
                            ¡Todas completadas! 
                            <span role="img" aria-label="celebración">🎉</span>
                          </Badge>
                        )}
                      </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Tabs.Panel>

          {/* Panel de Colección */}
          <Tabs.Panel value="collection" pt="xl">
            <Stack gap="xl">
              {/* Insignias */}
              <div>
                <Title order={3} ta="center">
                  Mis Insignias <span role="img" aria-label="celebración">🏅</span>
                </Title>
                {collectedBadges.length > 0 ? (
                  <Group gap="xs">
                    {collectedBadges.map((badge, i) => (
                      <Badge key={i} size="lg" variant="gradient" gradient={{ from: 'gold', to: 'orange' }}>
                        {badge}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text c="dimmed" ta="center" py="xl">
                    Aún no has desbloqueado insignias. ¡Completa misiones para conseguirlas!
                  </Text>
                )}
              </div>

              <Divider />

              {/* Tarjetas desbloqueadas */}
              <div>
                <Title order={3} ta="center">
                  ¡Tarjeta Desbloqueada! <span role="img" aria-label="celebración">🎴</span>
                </Title>
                {unlockedCards.length > 0 ? (
                  <Grid>
                    {unlockedCards.map((card, i) => (
                      <Grid.Col key={i} span={{ base: 12, xs: 6, sm: 4 }}>
                        <Card withBorder padding="md">
                          <Center mb="xs">
                            <Text size="40px">{card.rarity.emoji}</Text>
                          </Center>
                          <Badge color={card.rarity.color} fullWidth mb="xs">
                            {card.rarity.name}
                          </Badge>
                          <Text ta="center" fw={600}>+{card.points} pts</Text>
                          {card.badge && (
                            <Text size="xs" ta="center" mt="xs">{card.badge}</Text>
                          )}
                        </Card>
                      </Grid.Col>
                    ))}
                  </Grid>
                ) : (
                  <Text c="dimmed" ta="center" py="xl">
                    Completa misiones para desbloquear tarjetas
                  </Text>
                )}
              </div>
            </Stack>
          </Tabs.Panel>

          {/* Panel de Estadísticas */}
          <Tabs.Panel value="stats" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Card withBorder padding="xl">
                  <Stack align="center" gap="md">
                    <RingProgress
                      size={180}
                      thickness={16}
                      sections={materiasGeneradas.map(s => ({
                        value: getSubjectProgress(s.id),
                        color: s.color
                      }))}
                      label={
                        <Center>
                          <Stack gap={0} align="center">
                            <Text size="xl" fw={700}>{Math.round(
                              materiasGeneradas.reduce((acc, s) => acc + getSubjectProgress(s.id), 0) / materiasGeneradas.length
                            )}%</Text>
                            <Text size="xs" c="dimmed">Progreso</Text>
                          </Stack>
                        </Center>
                      }
                    />
                    <Text fw={600} size="lg">Progreso General</Text>
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap="md">
                  {materiasGeneradas.map(subject => (
                    <Card key={subject.id} withBorder padding="md">
                      <Group justify="space-between" mb="xs">
                        <Group gap="xs">
                          <Text size="20px">{ICON_MAP[subject.icon] ?? "📚"}</Text>
                          <Text fw={500}>{subject.name}</Text>
                        </Group>
                        <Text fw={600} c={subject.color}>
                          {Math.round(getSubjectProgress(subject.id))}%
                        </Text>
                      </Group>
                      <Progress value={getSubjectProgress(subject.id)} color={subject.color} size="sm" />
                    </Card>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>

        {/* Modal de Misión */}
        <Modal
          opened={!!selectedSubject && !showCard}
          onClose={() => {
            setSelectedSubject(null);
            setUserAnswer('');
          }}
          title={
            <Group gap="xs">
              <Text size="25px">
                <span role="img" aria-label="celebración">📚</span>
              </Text>
              <Text fw={600}>{selectedSubject?.name}</Text>
            </Group>
          }
          size="md"
        >
          {selectedSubject && (() => {
            const mission = getCurrentMission(selectedSubject);
            return mission ? (
              <Stack gap="lg">
                <Paper p="md" withBorder style={{ background: '#f8f9fa' }}>
                  <Text fw={500} size="lg" mb="xs">Misión #{mission.id}</Text>
                  <Text>{mission.question}</Text>
                </Paper>
                
                <TextInput
                  label="Tu respuesta"
                  placeholder="Escribe tu respuesta aquí..."
                  size="md"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />
                
                <Group justify="space-between">
                  <Badge size="lg" color="green" variant="light">
                    Recompensa: {calcularPuntosPorMision()} puntos
                  </Badge>
                  <Button 
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    color={selectedSubject.color}
                    size="md"
                  >
                    Verificar respuesta
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Text ta="center" c="dimmed" py="xl">
                ¡Has completado todas las misiones de esta materia! 
                <span role="img" aria-label="celebración">🎉</span>
              </Text>
            );
          })()}
        </Modal>

        {/* Modal de Tarjeta Rasca y Gana */}
        <Modal
          opened={showCard}
          onClose={() => setShowCard(false)}
          withCloseButton={false}
          size="lg"
          centered
        >
          <Stack gap="lg">
            <Title order={2} ta="center">
              ¡Tarjeta Desbloqueada! <span role="img" aria-label="celebración">🎉</span>
            </Title>

            <Text ta="center" c="dimmed">Rasca la tarjeta para revelar tu recompensa</Text>
            {currentReward && (
              <ScratchCard 
                reward={currentReward} 
                onComplete={handleCardComplete}
              />
            )}
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}