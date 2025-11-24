import React, { useState, useEffect } from 'react';
import { Button, Card, Text, Badge, Stack, Group, Title, Container, Paper, Alert } from '@mantine/core';

import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TipoTransaccion } from '../../../enums/Enums';
import { CrearTransaccionDTO } from '../../../types/dto';
import { useTransaccionPuntos } from '../hooks/useGamificacion';
import { handleModelResponse, useGemini } from '@rec-shell/rec-web-shared';
import { MATERIAS, promptTemplateRuleta } from '../../../utils/CONSTANTE';
import { ResultadoType, Materia } from '../interface/interface';

export function Ruleta() {
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoType | null>(null);
  const [rotacion, setRotacion] = useState(0);
  const [yaGiro, setYaGiro] = useState(false);
  const [puntosTotal, setPuntosTotal] = useState(0);
  const usuarioId = ST_GET_USER_ID();

  //Hook para invocar las reglas del juego Ini
  const { CREAR, OBTENER_REGLA_POR_TIPO, regla, loading, error } = useTransaccionPuntos();

  useEffect(() => {
      const cargarRegla = async () => {
        await OBTENER_REGLA_POR_TIPO('RULETA');
      };
      cargarRegla();
  }, []);
  //Hook para invocar las reglas del juego Ini

  // Hook de Gemini Ini  
  const [materiasGeneradas, setMateriasGeneradas] = useState<Materia[]>(MATERIAS);
  const [cargandoActividades, setCargandoActividades] = useState(true);
  
  const { loading: loadingGemini, error: errorGemini, generateText } = useGemini({
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
        },
        onError: (err) => {
          console.error('Error al parsear respuesta de Gemini:', err);
          setMateriasGeneradas(MATERIAS);
        },
        onFinally: () => {
          setCargandoActividades(false);
        }
      });
    },
    onError: (errorMsg: string) => {
      console.error('Error de Gemini:', errorMsg);
      setCargandoActividades(false);
      setMateriasGeneradas(MATERIAS);
    }
  });
  // Hook de Gemini Fin

  // Cargar actividades al montar el componente
  useEffect(() => {
    const cargarActividades = async () => {
      // Verificar si ya hay actividades guardadas para hoy
      const materiasGuardadas = sessionStorage.getItem(`materias_${usuarioId}`);
      const fechaGeneracion = sessionStorage.getItem(`fecha_materias_${usuarioId}`);
      const hoy = new Date().toDateString();
      
      if (materiasGuardadas && fechaGeneracion === hoy) {
        // Usar actividades guardadas del día
        try {
          const materias = JSON.parse(materiasGuardadas);
          setMateriasGeneradas(materias);
          setCargandoActividades(false);
          return;
        } catch (err) {
          console.error('Error al cargar materias guardadas:', err);
        }
      }
      
      // Si no hay actividades guardadas o son de otro día, generar nuevas
      sessionStorage.setItem(`fecha_materias_${usuarioId}`, hoy);
      await generateText(promptTemplateRuleta);
    };

    cargarActividades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId]); // Solo depende de usuarioId

  useEffect(() => {
    // Verificar si ya giró hoy (usando memoria en lugar de localStorage)
    const lastSpin = sessionStorage.getItem(`ultimoGiro_${usuarioId}`);
    const puntos = sessionStorage.getItem(`puntosTotal_${usuarioId}`);
    
    if (lastSpin) {
      const lastDate = new Date(lastSpin);
      const today = new Date();
      if (lastDate.toDateString() === today.toDateString()) {
        setYaGiro(false); // Permitir múltiples giros para pruebas
      }
    }
    
    if (puntos) {
      setPuntosTotal(parseInt(puntos));
    }
  }, [usuarioId]);

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
      setYaGiro(true);

      // Crear transacción de puntos en la base de datos
      try {
        const nuevoBalance = puntosTotal + actividadSeleccionada.puntos;
        
        const tipoPunto = { id: regla?.id_tipo_punto || 1 ,  nombre: "", nombreMostrar:""};
        const puntosCalculados = regla?.puntosOtorgados ? regla.puntosOtorgados : actividadSeleccionada.puntos;

        const transaccionData: CrearTransaccionDTO = {
          usuarioId: ST_GET_USER_ID(),
          tipoPunto: tipoPunto,
          tipoTransaccion: TipoTransaccion.GANAR,
          cantidad: puntosCalculados,
          //balanceDespues: nuevoBalance,
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
                {regla?.puntosOtorgados ?? puntosTotal} puntos
            </Badge>
          </Group>
        </Paper>

        {(error || errorGemini) && (
          <Alert color="red" title="Error">
            {error || errorGemini}
          </Alert>
        )}

        {cargandoActividades && (
          <Alert color="blue" title="Generando actividades...">
            <span role="img" aria-label="robot">🤖</span> Estamos creando actividades personalizadas con IA. Esto solo tomará unos segundos...
          </Alert>
        )}

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
            {!cargandoActividades && (
              <Text size="xs" c="dimmed" mt="xs">
                <span role="img" aria-label="robot">🤖</span> Actividades generadas con IA
              </Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}