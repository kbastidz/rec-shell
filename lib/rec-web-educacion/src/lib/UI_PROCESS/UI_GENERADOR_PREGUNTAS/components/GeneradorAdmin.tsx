import { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Alert,
  LoadingOverlay,
  FileButton,
  Box,
  Badge,
  Divider,
  ActionIcon,
  Tooltip,
  Card,
  Radio,
  NumberInput,
  Select,
  TextInput
} from '@mantine/core';
import {
  IconUpload,
  IconFileTypePdf,
  IconAlertCircle,
  IconSparkles,
  IconX,
  IconDownload,
  IconCopy,
  IconQuestionMark,
  IconCalendar
} from '@tabler/icons-react';

import { PREGUNTAS, RESUME } from '../../../utils/CONSTANTE';

import { ActionButtons, NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { useEducacion } from '../hook/useEducacion';
import { PROMPT_LIMITS } from '../../../utils/prompts.util';
import { pdfService } from '@rec-shell/rec-web-shared';

interface Question {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

export function GeneradorAdmin() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(PROMPT_LIMITS.DEFAULT_QUESTIONS);
  
  const notifications = useNotifications();
  const { CREAR, loading: loadingGuardar } = useEducacion();
  const [idCurso, setIdCurso] = useState<string>();
  const [fechaEvaluacion, setFechaEvaluacion] = useState<string>('');

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setSummary('');
    setError('');
    setQuestions([]);
    setSelectedAnswers({});
  };

  const cursosDisponibles = [
    { value: '8', label: 'Octavo' },
    { value: '9', label: 'Noveno' },
    ];

  const clearFile = () => {
    setFile(null);
    setSummary('');
    setError('');
    setQuestions([]);
    setSelectedAnswers({});
  };

  const handleGenerateSummary = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo PDF');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setQuestions([]);

    try {
      const result = await pdfService.summarizePDF(file);
      setSummary(result);
      console.log(result);
      notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, 'El resumen del PDF se ha generado exitosamente');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar resumen';
      console.log(errorMessage);      
      setSummary(RESUME);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!summary) {
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, 'Primero debes generar un resumen');
      return;
    }

    if (!numberOfQuestions || numberOfQuestions < PROMPT_LIMITS.MIN_QUESTIONS) {
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, `Debes ingresar un número válido de preguntas (mínimo ${PROMPT_LIMITS.MIN_QUESTIONS})`);
      return;
    }

    if (numberOfQuestions > PROMPT_LIMITS.MAX_QUESTIONS) {
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, `El número máximo de preguntas es ${PROMPT_LIMITS.MAX_QUESTIONS}`);
      return;
    }

    setLoadingQuestions(true);
    setQuestions([]);
    setSelectedAnswers({});

    try {
      // Pasar el número de preguntas al servicio
      const result = await pdfService.generateQuestions(summary, numberOfQuestions);
      
      let parsedQuestions;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : result;
        parsedQuestions = JSON.parse(jsonStr);
      } catch (parseError) {
        throw new Error('Error al procesar las preguntas generadas');
      }

      if (parsedQuestions.preguntas && Array.isArray(parsedQuestions.preguntas)) {
        setQuestions(parsedQuestions.preguntas);
        
        notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, `Se generaron ${parsedQuestions.preguntas.length} preguntas exitosamente`);
      } else {
        throw new Error('Formato de preguntas inválido');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar preguntas';
      console.log('Error en Gemini, usando mock:', errorMessage);
      // Usar preguntas mock cuando Gemini falla (limitadas al número solicitado)
      const availableMockQuestions = PREGUNTAS.preguntas.slice(0, Math.min(numberOfQuestions, PREGUNTAS.preguntas.length));
      setQuestions(availableMockQuestions);
      notifications.warning(
        'Modo de prueba',
        `Se generaron ${availableMockQuestions.length} preguntas de ejemplo debido a un error con el servicio de IA`
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary);
    notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, 'Resumen copiado al portapapeles');
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen_${file?.name.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, 'Resumen descargado exitosamente');
  };

  const handleDownloadQuestions = () => {
    let content = 'CUESTIONARIO\n\n';
    questions.forEach((q, idx) => {
      content += `${idx + 1}. ${q.pregunta}\n`;
      q.opciones.forEach((opt, optIdx) => {
        const letter = String.fromCharCode(65 + optIdx);
        content += `   ${letter}) ${opt}\n`;
      });
      content += `   Respuesta correcta: ${String.fromCharCode(65 + q.respuestaCorrecta)}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuestionario_${file?.name.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, 'Cuestionario descargado exitosamente');
  };

  const handleGuardarCuestionario = async () => {
    if (!questions || questions.length === 0) {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        'No hay preguntas para guardar'
      );
      return;
    }

    if (!idCurso) {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        'Debes seleccionar un curso'
      );
      return;
    }

    if (!fechaEvaluacion) {
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        'Debes seleccionar una fecha de evaluación'
      );
      return;
    }

    try {
      const tituloGenerado = file?.name 
        ? `Evaluación - ${file.name.replace('.pdf', '')}`
        : `Evaluación generada - ${new Date().toLocaleDateString('es-ES')}`;
      
      // Generar descripción automática basada en el resumen
      const descripcionGenerada = summary 
        ? summary.substring(0, 200) + (summary.length > 200 ? '...' : '')
        : `Evaluación de ${questions.length} preguntas generada automáticamente`;
      
      const fechaEvaluacionISO = new Date(fechaEvaluacion).toISOString();
      const codigoUnico = `EVAL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const dataToSave = {
        preguntas: questions,
        titulo: tituloGenerado,
        descripcion: descripcionGenerada,
        codigoUnico: codigoUnico,
        fechaCreacion: new Date().toISOString(),
        estado: 'activo' as const,
        idCurso: idCurso,
        fechaEvaluacion: fechaEvaluacionISO,
        ...(summary && { resumen: summary }),
        ...(file?.name && { nombreArchivo: file.name })
      };

      await CREAR(dataToSave);

      clearFile();
      setNumberOfQuestions(PROMPT_LIMITS.DEFAULT_QUESTIONS);
      setIdCurso(undefined);
      setFechaEvaluacion('');
      
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Box>
          <Group gap="xs" mb="xs">
            <IconSparkles size={32} color="#228be6" />
            <Title order={1}>Resumen de PDF con IA</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Sube un documento PDF y obtén un resumen inteligente generado por Gemini AI
          </Text>
        </Box>

        {/* Upload Section */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          
          <Stack gap="md">
            <Text fw={500} size="lg">Cargar documento</Text>
            
            {!file ? (
              <FileButton
                onChange={handleFileChange}
                accept="application/pdf"
              >
                {(props) => (
                  <Paper
                    {...props}
                    p="xl"
                    radius="md"
                    style={{
                      border: '2px dashed #dee2e6',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: '#f8f9fa'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#228be6';
                      e.currentTarget.style.backgroundColor = '#e7f5ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#dee2e6';
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                  >
                    <Stack align="center" gap="sm">
                      <IconUpload size={48} color="#868e96" />
                      <Text size="lg" fw={500}>
                        Haz clic para seleccionar un PDF
                      </Text>
                      <Text size="sm" c="dimmed">
                        o arrastra y suelta aquí
                      </Text>
                      <Badge color="gray" variant="light">
                        Tamaño máximo: 10MB
                      </Badge>
                    </Stack>
                  </Paper>
                )}
              </FileButton>
            ) : (
              <Paper p="md" radius="md" withBorder bg="blue.0">
                <Group justify="space-between">
                  <Group gap="md">
                    <IconFileTypePdf size={40} color="#228be6" />
                    <Box>
                      <Text fw={500}>{file.name}</Text>
                      <Text size="sm" c="dimmed">
                        {formatFileSize(file.size)}
                      </Text>
                    </Box>
                  </Group>
                  <Tooltip label="Eliminar archivo">
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={clearFile}
                      disabled={loading}
                    >
                      <IconX size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Paper>
            )}

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                variant="filled"
              >
                {error}
              </Alert>
            )}

            <Button
              size="lg"
              leftSection={<IconSparkles size={20} />}
              onClick={handleGenerateSummary}
              disabled={!file || loading}
              loading={loading}
              fullWidth
            >
              {loading ? 'Generando resumen...' : 'Generar resumen'}
            </Button>
          </Stack>
        </Paper>

        {/* Summary Section */}
        {summary && (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500} size="lg">Resumen generado</Text>
                <Group gap="xs">
                  <Tooltip label="Copiar resumen">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={handleCopySummary}
                    >
                      <IconCopy size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Descargar resumen">
                    <ActionIcon
                      variant="light"
                      color="green"
                      onClick={handleDownloadSummary}
                    >
                      <IconDownload size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              
              <Divider />
              
              <Paper
                p="md"
                radius="md"
                bg="gray.0"
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              >
                <Text style={{ whiteSpace: 'pre-wrap' }}>
                  {summary}
                </Text>
              </Paper>

              <Divider />

              <Group align="flex-end" gap="md">
                <NumberInput
                  label="Número de preguntas"
                  description="¿Cuántas preguntas deseas generar?"
                  placeholder="Ingresa un número"
                  min={PROMPT_LIMITS.MIN_QUESTIONS}
                  max={PROMPT_LIMITS.MAX_QUESTIONS}
                  value={numberOfQuestions}
                  onChange={(value) => setNumberOfQuestions(Number(value))}
                  style={{ flex: 1 }}
                  leftSection={<IconQuestionMark size={18} />}
                />
                <Button
                  size="md"
                  leftSection={<IconQuestionMark size={20} />}
                  onClick={handleGenerateQuestions}
                  loading={loadingQuestions}
                  variant="light"
                  color="violet"
                  style={{ flex: 1 }}
                >
                  {loadingQuestions ? 'Generando...' : `Generar ${numberOfQuestions} pregunta${numberOfQuestions !== 1 ? 's' : ''}`}
                </Button>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Questions Section */}
        {questions.length > 0 && (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500} size="lg">Cuestionario ({questions.length} preguntas)</Text>
                <Tooltip label="Descargar cuestionario">
                  <ActionIcon
                    variant="light"
                    color="green"
                    onClick={handleDownloadQuestions}
                  >
                    <IconDownload size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
              
              <Divider />
              
              <Stack gap="lg">
                {questions.map((q, idx) => (
                  <Card key={idx} padding="lg" radius="md" withBorder>
                    <Stack gap="md">
                      <Text fw={500} size="md">
                        {idx + 1}. {q.pregunta}
                      </Text>
                      
                      <Radio.Group
                        value={selectedAnswers[idx]?.toString()}
                        onChange={(value) => {
                          setSelectedAnswers(prev => ({
                            ...prev,
                            [idx]: parseInt(value)
                          }));
                        }}
                      >
                        <Stack gap="xs">
                          {q.opciones.map((opcion, optIdx) => {
                            const isSelected = selectedAnswers[idx] === optIdx;
                            const isCorrect = q.respuestaCorrecta === optIdx;
                            const showResult = selectedAnswers[idx] !== undefined;
                            
                            let color = undefined;
                            if (showResult) {
                              if (isCorrect) color = 'green';
                              else if (isSelected && !isCorrect) color = 'red';
                            }
                            
                            return (
                              <Paper
                                key={optIdx}
                                p="sm"
                                radius="sm"
                                withBorder
                                style={{
                                  backgroundColor: color ? `var(--mantine-color-${color}-0)` : undefined,
                                  borderColor: color ? `var(--mantine-color-${color}-3)` : undefined,
                                }}
                              >
                                <Radio
                                  value={optIdx.toString()}
                                  label={
                                    <Group gap="xs">
                                      <Text>{String.fromCharCode(65 + optIdx)}) {opcion}</Text>
                                      {showResult && isCorrect && (
                                        <Badge color="green" size="sm">Correcta</Badge>
                                      )}
                                    </Group>
                                  }
                                />
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Radio.Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>

              {/* Información de la evaluación que se guardará */}
              <Divider my="xl" label="Información que se guardará" labelPosition="center" />
              
              <Paper p="md" radius="md" withBorder bg="blue.0">
                <Stack gap="md">
                  
                  <Group gap="xs">
                    <Badge color="blue" variant="filled">Configuración</Badge>
                    <Text size="sm" fw={500}>Configura los detalles de la evaluación:</Text>
                  </Group>
                  
                  <Stack gap="xs">
                     <Select
                        label="Curso"
                        description="Selecciona el curso para esta evaluación"
                        data={[{ value: '', label: 'Selecciona un curso...' }, ...cursosDisponibles]}
                        value={idCurso}
                        onChange={(value) => setIdCurso(value || "")}
                        clearable
                        placeholder="Selecciona un curso"
                        required
                        error={!idCurso ? 'Este campo es requerido' : undefined}
                      />
                      
                      <TextInput
                        label="Fecha de evaluación"
                        description="Selecciona la fecha programada para la evaluación"
                        type="date"
                        value={fechaEvaluacion}
                        onChange={(e) => setFechaEvaluacion(e.target.value)}
                        placeholder="Selecciona una fecha"
                        required
                        error={!fechaEvaluacion ? 'Este campo es requerido' : undefined}
                        leftSection={<IconCalendar size={16} />}
                      />
                      
                      <Divider my="xs" />
                      
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="dimmed" style={{ width: '140px' }}>Título:</Text>
                      <Text size="sm">
                        {file?.name 
                          ? `Evaluación - ${file.name.replace('.pdf', '')}`
                          : `Evaluación generada - ${new Date().toLocaleDateString('es-ES')}`
                        }
                      </Text>
                    </Group>
                    
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="dimmed" style={{ width: '140px' }}>Descripción:</Text>
                      <Text size="sm" lineClamp={2}>
                        {summary 
                          ? summary.substring(0, 200) + (summary.length > 200 ? '...' : '')
                          : `Evaluación de ${questions.length} preguntas generada automáticamente`
                        }
                      </Text>
                    </Group>
                    
                    <Divider my="xs" />
                    
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="dimmed" style={{ width: '140px' }}>Código único:</Text>
                      <Text size="sm" ff="monospace">Se generará al guardar</Text>
                    </Group>
                    
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="dimmed" style={{ width: '140px' }}>Fecha creación:</Text>
                      <Text size="sm">{new Date().toLocaleString('es-ES')}</Text>
                    </Group>
                    
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="dimmed" style={{ width: '140px' }}>Estado:</Text>
                      <Badge color="green" variant="light">Activo</Badge>
                    </Group>
                    
                    <Group gap="xs">
                      <Text size="sm" fw={500} c="dimmed" style={{ width: '140px' }}>Total preguntas:</Text>
                      <Badge color="violet" variant="filled">{questions.length}</Badge>
                    </Group>
                  </Stack>
                </Stack>
              </Paper>

              {/* Botón para guardar en BD */}
              <Group justify="center" mt="xl">
                <ActionButtons.Save
                  onClick={handleGuardarCuestionario}
                  loading={loadingGuardar}
                />
              </Group>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}