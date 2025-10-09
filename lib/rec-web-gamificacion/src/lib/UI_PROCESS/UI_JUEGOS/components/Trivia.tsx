import React, { useState, useEffect } from 'react';
import { Container, Card, Text, Button, Progress, Badge, Group, Stack, Title, Center, Paper, ThemeIcon, Alert } from '@mantine/core';
import { IconBrain, IconBook, IconFlask, IconWorld, IconLanguage, IconTrophy, IconClock, IconCheck, IconX, IconSparkles } from '@tabler/icons-react';
import { useTransaccionPuntos } from '../../UI_PERFIL_USUARIO/hooks/useGamificacion';
import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TipoPunto } from '../../../types/model';

interface Question {
  q: string;
  a: string[];
  correct: number;
  difficulty: number;
  explanation: string;
}

interface SubjectData {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  questions: Question[];
}

interface CurrentQuestion extends Question {
  subject: string;
  subjectData: SubjectData;
}

type SubjectsType = {
  [key: string]: SubjectData;
}

const SUBJECTS: SubjectsType = {
  matematicas: {
    name: 'Matemáticas',
    icon: IconBrain,
    color: 'blue',
    questions: [
      { q: '¿Cuánto es 15 × 8?', a: ['120', '125', '115', '130'], correct: 0, difficulty: 1, explanation: '15 × 8 = 120' },
      { q: '¿Cuál es el perímetro de un cuadrado con lado de 7cm?', a: ['28cm', '49cm', '14cm', '21cm'], correct: 0, difficulty: 2, explanation: 'Perímetro = 4 × lado = 4 × 7 = 28cm' },
      { q: 'Si x + 12 = 20, ¿cuánto vale x?', a: ['8', '32', '12', '10'], correct: 0, difficulty: 1, explanation: 'x = 20 - 12 = 8' },
      { q: '¿Cuánto es 2³ + 3²?', a: ['17', '15', '19', '13'], correct: 0, difficulty: 2, explanation: '2³ = 8, 3² = 9, entonces 8 + 9 = 17' },
      { q: '¿Cuál es el área de un círculo con radio 5? (usa π ≈ 3.14)', a: ['78.5', '31.4', '15.7', '157'], correct: 0, difficulty: 3, explanation: 'Área = π × r² = 3.14 × 25 = 78.5' },
      { q: '¿Cuántos grados tiene un triángulo?', a: ['180°', '360°', '90°', '270°'], correct: 0, difficulty: 1, explanation: 'La suma de ángulos internos de un triángulo siempre es 180°' },
      { q: '¿Qué fracción es equivalente a 0.75?', a: ['3/4', '2/3', '4/5', '1/2'], correct: 0, difficulty: 2, explanation: '0.75 = 75/100 = 3/4' }
    ]
  },
  lengua: {
    name: 'Lengua',
    icon: IconBook,
    color: 'grape',
    questions: [
      { q: '¿Cuál es el sustantivo en "El gato negro duerme"?', a: ['gato', 'negro', 'duerme', 'el'], correct: 0, difficulty: 1, explanation: 'El sustantivo es la palabra que nombra al ser u objeto: "gato"' },
      { q: '¿Qué tipo de palabra es "rápidamente"?', a: ['Adverbio', 'Adjetivo', 'Verbo', 'Sustantivo'], correct: 0, difficulty: 2, explanation: 'Los adverbios terminados en -mente modifican al verbo' },
      { q: '¿Cuántas sílabas tiene "murciélago"?', a: ['4', '3', '5', '6'], correct: 0, difficulty: 1, explanation: 'mur-cié-la-go = 4 sílabas' },
      { q: '¿Cuál es el sinónimo de "feliz"?', a: ['Contento', 'Triste', 'Enojado', 'Cansado'], correct: 0, difficulty: 1, explanation: 'Sinónimos son palabras con significado similar' },
      { q: '¿Qué signo va en: "Hola __ cómo estás"?', a: [',', '.', ';', ':'], correct: 0, difficulty: 2, explanation: 'La coma separa frases cortas en una oración' },
      { q: '¿Qué es una metáfora?', a: ['Comparación implícita', 'Exageración', 'Repetición', 'Pregunta retórica'], correct: 0, difficulty: 3, explanation: 'La metáfora compara sin usar "como": "tus ojos son estrellas"' }
    ]
  },
  ciencias: {
    name: 'Ciencias',
    icon: IconFlask,
    color: 'green',
    questions: [
      { q: '¿Qué gas respiramos principalmente?', a: ['Oxígeno', 'Hidrógeno', 'Nitrógeno', 'CO₂'], correct: 0, difficulty: 1, explanation: 'Inhalamos oxígeno (O₂) necesario para vivir' },
      { q: '¿Cuántos planetas hay en el Sistema Solar?', a: ['8', '9', '7', '10'], correct: 0, difficulty: 1, explanation: 'Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno' },
      { q: '¿Qué órgano bombea la sangre?', a: ['Corazón', 'Pulmón', 'Hígado', 'Riñón'], correct: 0, difficulty: 1, explanation: 'El corazón bombea sangre a todo el cuerpo' },
      { q: '¿Cuál es la fórmula del agua?', a: ['H₂O', 'CO₂', 'O₂', 'H₂'], correct: 0, difficulty: 2, explanation: 'Dos átomos de hidrógeno y uno de oxígeno' },
      { q: '¿Qué tipo de animal es la ballena?', a: ['Mamífero', 'Pez', 'Reptil', 'Anfibio'], correct: 0, difficulty: 2, explanation: 'Las ballenas son mamíferos marinos que respiran aire' },
      { q: '¿Qué produce la fotosíntesis?', a: ['Oxígeno', 'CO₂', 'Nitrógeno', 'Metano'], correct: 0, difficulty: 2, explanation: 'Las plantas producen oxígeno durante la fotosíntesis' },
      { q: '¿A qué velocidad viaja la luz?', a: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], correct: 0, difficulty: 3, explanation: 'La luz viaja a aprox. 300,000 kilómetros por segundo' }
    ]
  },
  sociales: {
    name: 'Sociales',
    icon: IconWorld,
    color: 'orange',
    questions: [
      { q: '¿Cuál es la capital de Francia?', a: ['París', 'Londres', 'Roma', 'Madrid'], correct: 0, difficulty: 1, explanation: 'París es la capital y ciudad más grande de Francia' },
      { q: '¿En qué continente está Egipto?', a: ['África', 'Asia', 'Europa', 'América'], correct: 0, difficulty: 1, explanation: 'Egipto está en el noreste de África' },
      { q: '¿Quién descubrió América?', a: ['Cristóbal Colón', 'Marco Polo', 'Magallanes', 'Vasco da Gama'], correct: 0, difficulty: 1, explanation: 'Colón llegó a América en 1492' },
      { q: '¿Cuántos continentes hay?', a: ['7', '5', '6', '8'], correct: 0, difficulty: 2, explanation: 'América, Europa, África, Asia, Oceanía, Antártida, divididos en N y S América' },
      { q: '¿Qué océano está entre América y Europa?', a: ['Atlántico', 'Pacífico', 'Índico', 'Ártico'], correct: 0, difficulty: 2, explanation: 'El Océano Atlántico separa estos dos continentes' },
      { q: '¿En qué año cayó el Muro de Berlín?', a: ['1989', '1991', '1985', '1979'], correct: 0, difficulty: 3, explanation: 'El Muro de Berlín cayó el 9 de noviembre de 1989' }
    ]
  },
  ingles: {
    name: 'Inglés',
    icon: IconLanguage,
    color: 'red',
    questions: [
      { q: '¿Cómo se dice "libro" en inglés?', a: ['Book', 'Look', 'Cook', 'Hook'], correct: 0, difficulty: 1, explanation: '"Book" significa libro en inglés' },
      { q: '¿Qué significa "cat"?', a: ['Gato', 'Perro', 'Pájaro', 'Ratón'], correct: 0, difficulty: 1, explanation: '"Cat" es gato en español' },
      { q: '¿Cuál es el plural de "child"?', a: ['Children', 'Childs', 'Childes', 'Childen'], correct: 0, difficulty: 2, explanation: '"Child" (niño) tiene un plural irregular: "children"' },
      { q: '¿Qué significa "I am hungry"?', a: ['Tengo hambre', 'Estoy feliz', 'Tengo sueño', 'Estoy cansado'], correct: 0, difficulty: 1, explanation: '"Hungry" significa hambriento/a' },
      { q: '¿Cómo se dice "buenos días" en inglés?', a: ['Good morning', 'Good night', 'Good afternoon', 'Good evening'], correct: 0, difficulty: 1, explanation: '"Good morning" se usa para saludar en la mañana' },
      { q: '¿Cuál es el pasado de "go"?', a: ['Went', 'Goed', 'Gone', 'Goes'], correct: 0, difficulty: 2, explanation: '"Go" (ir) tiene pasado irregular: "went"' },
      { q: 'What is the opposite of "hot"?', a: ['Cold', 'Warm', 'Cool', 'Mild'], correct: 0, difficulty: 2, explanation: '"Cold" (frío) es lo opuesto de "hot" (caliente)' }
    ]
  }
};

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

  const { crearTransaccion, loading: savingPoints, error: errorSavingPoints } = useTransaccionPuntos();
  // Cuando el juego termina y guardas los puntos
  const handleSavePoints = async () => {
   const tipoPunto = { id: '1' };

    const transaccionData = {
      usuarioId: ST_GET_USER_ID(),
      tipoPunto: tipoPunto,
      tipoTransaccion: 'GANAR' as const,
      cantidad: score,
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

    const result = await crearTransaccion(transaccionData);
    
    if (result) {
      console.log('Puntos guardados exitosamente:', result);
      // Puedes mostrar una notificación de éxito aquí
    } else if (errorSavingPoints) {
      console.error('Error al guardar puntos:', errorSavingPoints);
      // Puedes mostrar una notificación de error aquí
    }
  };

  const getRandomQuestion = (): CurrentQuestion => {
    const subjects = Object.keys(SUBJECTS);
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const subjectData = SUBJECTS[randomSubject];
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
    if (!currentQuestion) {
      startNewQuestion();
    }
  }, []);

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

  if (!currentQuestion) return null;

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