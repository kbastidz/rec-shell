import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Table,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Group,
  ActionIcon,
  Stack,
  Paper,
  LoadingOverlay,
  Text,
  Alert,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { useTratamientos } from '../hooks/useAgricultura';
import { Tratamiento } from '../../types/model';
import { DeleteConfirmModal } from '@rec-shell/rec-web-shared';


export  function TratamientosAdmin() {
  const { tratamientos, loading, error, CREAR, ACTUALIZAR, ELIMINAR, BUSCAR } = useTratamientos();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingTratamiento, setDeletingTratamiento] = useState<Tratamiento | null>(null);
  

  const form = useForm({
    initialValues: {
      nombreTratamiento: '',
      tipoTratamiento: '',
      descripcion: '',
      dosisRecomendada: '',
      frecuenciaAplicacion: '',
      tiempoEfectividadDias: 0,
      costoEstimadoPorHectarea: 0,
      activo: true,
    },
    validate: {
      nombreTratamiento: (value) => (!value ? 'El nombre es requerido' : null),
      dosisRecomendada: (value) => (!value ? 'La dosis es requerida' : null),
    },
  });

  useEffect(() => {
    BUSCAR();
  }, [BUSCAR]);

  const handleOpenModal = (tratamiento: Tratamiento | null = null) => {
    if (tratamiento) {
      setEditingId(tratamiento.id);
      form.setValues({
        nombreTratamiento: tratamiento.nombreTratamiento,
        tipoTratamiento: tratamiento.tipoTratamiento || '',
        descripcion: tratamiento.descripcion || '',
        dosisRecomendada: tratamiento.dosisRecomendada || '',
        frecuenciaAplicacion: tratamiento.frecuenciaAplicacion || '',
        tiempoEfectividadDias: tratamiento.tiempoEfectividadDias || 0,
        costoEstimadoPorHectarea: tratamiento.costoEstimadoPorHectarea || 0,
        activo: tratamiento.activo,
      });
    } else {
      setEditingId(null);
      form.reset();
    }
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingId(null);
    form.reset();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (editingId) {
        await ACTUALIZAR(editingId, values);
      } else {
        await CREAR(values);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ELIMINAR(id);
      setDeletingTratamiento(null);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <Box p="md">
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Tratamientos</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => handleOpenModal()}
          >
            Registrar
          </Button>
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} />
          
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Dosis</Table.Th>
                <Table.Th>Frecuencia</Table.Th>
                <Table.Th>Días Efectividad</Table.Th>
                <Table.Th>Costo/Ha</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tratamientos.map((tratamiento) => (
                <Table.Tr key={tratamiento.id}>
                  <Table.Td>{tratamiento.nombreTratamiento}</Table.Td>
                  <Table.Td>{tratamiento.tipoTratamiento || '-'}</Table.Td>
                  <Table.Td>{tratamiento.dosisRecomendada}</Table.Td>
                  <Table.Td>{tratamiento.frecuenciaAplicacion || '-'}</Table.Td>
                  <Table.Td>{tratamiento.tiempoEfectividadDias || '-'}</Table.Td>
                  <Table.Td>${tratamiento.costoEstimadoPorHectarea?.toFixed(2) || '0.00'}</Table.Td>
                  <Table.Td>
                    <Text c={tratamiento.activo ? 'green' : 'red'} fw={500}>
                      {tratamiento.activo ? 'Activo' : 'Inactivo'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleOpenModal(tratamiento)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => setDeletingTratamiento(tratamiento)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {tratamientos.length === 0 && !loading && (
            <Text ta="center" py="xl" c="dimmed">
              No se encontraron registros
            </Text>
          )}
        </div>
      </Paper>

      {/* Modal Crear/Editar */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre del Tratamiento"
            placeholder="Ej: Fertilizante NPK"
            required
            {...form.getInputProps('nombreTratamiento')}
          />

          <TextInput
            label="Tipo de Tratamiento"
            placeholder="Ej: Fertilizante, Fungicida"
            {...form.getInputProps('tipoTratamiento')}
          />

          <Textarea
            label="Descripción"
            placeholder="Describe el tratamiento..."
            minRows={3}
            {...form.getInputProps('descripcion')}
          />

          <TextInput
            label="Dosis Recomendada"
            placeholder="Ej: 200 kg/ha"
            required
            {...form.getInputProps('dosisRecomendada')}
          />

          <TextInput
            label="Frecuencia de Aplicación"
            placeholder="Ej: Cada 30 días"
            {...form.getInputProps('frecuenciaAplicacion')}
          />

          <NumberInput
            label="Tiempo de Efectividad (días)"
            placeholder="30"
            min={0}
            {...form.getInputProps('tiempoEfectividadDias')}
          />

          <NumberInput
            label="Costo Estimado por Hectárea"
            placeholder="0.00"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            prefix="$ "
            {...form.getInputProps('costoEstimadoPorHectarea')}
          />

          <Switch
            label="Tratamiento Activo"
            {...form.getInputProps('activo', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit(form.values)} loading={loading}>
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal Confirmación Eliminar */}
      <DeleteConfirmModal
        opened={deletingTratamiento !== null}
        onClose={() => setDeletingTratamiento(null)}
        onConfirm={async () => {
          if (deletingTratamiento) {
            await handleDelete(deletingTratamiento.id);
          }
        }}
        itemName={deletingTratamiento?.nombreTratamiento || "Registro"}
      />

    </Box>
  );
}