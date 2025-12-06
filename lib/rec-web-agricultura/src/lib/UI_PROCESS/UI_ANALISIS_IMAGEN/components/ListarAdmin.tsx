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
} from '@tabler/icons-react';
import { usePlanesTratamiento } from '../hooks/useAgricultura';
import { AnalisisImagenMCHLDTO, GenerarPlanAnalisisRequest, GenerarPlanRequest, PlanTratamientoResponse } from '../../../types/dto';
import {
  ActionButtons,
  handleModelResponse,
  PaginationControls,
  useGemini,
  usePagination,
} from '@rec-shell/rec-web-shared';
import { useAnalisisImagen } from '../../UI_CARGA_IMAGEN/hook/useAgriculturaMchl';
import { fallbackPlan, generarPromptPlanTratamiento } from '../../../utils/generarPromptPlanTratamiento';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { getDeficienciaColor, getConfianzaColor } from '../../../utils/utils';


export function ListarAdmin() {
  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const {
    loading: loadingPlan,
    generarPlan
  } = usePlanesTratamiento();

  const [planTratamientoGenerado, setPlanTratamientoGenerado] = useState<PlanTratamientoResponse>(fallbackPlan);
  
  const analisisActualRef = useRef<AnalisisImagenMCHLDTO | null>(null);

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

  const handleGenerarPlan = async (analisis: AnalisisImagenMCHLDTO) => {
    try {
      analisisActualRef.current = analisis; 
      analisis.imagenBase64 = "";
      const prompt = generarPromptPlanTratamiento(analisis);

      console.log('🚀 Generando plan de tratamiento para:', analisis.archivo);
      await generateText(prompt);
      
      // ❌ NO guardar aquí - el estado aún no se ha actualizado
      // La llamada a generarPlan ahora está en onParsed del callback de useGemini
      
    } catch (error) {
      console.error('❌ Error al generar plan:', error);
      analisisActualRef.current = null;
    }
  };

  // Ref Paginacion Global
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
    searchFields: ['deficiencia', 'confianza', 'probabilidades'],
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
            <Title order={2}>Generar planes de Tratamiento</Title>
            <Text c="dimmed" size="sm">
              Análisis de Imágenes
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
                <Table.Th>Deficiencia</Table.Th>
                <Table.Th>Confianza</Table.Th>
                <Table.Th>Probabilidades</Table.Th>
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
                      color={getDeficienciaColor(analisis.deficiencia)}
                      variant="filled"
                      leftSection={<IconLeaf size={14} />}
                    >
                      {analisis.deficiencia}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      color={getConfianzaColor(analisis.confianza)}
                      variant="light"
                      size="lg"
                    >
                      {analisis.confianza.toFixed(1)}%
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Stack gap={2}>
                      {Object.entries(analisis.probabilidades).map(
                        ([nutriente, valor]) => (
                          <Group
                            key={nutriente}
                            justify="space-between"
                            gap="xs"
                          >
                            <Text size="xs">{nutriente}:</Text>
                            <Text size="xs" fw={500}>
                              {valor.toFixed(1)}%
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
                      <Tooltip label="Generar plan de tratamiento">
                        <Button
                          size="xs"
                          variant="light"
                          color="green"
                          leftSection={<IconFileText size={16} />}
                          onClick={() => handleGenerarPlan(analisis)}
                          loading={loadingGemini}
                          disabled={loadingGemini}
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
            searchPlaceholder="Buscar por deficiencia, confianza o nutriente..."
          />
        )}
      </Stack>
    </Box>
  );
}