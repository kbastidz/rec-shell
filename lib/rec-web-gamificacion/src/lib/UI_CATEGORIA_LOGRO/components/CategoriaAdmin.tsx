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
import { useCategorias } from '../hooks/useGamificacion';
import { ActionButtons, DeleteConfirmModal, PaginatedTable } from '@rec-shell/rec-web-shared';

export function CategoriaAdmin() {
  const {
    categorias,
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

  const handleSubmit = async () => {
   
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

  //Columnas Dinamica Ini
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'nombreMostrar', label: 'Nombre Mostrar' },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (categoria: CategoriaLogro) => (
        <Text size="sm" lineClamp={2}>
          {categoria.descripcion || '-'}
        </Text>
      ),
    },
    { key: 'ordenClasificacion', label: 'Orden' },
    {
      key: 'estaActivo',
      label: 'Estado',
      render: (categoria: CategoriaLogro) => (
        <Badge color={categoria.estaActivo ? 'green' : 'red'}>
          {categoria.estaActivo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      icon: <IconEdit size={16} />,
      label: 'Editar',
      color: 'blue',
      onClick: abrirModalEditar,
    },
    {
      icon: <IconTrash size={16} />,
      label: 'Eliminar',
      color: 'red',
      onClick: abrirModalEliminar,
    },
  ];
  //Columnas Dinamica Fin

  if (loading && categorias.length === 0) {
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
          <ActionButtons.Modal 
            onClick={abrirModalCrear} 
            loading={procesando} 
          />
        </Group>

        <PaginatedTable
          data={categorias}
          columns={columns}
          actions={actions}
          loading={loading || procesando}
          searchFields={['nombre', 'nombreMostrar', 'descripcion']}
          itemsPerPage={10}
          searchPlaceholder="Buscar por nombre o descripción..."
          getRowKey={(item) => item.id}
        />
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

          <NumberInput
            label="Orden de Clasificación"
            placeholder="0"
            min={0}
            max={10}
            required
            {...form.getInputProps('ordenClasificacion')}
          />

          <Switch
              label="Estado Activo"
              description="Indica si este tratamiento está disponible para uso"
              size="md"
              color="teal"
              {...form.getInputProps('estaActivo', { type: 'checkbox' })}
          />

          <Group justify="center" mt="md">
            <ActionButtons.Cancel onClick={() => setModalAbierto(false)} />
            <ActionButtons.Save onClick={handleSubmit} loading={procesando} />
            
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