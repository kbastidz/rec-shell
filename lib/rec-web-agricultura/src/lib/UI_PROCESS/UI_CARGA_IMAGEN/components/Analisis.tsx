import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Stack,
  Image,
  Progress,
  Card,
  Loader,
  Alert,
  Badge,
  Box,
  Grid,
} from '@mantine/core';

import {
  IconPhoto,
  IconLeaf,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCircleCheck,
  IconMapPin,
} from '@tabler/icons-react';
import { useAnalisisImagen } from '../hook/useAgriculturaMchl';
import { AnalisisImagenMCHLDTO } from '../../../types/dto';
import {
  NOTIFICATION_MESSAGES,
  useGemini,
  useNotifications,
} from '@rec-shell/rec-web-shared';
import {
  FALLBACK_DATA_YOLO,
  generarPromptRecomendaciones,
  generarPromptRecomendacionesYOLO,
} from '../../../utils/promp';
import { register } from 'module';
import {
  APIResponse,
  construirAnalisisDTO,
  ResultDataYOLO,
} from '../../../types/yolo';

const API_URL = 'http://localhost:8000';

// Datos de respaldo cuando la API no está disponible
const FALLBACK_DATA = {
  success: true,
  data: {
    deficiencia: 'Nitrogeno',
    confianza: 95.03,
    probabilidades: {
      Potasio: 1.4,
      Nitrogeno: 95.03,
      Fosforo: 3.57,
    },
  },
  archivo: 'Imagen de WhatsApp 2025-10-31 a las 18.53.49_e8478295.jpg',
};

interface ResultData {
  deficiencia: string;
  confianza: number;
  probabilidades: {
    Potasio: number;
    Nitrogeno: number;
    Fosforo: number;
  };
}

interface RecomendacionesType {
  recomendaciones: {
    tratamiento: string;
    dosis: string;
    frecuencia: string;
  };
}

// Función auxiliar para manejar respuesta del modelo
function handleModelResponse<T>({
  text,
  onParsed,
  onError,
  onFinally,
}: {
  text: string;
  onParsed: (data: T) => void;
  onError: (err: string) => void;
  onFinally?: () => void;
}) {
  try {
    let jsonText = text.trim();
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    } else {
      const braceMatch = text.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonText = braceMatch[0];
      }
    }

    const parsed = JSON.parse(jsonText) as T;
    onParsed(parsed);
  } catch (err) {
    console.error('Error al parsear JSON:', err);
    onError(err instanceof Error ? err.message : 'Error desconocido');
  } finally {
    onFinally?.();
  }
}

export function Analisis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultDataYOLO | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState('');
  const [imagenBase64, setImagenBase64] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const notifications = useNotifications();

  const {
    loading: guardandoAnalisis,
    error: errorGuardar,
    REGISTRAR,
  } = useAnalisisImagen();

  //Gemini API Ini
  const {
    loading: loadingGemini,
    error: errorGemini,
    generateText,
  } = useGemini({
    onSuccess: (text: string) =>
      handleModelResponse<RecomendacionesType>({
        text,
        onParsed: (data) => {
          const recomendacionesFormateadas = JSON.stringify(
            data.recomendaciones,
            null,
            2
          );
          setRecomendaciones(recomendacionesFormateadas);
          setIsLoadingRecommendations(false);
        },
        onError: (err) => {
          console.error('Error al parsear recomendaciones:', err);
          const fallback = {
            tratamiento: 'Consultar con especialista agrícola',
            dosis: 'Por determinar',
            frecuencia: 'Por determinar',
          };
          setRecomendaciones(JSON.stringify(fallback, null, 2));
          setIsLoadingRecommendations(false);
        },
        onFinally: () => {
          console.log('✨ Finalizó el procesamiento de recomendaciones');
        },
      }),
    onError: (err: string) => {
      console.error('Error de Gemini:', err);
      const fallback = {
        tratamiento: 'Error al generar recomendaciones',
        dosis: 'N/A',
        frecuencia: 'N/A',
      };
      setRecomendaciones(JSON.stringify(fallback, null, 2));
      setIsLoadingRecommendations(false);
    },
  });

  //Gemini API Ini

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setResults(null);
      setError(null);
      setRecomendaciones('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Por favor selecciona una imagen válida');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  /*
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResults(null);
    setError(null);
    setRecomendaciones('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('Resultados:', result);
      
      if (result.success) {
        setResults(result.data);
        
        setIsLoadingRecommendations(true);
        const prompt = generarPromptRecomendaciones(result.data);
        await generateText(prompt);
      } else {
        setError('Error al procesar la imagen');
      }
    } catch (err) {
      console.error('API no disponible, usando datos de fallback:', err);
      
      // Usar datos de fallback
      setResults(FALLBACK_DATA.data);
      
      setIsLoadingRecommendations(true);
      const prompt = generarPromptRecomendaciones(FALLBACK_DATA.data);
      await generateText(prompt);
    } finally {
      setLoading(false);
    }
  };
  */

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResults(null);
    setError(null);
    setRecomendaciones('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Usa /predict/visual si quieres la imagen con cajas dibujadas
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const result: APIResponse = await response.json();
      console.log('Resultados YOLO:', result);

      if (result.success) {
        setResults(result.data);

        // Generar recomendaciones basadas en las detecciones
        if (result.data.detecciones.length > 0) {
          setIsLoadingRecommendations(true);
          const prompt = generarPromptRecomendacionesYOLO(result.data);
          await generateText(prompt);
        } else {
          setRecomendaciones(
            'No se detectaron deficiencias en esta imagen. La hoja parece saludable.'
          );
        }
      } else {
        setError('Error al procesar la imagen');
      }
    } catch (err) {
      console.error('Error en la API:', err);
      setError('No se pudo conectar con el servidor');
      const fallback = {
        tratamiento: 'Consultar con especialista agrícola',
        dosis: 'Por determinar',
        frecuencia: 'Por determinar',
      };
      setRecomendaciones(JSON.stringify(fallback, null, 2));

      setResults(FALLBACK_DATA_YOLO.data);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAnalisis = async () => {
    if (!results || !selectedFile) return;

    let recomendacionesJSON: Record<string, any> = {};

    try {
      if (recomendaciones.trim()) {
        recomendacionesJSON = JSON.parse(recomendaciones);
      }
    } catch (err) {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        'El formato JSON de recomendaciones es inválido'
      );
      return;
    }

    /*const analisisDTO: AnalisisImagenMCHLDTO = {
      deficiencia: results.deficiencia,
      confianza: results.confianza,
      probabilidades: results.probabilidades,
      archivo: selectedFile.name,
      imagenBase64: imagenBase64,
      fecha: new Date().toISOString().split('T')[0],
      recomendaciones: recomendacionesJSON
    };*/

    const analisisDTO = construirAnalisisDTO(
      results,
      selectedFile,
      imagenBase64,
      recomendacionesJSON
    );

    console.log('DTO a enviar:', analisisDTO);

    const resultado = await REGISTRAR(analisisDTO);

    if (resultado) {
      notifications.success();

      // Limpiar el contenido
      setSelectedFile(null);
      setPreviewUrl(null);
      setResults(null);
      setRecomendaciones('');
      setImagenBase64('');
      setError(null);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
      }}
    >
      <Container size="md">
        <Paper
          shadow="xl"
          radius="xl"
          p="xl"
          style={{
            background: 'white',
          }}
        >
          <Stack gap="lg">
            <div style={{ textAlign: 'center' }}>
              <Group justify="center" gap="xs" mb="xs">
                <IconLeaf size={32} color="#667eea" />
                <Title order={1} size="h2">
                  Detector de Deficiencias en Cacao
                </Title>
              </Group>
              <Text size="sm" c="dimmed">
                Sube una imagen de hojas de cacao para detectar deficiencias
                nutricionales
              </Text>
            </div>

            <Paper
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderWidth: 3,
                borderStyle: 'dashed',
                borderColor: isDragging ? '#5a67d8' : '#667eea',
                borderRadius: '15px',
                background: isDragging ? '#e8ebff' : '#f8f9ff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <Stack align="center" gap="md">
                <IconPhoto size={60} color="#667eea" />
                <div>
                  <Text size="lg" fw={500} mb={5}>
                    Haz clic o arrastra una imagen aquí
                  </Text>
                  <Text size="sm" c="dimmed">
                    Formatos soportados: JPG, JPEG, PNG
                  </Text>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0] || null)
                  }
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button variant="light" size="md" component="span">
                    Seleccionar archivo
                  </Button>
                </label>
              </Stack>
            </Paper>

            {previewUrl && (
              <Paper radius="md" withBorder p="md">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  radius="md"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </Paper>
            )}

            <Button
              fullWidth
              size="lg"
              radius="xl"
              disabled={!selectedFile || loading}
              onClick={handleAnalyze}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'transform 0.2s',
              }}
            >
              {loading ? <Loader size="sm" color="white" /> : 'Analizar Imagen'}
            </Button>

            {error && (
              <Alert color="red" title="Error" radius="md">
                {error}
              </Alert>
            )}

            {errorGuardar && (
              <Alert color="red" title="Error al guardar" radius="md">
                {errorGuardar}
              </Alert>
            )}

            {errorGemini && (
              <Alert
                color="orange"
                title="Error al generar recomendaciones"
                radius="md"
              >
                {errorGemini}
              </Alert>
            )}

            {isLoadingRecommendations && (
              <Alert color="blue" title="Generando recomendaciones" radius="md">
                <Group gap="sm">
                  <Loader size="sm" />
                  <Text size="sm">
                    Gemini está generando recomendaciones personalizadas...
                  </Text>
                </Group>
              </Alert>
            )}

            {/* ========================================
          RESULTADOS YOLO - NUEVA SECCIÓN
          ======================================== */}

            {results && (
              <Stack gap="md">
                {/* Mensaje de estado */}
                <Alert
                  color={
                    results.tipo_alerta === 'success'
                      ? 'green'
                      : results.tipo_alerta === 'warning'
                      ? 'yellow'
                      : 'red'
                  }
                  title={results.es_valido ? 'Análisis completado' : 'Atención'}
                  radius="md"
                  icon={
                    results.es_valido ? (
                      <IconCircleCheck size={20} />
                    ) : (
                      <IconAlertCircle size={20} />
                    )
                  }
                >
                  {results.mensaje}
                </Alert>

                {/* Solo mostrar si hay detecciones */}
                {results.detecciones && results.detecciones.length > 0 && (
                  <>
                    {/* Card de resumen */}
                    <Card
                      radius="lg"
                      style={{
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      }}
                      p="xl"
                    >
                      <Grid>
                        <Grid.Col span={6}>
                          <Text size="xs" opacity={0.9} mb={5}>
                            Total Detecciones
                          </Text>
                          <Text size="xl" fw={700}>
                            {results.estadisticas.total_detecciones}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text size="xs" opacity={0.9} mb={5}>
                            Confianza Promedio
                          </Text>
                          <Text size="xl" fw={700}>
                            {results.estadisticas.confianza_promedio.toFixed(1)}
                            %
                          </Text>
                        </Grid.Col>
                      </Grid>
                    </Card>

                    {/* Deficiencias por tipo */}
                    <Paper radius="lg" p="xl" style={{ background: '#f8f9ff' }}>
                      <Text fw={600} mb="lg" size="md">
                        📊 Resumen por tipo de deficiencia
                      </Text>

                      <Stack gap="md">
                        {Object.entries(results.estadisticas.por_tipo).map(
                          ([deficiencia, cantidad]) => {
                            // Calcular confianza promedio para esta deficiencia
                            const deteccionesDelTipo =
                              results.detecciones.filter(
                                (d) => d.deficiencia === deficiencia
                              );
                            const confianzaPromedio =
                              deteccionesDelTipo.reduce(
                                (sum, d) => sum + d.confianza,
                                0
                              ) / cantidad;

                            return (
                              <div key={deficiencia}>
                                <Group justify="space-between" mb={5}>
                                  <Group gap="xs">
                                    <Text size="sm" fw={600}>
                                      {deficiencia}
                                    </Text>
                                    <Badge color="red" size="sm">
                                      {cantidad} región
                                      {cantidad > 1 ? 'es' : ''}
                                    </Badge>
                                  </Group>
                                  <Text size="sm" fw={600}>
                                    {confianzaPromedio.toFixed(1)}%
                                  </Text>
                                </Group>
                                <Progress
                                  value={confianzaPromedio}
                                  size="xl"
                                  radius="xl"
                                  styles={{
                                    root: { background: '#e0e0e0' },
                                    section: {
                                      background:
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    },
                                  }}
                                />
                              </div>
                            );
                          }
                        )}
                      </Stack>
                    </Paper>

                    {/* Detalle de cada detección */}
                    <Paper radius="lg" p="xl" style={{ background: '#fff5f5' }}>
                      <Text fw={600} mb="lg" size="md">
                        🔍 Detalle de regiones afectadas
                      </Text>

                      <Stack gap="sm">
                        {results.detecciones.map((det, idx) => (
                          <Card
                            key={idx}
                            radius="md"
                            withBorder
                            p="md"
                            style={{ background: 'white' }}
                          >
                            <Group justify="space-between" align="flex-start">
                              <Stack gap={5}>
                                <Group gap="xs">
                                  <Badge
                                    size="lg"
                                    variant="gradient"
                                    gradient={{
                                      from: '#667eea',
                                      to: '#764ba2',
                                    }}
                                  >
                                    Región {idx + 1}
                                  </Badge>
                                  <Text fw={700} size="lg">
                                    {det.deficiencia}
                                  </Text>
                                </Group>

                                <Group gap="md" mt={5}>
                                  <Box>
                                    <Text size="xs" c="dimmed">
                                      Ubicación (x,y)
                                    </Text>
                                    <Text size="sm" fw={500}>
                                      <IconMapPin
                                        size={14}
                                        style={{
                                          display: 'inline',
                                          marginRight: 4,
                                        }}
                                      />
                                      ({det.bbox.x1}, {det.bbox.y1})
                                    </Text>
                                  </Box>

                                  <Box>
                                    <Text size="xs" c="dimmed">
                                      Dimensiones
                                    </Text>
                                    <Text size="sm" fw={500}>
                                      {det.bbox.ancho} × {det.bbox.alto} px
                                    </Text>
                                  </Box>

                                  <Box>
                                    <Text size="xs" c="dimmed">
                                      Área afectada
                                    </Text>
                                    <Text size="sm" fw={500}>
                                      {det.area.toLocaleString()} px²
                                    </Text>
                                  </Box>
                                </Group>
                              </Stack>

                              <Box style={{ textAlign: 'right' }}>
                                <Text
                                  size="2rem"
                                  fw={700}
                                  style={{
                                    background:
                                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }}
                                >
                                  {det.confianza.toFixed(1)}%
                                </Text>
                                <Text size="xs" c="dimmed">
                                  confianza
                                </Text>
                              </Box>
                            </Group>
                          </Card>
                        ))}
                      </Stack>
                    </Paper>

                    {/* Imagen procesada (si está disponible) */}
                    {results.imagen_procesada && (
                      <Paper radius="lg" p="md" withBorder>
                        <Text fw={600} mb="md" size="md">
                          📸 Imagen con detecciones marcadas
                        </Text>
                        <Image
                          src={`data:image/jpeg;base64,${results.imagen_procesada}`}
                          alt="Imagen procesada con detecciones"
                          radius="md"
                        />
                      </Paper>
                    )}
                  </>
                )}

                {/* Recomendaciones sin detecciones */}
                {results.recomendaciones &&
                  results.recomendaciones.length > 0 && (
                    <Alert color="yellow" title="Recomendaciones" radius="md">
                      <Stack gap="xs">
                        {results.recomendaciones.map((rec, idx) => (
                          <Text key={idx} size="sm">
                            • {rec}
                          </Text>
                        ))}
                      </Stack>
                    </Alert>
                  )}

                {/* Recomendaciones de Gemini */}
                {recomendaciones &&
                  !isLoadingRecommendations &&
                  results.detecciones.length > 0 && (
                    <Paper radius="lg" p="xl" style={{ background: '#e8fff5' }}>
                      <Text fw={600} mb="md" size="md">
                        🌱 Recomendaciones Personalizadas (Generadas por IA)
                      </Text>
                      <Paper p="md" radius="md" style={{ background: 'white' }}>
                        <div
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: '1.6',
                            fontSize: '14px',
                          }}
                        >
                          {recomendaciones}
                        </div>
                      </Paper>
                    </Paper>
                  )}

                {/* Botón guardar - solo si hay detecciones válidas */}
                {results.detecciones.length > 0 && (
                  <Button
                    fullWidth
                    size="lg"
                    radius="xl"
                    onClick={handleGuardarAnalisis}
                    disabled={
                      guardandoAnalisis ||
                      isLoadingRecommendations ||
                      !recomendaciones
                    }
                    leftSection={<IconDeviceFloppy size={20} />}
                    style={{
                      background:
                        'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    {guardandoAnalisis ? (
                      <Loader size="sm" color="white" />
                    ) : (
                      'Guardar Análisis'
                    )}
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </div>
  );
}
