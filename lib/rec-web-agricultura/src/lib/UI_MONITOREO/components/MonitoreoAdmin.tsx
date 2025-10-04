import React, { useState, useEffect, useMemo } from 'react';
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
import { IconPlus, IconEdit, IconTrash, IconEye, IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { ParametroMonitoreo } from '../../types/model';
import { useParametrosMonitoreo, useParametrosMonitoreoCRUD } from '../hooks/useAgricultura';
import { DeleteConfirmModal, NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';

const ParametroModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  parametro?: ParametroMonitoreo;
  onSubmit: (data: any) => void;
  loading: boolean;
}> = ({ opened, onClose, parametro, onSubmit, loading }) => {
  
  const form = useForm({
    initialValues: {
      cultivoId: '',
      fechaMedicion: new Date(),
      humedadSuelo: 0,
      humedadAmbiente: 0,
      temperatura: 0,
      phSuelo: 0,
      precipitacionMm: 0,
      horasSol: 0,
      velocidadVientoKmh: 0,
      fuenteDatos: '',
      coordenadasGps: ''
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

  useEffect(() => {
    if (opened) {
      if (parametro) {
        form.setValues({
          cultivoId: parametro.cultivoId || '',
          fechaMedicion: parametro.fechaMedicion ? new Date(parametro.fechaMedicion) : new Date(),
          humedadSuelo: parametro.humedadSuelo,
          humedadAmbiente: parametro.humedadAmbiente,
          temperatura: parametro.temperatura,
          phSuelo: parametro.phSuelo,
          precipitacionMm: parametro.precipitacionMm,
          horasSol: parametro.horasSol,
          velocidadVientoKmh: parametro.velocidadVientoKmh,
          fuenteDatos: parametro.fuenteDatos || '',
          coordenadasGps: parametro.coordenadasGps || '',
        });
      } else {
        form.reset();
      }
    }
  }, [opened, parametro?.id]); 

  const handleSubmit = (values: any) => {
    const formData = {
      ...values,
      cultivo: { id: values.cultivoId }
    };
    console.log(formData);
    onSubmit(formData);
  };

  const cultivosOptions = useMemo(() => [
    { value: '1', label: 'Cacao Trinitario - Finca San Miguel' },
    { value: '2', label: 'Cacao Nacional - Finca El Dorado' },
    { value: '3', label: 'Cacao CCN-51 - Finca La Esperanza' }
  ], []);

  const fuentesOptions = useMemo(() => [
    { value: 'Sensor Automático', label: 'Sensor Automático' },
    { value: 'Medición Manual', label: 'Medición Manual' },
    { value: 'Estación Meteorológica', label: 'Estación Meteorológica' },
    { value: 'Satelital', label: 'Satelital' }
  ], []);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={parametro ? 'Editar Registro' : 'Nuevo Registro'}
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
              <TextInput
                label="Fecha Medición"
                type="date"
                {...form.getInputProps('fechaMedicion')}
                required
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

const DetalleParametroModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  parametro?: ParametroMonitoreo;
}> = ({ opened, onClose, parametro }) => {
  
  if (!parametro) return null;

  const formatValue = (value: number | undefined, unit: string) => {
    return value !== undefined ? `${value} ${unit}` : 'No registrado';
  };

  const MetricCard: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <Box
      p="md"
      style={{
        background: 'linear-gradient(135deg, rgba(34, 139, 230, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(34, 139, 230, 0.1)',
        transition: 'all 0.3s ease',
      }}      
    >
      <Flex direction="column" gap={4}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.5px' }}>
          {label}
        </Text>
        <Flex align="center" gap="xs">
          {icon}
          <Text size="lg" fw={700} style={{ color: '#228be6' }}>
            {value}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Detalle del Parámetro</Title>}
      size="lg"
      centered
    >
      <Stack gap="lg" pt="md">
        {/* Información General */}
        <Box>
          <Text size="sm" fw={700} mb="md" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
            Información General
          </Text>
          <Card 
            withBorder 
            p="lg"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 139, 230, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
              borderColor: 'rgba(34, 139, 230, 0.15)',
              borderRadius: '12px',
            }}
          >
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>Cultivo</Text>
                  <Text fw={600} size="md">{parametro.nombreCultivo}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>Ubicación</Text>
                  <Text fw={600} size="md">{parametro.ubicacionNombre}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>Fecha de Medición</Text>
                  <Text fw={600} size="md">{parametro.fechaMedicion}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap={4}>
                  <Text size="xs" c="dimmed" fw={600}>Fuente de Datos</Text>
                  <Badge variant="gradient" gradient={{ from: 'blue', to: 'violet' }} size="lg">
                    {parametro.fuenteDatos}
                  </Badge>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>
        </Box>

        {/* Mediciones Ambientales */}
        <Box>
          <Text size="sm" fw={700} mb="md" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
            Mediciones Ambientales
          </Text>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <MetricCard label="Temperatura" value={formatValue(parametro.temperatura, '°C')} />
            </Grid.Col>
            <Grid.Col span={6}>
              <MetricCard label="Humedad Ambiente" value={formatValue(parametro.humedadAmbiente, '%')} />
            </Grid.Col>
            <Grid.Col span={4}>
              <MetricCard label="Precipitación" value={formatValue(parametro.precipitacionMm, 'mm')} />
            </Grid.Col>
            <Grid.Col span={4}>
              <MetricCard label="Horas de Sol" value={formatValue(parametro.horasSol, 'h')} />
            </Grid.Col>
            <Grid.Col span={4}>
              <MetricCard label="Velocidad Viento" value={formatValue(parametro.velocidadVientoKmh, 'km/h')} />
            </Grid.Col>
          </Grid>
        </Box>

        {/* Mediciones del Suelo */}
        <Box>
          <Text size="sm" fw={700} mb="md" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
            Mediciones del Suelo
          </Text>
          <Grid gutter="md">
            <Grid.Col span={6}>
              <MetricCard label="Humedad del Suelo" value={formatValue(parametro.humedadSuelo, '%')} />
            </Grid.Col>
            <Grid.Col span={6}>
              <MetricCard label="pH del Suelo" value={formatValue(parametro.phSuelo, '')} />
            </Grid.Col>
          </Grid>
        </Box>

        {/* Coordenadas GPS */}
        {parametro.coordenadasGps && (
          <Box>
            <Text size="sm" fw={700} mb="md" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              Ubicación GPS
            </Text>
            <Card 
              withBorder 
              p="md"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 139, 230, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                borderColor: 'rgba(34, 139, 230, 0.15)',
                borderRadius: '12px',
              }}
            >
              <Text fw={600} size="md" style={{ fontFamily: 'monospace' }}>
                {parametro.coordenadasGps}
              </Text>
            </Card>
          </Box>
        )}
      </Stack>
    </Modal>
  );
};

export const MonitoreoAdmin: React.FC = () => {
  const { parametros, loading: loadingList, error, refetch } = useParametrosMonitoreo();
  const { 
    CREAR, 
    ACTUALIZAR, 
    ELIMINAR, 
    loading: loadingCRUD,
    clearError 
  } = useParametrosMonitoreoCRUD();

  const [modalOpened, setModalOpened] = useState(false);
  const [detalleModalOpened, setDetalleModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedParametro, setSelectedParametro] = useState<ParametroMonitoreo | undefined>();
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(parametros.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = parametros.slice(startIndex, endIndex);

  const notifications = useNotifications();

  const handleCreate = () => {
    setSelectedParametro(undefined);
    setEditMode(false);
    clearError();
    setModalOpened(true);
  };

  const handleEdit = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setEditMode(true);
    clearError();
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
    } catch (error: unknown) {
      console.error('Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteClick = (parametro: ParametroMonitoreo) => {
    setSelectedParametro(parametro);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedParametro) return;

    const success = await ELIMINAR(selectedParametro.id);
    if (success) {
      notifications.show({
        title: 'Éxito',
        message: 'Parámetro eliminado correctamente',
        color: 'green',
      });
      setDeleteModalOpened(false);
      refetch();
    } else {
      notifications.show({
        title: 'Error',
        message: 'No se pudo eliminar el parámetro',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      let result;
      
      if (editMode && selectedParametro) {
        result = await ACTUALIZAR(selectedParametro.id, data);
      } else {
        result = await CREAR(data);
      }

      if (result) {
        notifications.success(); 
        setModalOpened(false);
        refetch();
      } else {
        notifications.error(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          `No se pudo ${editMode ? 'actualizar' : 'crear'} el parámetro`
        ); 
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);   
    }
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    clearError();
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
              Registrar
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
                          onClick={() => handleDeleteClick(parametro)}
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
              No se encontraron registros
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

      {/* Modal genérico de confirmación para Eliminar */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedParametro ? `${selectedParametro.nombreCultivo} - ${selectedParametro.fechaMedicion}` : ""}
        itemType="parámetro de monitoreo"
      />
    </Container>
  );
};