import React, { useState, useEffect, useRef } from 'react';
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
  Grid,
  ActionIcon,
  Tabs,
  Accordion,
  Divider,
  Table,
  SimpleGrid,
  Box,
  Tooltip,
  Center,
  Select,
} from '@mantine/core';

import {
  IconPhoto,
  IconLeaf,
  IconDeviceFloppy,
  IconAlertCircle,
  IconCircleCheck,
  IconTrash,
  IconEye,
  IconBulb,
  IconZoomScan,
  IconInfoCircle,
  IconChartBar,
  IconShieldCheck,
} from '@tabler/icons-react';
import { useAnalisisImagen } from '../hook/useAgriculturaMchl';
import {
  environment,
  NOTIFICATION_MESSAGES,
  useGemini,
  useNotifications,
} from '@rec-shell/rec-web-shared';
import {
  generarFallbackDesdeImagenes,
  generarPromptRecomendacionesYOLO,
} from '../../../utils/promp';
import {
  APIResponse,
  construirAnalisisDTO,
  Deteccion,
  DeteccionDTO,
  RecomendacionesGemini,
  ResultDataYOLO,
} from '../../../types/yolo';
import { generarFallbackRecomendaciones } from '../../../utils/utils';
import { useCultivos } from '../../../UI_CULTIVO/hooks/useAgricultura';

const API_URL = environment.yolo.url;

export interface ImagenAnalisis {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  resultado: ResultDataYOLO | null;
  estado: 'pendiente' | 'analizando' | 'completado' | 'error';
  error?: string;
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

// Componente para mostrar detección individual
const DeteccionCard: React.FC<{ deteccion: Deteccion; index: number }> = ({
  deteccion,
  index,
}) => {
  const getSeverityColor = (confianza: number) => {
    if (confianza >= 90) return 'red';
    if (confianza >= 70) return 'orange';
    return 'yellow';
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Badge
            color={getSeverityColor(deteccion.confianza)}
            size="lg"
            variant="filled"
            leftSection={<IconZoomScan size={12} />}
          >
            Región {deteccion.area}
          </Badge>
          <Badge color="blue" variant="light" style={{ textTransform: 'none' }}>
            {deteccion.deficiencia}
          </Badge>
        </Group>
        <Badge color="gray" variant="light">
          #{index + 1}
        </Badge>
      </Group>

      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            Confianza:
          </Text>
          <Text size="sm" fw={700} c={getSeverityColor(deteccion.confianza)}>
            {deteccion.confianza.toFixed(2)}%
          </Text>
        </Group>

        <Divider />

        <Text size="sm" fw={600} mb={4}>
          Ubicación en la imagen:
        </Text>
        <SimpleGrid cols={2} spacing="xs">
          <Paper p="xs" radius="sm" style={{ background: '#f8f9fa' }}>
            <Text size="xs" c="dimmed">
              Esquina superior
            </Text>
            <Text size="xs">
              X: {deteccion.bbox.x1}, Y: {deteccion.bbox.y1}
            </Text>
          </Paper>
          <Paper p="xs" radius="sm" style={{ background: '#f8f9fa' }}>
            <Text size="xs" c="dimmed">
              Esquina inferior
            </Text>
            <Text size="xs">
              X: {deteccion.bbox.x2}, Y: {deteccion.bbox.y2}
            </Text>
          </Paper>
        </SimpleGrid>

        <SimpleGrid cols={2} spacing="xs">
          <Paper p="xs" radius="sm" style={{ background: '#f0f7ff' }}>
            <Text size="xs" c="dimmed">
              Ancho
            </Text>
            <Text size="xs" fw={600}>
              {Math.abs(deteccion.bbox.x2 - deteccion.bbox.x1)} px
            </Text>
          </Paper>
          <Paper p="xs" radius="sm" style={{ background: '#f0f7ff' }}>
            <Text size="xs" c="dimmed">
              Alto
            </Text>
            <Text size="xs" fw={600}>
              {Math.abs(deteccion.bbox.y2 - deteccion.bbox.y1)} px
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="xs" radius="sm" style={{ background: '#e6f7ff' }}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Área total detectada:
            </Text>
            <Text size="xs" fw={600}>
              {deteccion.area.toLocaleString()} px²
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Card>
  );
};

// Componente para mostrar estadísticas
const EstadisticasPanel: React.FC<{
  estadisticas: ResultDataYOLO['estadisticas'];
}> = ({ estadisticas }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb="md">
        <IconChartBar size={20} />
        <Text fw={600} size="lg">
          Estadísticas del Análisis
        </Text>
      </Group>

      <SimpleGrid cols={2} spacing="md">
        <Paper p="md" radius="sm" style={{ background: '#f0f7ff' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Total Detecciones
          </Text>
          <Text size="2rem" fw={700} c="blue">
            {estadisticas.total_detecciones}
          </Text>
        </Paper>

        <Paper p="md" radius="sm" style={{ background: '#f0fff4' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Deficiencias Únicas
          </Text>
          <Text size="2rem" fw={700} c="green">
            {estadisticas.deficiencias_unicas}
          </Text>
        </Paper>

        <Paper p="md" radius="sm" style={{ background: '#fff7f0' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Confianza Promedio
          </Text>
          <Group align="flex-end" gap="xs">
            <Text size="2rem" fw={700} c="orange">
              {estadisticas.confianza_promedio.toFixed(1)}%
            </Text>
            <Progress
              value={estadisticas.confianza_promedio}
              size="sm"
              radius="xl"
              style={{ flex: 1 }}
            />
          </Group>
        </Paper>

        <Paper p="md" radius="sm" style={{ background: '#fff0f0' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Confianza Máxima
          </Text>
          <Text size="2rem" fw={700} c="red">
            {estadisticas.confianza_maxima.toFixed(1)}%
          </Text>
        </Paper>
      </SimpleGrid>

      <Divider my="md" />

      <Text size="sm" fw={600} mb="sm">
        Distribución por Tipo:
      </Text>

      <SimpleGrid cols={3} spacing="xs">
        {Object.entries(estadisticas.por_tipo).map(([tipo, cantidad]) => (
          <Badge
            key={tipo}
            color={
              tipo === 'Potasio'
                ? 'orange'
                : tipo === 'Nitrogeno'
                ? 'blue'
                : tipo === 'Fosforo'
                ? 'red'
                : tipo === 'Zinc'
                ? 'green'
                : tipo === 'Magnesio'
                ? 'violet'
                : 'gray'
            }
            size="lg"
            variant="light"
            style={{ textTransform: 'none' }}
          >
            {tipo}: {cantidad}
          </Badge>
        ))}
      </SimpleGrid>
    </Card>
  );
};

// Componente para metadata
const MetadataPanel: React.FC<{ metadata: ResultDataYOLO['metadata'] }> = ({
  metadata,
}) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group mb="md">
        <IconInfoCircle size={20} />
        <Text fw={600}>Información Técnica</Text>
      </Group>

      <SimpleGrid cols={2} spacing="sm">
        <div>
          <Text size="xs" c="dimmed">
            Dimensiones Imagen
          </Text>
          <Text size="sm" fw={500}>
            {metadata.dimensiones_imagen.ancho} ×{' '}
            {metadata.dimensiones_imagen.alto}px
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">
            Umbral Confianza
          </Text>
          <Text size="sm" fw={500}>
            {(metadata.umbral_confianza * 100).toFixed(0)}%
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">
            Umbral IoU
          </Text>
          <Text size="sm" fw={500}>
            {metadata.umbral_iou}
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">
            Proporción
          </Text>
          <Text size="sm" fw={500}>
            {(
              metadata.dimensiones_imagen.ancho /
              metadata.dimensiones_imagen.alto
            ).toFixed(2)}
            :1
          </Text>
        </div>
      </SimpleGrid>
    </Card>
  );
};

export function Analisis() {
  const [imagenes, setImagenes] = useState<ImagenAnalisis[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [recomendacionesGlobal, setRecomendacionesGlobal] =
    useState<RecomendacionesGemini | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('upload');  
  const nuevasImagenesRef = useRef<string[]>([]);

  const notifications = useNotifications();

  const {
    loading: guardandoAnalisis,
    error: errorGuardar,
    REGISTRAR,
  } = useAnalisisImagen();

  //Ref 1 Consumir hook para combo v1
  const { cultivos, LISTAR } = useCultivos();
  const [nombreCultivo, setNombreCultivo] = useState<string | null>(null);
  useEffect(() => {
    LISTAR();
  }, []);
  const listCultivos = cultivos.map((cultivo) => ({
    value: `${cultivo.nombreCultivo} - ${cultivo.variedadCacao}`,
    label: `${cultivo.nombreCultivo} - ${cultivo.variedadCacao}`,
  }));
  //Ref 1 Consumir hook para combo v1

  // Gemini API
  const {
    loading: loadingGemini,
    error: errorGemini,
    generateText,
  } = useGemini({
    onSuccess: (text: string) =>
      handleModelResponse<RecomendacionesGemini>({
        text,
        onParsed: (data) => {
          setRecomendacionesGlobal(data);
          setIsLoadingRecommendations(false);
        },
        onError: (err) => {
          console.error('Error al parsear recomendaciones:', err);
          const fallback = generarFallbackDesdeImagenes(imagenes);
          setRecomendacionesGlobal(fallback);
          setIsLoadingRecommendations(false);
        },
      }),
    onError: (err: string) => {
      console.error('Error de Gemini:', err);
      const fallback = generarFallbackDesdeImagenes(imagenes);
      setRecomendacionesGlobal(fallback);
      setIsLoadingRecommendations(false);
    },
  });

  // Generar ID único
  const generarId = () =>
    `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // useEffect para analizar automáticamente las nuevas imágenes
  useEffect(() => {
    if (nuevasImagenesRef.current.length > 0) {
      const idsToAnalyze = [...nuevasImagenesRef.current];
      nuevasImagenesRef.current = [];

      idsToAnalyze.forEach((id) => {
        analizarImagen(id);
      });
    }
  }, [imagenes.length]);

  // Convertir archivo a base64
  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Manejar selección de archivos
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nuevasImagenes: ImagenAnalisis[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        notifications.error(
          NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
          `${file.name} no es una imagen válida`
        );
        continue;
      }

      try {
        const base64 = await convertirABase64(file);
        const objectUrl = URL.createObjectURL(file);

        nuevasImagenes.push({
          id: generarId(),
          file,
          previewUrl: objectUrl,
          base64,
          resultado: null,
          estado: 'pendiente',
        });
      } catch (error) {
        console.error(`Error al procesar ${file.name}:`, error);
      }
    }

    setImagenes((prev) => [...prev, ...nuevasImagenes]);
    if (nuevasImagenes.length > 0) {
      nuevasImagenesRef.current = nuevasImagenes.map((img) => img.id);

      setActiveTab('images');
      notifications.success(
        'Imágenes cargadas',
        `Iniciando análisis automático de ${nuevasImagenes.length} imagen${
          nuevasImagenes.length > 1 ? 'es' : ''
        }...`
      );
    }
  };

  // Drag and drop
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
    handleFileSelect(e.dataTransfer.files);
  };

  // Eliminar imagen
  const eliminarImagen = (id: string) => {
    setImagenes((prev) => {
      const imagen = prev.find((img) => img.id === id);
      if (imagen?.previewUrl) {
        URL.revokeObjectURL(imagen.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  // Analizar una imagen individual
  const analizarImagen = async (id: string) => {
    const imagen = imagenes.find((img) => img.id === id);
    if (!imagen) return;

    setImagenes((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, estado: 'analizando' as const } : img
      )
    );

    const formData = new FormData();
    formData.append('file', imagen.file);

    try {
      const response = await fetch(`${API_URL}/predict/visual`, {
        method: 'POST',
        body: formData,
      });

      const result: APIResponse = await response.json();
      console.log('Resultados YOLO:', result);

      if (result.success) {
        setImagenes((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  resultado: result.data,
                  estado: 'completado' as const,
                }
              : img
          )
        );
      } else {
        setImagenes((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  estado: 'error' as const,
                  error: 'Error al procesar la imagen',
                }
              : img
          )
        );
      }
    } catch (err) {
      console.error('Error en la API:', err);
      setImagenes((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                estado: 'error' as const,
                error: 'No se pudo conectar con el servidor',
              }
            : img
        )
      );
    }
  };

  // Analizar todas las imágenes
  const analizarTodasLasImagenes = async () => {
    const imagenesPendientes = imagenes.filter(
      (img) => img.estado === 'pendiente' || img.estado === 'error'
    );

    for (const imagen of imagenesPendientes) {
      await analizarImagen(imagen.id);
    }
  };

  // Generar recomendaciones consolidadas con Gemini
  const generarRecomendacionesConsolidadas = async () => {
    const imagenesCompletadas = imagenes.filter(
      (img) =>
        img.estado === 'completado' &&
        (img.resultado?.detecciones?.length ?? 0) > 0
    );

    if (imagenesCompletadas.length === 0) {
      notifications.error(
        'Sin detecciones',
        'No hay imágenes con deficiencias detectadas'
      );
      return;
    }

    setIsLoadingRecommendations(true);
    setActiveTab('recommendations');

    const todasLasDetecciones = imagenesCompletadas.flatMap(
      (img) => img.resultado!.detecciones
    );

    const estadisticasConsolidadas = {
      total_detecciones: todasLasDetecciones.length,
      deficiencias_unicas: new Set(
        todasLasDetecciones.map((d) => d.deficiencia)
      ).size,
      confianza_promedio:
        todasLasDetecciones.reduce((sum, det) => sum + det.confianza, 0) /
        todasLasDetecciones.length,
      confianza_maxima: Math.max(
        ...todasLasDetecciones.map((d) => d.confianza)
      ),
      por_tipo: todasLasDetecciones.reduce<Record<string, number>>(
        (acc, det) => {
          acc[det.deficiencia] = (acc[det.deficiencia] || 0) + 1;
          return acc;
        },
        {}
      ),
    };

    const resultadoConsolidado: ResultDataYOLO = {
      detecciones: todasLasDetecciones,
      estadisticas: estadisticasConsolidadas,
      metadata: {
        dimensiones_imagen: {
          ancho: Math.max(
            ...imagenesCompletadas.map(
              (img) => img.resultado!.metadata.dimensiones_imagen.ancho
            )
          ),
          alto: Math.max(
            ...imagenesCompletadas.map(
              (img) => img.resultado!.metadata.dimensiones_imagen.alto
            )
          ),
        },
        umbral_confianza: Math.min(
          ...imagenesCompletadas.map(
            (img) => img.resultado!.metadata.umbral_confianza
          )
        ),
        umbral_iou: Math.max(
          ...imagenesCompletadas.map(
            (img) => img.resultado!.metadata.umbral_iou
          )
        ),
      },
      es_valido: true,
      mensaje: `Se analizaron ${imagenesCompletadas.length} imágenes`,
      tipo_alerta: 'warning',
      recomendaciones: [],
    };

    try {
      const prompt = generarPromptRecomendacionesYOLO(resultadoConsolidado);
      await generateText(prompt);
    } catch (error) {
      console.error('Error al generar recomendaciones:', error);
      const fallback = generarFallbackRecomendaciones(resultadoConsolidado);
      setRecomendacionesGlobal(fallback);
      setIsLoadingRecommendations(false);
    }
  };

  // Guardar análisis
  const handleGuardarAnalisis = async () => {
    const imagenesCompletadas = imagenes.filter(
      (img) => img.estado === 'completado' && img.resultado
    );

    if (imagenesCompletadas.length === 0 || !recomendacionesGlobal) return;

    if (!nombreCultivo) {
      notifications.error(
        'Cultivo requerido',
        'Por favor seleccione un cultivo antes de guardar'
      );
      return;
    }

    for (const imagen of imagenesCompletadas) {
      if (!imagen.resultado) continue;

      const analisisDTO = construirAnalisisDTO(
        imagen.resultado,
        imagen.file,
        imagen.base64,
        recomendacionesGlobal,
        nombreCultivo 
      );
      await REGISTRAR(analisisDTO);
    }

    notifications.success(
      'Éxito',
      `Se guardaron ${imagenesCompletadas.length} análisis`
    );

    imagenes.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImagenes([]);
    setRecomendacionesGlobal(null);
    setActiveTab('upload');
  };

  // Calcular estadísticas globales
  const estadisticasGlobales = imagenes.reduce(
    (acc, img) => {
      if (img.estado === 'completado') acc.completadas++;
      if (img.estado === 'analizando') acc.analizando++;
      if (img.estado === 'error') acc.error++;
      if (img.estado === 'pendiente') acc.pendientes++;
      return acc;
    },
    { completadas: 0, analizando: 0, error: 0, pendientes: 0 }
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: '#f5f7fa',
      }}
    >
      <Container size="xl">
        {/* Header compacto */}
        <Group justify="center" mb="xl">
          <IconLeaf size={36} color="#667eea" />
          <div>
            <Title order={1} size="h2" style={{ margin: 0 }}>
              Detector de Deficiencias en Cacao
            </Title>
            <Text size="sm" c="dimmed">
              Análisis de deficiencias nutricionales con IA YOLO
            </Text>
          </div>
        </Group>

        {/* Tabs principales */}
        <Tabs value={activeTab} onChange={setActiveTab} radius="md">
          <Tabs.List grow>
            <Tabs.Tab value="upload" leftSection={<IconPhoto size={16} />}>
              Cargar Imágenes
            </Tabs.Tab>
            <Tabs.Tab
              value="images"
              leftSection={<IconEye size={16} />}
              disabled={imagenes.length === 0}
            >
              Imágenes ({imagenes.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="recommendations"
              leftSection={<IconBulb size={16} />}
              disabled={!recomendacionesGlobal}
            >
              Recomendaciones
            </Tabs.Tab>
          </Tabs.List>

          {/* Tab 1: Upload */}
          <Tabs.Panel value="upload" pt="md">
            <Paper
              shadow="sm"
              radius="lg"
              p="xl"
              style={{ background: 'white' }}
            >
              <Stack gap="lg">
                {/* Zona de carga */}
                <Paper
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    borderWidth: 3,
                    borderStyle: 'dashed',
                    borderColor: isDragging ? '#5a67d8' : '#cbd5e0',
                    borderRadius: '12px',
                    background: isDragging ? '#e8ebff' : '#f8f9ff',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: '60px 40px',
                    textAlign: 'center',
                  }}
                >
                  <Stack align="center" gap="md">
                    <IconPhoto size={60} color="#667eea" />
                    <div>
                      <Text size="lg" fw={500} mb={5}>
                        Arrastra imágenes aquí o haz clic para seleccionar
                      </Text>
                      <Text size="sm" c="dimmed">
                        Soporta múltiples archivos: JPG, JPEG, PNG
                      </Text>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      onChange={(e) => handleFileSelect(e.target.files)}
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <label htmlFor="file-input">
                      <Button
                        variant="gradient"
                        size="lg"
                        component="span"
                        gradient={{ from: '#667eea', to: '#764ba2' }}
                      >
                        Seleccionar Archivos
                      </Button>
                    </label>
                  </Stack>
                </Paper>

                {/* Estadísticas rápidas */}
                {imagenes.length > 0 && (
                  <>
                    <Grid>
                      <Grid.Col span={3}>
                        <Paper
                          p="md"
                          radius="md"
                          style={{
                            background: '#f0f7ff',
                            border: '1px solid #d0e1ff',
                          }}
                        >
                          <Text size="xs" c="dimmed" mb={5}>
                            Total
                          </Text>
                          <Text size="xl" fw={700}>
                            {imagenes.length}
                          </Text>
                        </Paper>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Paper
                          p="md"
                          radius="md"
                          style={{
                            background: '#fff5f0',
                            border: '1px solid #ffd8cc',
                          }}
                        >
                          <Text size="xs" c="dimmed" mb={5}>
                            Pendientes
                          </Text>
                          <Text size="xl" fw={700}>
                            {estadisticasGlobales.pendientes}
                          </Text>
                        </Paper>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Paper
                          p="md"
                          radius="md"
                          style={{
                            background: '#f0fff4',
                            border: '1px solid #c6f6d5',
                          }}
                        >
                          <Text size="xs" c="dimmed" mb={5}>
                            Completadas
                          </Text>
                          <Text size="xl" fw={700}>
                            {estadisticasGlobales.completadas}
                          </Text>
                        </Paper>
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Paper
                          p="md"
                          radius="md"
                          style={{
                            background: '#fff0f0',
                            border: '1px solid #ffc9c9',
                          }}
                        >
                          <Text size="xs" c="dimmed" mb={5}>
                            Errores
                          </Text>
                          <Text size="xl" fw={700}>
                            {estadisticasGlobales.error}
                          </Text>
                        </Paper>
                      </Grid.Col>
                    </Grid>

                    <Group grow>
                      {(estadisticasGlobales.pendientes > 0 ||
                        estadisticasGlobales.error > 0) && (
                        <Button
                          size="lg"
                          radius="md"
                          onClick={analizarTodasLasImagenes}
                          loading={estadisticasGlobales.analizando > 0}
                          variant="gradient"
                          gradient={{ from: '#667eea', to: '#764ba2' }}
                        >
                          Re-analizar{' '}
                          {estadisticasGlobales.pendientes +
                            estadisticasGlobales.error}{' '}
                          pendiente
                          {estadisticasGlobales.pendientes +
                            estadisticasGlobales.error >
                          1
                            ? 's'
                            : ''}
                        </Button>
                      )}

                      <Button
                        size="lg"
                        radius="md"
                        variant="light"
                        onClick={() => setActiveTab('images')}
                      >
                        Ver Imágenes
                      </Button>
                    </Group>
                  </>
                )}
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* Tab 2: Imágenes */}
          <Tabs.Panel value="images" pt="md">
            <Paper
              shadow="sm"
              radius="lg"
              p="md"
              style={{ background: 'white' }}
            >
              <Stack gap="md">
                {/* Botones de acción */}
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    Imágenes Analizadas ({imagenes.length})
                  </Text>
                  <Group>
                    <Button
                      size="sm"
                      disabled={
                        estadisticasGlobales.completadas === 0 ||
                        isLoadingRecommendations
                      }
                      onClick={generarRecomendacionesConsolidadas}
                      loading={isLoadingRecommendations}
                      variant="gradient"
                      gradient={{ from: '#f093fb', to: '#f5576c' }}
                      leftSection={<IconBulb size={16} />}
                    >
                      Generar Recomendaciones
                    </Button>
                  </Group>
                </Group>

                <Divider />

                {/* Lista de imágenes */}
                <Stack gap="md">
                  {imagenes.map((imagen) => (
                    <Card
                      key={imagen.id}
                      shadow="sm"
                      padding="md"
                      radius="md"
                      withBorder
                      style={{
                        borderLeft: `4px solid ${
                          imagen.estado === 'completado'
                            ? '#40c057'
                            : imagen.estado === 'analizando'
                            ? '#228be6'
                            : imagen.estado === 'error'
                            ? '#fa5252'
                            : '#868e96'
                        }`,
                      }}
                    >
                      <Group justify="space-between" mb="md">
                        <Group>
                          <Text fw={500}>{imagen.file.name}</Text>
                          <Badge
                            color={
                              imagen.estado === 'completado'
                                ? 'green'
                                : imagen.estado === 'analizando'
                                ? 'blue'
                                : imagen.estado === 'error'
                                ? 'red'
                                : 'gray'
                            }
                            variant="light"
                          >
                            {imagen.estado === 'completado' && '✓ Completado'}
                            {imagen.estado === 'analizando' && '⏳ Analizando'}
                            {imagen.estado === 'error' && '✗ Error'}
                            {imagen.estado === 'pendiente' && '⏸ Pendiente'}
                          </Badge>
                        </Group>
                        <Group>
                          {imagen.estado === 'pendiente' && (
                            <Button
                              size="xs"
                              onClick={() => analizarImagen(imagen.id)}
                            >
                              Analizar
                            </Button>
                          )}
                          {imagen.estado === 'error' && (
                            <Button
                              size="xs"
                              color="orange"
                              onClick={() => analizarImagen(imagen.id)}
                            >
                              Reintentar
                            </Button>
                          )}
                          <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => eliminarImagen(imagen.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>

                      {imagen.estado === 'analizando' && (
                        <Center py="xl">
                          <Stack align="center" gap="md">
                            <Loader size="lg" />
                            <Text>Analizando imagen con YOLO...</Text>
                          </Stack>
                        </Center>
                      )}

                      {imagen.error && (
                        <Alert
                          color="red"
                          title="Error"
                          icon={<IconAlertCircle />}
                        >
                          {imagen.error}
                        </Alert>
                      )}

                      {imagen.resultado && imagen.estado === 'completado' && (
                        <Stack gap="lg">
                          {/* Mensaje de resultado */}
                          <Alert
                            color={
                              imagen.resultado.tipo_alerta === 'success'
                                ? 'green'
                                : imagen.resultado.tipo_alerta === 'warning'
                                ? 'yellow'
                                : 'red'
                            }
                            title="Resultado del Análisis"
                            icon={
                              imagen.resultado.es_valido ? (
                                <IconCircleCheck />
                              ) : (
                                <IconAlertCircle />
                              )
                            }
                          >
                            <Text fw={600}>{imagen.resultado.mensaje}</Text>
                            {imagen.resultado.detecciones.length > 0 && (
                              <Text size="sm" mt="xs">
                                Se detectaron{' '}
                                {imagen.resultado.detecciones.length} región(es)
                                con deficiencias
                              </Text>
                            )}
                          </Alert>

                          {/* Vista de dos columnas para resultados */}
                          <Grid>
                            <Grid.Col span={6}>
                              {/* Imágenes */}
                              <Stack gap="md">
                                <div>
                                  <Text size="sm" fw={600} mb="xs">
                                    Imagen Original
                                  </Text>
                                  <Image
                                    src={imagen.previewUrl}
                                    alt={imagen.file.name}
                                    radius="md"
                                    style={{
                                      maxHeight: '300px',
                                      objectFit: 'contain',
                                    }}
                                  />
                                </div>

                                {imagen.resultado.imagen_procesada && (
                                  <div>
                                    <Text size="sm" fw={600} mb="xs">
                                      Imagen Procesada
                                      <Tooltip label="Imagen con bounding boxes de las deficiencias detectadas por región">
                                        <IconInfoCircle
                                          size={14}
                                          style={{ marginLeft: '8px' }}
                                        />
                                      </Tooltip>
                                    </Text>
                                    <Image
                                      src={`data:image/jpeg;base64,${imagen.resultado.imagen_procesada}`}
                                      alt="Procesada"
                                      radius="md"
                                      style={{
                                        maxHeight: '300px',
                                        objectFit: 'contain',
                                      }}
                                    />
                                    <Text size="xs" c="dimmed" mt={5}>
                                      Cada región numerada muestra una
                                      deficiencia detectada
                                    </Text>
                                  </div>
                                )}
                              </Stack>
                            </Grid.Col>

                            <Grid.Col span={6}>
                              {/* Resultados detallados */}
                              <Stack gap="md">
                                {/* Detecciones */}
                                {imagen.resultado.detecciones.length > 0 ? (
                                  <>
                                    <Text size="lg" fw={600}>
                                      Regiones con Deficiencias (
                                      {imagen.resultado.detecciones.length})
                                    </Text>
                                    <SimpleGrid cols={2} spacing="md">
                                      {imagen.resultado.detecciones.map(
                                        (deteccion, index) => (
                                          <DeteccionCard
                                            key={index}
                                            deteccion={deteccion}
                                            index={index}
                                          />
                                        )
                                      )}
                                    </SimpleGrid>

                                    <EstadisticasPanel
                                      estadisticas={
                                        imagen.resultado.estadisticas
                                      }
                                    />
                                    <MetadataPanel
                                      metadata={imagen.resultado.metadata}
                                    />
                                  </>
                                ) : (
                                  <Alert
                                    color="green"
                                    title="¡Excelente!"
                                    icon={<IconShieldCheck />}
                                  >
                                    <Text>
                                      No se detectaron deficiencias en esta
                                      imagen.
                                    </Text>
                                    <Text size="sm" mt="xs">
                                      La planta parece estar saludable.
                                    </Text>
                                  </Alert>
                                )}
                              </Stack>
                            </Grid.Col>
                          </Grid>
                        </Stack>
                      )}

                      {imagen.estado === 'pendiente' && (
                        <Image
                          src={imagen.previewUrl}
                          alt={imagen.file.name}
                          radius="md"
                          style={{
                            maxHeight: '200px',
                            objectFit: 'contain',
                          }}
                        />
                      )}
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Tabs.Panel>

          {/* Tab 3: Recomendaciones */}
          <Tabs.Panel value="recommendations" pt="md">
            <Paper
              shadow="sm"
              radius="lg"
              p="xl"
              style={{ background: 'white' }}
            >
              <Stack gap="lg">
                {isLoadingRecommendations ? (
                  <Group justify="center" p="xl">
                    <Loader size="lg" />
                    <Text>Generando recomendaciones con IA...</Text>
                  </Group>
                ) : recomendacionesGlobal ? (
                  <>
                    <Group justify="space-between">
                      <div>
                        <Title order={2} size="h3">
                          <span role="img" aria-label="recomendaciones">
                            🌱
                          </span>
                          Recomendaciones IA
                        </Title>
                        <Text size="sm" c="dimmed">
                          Análisis consolidado de todas las imágenes
                        </Text>
                      </div>
                      <Button
                        size="lg"
                        radius="md"
                        onClick={handleGuardarAnalisis}
                        disabled={guardandoAnalisis}
                        loading={guardandoAnalisis}
                        leftSection={<IconDeviceFloppy size={20} />}
                        variant="gradient"
                        gradient={{ from: '#11998e', to: '#38ef7d' }}
                      >
                        Guardar Análisis
                      </Button>
                    </Group>

                    <Divider />

                    {/* Confianza general */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Group>
                        <Select
                          label="Cultivo"
                          placeholder="Seleccione un cultivo"
                          data={listCultivos}
                          value={nombreCultivo}
                          onChange={setNombreCultivo}
                          required
                          searchable
                          style={{ flex: 1 }}
                        />
                      </Group>
                    </Card>
                    <Divider />
                    <Card
                      radius="md"
                      padding="lg"
                      style={{ background: '#f8f9ff' }}
                    >
                      <Text size="sm" fw={600} mb="sm">
                        Confianza General del Análisis
                      </Text>
                      <Group align="center" gap="md">
                        <Progress
                          value={recomendacionesGlobal.confianza_general}
                          size="xl"
                          radius="xl"
                          style={{ flex: 1 }}
                          styles={{
                            section: {
                              background:
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            },
                          }}
                        />
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
                          {recomendacionesGlobal.confianza_general}%
                        </Text>
                      </Group>
                    </Card>

                    {/* Deficiencias con Accordion */}
                    <Accordion
                      variant="separated"
                      radius="md"
                      defaultValue={
                        recomendacionesGlobal.deficiencias[0]?.nombre
                      }
                    >
                      {recomendacionesGlobal.deficiencias.map(
                        (deficiencia, idx) => (
                          <Accordion.Item key={idx} value={deficiencia.nombre}>
                            <Accordion.Control>
                              <Group justify="space-between">
                                <Text size="md" fw={600}>
                                  {deficiencia.nombre}
                                </Text>
                                <Badge
                                  variant="gradient"
                                  gradient={{ from: '#667eea', to: '#764ba2' }}
                                >
                                  {deficiencia.confianza.toFixed(1)}%
                                </Badge>
                              </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                              <Stack gap="md">
                                {/* Tratamiento inmediato */}
                                <div>
                                  <Text size="sm" fw={600} mb="xs" c="red">
                                    <span role="img" aria-label="tratamiento">
                                      🚨
                                    </span>
                                    Tratamiento Inmediato
                                  </Text>
                                  <Paper
                                    p="sm"
                                    radius="md"
                                    style={{ background: '#fff5f5' }}
                                  >
                                    <Stack gap={5}>
                                      {deficiencia.recomendaciones.tratamiento_inmediato.map(
                                        (t, i) => (
                                          <Text key={i} size="sm">
                                            • {t}
                                          </Text>
                                        )
                                      )}
                                    </Stack>
                                  </Paper>
                                </div>

                                {/* Fertilizantes */}
                                <div>
                                  <Text size="sm" fw={600} mb="xs" c="blue">
                                    <span role="img" aria-label="fertilizantes">
                                      💊
                                    </span>
                                    Fertilizantes Recomendados
                                  </Text>
                                  <Paper
                                    p="sm"
                                    radius="md"
                                    style={{ background: '#f0f7ff' }}
                                  >
                                    <Stack gap={5}>
                                      {deficiencia.recomendaciones.fertilizantes_recomendados.map(
                                        (f, i) => (
                                          <Text key={i} size="sm">
                                            • {f}
                                          </Text>
                                        )
                                      )}
                                    </Stack>
                                  </Paper>
                                </div>

                                {/* Preventivas */}
                                <div>
                                  <Text size="sm" fw={600} mb="xs" c="green">
                                    🛡️ Medidas Preventivas
                                  </Text>
                                  <Paper
                                    p="sm"
                                    radius="md"
                                    style={{ background: '#f0fff4' }}
                                  >
                                    <Stack gap={5}>
                                      {deficiencia.recomendaciones.medidas_preventivas.map(
                                        (m, i) => (
                                          <Text key={i} size="sm">
                                            • {m}
                                          </Text>
                                        )
                                      )}
                                    </Stack>
                                  </Paper>
                                </div>
                              </Stack>
                            </Accordion.Panel>
                          </Accordion.Item>
                        )
                      )}
                    </Accordion>
                  </>
                ) : (
                  <Text ta="center" c="dimmed" py="xl">
                    No hay recomendaciones generadas aún
                  </Text>
                )}
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        {/* Errores globales */}
        {(errorGuardar || errorGemini) && (
          <Stack gap="sm" mt="md">
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
          </Stack>
        )}
      </Container>
    </div>
  );
}
