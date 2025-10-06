import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  ColorInput,
  NumberInput,
  Switch,
  Group,
  Stack,
  ActionIcon,
  Badge,
  Text,
  Box,
  Loader,
  Center,
  Paper,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { CategoriaInput } from '../../types/dto';
import { CategoriaLogro } from '../../types/model';
import { useCategorias } from '../hooks/useCategorias';
import { DeleteConfirmModal } from '@rec-shell/rec-web-shared';

export function CategoriaAdmin() {
  const {
    todasLasCategorias,
    loading,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    refrescarTodasLasCategorias,
  } = useCategorias();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CategoriaLogro | null>(null);
  const [procesando, setProcesando] = useState(false);

  const form = useForm<CategoriaInput>({
    initialValues: {
      nombre: '',
      nombreMostrar: '',
      descripcion: '',
      urlIcono: '',
      color: '#228BE6',
      ordenClasificacion: 0,
      estaActivo: true,
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      nombreMostrar: (value) => (!value ? 'El nombre a mostrar es requerido' : null),
      ordenClasificacion: (value) => (value < 0 ? 'Debe ser mayor o igual a 0' : null),
    },
  });

  const abrirModalCrear = () => {
    form.reset();
    setCategoriaEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (categoria: any) => {
    form.setValues({
      nombre: categoria.nombre,
      nombreMostrar: categoria.nombreMostrar,
      descripcion: categoria.descripcion || '',
      urlIcono: categoria.urlIcono || '',
      color: categoria.color || '#228BE6',
      ordenClasificacion: categoria.ordenClasificacion,
      estaActivo: categoria.estaActivo,
    });
    setCategoriaEditar(categoria.id);
    setModalAbierto(true);
  };

  const abrirModalEliminar = (categoria: CategoriaLogro) => {
    setItemToDelete(categoria);
    setDeleteModalOpened(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpened(false);
    setItemToDelete(null);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const validacion = form.validate();
    if (validacion.hasErrors) return;

    setProcesando(true);
    try {
      if (categoriaEditar) {
        await ACTUALIZAR(categoriaEditar, form.values);
      } else {
        await CREAR(form.values);
      }
      setModalAbierto(false);
      await refrescarTodasLasCategorias();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setProcesando(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    
    setProcesando(true);
    try {
      await ELIMINAR(id);
      await refrescarTodasLasCategorias();
      closeDeleteModal();      
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setProcesando(false);
    }
  };

  if (loading && todasLasCategorias.length === 0) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Box p="md">
      <Paper shadow="sm" p="lg" radius="md">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Categorías</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={abrirModalCrear}
          >
            Registrar
          </Button>
        </Group>

        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Nombre Mostrar</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Color</Table.Th>
              <Table.Th>Orden</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {todasLasCategorias.map((categoria) => (
              <Table.Tr key={categoria.id}>
                <Table.Td>{categoria.nombre}</Table.Td>
                <Table.Td>{categoria.nombreMostrar}</Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={2}>
                    {categoria.descripcion || '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Box
                      w={20}
                      h={20}
                      style={{
                        backgroundColor: categoria.color || '#228BE6',
                        borderRadius: 4,
                      }}
                    />
                    <Text size="xs">{categoria.color}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{categoria.ordenClasificacion}</Table.Td>
                <Table.Td>
                  <Badge color={categoria.estaActivo ? 'green' : 'red'}>
                    {categoria.estaActivo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => abrirModalEditar(categoria)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => abrirModalEliminar(categoria)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {todasLasCategorias.length === 0 && (
          <Center p="xl">
            <Text c="dimmed">No hay categorías registradas</Text>
          </Center>
        )}
      </Paper>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={categoriaEditar ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Codigo de la Categoría"
            placeholder="nombre_categoria"
            required
            {...form.getInputProps('nombre')}
          />

          <TextInput
            label="Nombre de Categoria"
            placeholder="Categoría"
            required
            {...form.getInputProps('nombreMostrar')}
          />

          <Textarea
            label="Descripción"
            placeholder="Descripción de la categoría"
            minRows={3}
            {...form.getInputProps('descripcion')}
          />

          <TextInput
            label="URL del Ícono"
            placeholder="https://ejemplo.com/icono.png"
            {...form.getInputProps('urlIcono')}
          />

          <ColorInput
            label="Color"
            format="hex"
            {...form.getInputProps('color')}
          />

          <NumberInput
            label="Orden de Clasificación"
            placeholder="0"
            min={0}
            required
            {...form.getInputProps('ordenClasificacion')}
          />

          <Switch
            label="Estado Activo"
            {...form.getInputProps('estaActivo', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setModalAbierto(false)}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} loading={procesando}>
              {categoriaEditar ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(itemToDelete?.id || "")}
        itemName={itemToDelete?.nombreMostrar || ""}
        itemType="Categoría"
      />
    </Box>
  );
}