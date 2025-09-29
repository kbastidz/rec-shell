import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Table,
  ActionIcon,
  Group,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Switch,
  Paper,
  Badge,
  Loader,
  Text,
  Stack,
  rem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconPlus, IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { useMedidaPreventiva } from '../hooks/useMedidaPreventiva';
import { MedidaPreventiva } from '../../types/model';
import { MedidaPreventivaInput } from '../services/agricultura.service';

export const MedidaCRUD = () => {

  const {
    medidas,
    loading,
    error,
    crearMedidaPreventiva,
    obtenerTodasLasMedidas,
    actualizarMedida,
    eliminarMedida,
    activarMedida,
    desactivarMedida,
    clearError
  } = useMedidaPreventiva();

  const [modalOpened, setModalOpened] = useState(false);
  const [modalEliminarOpened, setModalEliminarOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [medidaSeleccionada, setMedidaSeleccionada] = useState<MedidaPreventiva | null>(null);

  const form = useForm<MedidaPreventivaInput>({
    initialValues: {
      titulo: '',
      descripcion: '',
      tipoMedida: '',
      frecuenciaRecomendada: '',
      temporadaAplicacion: '',
      costoEstimado: 0,
      efectividadPorcentaje: 0,
      activo: true
    },
    validate: {
      titulo: (value) => (!value ? 'El título es requerido' : null),
      descripcion: (value) => (!value ? 'La descripción es requerida' : null),
      efectividadPorcentaje: (value) => 
        value && (value < 0 || value > 100) ? 'Debe estar entre 0 y 100' : null
    }
  });

  useEffect(() => {
    cargarMedidas();
  }, []);

  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: error,
        color: 'red',
        icon: <IconX size={16} />
      });
      clearError();
    }
  }, [error]);

  const cargarMedidas = async () => {
    try {
      await obtenerTodasLasMedidas();
    } catch (error) {
      console.error('Error al cargar medidas:', error);
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setMedidaSeleccionada(null);
    form.reset();
    setModalOpened(true);
  };

  const abrirModalEditar = (medida: MedidaPreventiva) => {
    setModoEdicion(true);
    setMedidaSeleccionada(medida);
    form.setValues({
      titulo: medida.titulo,
      descripcion: medida.descripcion,
      tipoMedida: medida.tipoMedida || '',
      frecuenciaRecomendada: medida.frecuenciaRecomendada || '',
      temporadaAplicacion: medida.temporadaAplicacion || '',
      costoEstimado: medida.costoEstimado || 0,
      efectividadPorcentaje: medida.efectividadPorcentaje || 0,
      activo: medida.activo
    });
    setModalOpened(true);
  };

  const handleSubmit = async (values: MedidaPreventivaInput) => {
    try {
      if (modoEdicion && medidaSeleccionada) {
        await actualizarMedida(medidaSeleccionada.id, values);
        notifications.show({
          title: 'Éxito',
          message: 'Medida preventiva actualizada correctamente',
          color: 'green',
          icon: <IconCheck size={16} />
        });
      } else {
        await crearMedidaPreventiva(values);
        notifications.show({
          title: 'Éxito',
          message: 'Medida preventiva creada correctamente',
          color: 'green',
          icon: <IconCheck size={16} />
        });
      }
      setModalOpened(false);
      form.reset();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEliminar = async (id: number, titulo: string) => {
    try {
      await eliminarMedida(id);
      notifications.show({
        title: 'Éxito',
        message: 'Medida preventiva eliminada correctamente',
        color: 'green',
        icon: <IconCheck size={16} />
      });
      setModalEliminarOpened(false);
      setMedidaSeleccionada(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const abrirModalEliminar = (medida: MedidaPreventiva) => {
    setMedidaSeleccionada(medida);
    setModalEliminarOpened(true);
  };

  const handleToggleActivo = async (medida: MedidaPreventiva) => {
    try {
      if (medida.activo) {
        await desactivarMedida(medida.id);
        notifications.show({
          title: 'Éxito',
          message: 'Medida preventiva desactivada',
          color: 'blue',
          icon: <IconCheck size={16} />
        });
      } else {
        await activarMedida(medida.id);
        notifications.show({
          title: 'Éxito',
          message: 'Medida preventiva activada',
          color: 'blue',
          icon: <IconCheck size={16} />
        });
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const tiposMedida = [
    { value: 'PREVENTIVA', label: 'Preventiva' },
    { value: 'CORRECTIVA', label: 'Correctiva' },
    { value: 'CULTURAL', label: 'Cultural' },
    { value: 'QUIMICA', label: 'Química' },
    { value: 'BIOLOGICA', label: 'Biológica' }
  ];

  const temporadas = [
    { value: 'PRIMAVERA', label: 'Primavera' },
    { value: 'VERANO', label: 'Verano' },
    { value: 'OTOÑO', label: 'Otoño' },
    { value: 'INVIERNO', label: 'Invierno' },
    { value: 'TODO_AÑO', label: 'Todo el año' }
  ];

  if (loading && medidas.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Medidas Preventivas</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={abrirModalCrear}>
          Nueva Medida
        </Button>
      </Group>

      <Paper shadow="sm" p="md" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Efectividad</Table.Th>
              <Table.Th>Costo Estimado</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {medidas.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed">
                    No hay medidas preventivas registradas
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              medidas.map((medida) => (
                <Table.Tr key={medida.id}>
                  <Table.Td>
                    <Text fw={500}>{medida.titulo}</Text>
                    <Text size="xs" c="dimmed">
                      {medida.descripcion.substring(0, 60)}...
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue">
                      {medida.tipoMedida || 'N/A'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {medida.efectividadPorcentaje ? `${medida.efectividadPorcentaje}%` : 'N/A'}
                  </Table.Td>
                  <Table.Td>
                    {medida.costoEstimado 
                      ? `$${medida.costoEstimado.toFixed(2)}` 
                      : 'N/A'}
                  </Table.Td>
                  <Table.Td>
                    <Switch
                      checked={medida.activo}
                      onChange={() => handleToggleActivo(medida)}
                      color="green"
                      label={medida.activo ? 'Activo' : 'Inactivo'}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => abrirModalEditar(medida)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => abrirModalEliminar(medida)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal para Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={modoEdicion ? 'Editar Medida Preventiva' : 'Nueva Medida Preventiva'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Título"
              placeholder="Ingrese el título"
              required
              {...form.getInputProps('titulo')}
            />

            <Textarea
              label="Descripción"
              placeholder="Ingrese la descripción"
              required
              minRows={3}
              {...form.getInputProps('descripcion')}
            />

            <Select
              label="Tipo de Medida"
              placeholder="Seleccione el tipo"
              data={tiposMedida}
              clearable
              {...form.getInputProps('tipoMedida')}
            />

            <TextInput
              label="Frecuencia Recomendada"
              placeholder="Ej: Semanal, Mensual, etc."
              {...form.getInputProps('frecuenciaRecomendada')}
            />

            <Select
              label="Temporada de Aplicación"
              placeholder="Seleccione la temporada"
              data={temporadas}
              clearable
              {...form.getInputProps('temporadaAplicacion')}
            />

            <NumberInput
              label="Costo Estimado"
              placeholder="0.00"
              prefix="$"
              decimalScale={2}
              min={0}
              {...form.getInputProps('costoEstimado')}
            />

            <NumberInput
              label="Efectividad (%)"
              placeholder="0-100"
              suffix="%"
              min={0}
              max={100}
              {...form.getInputProps('efectividadPorcentaje')}
            />

            <Switch
              label="Activo"
              {...form.getInputProps('activo', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setModalOpened(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {modoEdicion ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal
        opened={modalEliminarOpened}
        onClose={() => setModalEliminarOpened(false)}
        title="Confirmar Eliminación"
        centered
        size="md"
      >
        <Stack align="center" gap="lg">
          

          <Stack gap="xs" align="center">
            <Group gap="md">
              <IconAlertTriangle size={32} color="red" />
              <div>
                <Text fw={500}>¿Está seguro de eliminar este registro?</Text>
                <Text size="sm" c="dimmed">Esta acción no se puede deshacer.</Text>
              </div>
            </Group>
          </Stack>

          {medidaSeleccionada && (
            <Paper p="md" withBorder w="100%" bg="gray.0">
              <Stack gap="xs">
                <Group gap="xs">
                  <Text size="sm" fw={500}>Título:</Text>
                  <Text size="sm">{medidaSeleccionada.titulo}</Text>
                </Group>
                <Group gap="xs">
                  <Text size="sm" fw={500}>Tipo:</Text>
                  <Badge size="sm" variant="light" color="blue">
                    {medidaSeleccionada.tipoMedida || 'N/A'}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {medidaSeleccionada.descripcion}
                </Text>
              </Stack>
            </Paper>
          )}

          <Group justify="center" w="100%" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => setModalEliminarOpened(false)}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => medidaSeleccionada && handleEliminar(medidaSeleccionada.id, medidaSeleccionada.titulo)}
              loading={loading}
              fullWidth
              leftSection={<IconTrash size={16} />}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};