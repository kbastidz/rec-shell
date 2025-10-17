import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Card, 
  Group, 
  Text, 
  Stack,
  Grid,
  Button,
  Badge,
  Modal,
  NumberInput,
  Radio,
  Progress,
  Alert,
  Tabs,
  SimpleGrid,
  ActionIcon,
  Paper,
  Center,
  Divider
} from '@mantine/core';
import { 
  IconDice, 
  IconTicket, 
  IconBulb,
  IconNumbers,
  IconTable,
  IconTrophy,
  IconCoins,
  IconRefresh,
  IconCheck,
  IconX,
  IconStar
} from '@tabler/icons-react';
/*
export const PerfilAdmin = () => {
  const [userPoints, setUserPoints] = useState(2500);
  const [activeGame, setActiveGame] = useState(null);
  
  // Estados para Ruleta Diaria
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [wheelUsedToday, setWheelUsedToday] = useState(false);
  
  // Estados para Rasca y Gana
  const [scratchCards, setScratchCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [scratchProgress, setScratchProgress] = useState(0);
  
  // Estados para Trivia
  const [triviaQuestion, setTriviaQuestion] = useState(null);
  const [triviaAnswer, setTriviaAnswer] = useState(null);
  const [triviaResult, setTriviaResult] = useState(null);
  
  // Estados para Adivina el Número
  const [guessNumber, setGuessNumber] = useState('');
  const [guessAttempts, setGuessAttempts] = useState(0);
  const [guessHistory, setGuessHistory] = useState([]);
  const [secretNumber, setSecretNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [accumulatedPrize, setAccumulatedPrize] = useState(500);
  
  // Estados para Bingo
  const [bingoBoard, setBingoBoard] = useState([]);
  const [completedActions, setCompletedActions] = useState([]);

  // Premios de la ruleta
  const wheelPrizes = [
    { points: 10, color: 'gray', label: '10 pts', probability: 30 },
    { points: 25, color: 'blue', label: '25 pts', probability: 25 },
    { points: 50, color: 'green', label: '50 pts', probability: 20 },
    { points: 100, color: 'orange', label: '100 pts', probability: 15 },
    { points: 250, color: 'violet', label: '250 pts', probability: 7 },
    { points: 500, color: 'red', label: '500 pts', probability: 3 },
  ];

  // Preguntas de trivia
  const triviaQuestions = [
    {
      question: "¿Cuál es el framework de React que estamos usando para los estilos?",
      options: ["Material-UI", "Mantine", "Chakra UI", "Ant Design"],
      correct: 1,
      points: 50
    },
    {
      question: "¿En qué año se lanzó React?",
      options: ["2011", "2013", "2015", "2017"],
      correct: 1,
      points: 50
    },
    {
      question: "¿Qué hook se usa para manejar estado en React?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correct: 1,
      points: 50
    }
  ];

  // Acciones para el Bingo
  const bingoActions = [
    { id: 1, text: "Publicar contenido", icon: "📝", completed: false },
    { id: 2, text: "Comentar 3 veces", icon: "💬", completed: false },
    { id: 3, text: "Seguir a 5 usuarios", icon: "👥", completed: false },
    { id: 4, text: "Compartir contenido", icon: "🔄", completed: false },
    { id: 5, text: "Dar 10 likes", icon: "❤️", completed: false },
    { id: 6, text: "Completar perfil", icon: "✨", completed: false },
    { id: 7, text: "Subir foto", icon: "📸", completed: false },
    { id: 8, text: "Invitar amigo", icon: "🎁", completed: false },
    { id: 9, text: "Logro especial", icon: "🏆", completed: false },
  ];

  useEffect(() => {
    // Generar tarjetas rasca y gana disponibles
    const cards = [
      { id: 1, value: 25, scratched: false, mission: "Publica 3 veces hoy" },
      { id: 2, value: 50, scratched: false, mission: "Comenta 5 veces" },
      { id: 3, value: 100, scratched: false, mission: "Completa tu racha de 7 días" },
    ];
    setScratchCards(cards);
    
    // Inicializar tablero de bingo
    setBingoBoard(bingoActions);
  }, []);

  // RULETA DIARIA
  const spinWheel = () => {
    if (wheelUsedToday) return;
    
    setSpinning(true);
    setWheelResult(null);
    
    // Simular giro de ruleta con probabilidades
    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulative = 0;
      let result = wheelPrizes[0];
      
      for (const prize of wheelPrizes) {
        cumulative += prize.probability;
        if (random <= cumulative) {
          result = prize;
          break;
        }
      }
      
      setWheelResult(result);
      setUserPoints(prev => prev + result.points);
      setSpinning(false);
      setWheelUsedToday(true);
      
      // Registrar transacción
      saveTransaction('ruleta_diaria', result.points, `Ruleta diaria - Premio: ${result.points} pts`);
    }, 2000);
  };

  // RASCA Y GANA
  const scratchCard = (cardId) => {
    setSelectedCard(cardId);
    setScratchProgress(0);
  };

  const continueScratch = () => {
    if (scratchProgress < 100) {
      setScratchProgress(prev => Math.min(prev + 20, 100));
    } else {
      const card = scratchCards.find(c => c.id === selectedCard);
      if (card) {
        setUserPoints(prev => prev + card.value);
        setScratchCards(prev => prev.map(c => 
          c.id === selectedCard ? { ...c, scratched: true } : c
        ));
        saveTransaction('rasca_gana', card.value, `Rasca y gana - ${card.mission}`);
      }
      setSelectedCard(null);
      setScratchProgress(0);
    }
  };

  // TRIVIA RELÁMPAGO
  const startTrivia = () => {
    const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    setTriviaQuestion(randomQ);
    setTriviaAnswer(null);
    setTriviaResult(null);
  };

  const submitTrivia = () => {
    if (triviaAnswer === null) return;
    
    const isCorrect = triviaAnswer === triviaQuestion.correct;
    setTriviaResult(isCorrect);
    
    if (isCorrect) {
      setUserPoints(prev => prev + triviaQuestion.points);
      saveTransaction('trivia', triviaQuestion.points, `Trivia correcta: ${triviaQuestion.question}`);
    }
  };

  // ADIVINA EL NÚMERO
  const submitGuess = () => {
    if (!guessNumber || guessAttempts >= 5) return;
    
    const guess = parseInt(guessNumber);
    const newAttempts = guessAttempts + 1;
    setGuessAttempts(newAttempts);
    
    let hint = '';
    if (guess === secretNumber) {
      // ¡Ganaste!
      const prize = accumulatedPrize - (newAttempts * 50);
      setUserPoints(prev => prev + prize);
      setGuessHistory(prev => [...prev, { guess, result: '🎉 ¡CORRECTO!' }]);
      saveTransaction('adivina_numero', prize, `Adivinó el número en ${newAttempts} intentos`);
      
      // Resetear juego
      setTimeout(() => {
        setSecretNumber(Math.floor(Math.random() * 100) + 1);
        setGuessAttempts(0);
        setGuessHistory([]);
        setAccumulatedPrize(prev => prev + 100);
      }, 3000);
    } else {
      hint = guess < secretNumber ? '⬆️ Muy bajo' : '⬇️ Muy alto';
      setGuessHistory(prev => [...prev, { guess, result: hint }]);
    }
    
    setGuessNumber('');
    
    if (newAttempts >= 5 && guess !== secretNumber) {
      setGuessHistory(prev => [...prev, { guess: '—', result: `❌ Era el ${secretNumber}` }]);
      setTimeout(() => {
        setSecretNumber(Math.floor(Math.random() * 100) + 1);
        setGuessAttempts(0);
        setGuessHistory([]);
      }, 3000);
    }
  };

  // BINGO SEMANAL
  const toggleBingoAction = (actionId) => {
    setBingoBoard(prev => prev.map(action => 
      action.id === actionId ? { ...action, completed: !action.completed } : action
    ));
    
    const completed = bingoBoard.filter(a => a.completed).length + 1;
    if (completed === 9) {
      // ¡Bingo completo!
      setUserPoints(prev => prev + 1000);
      saveTransaction('bingo', 1000, 'Completó tablero de Bingo semanal');
    } else if (completed % 3 === 0) {
      // Línea completada
      const lineBonus = 100;
      setUserPoints(prev => prev + lineBonus);
      saveTransaction('bingo_linea', lineBonus, `Completó línea de Bingo (${completed}/9)`);
    }
  };

  // Guardar transacción (simulado)
  const saveTransaction = (tipo_origen, puntos, descripcion) => {
    console.log('Transacción:', {
      tipo_transaccion: 'suma',
      tipo_origen,
      cantidad: puntos,
      descripcion,
      metadatos: {
        timestamp: new Date().toISOString(),
        game_type: tipo_origen,
        balance_anterior: userPoints,
        balance_nuevo: userPoints + puntos
      }
    });
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}

        /*
        <Group justify="space-between" align="center">
          <div>
            <Title order={1}>🎮 Mini-Juegos</Title>
            <Text c="dimmed" size="sm">Gana puntos jugando cada día</Text>
          </div>
          <Card p="md" withBorder bg="blue.0">
            <Group gap="xs">
              <IconCoins size={28} color="#FFD700" />
              <div>
                <Text size="xs" c="dimmed">Tus Puntos</Text>
                <Text size="xl" fw={700} c="blue">{userPoints.toLocaleString()}</Text>
              </div>
            </Group>
          </Card>
        </Group>

        <Tabs defaultValue="wheel">
          {/* RULETA DIARIA */}

          /*
          <Tabs.List>
            <Tabs.Tab value="wheel" leftSection={<IconDice size={16} />}>
              Ruleta Diaria
            </Tabs.Tab>
            <Tabs.Tab value="scratch" leftSection={<IconTicket size={16} />}>
              Rasca y Gana
            </Tabs.Tab>
            <Tabs.Tab value="trivia" leftSection={<IconBulb size={16} />}>
              Trivia
            </Tabs.Tab>
            <Tabs.Tab value="guess" leftSection={<IconNumbers size={16} />}>
              Adivina el Número
            </Tabs.Tab>
            <Tabs.Tab value="bingo" leftSection={<IconTable size={16} />}>
              Bingo Semanal
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="wheel" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                  <Center mb="xl">
                    <div style={{ 
                      width: 300, 
                      height: 300, 
                      borderRadius: '50%',
                      background: `conic-gradient(
                        ${wheelPrizes.map((p, i) => 
                          `${p.color} ${i * (360/6)}deg ${(i+1) * (360/6)}deg`
                        ).join(', ')}
                      )`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '8px solid #333',
                      transform: spinning ? 'rotate(1440deg)' : 'rotate(0deg)',
                      transition: 'transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: 100,
                        height: 100,
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40
                      }}>
                        🎰
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: -20,
                        width: 0,
                        height: 0,
                        borderLeft: '15px solid transparent',
                        borderRight: '15px solid transparent',
                        borderTop: '30px solid red'
                      }} />
                    </div>
                  </Center>

                  <Button 
                    fullWidth 
                    size="lg"
                    onClick={spinWheel}
                    disabled={wheelUsedToday || spinning}
                    leftSection={<IconDice size={20} />}
                  >
                    {wheelUsedToday ? '✅ Ya giraste hoy' : spinning ? '🎰 Girando...' : '🎲 Girar Ruleta'}
                  </Button>

                  {wheelResult && (
                    <Alert mt="md" color="green" icon={<IconTrophy />}>
                      <Text fw={700} size="lg">¡Ganaste {wheelResult.points} puntos!</Text>
                    </Alert>
                  )}
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Title order={3} mb="md">💰 Premios Posibles</Title>
                  <Stack gap="sm">
                    {wheelPrizes.map((prize, idx) => (
                      <Paper key={idx} p="sm" withBorder>
                        <Group justify="space-between">
                          <Group>
                            <Badge color={prize.color} size="lg">{prize.label}</Badge>
                            <Text size="sm" c="dimmed">{prize.probability}% probabilidad</Text>
                          </Group>
                          {wheelResult?.points === prize.points && (
                            <Badge color="green">¡Ganado!</Badge>
                          )}
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                  
                  <Divider my="md" />
                  
                  <Alert color="blue" icon={<IconBulb />}>
                    <Text size="sm" fw={500}>💡 Estrategia</Text>
                    <Text size="xs" c="dimmed">
                      La ruleta se resetea cada 24 horas. ¡No olvides girar todos los días para maximizar ganancias!
                    </Text>
                  </Alert>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* RASCA Y GANA */}

          /*
          <Tabs.Panel value="scratch" pt="xl">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {scratchCards.map(card => (
                <Card 
                  key={card.id}
                  shadow="sm" 
                  padding="xl" 
                  radius="md" 
                  withBorder
                  style={{ 
                    opacity: card.scratched ? 0.5 : 1,
                    cursor: card.scratched ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Stack align="center">
                    <IconTicket size={60} color={card.scratched ? 'gray' : 'orange'} />
                    <Title order={3}>{card.scratched ? `${card.value} pts` : '???'}</Title>
                    <Text size="sm" ta="center" c="dimmed">{card.mission}</Text>
                    
                    {card.scratched ? (
                      <Badge color="green" size="lg">✅ Usado</Badge>
                    ) : (
                      <Button 
                        variant="gradient" 
                        gradient={{ from: 'orange', to: 'red' }}
                        onClick={() => scratchCard(card.id)}
                      >
                        🎫 Rasca aquí
                      </Button>
                    )}
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            <Modal 
              opened={selectedCard !== null} 
              onClose={() => setSelectedCard(null)}
              title="¡Rasca la tarjeta!"
              centered
            >
              <Stack>
                <Center>
                  <div style={{
                    width: 200,
                    height: 200,
                    background: scratchProgress === 100 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 48,
                    transition: 'all 0.3s'
                  }}>
                    {scratchProgress === 100 ? (
                      <Text fw={700} c="white">
                        {scratchCards.find(c => c.id === selectedCard)?.value} pts
                      </Text>
                    ) : (
                      '❓'
                    )}
                  </div>
                </Center>
                
                <Progress value={scratchProgress} size="xl" />
                
                <Button 
                  size="lg"
                  onClick={continueScratch}
                  fullWidth
                >
                  {scratchProgress < 100 ? '🖐️ Rasca más' : '🎉 ¡Reclamar premio!'}
                </Button>
              </Stack>
            </Modal>
          </Tabs.Panel>

          {/* TRIVIA */}

          /*
          <Tabs.Panel value="trivia" pt="xl">
            <Card shadow="sm" padding="xl" radius="md" withBorder maw={600} mx="auto">
              {!triviaQuestion ? (
                <Stack align="center" gap="xl">
                  <IconBulb size={80} color="orange" />
                  <Title order={2} ta="center">Trivia Relámpago</Title>
                  <Text ta="center" c="dimmed">
                    Responde correctamente y gana 50 puntos. ¡Las preguntas aparecen aleatoriamente!
                  </Text>
                  <Button size="lg" onClick={startTrivia}>
                    ⚡ Comenzar Trivia
                  </Button>
                </Stack>
              ) : (
                <Stack>
                  <Title order={3}>{triviaQuestion.question}</Title>
                  
                  <Radio.Group value={triviaAnswer?.toString()} onChange={(val) => setTriviaAnswer(parseInt(val))}>
                    <Stack mt="md">
                      {triviaQuestion.options.map((option, idx) => (
                        <Radio 
                          key={idx}
                          value={idx.toString()} 
                          label={option}
                          disabled={triviaResult !== null}
                        />
                      ))}
                    </Stack>
                  </Radio.Group>

                  {triviaResult === null ? (
                    <Button 
                      mt="xl"
                      onClick={submitTrivia}
                      disabled={triviaAnswer === null}
                    >
                      Confirmar Respuesta
                    </Button>
                  ) : (
                    <>
                      <Alert 
                        mt="md"
                        color={triviaResult ? 'green' : 'red'}
                        icon={triviaResult ? <IconCheck /> : <IconX />}
                      >
                        {triviaResult ? (
                          <Text>¡Correcto! +{triviaQuestion.points} puntos</Text>
                        ) : (
                          <Text>Incorrecto. La respuesta era: {triviaQuestion.options[triviaQuestion.correct]}</Text>
                        )}
                      </Alert>
                      <Button mt="md" onClick={() => {
                        setTriviaQuestion(null);
                        setTriviaAnswer(null);
                        setTriviaResult(null);
                      }}>
                        Nueva Pregunta
                      </Button>
                    </>
                  )}
                </Stack>
              )}
            </Card>
          </Tabs.Panel>

          {/* ADIVINA EL NÚMERO */}

          /*
          <Tabs.Panel value="guess" pt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                  <Stack>
                    <Group justify="space-between">
                      <Title order={3}>🎯 Adivina el Número</Title>
                      <Badge size="lg" color="green">
                        Premio: {accumulatedPrize - (guessAttempts * 50)} pts
                      </Badge>
                    </Group>
                    
                    <Text c="dimmed">
                      Número entre 1 y 100. Tienes 5 intentos. ¡El premio disminuye con cada intento!
                    </Text>

                    <NumberInput
                      label="Tu número"
                      placeholder="1-100"
                      value={guessNumber}
                      onChange={(val) => setGuessNumber(val)}
                      min={1}
                      max={100}
                      disabled={guessAttempts >= 5}
                    />

                    <Button 
                      onClick={submitGuess}
                      disabled={!guessNumber || guessAttempts >= 5}
                    >
                      Adivinar ({guessAttempts}/5)
                    </Button>

                    <Progress 
                      value={(guessAttempts / 5) * 100} 
                      color={guessAttempts >= 5 ? 'red' : 'blue'}
                    />
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                  <Title order={4} mb="md">📋 Historial</Title>
                  <Stack gap="xs">
                    {guessHistory.length === 0 ? (
                      <Text c="dimmed" ta="center" py="xl">Aún no has intentado...</Text>
                    ) : (
                      guessHistory.map((entry, idx) => (
                        <Paper key={idx} p="sm" withBorder>
                          <Group justify="space-between">
                            <Text fw={500}>Intento {idx + 1}: {entry.guess}</Text>
                            <Text size="sm">{entry.result}</Text>
                          </Group>
                        </Paper>
                      ))
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* BINGO */}
          /*
          <Tabs.Panel value="bingo" pt="xl">
            <Card shadow="sm" padding="xl" radius="md" withBorder maw={600} mx="auto">
              <Stack>
                <Group justify="space-between">
                  <Title order={2}>🎰 Bingo Semanal</Title>
                  <Badge size="lg" color="violet">
                    {bingoBoard.filter(a => a.completed).length}/9
                  </Badge>
                </Group>

                <Text c="dimmed">
                  Completa 9 acciones esta semana para ganar 1000 puntos. Cada línea de 3 da bonus de 100 pts.
                </Text>

                <SimpleGrid cols={3} spacing="md">
                  {bingoBoard.map(action => (
                    <Card
                      key={action.id}
                      padding="md"
                      withBorder
                      style={{
                        cursor: 'pointer',
                        background: action.completed ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                        color: action.completed ? 'white' : 'black',
                        transition: 'all 0.3s'
                      }}
                      onClick={() => toggleBingoAction(action.id)}
                    >
                      <Stack align="center" gap={4}>
                        <Text size="2rem">{action.icon}</Text>
                        <Text size="xs" ta="center" fw={500}>
                          {action.text}
                        </Text>
                        {action.completed && <IconCheck size={20} />}
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>

                {bingoBoard.filter(a => a.completed).length === 9 && (
                  <Alert color="green" icon={<IconTrophy />}>
                    <Text fw={700} size="lg">🎉 ¡BINGO COMPLETO! +1000 puntos</Text>
                  </Alert>
                )}
              </Stack>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};
*/