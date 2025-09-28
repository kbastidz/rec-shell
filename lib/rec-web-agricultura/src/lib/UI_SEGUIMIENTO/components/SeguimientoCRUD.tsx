import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Group,
  ActionIcon,
  Text,
  Badge,
  Paper,
  Title,
  Stack,
  Alert,
  LoadingOverlay,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconEye, IconAlertCircle } from '@tabler/icons-react';
import { EstadoActividad } from '../../enums/Enums';
import { ActividadSeguimiento } from '../../types/model';
import { useActividadSeguimiento } from '../hooks/useSeguimiento';


const estadoColors: Record<EstadoActividad, string> = {
  [EstadoActividad.PENDIENTE]: 'blue',
  [EstadoActividad.OMITIDA]: 'yellow',
  [EstadoActividad.EJECUTADA]: 'green',
  //[EstadoActividad.CANCELADA]: 'red'
};


const estadoOptions = Object.values(EstadoActividad).map(estado => ({
  value: estado,
  label: estado.replace('_', ' ')
}));

export const SeguimientoCRUD: React.FC = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [editingActividad, setEditingActividad] = useState<ActividadSeguimiento | null>(null);
  const [viewingActividad, setViewingActividad] = useState<ActividadSeguimiento | null>(null);

  const {
    actividades,
    loading,
    error,
    crearActividad,
    obtenerTodasLasActividades,
    actualizarActividad,
    eliminarActividad,
    clearError
  } = useActividadSeguimiento();

  const form = useForm<Partial<ActividadSeguimiento>>({
    initialValues: {
      planTratamiento: undefined,
      nombreActividad: '',
      descripcion: '',
      fechaProgramada: '',
      estado: EstadoActividad.PENDIENTE,
      resultadoActividad: '',
      costoReal: undefined,
      responsable: '',
      recordatorioEnviado: false
    },
    validate: {
      planTratamiento: (value) => (!value ? 'El plan de tratamiento es requerido' : null),
      nombreActividad: (value) => (!value ? 'El nombre es requerido' : null),
      fechaProgramada: (value) => (!value ? 'La fecha programada es requerida' : null),
      estado: (value) => (!value ? 'El estado es requerido' : null)
    }
  });

  useEffect(() => {
    obtenerTodasLasActividades();
  }, []);

  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: error,
        color: 'red',
        icon: <IconAlertCircle size={16} />
      });
      clearError();
    }
  }, [error, clearError]);

  const handleOpenModal = (actividad?: ActividadSeguimiento) => {
    if (actividad) {
      setEditingActividad(actividad);
      form.setValues({
        planTratamiento: actividad.planTratamiento,
        nombreActividad: actividad.nombreActividad,
        descripcion: actividad.descripcion || '',
        fechaProgramada: actividad.fechaProgramada,
        estado: actividad.estado,
        resultadoActividad: actividad.resultadoActividad || '',
        costoReal: actividad.costoReal,
        responsable: actividad.responsable || '',
        recordatorioEnviado: actividad.recordatorioEnviado
      });
    } else {
      setEditingActividad(null);
      form.reset();
    }
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingActividad(null);
    form.reset();
  };

  const handleSubmit = async (values: Partial<ActividadSeguimiento>) => {
    try {
      if (editingActividad) {
        await actualizarActividad(editingActividad.id, {
          ...editingActividad,
          ...values
        } as ActividadSeguimiento);
        notifications.show({
          title: 'Éxito',
          message: 'Actividad actualizada correctamente',
          color: 'green'
        });
      } else {
        await crearActividad(values as ActividadSeguimiento);
        notifications.show({
          title: 'Éxito',
          message: 'Actividad creada correctamente',
          color: 'green'
        });
      }
      handleCloseModal();
      obtenerTodasLasActividades();
    } catch (error) {
      console.error('Error al guardar actividad:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await eliminarActividad(id);
        notifications.show({
          title: 'Éxito',
          message: 'Actividad eliminada correctamente',
          color: 'green'
        });
        obtenerTodasLasActividades();
      } catch (error) {
        console.error('Error al eliminar actividad:', error);
      }
    }
  };

  const handleViewDetails = (actividad: ActividadSeguimiento) => {
    setViewingActividad(actividad);
    setDetailModalOpened(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <Container size="xl" py="md">
      <Paper p="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>Gestión de Actividades de Seguimiento</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => handleOpenModal()}
            loading={loading}
          >
            Nueva Actividad
          </Button>
        </Group>

        <Box pos="relative">
          <LoadingOverlay visible={loading} />
          
          {actividades.length === 0 ? (
            <Alert icon={<IconAlertCircle size={16} />} title="Sin datos">
              No hay actividades registradas
            </Alert>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Plan</Table.Th>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Fecha Programada</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Responsable</Table.Th>
                  <Table.Th>Costo Real</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {actividades.map((actividad) => (
                  <Table.Tr key={actividad.id}>
                    <Table.Td>
                      <Text size="sm">{actividad.planTratamiento?.tratamiento?.nombreTratamiento || 'Sin plan'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{actividad.nombreActividad}</Text>
                    </Table.Td>
                    <Table.Td>{formatDate(actividad.fechaProgramada)}</Table.Td>
                    <Table.Td>
                      <Badge color={estadoColors[actividad.estado]} variant="light">
                        {actividad.estado.replace('_', ' ')}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{actividad.responsable || '-'}</Table.Td>
                    <Table.Td>
                      {actividad.costoReal ? `$${actividad.costoReal.toLocaleString()}` : '-'}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleViewDetails(actividad)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="yellow"
                          onClick={() => handleOpenModal(actividad)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(actividad.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Paper>

      {/* Modal para Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingActividad ? 'Editar Actividad' : 'Nueva Actividad'}
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Select
              label="Plan de Tratamiento"
              placeholder="Seleccione un plan de tratamiento"
              data={[
                { value: '1', label: 'Plan de Fertilización Orgánica 2024' },
              ]} // Aquí necesitas cargar los planes de tratamiento disponibles
              {...form.getInputProps('planTratamiento')}
              required
              searchable
            />

            <TextInput
              label="Nombre de la Actividad"
              placeholder="Ingrese el nombre de la actividad"
              {...form.getInputProps('nombreActividad')}
              required
            />

            <Textarea
              label="Descripción"
              placeholder="Ingrese la descripción (opcional)"
              {...form.getInputProps('descripcion')}
              autosize
              minRows={3}
            />

            <TextInput
              label="Fecha Programada"
              type="date"
              {...form.getInputProps('fechaProgramada')}
              required
            />

            <Select
              label="Estado"
              placeholder="Seleccione el estado"
              data={estadoOptions}
              {...form.getInputProps('estado')}
              required
            />

            <Textarea
              label="Resultado de la Actividad"
              placeholder="Ingrese el resultado (opcional)"
              {...form.getInputProps('resultadoActividad')}
              autosize
              minRows={2}
            />

            <NumberInput
              label="Costo Real"
              placeholder="Ingrese el costo real"
              {...form.getInputProps('costoReal')}
              min={0}
              decimalScale={2}
              prefix="$"
            />

            <TextInput
              label="Responsable"
              placeholder="Ingrese el responsable"
              {...form.getInputProps('responsable')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {editingActividad ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal para Ver Detalles */}
      <Modal
        opened={detailModalOpened}
        onClose={() => setDetailModalOpened(false)}
        title="Detalles de la Actividad"
        size="md"
      >
        {viewingActividad && (
          <Stack gap="md">
            <Group>
              <Text fw={500}>Plan de Tratamiento:</Text>
              <Text>{viewingActividad.planTratamiento?.tratamiento?.nombreTratamiento || 'Sin plan asignado'}</Text>
            </Group>

            <Group>
              <Text fw={500}>Nombre:</Text>
              <Text>{viewingActividad.nombreActividad}</Text>
            </Group>

            {viewingActividad.descripcion && (
              <Group align="flex-start">
                <Text fw={500}>Descripción:</Text>
                <Text>{viewingActividad.descripcion}</Text>
              </Group>
            )}

            <Group>
              <Text fw={500}>Fecha Programada:</Text>
              <Text>{formatDate(viewingActividad.fechaProgramada)}</Text>
            </Group>

            {viewingActividad.fechaEjecutada && (
              <Group>
                <Text fw={500}>Fecha Ejecutada:</Text>
                <Text>{formatDate(viewingActividad.fechaEjecutada)}</Text>
              </Group>
            )}

            <Group>
              <Text fw={500}>Estado:</Text>
              <Badge color={estadoColors[viewingActividad.estado]} variant="light">
                {viewingActividad.estado.replace('_', ' ')}
              </Badge>
            </Group>

            {viewingActividad.resultadoActividad && (
              <Group align="flex-start">
                <Text fw={500}>Resultado:</Text>
                <Text>{viewingActividad.resultadoActividad}</Text>
              </Group>
            )}

            {viewingActividad.costoReal && (
              <Group>
                <Text fw={500}>Costo Real:</Text>
                <Text>${viewingActividad.costoReal.toLocaleString()}</Text>
              </Group>
            )}

            {viewingActividad.responsable && (
              <Group>
                <Text fw={500}>Responsable:</Text>
                <Text>{viewingActividad.responsable}</Text>
              </Group>
            )}

            <Group>
              <Text fw={500}>Recordatorio Enviado:</Text>
              <Badge color={viewingActividad.recordatorioEnviado ? 'green' : 'gray'}>
                {viewingActividad.recordatorioEnviado ? 'Sí' : 'No'}
              </Badge>
            </Group>

            {viewingActividad.fechaCreacion && (
              <Group>
                <Text fw={500}>Fecha de Creación:</Text>
                <Text>{formatDate(viewingActividad.fechaCreacion)}</Text>
              </Group>
            )}
          </Stack>
        )}
      </Modal>
    </Container>
  );
};