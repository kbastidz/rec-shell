import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Title,
  Table,
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Alert,
  Center,
  Button,
  ThemeIcon,
  Box,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconLeaf,
  IconCalendar,
  IconFileText,
  IconCheck,
  IconX,
  IconTarget,
} from '@tabler/icons-react';
import { usePlanesTratamiento } from '../hooks/useAgricultura';
import { 
  GenerarPlanAnalisisRequest, 
  PlanTratamientoResponse 
} from '../../../types/dto';
import {
  ActionButtons,
  handleModelResponse,
  PaginationControls,
  useGemini,
  usePagination,
} from '@rec-shell/rec-web-shared';
import { useAnalisisImagen } from '../../UI_CARGA_IMAGEN/hook/useAgriculturaMchl';
import { 
  fallbackPlan, 
  generarPromptPlanTratamiento 
} from '../../../utils/generarPromptPlanTratamiento';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';

// Utilidad para obtener color según tipo de alerta
const getTipoAlertaColor = (tipo: string): string => {
  const colors: Record<string, string> = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  };
  return colors[tipo] || 'gray';
};

// Utilidad para formatear nombre de deficiencia
const formatDeficiencia = (deficiencia: string): string => {
  return deficiencia
    .replace('deficienciia_', '')
    .replace('deficiencia_', '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Utilidad para color según confianza
const getConfianzaColor = (confianza: number): string => {
  if (confianza >= 80) return 'green';
  if (confianza >= 60) return 'yellow';
  return 'orange';
};

export function ListarAdmin() {
  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const { loading: loadingPlan, generarPlan } = usePlanesTratamiento();

  const [planTratamientoGenerado, setPlanTratamientoGenerado] = 
    useState<PlanTratamientoResponse>(fallbackPlan);
  
  const analisisActualRef = useRef<AnalisisImagenYOLO_DTO | null>(null);

  // ✅ Función helper para guardar el plan
  const guardarPlanTratamiento = (plan: PlanTratamientoResponse) => {
    if (analisisActualRef.current) {
      const request: GenerarPlanAnalisisRequest = {
        analisisId: analisisActualRef.current.id,
        planTratamiento: plan,
      };
      generarPlan(request);
      analisisActualRef.current = null;
    }
  };

  const { loading: loadingGemini, error: errorGemini, generateText } = useGemini({
    onSuccess: (text: string) =>
      handleModelResponse<PlanTratamientoResponse>({
        text,
        onParsed: (data: PlanTratamientoResponse) => {
          setPlanTratamientoGenerado(data);
          guardarPlanTratamiento(data); // ✅ Guardar plan exitoso
        },
        onError: (err) => {
          console.error('❌ Error al parsear plan de tratamiento:', err);
          setPlanTratamientoGenerado(fallbackPlan);
          guardarPlanTratamiento(fallbackPlan); // ✅ Guardar fallback
        },
        onFinally: () => {
          console.log('✨ Finalizó el procesamiento del plan de tratamiento');
        },
      }),
    onError: (err: string) => {
      console.error('❌ Error de Gemini API:', err);
      setPlanTratamientoGenerado(fallbackPlan);
      guardarPlanTratamiento(fallbackPlan); // ✅ Guardar fallback
    },
  });

  useEffect(() => {
    OBTENER();
  }, []);

  const handleGenerarPlan = async (analisis: AnalisisImagenYOLO_DTO) => {
    try {
      analisisActualRef.current = analisis;
      analisis.imagenBase64 = "";
      const prompt = generarPromptPlanTratamiento(analisis);

      console.log('🚀 Generando plan de tratamiento para:', analisis.archivo);
      await generateText(prompt);
    } catch (error) {
      console.error('❌ Error al generar plan:', error);
      analisisActualRef.current = null;
    }
  };

  // Paginación
  const lista = Array.isArray(analisisList) ? analisisList : [];
  const {
    currentPage,
    totalPages,
    paginatedData,
    setPage,
    setItemsPerPage,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems,
    searchTerm,
    setSearchTerm,
  } = usePagination({
    data: lista,
    itemsPerPage: 5,
    searchFields: ['archivo', 'mensaje'],
  });

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="xl" />
            <Text c="dimmed">Cargando análisis...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertCircle size={20} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box p="md">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Generar Planes de Tratamiento</Title>
            <Text c="dimmed" size="sm">
              Análisis YOLO de Imágenes
            </Text>
          </div>
          <ActionButtons.Refresh onClick={OBTENER} />
        </Group>

        {analisisList.length === 0 ? (
          <Alert
            icon={<IconAlertCircle size={20} />}
            title="Sin registros"
            color="blue"
          >
            No hay análisis registrados. Realiza tu primer análisis para
            comenzar.
          </Alert>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Archivo</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Detecciones</Table.Th>
                <Table.Th>Confianza Promedio</Table.Th>
                <Table.Th>Deficiencias Detectadas</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((analisis) => (
                <Table.Tr key={analisis.id}>
                  <Table.Td>
                    <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
                      {analisis.archivo}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      color={getTipoAlertaColor(analisis.tipo_alerta)}
                      variant="filled"
                      size="sm"
                      leftSection={
                        analisis.es_valido ? (
                          <IconCheck size={14} />
                        ) : (
                          <IconX size={14} />
                        )
                      }
                    >
                      {analisis.es_valido ? 'Válido' : 'Inválido'}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon size="sm" variant="light" color="blue">
                        <IconTarget size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={500}>
                        {analisis.estadisticas.total_detecciones}
                      </Text>
                      <Text size="xs" c="dimmed">
                        ({analisis.estadisticas.deficiencias_unicas} únicas)
                      </Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      color={getConfianzaColor(
                        analisis.estadisticas.confianza_promedio
                      )}
                      variant="light"
                      size="lg"
                    >
                      {analisis.estadisticas.confianza_promedio.toFixed(1)}%
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Stack gap={4}>
                      {Object.entries(analisis.estadisticas.por_tipo).map(
                        ([deficiencia, cantidad]) => (
                          <Group key={deficiencia} gap="xs">
                            <Badge
                              size="sm"
                              variant="dot"
                              color="teal"
                              
                            >
                              {formatDeficiencia(deficiencia)}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              ({cantidad}x)
                            </Text>
                          </Group>
                        )
                      )}
                    </Stack>
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon size="sm" variant="light" color="gray">
                        <IconCalendar size={14} />
                      </ThemeIcon>
                      <Text size="xs">{formatDate(analisis.fecha)}</Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Generar plan de tratamiento con IA">
                        <Button
                          size="xs"
                          variant="light"
                          color="green"
                          leftSection={<IconFileText size={16} />}
                          onClick={() => handleGenerarPlan(analisis)}
                          loading={loadingGemini}
                          disabled={loadingGemini || !analisis.es_valido}
                        >
                          Plan
                        </Button>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}

        {lista.length > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) =>
              value && setItemsPerPage(Number(value))
            }
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por archivo o mensaje..."
          />
        )}
      </Stack>
    </Box>
  );
}