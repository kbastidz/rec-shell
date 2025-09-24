import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Button,
  Group,
  TextInput,
  Select,
  Grid,
  LoadingOverlay,
  Stack,
  Table,
  Badge,
  ActionIcon,
  Text,
  Flex,
  Card,
  Alert,
  Modal,
  Pagination
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconSearch,
  IconRefresh,
  IconMapPin,
  IconPlant,
  IconAlertCircle
} from '@tabler/icons-react';
import { useCultivos } from '../../hooks/useCultivos';
import { Cultivo, CultivoFilters } from '../../types/model';
import { EstadoCultivo } from '../../enums/Enums';
import { useCultivosNavigation } from '../../CultivosManager';



const VARIEDADES_CACAO = [
  'Trinitario',
  'Criollo',
  'Forastero',
  'Nacional',
  'CCN-51',
  'ICS-1',
  'ICS-6',
  'TSH-565'
];

export const ListarCultivos: React.FC = () => {
  
  const { navigateTo } = useCultivosNavigation();
  const [opened, { open, close }] = useDisclosure(false);
  const [cultivoAEliminar, setCultivoAEliminar] = useState<Cultivo | null>(null);
  const [filtros, setFiltros] = useState<CultivoFilters>({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const {
    cultivos,
    loading,
    error,
    areaTotalActiva,
    fetchCultivos,
    fetchAreaTotalActiva,
    eliminarCultivo,
    clearError,
    refetchCultivos
  } = useCultivos();

  useEffect(() => {
    fetchCultivos(filtros);
    fetchAreaTotalActiva();
  }, [filtros, page]);

 
const handleCrearCultivo = () => {
    navigateTo('crear');
  };

  const handleEditarCultivo = (id: string) => {
    navigateTo('editar', { id });
  };

  const handleVerDetalles = (id: string) => {
    navigateTo('detalle', { id });
  };

  const handleEliminarCultivo = (cultivo: Cultivo) => {
    setCultivoAEliminar(cultivo);
    open();
  };

  const confirmarEliminacion = async () => {
    if (cultivoAEliminar) {
      const exito = await eliminarCultivo(cultivoAEliminar.id);
      if (exito) {
        close();
        setCultivoAEliminar(null);
        refetchCultivos();
      }
    }
  };

  const handleFiltroChange = (campo: keyof CultivoFilters, valor: string | null | undefined) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor || undefined
    }));
    setPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros({});
    setPage(1);
  };

  const getEstadoBadgeColor = (estado: EstadoCultivo) => {
    switch (estado) {
      case EstadoCultivo.ACTIVO:
        return 'green';
      case EstadoCultivo.INACTIVO:
        return 'gray';
      case EstadoCultivo.COSECHADO:
        return 'blue';
      default:
        return 'gray';
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'Sin fecha';

    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  const cultivosActivos = cultivos.filter(c => c.estadoCultivo === EstadoCultivo.ACTIVO);
  const totalCultivos = cultivos.length;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header con estadísticas */}
        <Paper shadow="sm" p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Title order={2}>Gestión de Cultivos</Title>
              <Text size="sm" c="dimmed">
                Administra tus cultivos de cacao
              </Text>
            </div>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleCrearCultivo}
            >
              Nuevo Cultivo
            </Button>
          </Group>
        </Paper>

        {/* Cards de estadísticas */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" fw={500}>
                    Total Cultivos
                  </Text>
                  <Text fw={700} size="xl">
                    {totalCultivos}
                  </Text>
                </div>
                <IconPlant size={32} color="var(--mantine-color-green-6)" />
              </Group>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" fw={500}>
                    Cultivos Activos
                  </Text>
                  <Text fw={700} size="xl">
                    {cultivosActivos.length}
                  </Text>
                </div>
                <IconPlant size={32} color="var(--mantine-color-blue-6)" />
              </Group>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" fw={500}>
                    Área Total Activa
                  </Text>
                  <Text fw={700} size="xl">
                    {areaTotalActiva?.toFixed(2) || '0.00'} ha
                  </Text>
                </div>
                <IconMapPin size={32} color="var(--mantine-color-orange-6)" />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Filtros */}
        <Paper shadow="sm" p="md" withBorder>
          <Stack gap="md">
            <Text fw={500}>Filtros de búsqueda</Text>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Select
                  label="Estado"
                  placeholder="Todos los estados"
                  data={[
                    { value: EstadoCultivo.ACTIVO, label: 'Activo' },
                    { value: EstadoCultivo.INACTIVO, label: 'Inactivo' },
                    { value: EstadoCultivo.COSECHADO, label: 'Cosechado' }
                  ]}
                  value={filtros.estadoCultivo || ''}
                  onChange={(value) => handleFiltroChange('estadoCultivo', value)}
                  clearable
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Select
                  label="Variedad de Cacao"
                  placeholder="Todas las variedades"
                  data={VARIEDADES_CACAO}
                  value={filtros.variedadCacao || ''}
                  onChange={(value) => handleFiltroChange('variedadCacao', value)}
                  searchable
                  clearable
                />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 12, md: 4 }}>
                <Flex gap="sm" align="flex-end" h="100%">
                  <Button
                    variant="outline"
                    leftSection={<IconRefresh size={16} />}
                    onClick={refetchCultivos}
                  >
                    Actualizar
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={limpiarFiltros}
                  >
                    Limpiar Filtros
                  </Button>
                </Flex>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* Mensaje de error */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
            withCloseButton
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        {/* Tabla de cultivos */}
        <Paper shadow="sm" withBorder>
          <LoadingOverlay visible={loading} />
          
          {cultivos.length === 0 && !loading ? (
            <Stack align="center" gap="md" py="xl">
              <IconPlant size={64} color="var(--mantine-color-gray-4)" />
              <div style={{ textAlign: 'center' }}>
                <Text fw={500} size="lg">No hay cultivos registrados</Text>
                <Text c="dimmed" size="sm">
                  Comienza registrando tu primer cultivo
                </Text>
              </div>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={handleCrearCultivo}
              >
                Crear Primer Cultivo
              </Button>
            </Stack>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Cultivo</Table.Th>
                    <Table.Th>Variedad</Table.Th>
                    <Table.Th>Área (ha)</Table.Th>
                    <Table.Th>Ubicación</Table.Th>
                    <Table.Th>Fecha Siembra</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cultivos.map((cultivo) => (
                    <Table.Tr key={cultivo.id}>
                      <Table.Td>
                        <div>
                          <Text fw={500}>{cultivo.nombreCultivo}</Text>
                          <Text size="xs" c="dimmed">
                            ID: {cultivo.id}...
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>{cultivo.variedadCacao}</Table.Td>
                      <Table.Td>{cultivo.areaHectareas} ha</Table.Td>
                      <Table.Td>
                        <div>
                          <Text size="sm">{cultivo.ubicacionNombre}</Text>
                          <Text size="xs" c="dimmed">
                            {cultivo.latitud.toFixed(4)}, {cultivo.longitud.toFixed(4)}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>{formatearFecha(cultivo.fechaSiembra)}</Table.Td>
                      <Table.Td>
                        <Badge 
                          color={getEstadoBadgeColor(cultivo.estadoCultivo)}
                          variant="light"
                        >
                          {cultivo.estadoCultivo}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleVerDetalles(cultivo.id)}
                            title="Ver detalles"
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="orange"
                            onClick={() => handleEditarCultivo(cultivo.id)}
                            title="Editar"
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleEliminarCultivo(cultivo)}
                            title="Eliminar"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>

        {/* Paginación */}
        {cultivos.length > 0 && (
          <Group justify="center">
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.ceil(totalCultivos / limit)}
            />
          </Group>
        )}
      </Stack>

      {/* Modal de confirmación de eliminación */}
      <Modal
        opened={opened}
        onClose={close}
        title="Confirmar eliminación"
        centered
      >
        <Stack gap="md">
          <Text>
            ¿Está seguro que desea eliminar el cultivo{' '}
            <strong>{cultivoAEliminar?.nombreCultivo}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            Esta acción no se puede deshacer.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>
              Cancelar
            </Button>
            <Button color="red" onClick={confirmarEliminacion} loading={loading}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};