import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Table,
  Group,
  TextInput,
  Modal,
  Stack,
  Select,
  NumberInput,
  Badge,
  ActionIcon,
  Text,
  Loader,
  Alert,
  Flex,
  Card,
  Grid,
  Textarea,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconLeaf,
  IconMapPin,
} from '@tabler/icons-react';
import { useCultivos } from '../hooks/useAgricultura';
import { CultivoFormData } from '../../types/dto';
import {
  ActionButtons,
  DeleteConfirmModal,
  PaginationControls,
  usePagination,
} from '@rec-shell/rec-web-shared';

export const CultivosAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState<any>(null);
  const [cultivoAEliminar, setCultivoAEliminar] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [formData, setFormData] = useState<CultivoFormData>({
    nombreCultivo: '',
    variedadCacao: '',
    fechaSiembra: '',
    areaHectareas: 0,
    ubicacionNombre: '',
    latitud: 0,
    longitud: 0,
    altitud: 0,
    tipoSuelo: '',
    sistemaRiego: '',
    estadoCultivo: 'ACTIVO',
    notas: '',
  });

  const {
    cultivos,
    loading,
    error,
    areaTotalActiva,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    BUSCAR,
    fetchAreaTotalActiva,
    clearError,
  } = useCultivos();

  useEffect(() => {
    BUSCAR();
    if (fetchAreaTotalActiva) {
      fetchAreaTotalActiva();
    }
  }, []);

  const cultivosFiltrados = cultivos.filter(
    (c) =>
      c.nombreCultivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.variedadCacao?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.ubicacionNombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevo = () => {
    setModoEdicion(false);
    setCultivoSeleccionado(null);
    setFormData({
      nombreCultivo: '',
      variedadCacao: '',
      fechaSiembra: '',
      areaHectareas: 0,
      ubicacionNombre: '',
      latitud: 0,
      longitud: 0,
      altitud: 0,
      tipoSuelo: '',
      sistemaRiego: '',
      estadoCultivo: 'ACTIVO',
      notas: '',
    });
    open();
  };

  const handleEditar = (cultivo: any) => {
    setModoEdicion(true);
    setCultivoSeleccionado(cultivo);
    setFormData({
      nombreCultivo: cultivo.nombreCultivo || '',
      variedadCacao: cultivo.variedadCacao || '',
      fechaSiembra: cultivo.fechaSiembra || '',
      areaHectareas: cultivo.areaHectareas || 0,
      ubicacionNombre: cultivo.ubicacionNombre || '',
      latitud: cultivo.latitud || 0,
      longitud: cultivo.longitud || 0,
      altitud: cultivo.altitud || 0,
      tipoSuelo: cultivo.tipoSuelo || '',
      sistemaRiego: cultivo.sistemaRiego || '',
      estadoCultivo: cultivo.estadoCultivo || 'ACTIVO',
      notas: cultivo.notas || '',
    });
    open();
  };

  const handleEliminar = (cultivo: any) => {
    setCultivoAEliminar(cultivo);
    setDeleteOpened(true);
  };

  const confirmarEliminacion = async () => {
    if (cultivoAEliminar) {
      setEliminando(true);
      try {
        await ELIMINAR(cultivoAEliminar.id);
        if (fetchAreaTotalActiva) {
          await fetchAreaTotalActiva();
        }
        setDeleteOpened(false);
        setCultivoAEliminar(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setEliminando(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (modoEdicion && cultivoSeleccionado) {
        await ACTUALIZAR(cultivoSeleccionado.id, formData as any);
      } else {
        await CREAR(formData as any);
      }
      if (fetchAreaTotalActiva) {
        await fetchAreaTotalActiva();
      }
      close();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      ACTIVO: 'green',
      INACTIVO: 'gray',
      COSECHADO: 'blue',
      SUSPENDIDO: 'red',
    };
    return <Badge color={colores[estado] || 'gray'}>{estado}</Badge>;
  };

  // Ref Paginacion Global
  const lista = Array.isArray(cultivosFiltrados) ? cultivosFiltrados : [];
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
    searchFields: [
      'nombreCultivo',
      'variedadCacao',
      'areaHectareas',
      'ubicacionNombre',
    ],
  });

  return (
    <Box p="md">
      <Stack gap="lg">
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            withCloseButton
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        <Flex justify="space-between" align="center" mb="lg">
          <Title order={2}>Gestión de Cultivos</Title>
          <ActionButtons.Modal onClick={handleNuevo} loading={loading} />
        </Flex>
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Text size="sm" c="dimmed">
                Área Total Activa
              </Text>
              <Text size="xl" fw={700}>
                {areaTotalActiva ? areaTotalActiva.toFixed(2) : '0.00'} ha
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        
          {loading ? (
            <Flex justify="center" align="center" py="xl">
              <Loader size="lg" />
            </Flex>
          ) : cultivosFiltrados.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              {searchTerm
                ? 'No se encontraron resultados para tu búsqueda'
                : 'No se encontraron registros'}
            </Text>
          ) : (
             <Card shadow="sm" p="lg">
               <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Variedad Cacao</Table.Th>
                    <Table.Th>Área (ha)</Table.Th>
                    <Table.Th>Ubicación</Table.Th>
                    <Table.Th>Fecha Siembra</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedData.map((cultivo) => (
                    <Table.Tr key={cultivo.id}>
                      <Table.Td>
                        <Text fw={500}>{cultivo.nombreCultivo}</Text>
                      </Table.Td>
                      <Table.Td>{cultivo.variedadCacao || '-'}</Table.Td>
                      <Table.Td>
                        {cultivo.areaHectareas?.toFixed(2) || '0.00'}
                      </Table.Td>
                      <Table.Td>
                        {cultivo.ubicacionNombre ? (
                          <Group gap="xs">
                            <IconMapPin size={14} />
                            <Text size="sm">{cultivo.ubicacionNombre}</Text>
                          </Group>
                        ) : (
                          '-'
                        )}
                      </Table.Td>
                      <Table.Td>
                        {cultivo.fechaSiembra
                          ? new Date(cultivo.fechaSiembra).toLocaleDateString()
                          : '-'}
                      </Table.Td>
                      <Table.Td>
                        {getEstadoBadge(cultivo.estadoCultivo)}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleEditar(cultivo)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleEliminar(cultivo)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
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
              searchPlaceholder="Buscar por código, nombre o nutriente..."
            />
          )}
        
      </Stack>

      {/* Modal de Formulario */}
      <Modal
        opened={opened}
        onClose={close}
        title={modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
        size="90%"
      >
        <Stack gap="md">
          {/* Sección: Información Básica */}
          <Paper p="md" withBorder>
            <Text size="sm" fw={600} mb="sm" c="dimmed">
              INFORMACIÓN BÁSICA
            </Text>

            <Stack gap="sm">
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Nombre del Cultivo"
                    placeholder="Ej: Cacao Nacional"
                    required
                    value={formData.nombreCultivo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreCultivo: e.currentTarget.value,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Variedad de Cacao"
                    placeholder="Ej: CCN-51, Nacional Fino"
                    value={formData.variedadCacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        variedadCacao: e.currentTarget.value,
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <NumberInput
                    label="Área (hectáreas)"
                    placeholder="0.0"
                    required
                    min={0}
                    step={0.1}
                    decimalScale={2}
                    value={formData.areaHectareas}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        areaHectareas: typeof val === 'number' ? val : 0,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <TextInput
                    label="Fecha de Siembra"
                    type="date"
                    required
                    value={formData.fechaSiembra}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaSiembra: e.currentTarget.value,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Estado del Cultivo"
                    required
                    value={formData.estadoCultivo}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        estadoCultivo: val || 'ACTIVO',
                      })
                    }
                    data={[
                      { value: 'ACTIVO', label: 'Activo' },
                      { value: 'INACTIVO', label: 'Inactivo' },
                      { value: 'COSECHADO', label: 'Cosechado' },
                    ]}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>

          {/* Sección: Ubicación */}
          <Paper p="md" withBorder>
            <Text size="sm" fw={600} mb="sm" c="dimmed">
              UBICACIÓN
            </Text>
            <Stack gap="sm">
              <TextInput
                label="Nombre de Ubicación"
                placeholder="Ej: Parcela Norte, Lote 5"
                value={formData.ubicacionNombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ubicacionNombre: e.currentTarget.value,
                  })
                }
              />

              <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <NumberInput
                    label="Latitud"
                    placeholder="-2.1234"
                    step={0.000001}
                    decimalScale={6}
                    value={formData.latitud}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        latitud: typeof val === 'number' ? val : 0,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <NumberInput
                    label="Longitud"
                    placeholder="-79.1234"
                    step={0.000001}
                    decimalScale={6}
                    value={formData.longitud}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        longitud: typeof val === 'number' ? val : 0,
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <NumberInput
                    label="Altitud (m)"
                    placeholder="500"
                    min={0}
                    value={formData.altitud}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        altitud: typeof val === 'number' ? val : undefined,
                      })
                    }
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>

          {/* Sección: Características del Terreno */}
          <Paper p="md" withBorder>
            <Text size="sm" fw={600} mb="sm" c="dimmed">
              CARACTERÍSTICAS DEL TERRENO
            </Text>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Tipo de Suelo"
                  placeholder="Seleccione tipo de suelo"
                  value={formData.tipoSuelo}
                  onChange={(val) =>
                    setFormData({ ...formData, tipoSuelo: val || '' })
                  }
                  data={[
                    { value: 'ARCILLOSO', label: 'Arcilloso' },
                    { value: 'ARENOSO', label: 'Arenoso' },
                    { value: 'LIMOSO', label: 'Limoso' },
                    { value: 'FRANCO', label: 'Franco' },
                    { value: 'HUMIFERO', label: 'Humífero' },
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Sistema de Riego"
                  placeholder="Seleccione sistema"
                  value={formData.sistemaRiego}
                  onChange={(val) =>
                    setFormData({ ...formData, sistemaRiego: val || '' })
                  }
                  data={[
                    { value: 'GOTEO', label: 'Goteo' },
                    { value: 'ASPERSION', label: 'Aspersión' },
                    { value: 'GRAVEDAD', label: 'Gravedad' },
                    { value: 'MICROASPERSION', label: 'Microaspersión' },
                    { value: 'NATURAL', label: 'Natural (lluvia)' },
                  ]}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Sección: Observaciones */}
          <Paper p="md" withBorder>
            <Text size="sm" fw={600} mb="sm" c="dimmed">
              OBSERVACIONES
            </Text>
            <Textarea
              label="Notas"
              placeholder="Observaciones adicionales sobre el cultivo..."
              minRows={3}
              value={formData.notas}
              onChange={(e) =>
                setFormData({ ...formData, notas: e.currentTarget.value })
              }
            />
          </Paper>

          {/* Botones de Acción */}
          <Group justify="center" mt="md">
            <ActionButtons.Cancel onClick={close} />
            <ActionButtons.Save onClick={handleSubmit} loading={loading} />
          </Group>
        </Stack>
      </Modal>

      {/* Modal Generico de Eliminación */}
      <DeleteConfirmModal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        onConfirm={confirmarEliminacion}
        itemName={cultivoAEliminar?.nombreCultivo || ''}
        itemType="registro"
      />
    </Box>
  );
};
