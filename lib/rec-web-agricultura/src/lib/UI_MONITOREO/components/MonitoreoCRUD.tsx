import React, { useState } from 'react';
import {
  Container,
  Title,
  Button,
  Table,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Group,
  Stack,
  ActionIcon,
  Badge,
  Card,
  Grid,
  LoadingOverlay,
  Alert,
  Pagination,
  Flex,
  Text,
  Tooltip,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconEye, IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { ParametroMonitoreo } from '../../types/model';
import { useParametrosMonitoreo, useParametrosMonitoreoCRUD } from '../../UI_MONITOREO/hooks/useMonitoreo';


// Modal para crear/editar parámetros
const ParametroModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  parametro?: ParametroMonitoreo;
  onSubmit: (data: any) => void;
  loading: boolean;
}> = ({ opened, onClose, parametro, onSubmit, loading }) => {
  
  const form = useForm({
    initialValues: {
      cultivoId: parametro?.cultivoId || '',
      fechaMedicion: parametro?.fechaMedicion ? new Date(parametro.fechaMedicion) : new Date(),
      humedadSuelo: parametro?.humedadSuelo || '',
      humedadAmbiente: parametro?.humedadAmbiente || '',
      temperatura: parametro?.temperatura || '',
      phSuelo: parametro?.phSuelo || '',
      precipitacionMm: parametro?.precipitacionMm || '',
      horasSol: parametro?.horasSol || '',
      velocidadVientoKmh: parametro?.velocidadVientoKmh || '',
      fuenteDatos: parametro?.fuenteDatos || '',
      coordenadasGps: parametro?.coordenadasGps || '',
    },
    validate: {
      cultivoId: (value) => (value ? null : 'Cultivo es requerido'),
      fuenteDatos: (value) => (value ? null : 'Fuente de datos es requerida'),
      temperatura: (value) => {
        if (typeof value === "number" && (value < -50 || value > 60)) {
          return 'Temperatura debe estar entre -50°C y 60°C';
        }
        return null;
      },
      humedadSuelo: (value) => {
        if (typeof value === "number" && (value < 0 || value > 100)) {
          return 'Humedad debe estar entre 0% y 100%';
        }
        return null;
      },
      humedadAmbiente: (value) => {
        if (typeof value === "number" && (value < 0 || value > 100)) {
          return 'Humedad debe estar entre 0% y 100%';
        }
        return null;
      },
      phSuelo: (value) => {
        if (typeof value === "number" && (value < 0 || value > 14)) {
          return 'pH debe estar entre 0 y 14';
        }
        return null;
      }
    }
  });

  // Resetear formulario cuando cambie el parámetro
  React.useEffect(() => {
    if (parametro) {
      form.setValues({
        cultivoId: parametro.cultivoId || '',
        fechaMedicion: parametro.fechaMedicion ? new Date(parametro.fechaMedicion) : new Date(),
        humedadSuelo: parametro.humedadSuelo || '',
        humedadAmbiente: parametro.humedadAmbiente || '',
        temperatura: parametro.temperatura || '',
        phSuelo: parametro.phSuelo || '',
        precipitacionMm: parametro.precipitacionMm || '',
        horasSol: parametro.horasSol || '',
        velocidadVientoKmh: parametro.velocidadVientoKmh || '',
        fuenteDatos: parametro.fuenteDatos || '',
        coordenadasGps: parametro.coordenadasGps || '',
      });
    } else {
      form.reset();
    }
  }, [parametro]);

  const handleSubmit = (values: any) => {
    const formData = {
      ...values,
      fechaMedicion: values.fechaMedicion.toISOString().split('T')[0],
    };
    onSubmit(formData);
  };

  // Opciones de ejemplo para cultivos - idealmente estos deberían venir de otro hook
  const cultivosOptions = [
    { value: '1', label: 'Cacao Trinitario - Finca San Miguel' },
    { value: '2', label: 'Cacao Nacional - Finca El Dorado' },
    { value: '3', label: 'Cacao CCN-51 - Finca La Esperanza' }
  ];

  const fuentesOptions = [
    { value: 'Sensor Automático', label: 'Sensor Automático' },
    { value: 'Medición Manual', label: 'Medición Manual' },
    { value: 'Estación Meteorológica', label: 'Estación Meteorológica' },
    { value: 'Satelital', label: 'Satelital' }
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3}>
          {parametro ? 'Editar Parámetro' : 'Nuevo Parámetro'}
        </Title>
      }
      size="lg"
      centered
    >
      <LoadingOverlay visible={loading} />
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Cultivo"
                placeholder="Seleccionar cultivo"
                data={cultivosOptions}
                searchable
                required
                {...form.getInputProps('cultivoId')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <DatePickerInput
                label="Fecha de Medición"
                placeholder="Seleccionar fecha"
                required
                {...form.getInputProps('fechaMedicion')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Humedad del Suelo (%)"
                placeholder="0-100"
                min={0}
                max={100}
                decimalScale={1}
                {...form.getInputProps('humedadSuelo')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Humedad Ambiente (%)"
                placeholder="0-100"
                min={0}
                max={100}
                decimalScale={1}
                {...form.getInputProps('humedadAmbiente')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Temperatura (°C)"
                placeholder="-50 a 60"
                min={-50}
                max={60}
                decimalScale={1}
                {...form.getInputProps('temperatura')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="pH del Suelo"
                placeholder="0-14"
                min={0}
                max={14}
                decimalScale={1}
                {...form.getInputProps('phSuelo')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Precipitación (mm)"
                placeholder="0+"
                min={0}
                decimalScale={1}
                {...form.getInputProps('precipitacionMm')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Horas de Sol"
                placeholder="0-24"
                min={0}
                max={24}
                decimalScale={1}
                {...form.getInputProps('horasSol')}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Velocidad del Viento (km/h)"
                placeholder="0+"
                min={0}
                decimalScale={1}
                {...form.getInputProps('velocidadVientoKmh')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Fuente de Datos"
                placeholder="Seleccionar fuente"
                data={fuentesOptions}
                required
                {...form.getInputProps('fuenteDatos')}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Coordenadas GPS"
            placeholder="lat,lng (ej: -2.1894,-79.8965)"
            {...form.getInputProps('coordenadasGps')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {parametro ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </Stack>
      </Box>     
    </Modal>
  );
};

// Modal para ver detalles
const DetalleParametroModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  parametro?: ParametroMonitoreo;
}> = ({ opened, onClose, parametro }) => {
  
  if (!parametro) return null;

  const formatValue = (value: number | undefined, unit: string) => {
    return value !== undefined ? `${value} ${unit}` : 'No registrado';
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Detalle del Parámetro</Title>}
      size="md"
      centered
    >
      <Stack gap="sm">
        <Card withBorder>
          <Stack gap="xs">
            <Text fw={500}>Información General</Text>
            <Text size="sm"><strong>Cultivo:</strong> {parametro.nombreCultivo}</Text>
            <Text size="sm"><strong>Ubicación:</strong> {parametro.ubicacionNombre}</Text>
            <Text size="sm"><strong>Fecha:</strong> {parametro.fechaMedicion}</Text>
            <Text size="sm"><strong>Fuente:</strong> {parametro.fuenteDatos}</Text>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="xs">
            <Text fw={500}>Mediciones Ambientales</Text>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Temperatura:</strong> {formatValue(parametro.temperatura, '°C')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Humedad Ambiente:</strong> {formatValue(parametro.humedadAmbiente, '%')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Precipitación:</strong> {formatValue(parametro.precipitacionMm, 'mm')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Horas de Sol:</strong> {formatValue(parametro.horasSol, 'h')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Viento:</strong> {formatValue(parametro.velocidadVientoKmh, 'km/h')}</Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="xs">
            <Text fw={500}>Mediciones del Suelo</Text>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Humedad:</strong> {formatValue(parametro.humedadSuelo, '%')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>pH:</strong> {formatValue(parametro.phSuelo, '')}</Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {parametro.coordenadasGps && (
          <Card withBorder>
            <Text fw={500}>Ubicación</Text>
            <Text size="sm"><strong>Coordenadas:</strong> {parametro.coordenadasGps}</Text>
          </Card>
        )}
      </Stack>
    </Modal>
  );
};

// Componente principal
export const MonitoreoCRUD: React.FC = () => {
  // Usar los hooks reales
  const { parametros, loading: loadingList, error, refetch } = useParametrosMonitoreo();
  const { 
    crearParametro, 
    actualizarParametro, 
    eliminarParametro, 
    loading: loadingCRUD,
    clearError 
  } = useParametrosMonitoreoCRUD();

  const [modalOpened, setModalOpened] = useState(false);
  const [detalleModalOpened, setDetalleModalOpened] = useState(false);
  const [selectedParametro, setSelectedParametro] = useState<ParametroMonitoreo | undefined>();
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Calcular paginación
  const totalPages = Math.ceil(parametros.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = parametros.slice(startIndex, endIndex);

  const handleCreate = () => {
    setSelectedParametro(undefined);
    setEditMode(false);
    clearError(); // Limpiar errores previos
    setModalOpened(true);
  };

  const handleEdit = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setEditMode(true);
    clearError(); // Limpiar errores previos
    setModalOpened(true);
  };

  const handleView = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setDetalleModalOpened(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      notifications.show({
        title: 'Datos actualizados',
        message: 'La información ha sido actualizada correctamente',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron actualizar los datos',
        color: 'red',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (parametro: ParametroMonitoreo) => {
    modals.openConfirmModal({
      title: 'Eliminar Parámetro',
      children: (
        <Text size="sm">
          ¿Estás seguro de que deseas eliminar este parámetro de monitoreo? 
          Esta acción no se puede deshacer.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        const success = await eliminarParametro(parametro.id);
        if (success) {
          notifications.show({
            title: 'Éxito',
            message: 'Parámetro eliminado correctamente',
            color: 'green',
          });
          refetch();
        } else {
          notifications.show({
            title: 'Error',
            message: 'No se pudo eliminar el parámetro',
            color: 'red',
          });
        }
      },
    });
  };

  const handleSubmit = async (data: any) => {
    try {
      let result;
      
      if (editMode && selectedParametro) {
        result = await actualizarParametro(selectedParametro.id, data);
      } else {
        result = await crearParametro(data);
      }

      if (result) {
        notifications.show({
          title: 'Éxito',
          message: `Parámetro ${editMode ? 'actualizado' : 'creado'} correctamente`,
          color: 'green',
        });
        setModalOpened(false);
        refetch();
      } else {
        // El error ya se maneja en el hook, solo mostrar notificación
        notifications.show({
          title: 'Error',
          message: `No se pudo ${editMode ? 'actualizar' : 'crear'} el parámetro`,
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      notifications.show({
        title: 'Error',
        message: `Error inesperado al ${editMode ? 'actualizar' : 'crear'} el parámetro`,
        color: 'red',
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    clearError(); // Limpiar errores al cerrar
  };

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
          <Group mt="md">
            <Button size="sm" variant="light" onClick={refetch}>
              Reintentar
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Title order={2}>Parámetros de Monitoreo</Title>
          <Group>
            <Tooltip label="Actualizar datos">
              <Button 
                variant="light" 
                leftSection={<IconRefresh size="1rem" />} 
                onClick={handleRefresh}
                loading={refreshing}
                aria-label="Actualizar"
                />
            </Tooltip>
            <Button leftSection={<IconPlus size="1rem" />} onClick={handleCreate}>
              Nuevo Parámetro
            </Button>
          </Group>
        </Flex>

        <Card withBorder>
          <LoadingOverlay visible={loadingList} />
          
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Cultivo</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Temperatura</Table.Th>
                <Table.Th>Humedad Suelo</Table.Th>
                <Table.Th>pH</Table.Th>
                <Table.Th>Fuente</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {currentItems.map((parametro) => (
                <Table.Tr key={parametro.id}>
                  <Table.Td>{parametro.nombreCultivo}</Table.Td>
                  <Table.Td>{parametro.fechaMedicion}</Table.Td>
                  <Table.Td>
                    {parametro.temperatura ? `${parametro.temperatura}°C` : '-'}
                  </Table.Td>
                  <Table.Td>
                    {parametro.humedadSuelo ? `${parametro.humedadSuelo}%` : '-'}
                  </Table.Td>
                  <Table.Td>
                    {parametro.phSuelo ? parametro.phSuelo : '-'}
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" size="sm">
                      {parametro.fuenteDatos}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <Tooltip label="Ver detalle">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="sm"
                          onClick={() => handleView(parametro)}
                        >
                          <IconEye size="1rem" />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Editar">
                        <ActionIcon
                          variant="light"
                          color="yellow"
                          size="sm"
                          onClick={() => handleEdit(parametro)}
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Eliminar">
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(parametro)}
                        >
                          <IconTrash size="1rem" />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {parametros.length === 0 && !loadingList && (
            <Text ta="center" py="xl" c="dimmed">
              No hay parámetros registrados
            </Text>
          )}

          {totalPages > 1 && (
            <Flex justify="center" mt="md">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
              />
            </Flex>
          )}
        </Card>
      </Stack>

      {/* Modal para crear/editar */}
      <ParametroModal
        opened={modalOpened}
        onClose={handleCloseModal}
        parametro={editMode ? selectedParametro : undefined}
        onSubmit={handleSubmit}
        loading={loadingCRUD}
      />

      {/* Modal para ver detalle */}
      <DetalleParametroModal
        opened={detalleModalOpened}
        onClose={() => setDetalleModalOpened(false)}
        parametro={selectedParametro}
      />
    </Container>
  );
};