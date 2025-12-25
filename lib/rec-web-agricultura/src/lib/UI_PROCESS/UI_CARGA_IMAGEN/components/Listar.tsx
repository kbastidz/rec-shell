import { useEffect, useState } from 'react';
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
  Modal,
  Divider,
  ThemeIcon,
  Paper,
  Image,
  ActionIcon,
  Box,
  Card,
  SimpleGrid,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconLeaf,
  IconCalendar,
  IconEye,
  IconCheck,
  IconX,
  IconTarget,
  IconChartBar,
} from '@tabler/icons-react';
import { useAnalisisImagen } from '../hook/useAgriculturaMchl';
import {
  ActionButtons,
  PaginationControls,
  usePagination,
} from '@rec-shell/rec-web-shared';
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

export function Listar() {
  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const [selectedAnalisis, setSelectedAnalisis] =
    useState<AnalisisImagenYOLO_DTO | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    OBTENER();
  }, []);

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
    searchFields: ['archivo'],
  });

  const openModal = (analisis: AnalisisImagenYOLO_DTO): void => {
    setSelectedAnalisis(analisis);
    setModalOpened(true);
  };

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
          <Title order={2}>Historial de Análisis </Title>
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
                <Table.Th>Deficiencias</Table.Th>
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
                      leftSection={
                        analisis.es_valido ? (
                          <IconCheck size={14} />
                        ) : (
                          <IconX size={14} />
                        )
                      }
                    >
                      {analisis.mensaje}
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
                              ({cantidad})
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
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="lg"
                      onClick={() => openModal(analisis)}
                    >
                      <IconEye size={18} />
                    </ActionIcon>
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

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={600}>Detalles del Análisis YOLO</Text>}
        size="xl"
      >
        {selectedAnalisis && (
          <Stack gap="md">
            <Image
              src={selectedAnalisis.imagenBase64}
              height={300}
              alt={selectedAnalisis.archivo}
              fit="contain"
            />

            <Divider />

            <Group>
              <Text fw={500}>Archivo:</Text>
              <Text>{selectedAnalisis.archivo}</Text>
            </Group>

            <Group>
              <Text fw={500}>Fecha:</Text>
              <Text>{formatDate(selectedAnalisis.fecha)}</Text>
            </Group>

            <Group>
              <Text fw={500}>Estado:</Text>
              <Badge
                color={getTipoAlertaColor(selectedAnalisis.tipo_alerta)}
                leftSection={
                  selectedAnalisis.es_valido ? (
                    <IconCheck size={14} />
                  ) : (
                    <IconX size={14} />
                  )
                }
              >
                {selectedAnalisis.mensaje}
              </Badge>
            </Group>

            <Divider />

            <Text fw={500} size="lg">
              Estadísticas Generales
            </Text>

            <SimpleGrid cols={2}>
              <Card withBorder padding="md">
                <Stack gap="xs">
                  <Group gap="xs">
                    <ThemeIcon color="blue" variant="light">
                      <IconTarget size={20} />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      Total Detecciones
                    </Text>
                  </Group>
                  <Text size="xl" fw={700}>
                    {selectedAnalisis.estadisticas.total_detecciones}
                  </Text>
                </Stack>
              </Card>

              <Card withBorder padding="md">
                <Stack gap="xs">
                  <Group gap="xs">
                    <ThemeIcon color="teal" variant="light">
                      <IconLeaf size={20} />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      Deficiencias Únicas
                    </Text>
                  </Group>
                  <Text size="xl" fw={700}>
                    {selectedAnalisis.estadisticas.deficiencias_unicas}
                  </Text>
                </Stack>
              </Card>

              <Card withBorder padding="md">
                <Stack gap="xs">
                  <Group gap="xs">
                    <ThemeIcon color="green" variant="light">
                      <IconChartBar size={20} />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      Confianza Promedio
                    </Text>
                  </Group>
                  <Text size="xl" fw={700}>
                    {selectedAnalisis.estadisticas.confianza_promedio.toFixed(
                      1
                    )}
                    %
                  </Text>
                </Stack>
              </Card>

              <Card withBorder padding="md">
                <Stack gap="xs">
                  <Group gap="xs">
                    <ThemeIcon color="orange" variant="light">
                      <IconChartBar size={20} />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      Confianza Máxima
                    </Text>
                  </Group>
                  <Text size="xl" fw={700}>
                    {selectedAnalisis.estadisticas.confianza_maxima.toFixed(1)}
                    %
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>

            <Divider />

            <Text fw={500} size="lg">
              Detecciones por Región
            </Text>

            <Stack gap="sm">
              {selectedAnalisis.detecciones.map((deteccion) => (
                <Paper key={deteccion.region} p="md" withBorder>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Badge size="lg" variant="filled" color="blue">
                        Región {deteccion.region}
                      </Badge>
                      <Badge
                        size="lg"
                        color={getConfianzaColor(deteccion.confianza)}
                      >
                        {deteccion.confianza.toFixed(1)}% confianza
                      </Badge>
                    </Group>

                    <Group>
                      <Text fw={500}>Deficiencia:</Text>
                      <Badge color="teal" variant="light">
                        {formatDeficiencia(deteccion.deficiencia)}
                      </Badge>
                    </Group>

                    <Group>
                      <Text fw={500} size="sm">
                        Área:
                      </Text>
                      <Text size="sm">
                        {deteccion.area.toLocaleString()} px²
                      </Text>
                    </Group>

                    <Group>
                      <Text fw={500} size="sm">
                        Ubicación:
                      </Text>
                      <Text size="sm" c="dimmed">
                        ({deteccion.ubicacion.x1}, {deteccion.ubicacion.y1}) →
                        ({deteccion.ubicacion.x2}, {deteccion.ubicacion.y2})
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            {selectedAnalisis.recomendaciones &&
              Object.keys(selectedAnalisis.recomendaciones).length > 0 && (
                <>
                  <Divider />
                  <Text fw={500} size="lg">
                    Recomendaciones
                  </Text>
                  <Paper p="md" withBorder bg="blue.0">
                    <Stack gap="xs">
                      {Object.entries(selectedAnalisis.recomendaciones).map(
                        ([key, value]) => (
                          <Group key={key}>
                            <Text tt="capitalize" fw={500}>
                              {key}:
                            </Text>
                            <Text>{String(value)}</Text>
                          </Group>
                        )
                      )}
                    </Stack>
                  </Paper>
                </>
              )}

            {selectedAnalisis.metadata && (
              <>
                <Divider />
                <Text fw={500} size="lg">
                  Metadata del Modelo
                </Text>
                <Paper p="md" withBorder>
                  <SimpleGrid cols={2}>
                    <div>
                      <Text size="sm" c="dimmed">
                        Modelo
                      </Text>
                      <Text fw={500}>{selectedAnalisis.metadata.modelo}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">
                        Versión
                      </Text>
                      <Text fw={500}>{selectedAnalisis.metadata.version}</Text>
                    </div>
                  </SimpleGrid>
                </Paper>
              </>
            )}
          </Stack>
        )}
      </Modal>
    </Box>
  );
}