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
  RingProgress,
  Image,
  ActionIcon,
  Box,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconRefresh,
  IconLeaf,
  IconCalendar,
  IconEye,
} from '@tabler/icons-react';
import { useAnalisisImagen } from '../hook/useAgriculturaMchl';
import { AnalisisImagenMCHLDTO } from '../../../types/dto';
import {
  ActionButtons,
  PaginationControls,
  usePagination,
} from '@rec-shell/rec-web-shared';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { getDeficienciaColor, getConfianzaColor } from '../../../utils/utils';

export function Listar() {
  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
  const [selectedAnalisis, setSelectedAnalisis] =
    useState<AnalisisImagenMCHLDTO | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    OBTENER();
  }, []);

 

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

  const openModal = (analisis: AnalisisImagenMCHLDTO): void => {
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
          <Title order={2}>Historial de Análisis de Imágenes</Title>
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
        {/* Ref paginacion Global - Controles de paginación */}
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

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={600}>Detalles del Análisis</Text>}
        size="lg"
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

            <Divider />

            <Stack gap="xs">
              <Text fw={500} size="lg">
                Diagnóstico
              </Text>
              <Group>
                <Text>Deficiencia detectada:</Text>
                <Badge
                  size="lg"
                  color={getDeficienciaColor(selectedAnalisis.deficiencia)}
                >
                  {selectedAnalisis.deficiencia}
                </Badge>
              </Group>
            </Stack>

            <Center>
              <RingProgress
                size={200}
                thickness={20}
                sections={[
                  {
                    value: selectedAnalisis.confianza,
                    color: getConfianzaColor(selectedAnalisis.confianza),
                  },
                ]}
                label={
                  <Center>
                    <Stack gap={0} align="center">
                      <Text size="xl" fw={700}>
                        {selectedAnalisis.confianza.toFixed(1)}%
                      </Text>
                      <Text size="xs" c="dimmed">
                        Confianza
                      </Text>
                    </Stack>
                  </Center>
                }
              />
            </Center>

            <Paper p="md" withBorder>
              <Text fw={500} mb="xs">
                Distribución de probabilidades:
              </Text>
              <Stack gap="xs">
                {Object.entries(selectedAnalisis.probabilidades).map(
                  ([nutriente, valor]) => (
                    <div key={nutriente}>
                      <Group justify="space-between" mb={4}>
                        <Text size="sm">{nutriente}</Text>
                        <Text size="sm" fw={500}>
                          {valor.toFixed(1)}%
                        </Text>
                      </Group>
                      <div
                        style={{
                          height: 8,
                          background: '#e9ecef',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${valor}%`,
                            background:
                              nutriente === selectedAnalisis.deficiencia
                                ? '#40c057'
                                : '#228be6',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </Stack>
            </Paper>

            {selectedAnalisis.recomendaciones &&
              Object.keys(selectedAnalisis.recomendaciones).length > 0 && (
                <>
                  <Divider />
                  <Stack gap="xs">
                    <Text fw={500} size="lg">
                      Recomendaciones
                    </Text>
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
                </>
              )}
          </Stack>
        )}
      </Modal>
    </Box>
  );
}