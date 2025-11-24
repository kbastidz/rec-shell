import React, { useState, useEffect } from 'react';
import { Container, Card, Text, Button, Progress, Badge, Group, Stack, Title, Center, Paper, ThemeIcon, Alert, Box } from '@mantine/core';
import { IconBrain, IconTrophy, IconClock, IconCheck, IconX, IconSparkles } from '@tabler/icons-react';

import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TipoTransaccion } from '../../../enums/Enums';
import { CrearTransaccionDTO } from '../../../types/dto';
import { useTransaccionPuntos } from '../hooks/useGamificacion';
import { handleModelError, handleModelResponse, useGemini } from '@rec-shell/rec-web-shared';
import { promptTemplate, SUBJECTS } from '../../../utils/CONSTANTE';



export function Trivia() {
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  

  // Hook de Gemini para generar preguntas Ini  
  
  // Estado para preguntas generadas por Gemini
  const [generatedSubjects, setGeneratedSubjects] = useState<SubjectsType | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const { loading, error, generateText } = useGemini({
  onSuccess: (text: string) =>
    handleModelResponse<SubjectsType>({
      text,
      onParsed: (data) => {
        setGeneratedSubjects(data);
        setIsLoadingQuestions(false);
      },
      onError: (err) => {
        handleModelError(err, SUBJECTS, setGeneratedSubjects);
        setIsLoadingQuestions(false);
      },
      onFinally: () => {
        console.log('✨ Finalizó el procesamiento del texto');
      },
    }),

    onError: (err: string) =>
      handleModelError(err, SUBJECTS, (fallback) => {
        setGeneratedSubjects(fallback);
        setIsLoadingQuestions(false);
    }),
  });

  // Disparar la petición al cargar el componente
  useEffect(() => {
    console.log('🚀 Iniciando generación de preguntas con Gemini...');
    generateText(promptTemplate);
  }, []);
  // Hook de Gemini para generar preguntas Fin

  
  //Hook para invocar las reglas del juego Ini
  const { CREAR, OBTENER_REGLA_POR_TIPO, loading: savingPoints, error: errorSavingPoints, regla } = useTransaccionPuntos();
  
  useEffect(() => {
    const cargarRegla = async () => {
      await OBTENER_REGLA_POR_TIPO('TRIVIA');
    };
    cargarRegla();
  }, []);
  //Hook para invocar las reglas del juego Ini


  // Cuando el juego termina y guardas los puntos
  const handleSavePoints = async () => {
    const tipoPunto = { id: regla?.id_tipo_punto || 1 ,  nombre: "", nombreMostrar:""};
    const puntosCalculados = regla?.puntosOtorgados ? regla.puntosOtorgados : score;

    const transaccionData: CrearTransaccionDTO = {
      usuarioId: ST_GET_USER_ID(),
      tipoPunto: tipoPunto,
      tipoTransaccion: TipoTransaccion.GANAR,
      cantidad: puntosCalculados,
      descripcion: `Puntos obtenidos en Trivia Relámpago - ${totalQuestions} preguntas`,
      tipoOrigen: 'TRIVIA',
      idOrigen: 1,
      metadatos: {
        preguntas_respondidas: totalQuestions,
        precision: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
        mejor_racha: streak,
        fecha_completado: new Date().toISOString()
      }
    };

    const result = await CREAR(transaccionData);
    
    if (result) {
      console.log('Puntos guardados exitosamente:', result);
    } else if (errorSavingPoints) {
      console.error('Error al guardar puntos');
    }
  };

  const getRandomQuestion = (): CurrentQuestion => {
    const subjectsToUse = generatedSubjects || SUBJECTS;
    const subjects = Object.keys(subjectsToUse);
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const subjectData = subjectsToUse[randomSubject];
    const questions = subjectData.questions;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    return {
      ...randomQuestion,
      subject: randomSubject,
      subjectData: subjectData
    };
  };

  const startNewQuestion = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(15);
    setIsActive(true);
  };

  useEffect(() => {
    if (!currentQuestion && !isLoadingQuestions && generatedSubjects) {
      startNewQuestion();
    }
  }, [isLoadingQuestions, generatedSubjects]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, showResult]);

  const handleTimeout = () => {
    setIsActive(false);
    setShowResult(true);
    setStreak(0);
  };

  const handleAnswer = (index: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(index);
    setIsActive(false);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (index === currentQuestion.correct) {
      const points = currentQuestion.difficulty;
      const newScore = score + points;
      setScore(newScore);
      setStreak(prev => prev + 1);
      
      if (newScore >= 10) {
        setTimeout(() => {
          setGameFinished(true);
          // Guardar puntos automáticamente al terminar
          handleSavePoints();
        }, 2000);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (score >= 10) {
      setGameFinished(true);
    } else {
      startNewQuestion();
    }
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setTotalQuestions(0);
    setGameFinished(false);
    startNewQuestion();
  };

  // Pantalla de carga mientras se generan las preguntas
  if (!currentQuestion || isLoadingQuestions) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box p="md">
          <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
            <Stack gap="xl" align="center">
              <ThemeIcon size={120} radius="xl" color="violet" variant="light">
                <IconBrain size={80} />
              </ThemeIcon>
              
              <div style={{ textAlign: 'center' }}>
                <Title order={2} c="violet" mb="xs">
                  Generando preguntas...
                </Title>
                <Text size="lg" c="dimmed">
                  {loading ? 'Creando preguntas personalizadas con IA' : 'Preparando tu trivia'}
                </Text>
              </div>

              <Progress 
                value={100} 
                color="violet"
                size="xl"
                radius="xl"
                animated
                style={{ width: '100%' }}
              />

              {error && (
                <Alert color="red" variant="light" style={{ width: '100%' }}>
                  <Text size="sm" ta="center">
                    Hubo un error al generar preguntas. Usando preguntas predefinidas...
                  </Text>
                </Alert>
              )}
            </Stack>
          </Card>
        </Box>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container size="sm">
          <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
            <Stack gap="xl" align="center">
              <ThemeIcon size={120} radius="xl" color="yellow" variant="light">
                <IconTrophy size={80} />
              </ThemeIcon>
              
              <div style={{ textAlign: 'center' }}>
                <Title order={1} c="violet" mb="xs">
                  <span role="img" aria-label="celebración">🎉</span> ¡Felicidades! <span role="img" aria-label="celebración">🎉</span>
                </Title>
                <Text size="xl" fw={500} c="dimmed">
                  ¡Has completado la Trivia Relámpago!
                </Text>
              </div>

              <Paper p="xl" radius="md" style={{ background: '#f8f9fa', width: '100%' }}>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="lg" fw={600}>Puntuación Final:</Text>
                    <Badge size="xl" color="violet" variant="filled">
                      {score} puntos
                    </Badge>
                  </Group>
                  
                  <Group justify="space-between">
                    <Text size="lg" fw={600}>Preguntas Respondidas:</Text>
                    <Badge size="xl" color="blue" variant="light">
                      {totalQuestions}
                    </Badge>
                  </Group>
                  
                  <Group justify="space-between">
                    <Text size="lg" fw={600}>Mejor Racha:</Text>
                    <Badge size="xl" color="orange" variant="light">
                      {streak} <span role="img" aria-label="fuego">🔥</span>
                    </Badge>
                  </Group>

                  <Group justify="space-between">
                    <Text size="lg" fw={600}>Precisión:</Text>
                    <Badge size="xl" color="green" variant="light">
                      {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                    </Badge>
                  </Group>
                </Stack>
              </Paper>

              {savingPoints && (
                <Alert color="blue" variant="light" style={{ width: '100%' }}>
                  <Text size="sm" ta="center">
                    Guardando tus puntos...
                  </Text>
                </Alert>
              )}

              {errorSavingPoints && (
                <Alert color="red" variant="light" style={{ width: '100%' }}>
                  <Text size="sm" ta="center">
                    Error al guardar puntos: {errorSavingPoints}
                  </Text>
                </Alert>
              )}

              {!savingPoints && !errorSavingPoints && (
                <Alert color="green" variant="light" style={{ width: '100%' }}>
                  <Text size="sm" ta="center">
                    ¡Puntos guardados exitosamente! Has demostrado tus conocimientos en diferentes materias escolares. 
                    Sigue practicando para mejorar tus habilidades.
                  </Text>
                </Alert>
              )}           

              <Button 
                size="xl" 
                onClick={handleRestart}
                color="violet"
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape' }}
                fullWidth
                leftSection={<IconSparkles size={24} />}
              >
                Jugar de Nuevo
              </Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  const Icon = currentQuestion.subjectData.icon;
  const isCorrect = selectedAnswer === currentQuestion.correct;
  const timeProgress = (timeLeft / 15) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Container size="sm" style={{ paddingTop: '40px' }}>
        <Paper shadow="xl" p="xl" mb="xl" radius="lg" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
          <Group justify="space-between" mb="md">
            <Group>
              <ThemeIcon size={50} radius="xl" color="violet" variant="light">
                <IconTrophy size={30} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" fw={600}>PUNTUACIÓN TOTAL</Text>
                <Title order={2} c="violet">{score} pts</Title>
              </div>
            </Group>
            <div style={{ textAlign: 'right' }}>
              <Text size="xs" c="dimmed" fw={600}>RACHA</Text>
              <Group gap={5} justify="flex-end">
                <IconSparkles size={20} color="#f59e0b" />
                <Title order={2} c="orange">{streak}</Title>
              </Group>
            </div>
          </Group>
          
          {streak >= 3 && (
            <Alert color="orange" variant="light" title={<>¡Racha de fuego! <span role="img" aria-label="fuego">🔥</span></>}>
              ¡Llevas {streak} respuestas correctas seguidas!
            </Alert>
          )}
        </Paper>

        <Card shadow="xl" padding="xl" radius="lg" style={{ background: 'white' }}>
          <Stack gap="md">
            <Group justify="space-between">
              <Badge 
                size="lg" 
                leftSection={<Icon size={16} />}
                color={currentQuestion.subjectData.color}
                variant="filled"
              >
                {currentQuestion.subjectData.name}
              </Badge>
              <Badge size="lg" color="gray" variant="light">
                {currentQuestion.difficulty === 1 ? (
                  <><span role="img" aria-label="estrella">⭐</span> Fácil (1pt)</>
                ) : currentQuestion.difficulty === 2 ? (
                  <><span role="img" aria-label="estrellas">⭐⭐</span> Media (2pts)</>
                ) : (
                  <><span role="img" aria-label="estrellas">⭐⭐⭐</span> Difícil (3pts)</>
                )}
              </Badge>
            </Group>

            {!showResult && (
              <div>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={600} c="dimmed">
                    <IconClock size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Tiempo restante: {timeLeft}s
                  </Text>
                </Group>
                <Progress 
                  value={timeProgress} 
                  color={timeLeft <= 5 ? 'red' : timeLeft <= 10 ? 'orange' : 'green'}
                  size="lg"
                  radius="xl"
                  animated={timeLeft <= 5}
                />
              </div>
            )}

            <Paper p="md" radius="md" style={{ background: '#f8f9fa' }}>
              <Title order={3} ta="center" style={{ lineHeight: 1.4 }}>
                {currentQuestion.q}
              </Title>
            </Paper>

            <Stack gap="xs">
              {currentQuestion.a.map((answer, index) => {
                let color = currentQuestion.subjectData.color;
                let variant: 'light' | 'filled' = 'light';
                let icon = null;

                if (showResult) {
                  if (index === currentQuestion.correct) {
                    color = 'green';
                    variant = 'filled';
                    icon = <IconCheck size={20} />;
                  } else if (index === selectedAnswer) {
                    color = 'red';
                    variant = 'filled';
                    icon = <IconX size={20} />;
                  }
                }

                return (
                  <Button
                    key={index}
                    size="lg"
                    color={color}
                    variant={selectedAnswer === index && !showResult ? 'filled' : variant}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    leftSection={icon}
                    style={{ 
                      height: 'auto',
                      padding: '16px 20px',
                      justifyContent: 'flex-start'
                    }}
                    fullWidth
                  >
                    <Text size="md" fw={500} style={{ whiteSpace: 'normal', textAlign: 'left' }}>
                      {answer}
                    </Text>
                  </Button>
                );
              })}
            </Stack>

            {showResult && (
              <Alert 
                color={timeLeft === 0 ? 'orange' : isCorrect ? 'green' : 'red'} 
                title={
                  timeLeft === 0 ? (
                    <><span role="img" aria-label="reloj">⏰</span> ¡Se acabó el tiempo!</>
                  ) : isCorrect ? (
                    <><span role="img" aria-label="celebración">🎉</span> ¡Correcto!</>
                  ) : (
                    <><span role="img" aria-label="x">❌</span> Incorrecto</>
                  )
                }
                variant="filled"
              >
                <Text size="sm" fw={500}>
                  {currentQuestion.explanation}
                </Text>
                {isCorrect && (
                  <Text size="sm" mt="xs">
                    +{currentQuestion.difficulty} punto{currentQuestion.difficulty > 1 ? 's' : ''}
                  </Text>
                )}
              </Alert>
            )}

            {showResult && (
              <Button 
                size="lg" 
                onClick={handleNext}
                color="violet"
                variant="gradient"
                gradient={{ from: 'violet', to: 'grape' }}
              >
                Siguiente Pregunta →
              </Button>
            )}
          </Stack>
        </Card>

        <Center mt="xl">
          <Text size="sm" c="white" fw={500}>
            Preguntas respondidas: {totalQuestions} • Mejor racha: {streak}
          </Text>
        </Center>
      </Container>
    </div>
  );
}