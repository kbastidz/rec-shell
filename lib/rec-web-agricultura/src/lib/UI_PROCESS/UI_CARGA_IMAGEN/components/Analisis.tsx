import { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Button,
  Image,
  Alert,
  Badge,
  Card,
  Grid,
  Loader,
  Center,
  FileButton,
  rem,
  Progress,
  ThemeIcon,
  List,
  TextInput,
  Textarea,
  Modal,
  Select,
} from '@mantine/core';
import {
  IconUpload,
  IconPhoto,
  IconAlertCircle,
  IconLeaf,
  IconBug,
  IconX,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import { NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { ConexionService } from '../service/agricultura.service';
import { CacaoAnalysisResult } from '../../../types/dto';
import { useGuardarAnalisis } from '../hook/useAgricultura';
import { ST_GET_USER_ID } from '../../../utils/utils';

const cacaoService = new ConexionService();

export function Analisis() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CacaoAnalysisResult | null>(null);
  const [tiempoProcesamiento, setTiempoProcesamiento] = useState(0);
  
  // Modal para guardar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cultivoId, setCultivoId] = useState<string | null>(null);
  const [deficienciaId, setDeficienciaId] = useState<string | null>(null);
  const [severidad, setSeveridad] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState('');
  const [condicionesClima, setCondicionesClima] = useState('');
  const [notas, setNotas] = useState('');
  const notifications = useNotifications();

  
  // Datos de ejemplo para los combos (en producción vendrían de la API)
  const [cultivos] = useState([
    { value: '1', label: 'Cacao Nacional - Finca Los Ríos' },
    { value: '2', label: 'Cacao CCN-51 - Parcela Norte' },
    { value: '3', label: 'Cacao Trinitario - Sector A' },
  ]);

  const [deficiencias] = useState([
    { value: '1', label: 'Nitrógeno bajo - Hojas amarillas' },
    { value: '2', label: 'Fósforo insuficiente - Crecimiento lento' },
    { value: '3', label: 'Potasio deficiente - Bordes secos' },
  ]);

  const [severidades] = useState([
    { value: 'LEVE', label: 'Leve' },
    { value: 'MODERADA', label: 'Moderada' },
    { value: 'SEVERA', label: 'Severa' },
  ]);
  
  const { guardarAnalisis, loading: guardandoAnalisis } = useGuardarAnalisis();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      // Validar que sea una imagen
      if (!selectedFile.type.startsWith('image/')) {
        notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, 'Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, 'La imagen no debe superar los 5MB');
        return;
      }

      setFile(selectedFile);
      setResult(null);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    const startTime = Date.now();

    try {
      const analysisResult = await cacaoService.analizarHoja(file);
      const endTime = Date.now();
      const tiempoSegundos = Math.round((endTime - startTime) / 1000);
      
      setResult(analysisResult);
      setTiempoProcesamiento(tiempoSegundos);

      notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, 'La hoja ha sido analizada exitosamente');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Error al analizar la imagen',
        color: 'red',
        icon: <IconX size={18} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAnalisis = async () => {
    if (!result || !file) return;

    // Obtener dimensiones de la imagen
    const img = new window.Image();
    img.src = imagePreview!;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const exito = await guardarAnalisis({
      cultivoId: Number(cultivoId),
      deficiencia_Id: Number(deficienciaId),
      severidad: severidad as 'LEVE' | 'MODERADA' | 'SEVERA',
      usuarioId: ST_GET_USER_ID(),
      nombreImagen: file.name,
      rutaImagenOriginal: `/uploads/${file.name}`,
      tiempoProcesamiento: tiempoProcesamiento,
      metadatosImagen: {
        resolucion: `${img.width}x${img.height}`,
        tamanoBytes: file.size,
        tipo: file.type,
        fechaCaptura: new Date().toISOString(),
      },
      ubicacionEspecifica: ubicacion,
      condicionesClima: condicionesClima,
      notasUsuario: notas,
      confianzaPrediccion: result.probabilidad * 100,
      diagnosticoPrincipal: true,
      observacionesIa: `${result.estado_general}. Diagnóstico: ${result.posible_enfermedad}`,
      areasAfectadas: {
        caracteristicas: result.caracteristicas_detectadas,
        estado: result.estado_general
      }
    });

    if (exito) {
      setModalAbierto(false);
      // Limpiar el formulario
      setCultivoId(null);
      setDeficienciaId(null);
      setSeveridad(null);
      setUbicacion('');
      setCondicionesClima('');
      setNotas('');
    }
  };

  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setTiempoProcesamiento(0);
  };

  const getEstadoColor = (estado: string): string => {
    if (estado.toLowerCase().includes('sana')) return 'green';
    if (estado.toLowerCase().includes('deficiencia')) return 'yellow';
    if (estado.toLowerCase().includes('hongo')) return 'orange';
    if (estado.toLowerCase().includes('plaga') || estado.toLowerCase().includes('daño')) return 'red';
    return 'gray';
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Group>
              <ThemeIcon size="xl" radius="md" variant="light" color="green">
                <IconLeaf size={28} />
              </ThemeIcon>
              <div>
                <Title order={2}>Analizador de Hojas de Cacao</Title>
                <Text size="sm" c="dimmed">
                  Sube una imagen para detectar enfermedades y deficiencias
                </Text>
              </div>
            </Group>
          </Group>
        </Paper>

        <Grid gutter="lg">
          {/* Upload Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper shadow="sm" p="xl" radius="md" withBorder h="100%">
              <Stack gap="md" h="100%">
                <Title order={4}>Cargar Imagen</Title>

                {!imagePreview ? (
                  <Paper
                    withBorder
                    radius="md"
                    p="xl"
                    style={{
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: rem(300),
                    }}
                  >
                    <Center>
                      <Stack align="center" gap="md">
                        <ThemeIcon size={60} radius="xl" variant="light" color="blue">
                          <IconPhoto size={30} />
                        </ThemeIcon>
                        <Text size="lg" fw={500} ta="center">
                          Selecciona una imagen
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          JPG, PNG o WEBP (máx. 5MB)
                        </Text>
                        <FileButton onChange={handleFileChange} accept="image/*">
                          {(props) => (
                            <Button
                              {...props}
                              leftSection={<IconUpload size={18} />}
                              size="md"
                              variant="light"
                            >
                              Seleccionar archivo
                            </Button>
                          )}
                        </FileButton>
                      </Stack>
                    </Center>
                  </Paper>
                ) : (
                  <Stack gap="md" style={{ flex: 1 }}>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      radius="md"
                      fit="contain"
                      h={300}
                    />
                    <Group grow>
                      <Button
                        onClick={handleAnalyze}
                        loading={loading}
                        leftSection={<IconLeaf size={18} />}
                        size="md"
                      >
                        Analizar Hoja
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="light"
                        color="gray"
                        size="md"
                      >
                        Cambiar imagen
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Results Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper shadow="sm" p="xl" radius="md" withBorder h="100%">
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Title order={4}>Resultados del Análisis</Title>
                  {result && (
                    <Button
                      leftSection={<IconDeviceFloppy size={18} />}
                      variant="light"
                      onClick={() => setModalAbierto(true)}
                    >
                      Guardar
                    </Button>
                  )}
                </Group>

                {loading && (
                  <Center py="xl">
                    <Stack align="center" gap="md">
                      <Loader size="lg" />
                      <Text size="sm" c="dimmed">
                        Analizando imagen...
                      </Text>
                    </Stack>
                  </Center>
                )}

                {!loading && !result && (
                  <Alert
                    icon={<IconAlertCircle size={18} />}
                    title="Sin resultados"
                    color="blue"
                    variant="light"
                  >
                    Carga una imagen y presiona "Analizar Hoja" para ver los resultados
                  </Alert>
                )}

                {!loading && result && (
                  <Stack gap="lg">
                    {/* Estado General */}
                    <Card withBorder padding="md" radius="md">
                      <Stack gap="xs">
                        <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                          Estado General
                        </Text>
                        <Group justify="space-between" align="center">
                          <Badge
                            size="lg"
                            variant="light"
                            color={getEstadoColor(result.estado_general)}
                          >
                            {result.estado_general}
                          </Badge>
                          <Text size="xl" fw={700}>
                            {(result.probabilidad * 100).toFixed(0)}%
                          </Text>
                        </Group>
                        <Progress
                          value={result.probabilidad * 100}
                          color={getEstadoColor(result.estado_general)}
                          size="md"
                          radius="xl"
                        />
                      </Stack>
                    </Card>

                    {/* Posible Enfermedad */}
                    <Card withBorder padding="md" radius="md">
                      <Stack gap="xs">
                        <Group gap="xs">
                          <IconBug size={18} />
                          <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                            Diagnóstico
                          </Text>
                        </Group>
                        <Text size="md" fw={500}>
                          {result.posible_enfermedad}
                        </Text>
                      </Stack>
                    </Card>

                    {/* Características Detectadas */}
                    <Card withBorder padding="md" radius="md">
                      <Stack gap="md">
                        <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                          Características Detectadas
                        </Text>
                        <List spacing="xs" size="sm">
                          <List.Item>
                            <strong>Color:</strong> {result.caracteristicas_detectadas.color_principal}
                          </List.Item>
                          <List.Item>
                            <strong>Manchas:</strong> {result.caracteristicas_detectadas.manchas}
                          </List.Item>
                          <List.Item>
                            <strong>Borde:</strong> {result.caracteristicas_detectadas.borde}
                          </List.Item>
                          <List.Item>
                            <strong>Textura:</strong> {result.caracteristicas_detectadas.textura}
                          </List.Item>
                          <List.Item>
                            <strong>Deformaciones:</strong>{' '}
                            {result.caracteristicas_detectadas.deformaciones ? 'Sí' : 'No'}
                          </List.Item>
                        </List>
                      </Stack>
                    </Card>
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>

      {/* Modal para guardar análisis */}
      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Guardar Análisis"
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Cultivo"
            placeholder="Seleccione el cultivo"
            data={cultivos}
            value={cultivoId}
            onChange={setCultivoId}
            required
            searchable
            clearable
          />
          
          <Select
            label="Deficiencia Nutricional"
            placeholder="Seleccione la deficiencia detectada"
            data={deficiencias}
            value={deficienciaId}
            onChange={setDeficienciaId}
            searchable
            clearable
          />

          <Select
            label="Severidad"
            placeholder="Seleccione la severidad"
            data={severidades}
            value={severidad}
            onChange={setSeveridad}
            required
          />
        
          <TextInput
            label="Ubicación Específica"
            placeholder="Ej: Parcela Norte, Sector A"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.currentTarget.value)}
          />

          <TextInput
            label="Condiciones Climáticas"
            placeholder="Ej: Soleado, Nublado, Lluvia"
            value={condicionesClima}
            onChange={(e) => setCondicionesClima(e.currentTarget.value)}
          />

          <Textarea
            label="Notas del Usuario"
            placeholder="Observaciones adicionales..."
            value={notas}
            onChange={(e) => setNotas(e.currentTarget.value)}
            rows={4}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setModalAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={18} />}
              onClick={handleGuardarAnalisis}
              loading={guardandoAnalisis}
            >
              Guardar Análisis
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}