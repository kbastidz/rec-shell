import React, { useState } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Table,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Switch,
  Stack,
  Badge,
  Card,
  Tabs,
  Alert,
  LoadingOverlay,
  Text,
  Flex
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconUsers,
  IconUser,
  IconAlertCircle,
  IconAlertTriangle
} from '@tabler/icons-react';
import {
  useTiposIndividuales,
  useTiposGrupales,
  useBuscarTipoPorNombre,
  useCrearTipoDesafio,
  useActualizarTipoDesafio,
  useEliminarTipoDesafio
} from '../hooks/useTipoDesafio';
import { TipoDesafio } from '../../types/model';

interface TipoDesafioFormData {
  nombre: string;
  nombreMostrar: string;
  descripcion: string;
  esIndividual: boolean;
  esGrupal: boolean;
}

export const TiposDesafioCRUD: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [editingItem, setEditingItem] = useState<TipoDesafio | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TipoDesafio | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('individuales');
  const [searchValue, setSearchValue] = useState('');

  // Hooks para datos
  const { data: tiposIndividuales, loading: loadingIndividuales, error: errorIndividuales, refetch: refetchIndividuales } = useTiposIndividuales();
  const { data: tiposGrupales, loading: loadingGrupales, error: errorGrupales, refetch: refetchGrupales } = useTiposGrupales();
  const { data: resultadoBusqueda, loading: loadingBusqueda, error: errorBusqueda, buscarPorNombre } = useBuscarTipoPorNombre();

  // Hooks para mutations
  const { crearTipoDesafio, loading: creatingLoading, error: createError } = useCrearTipoDesafio();
  const { actualizarTipoDesafio, loading: updatingLoading, error: updateError } = useActualizarTipoDesafio();
  const { eliminarTipoDesafio, loading: deletingLoading, error: deleteError } = useEliminarTipoDesafio();

  // Formulario
  const form = useForm<TipoDesafioFormData>({
    initialValues: {
      nombre: '',
      nombreMostrar: '',
      descripcion: '',
      esIndividual: false,
      esGrupal: false,
    },
    validate: {
      nombre: (value) => !value.trim() ? 'El nombre es requerido' : null,
      nombreMostrar: (value) => !value.trim() ? 'El nombre a mostrar es requerido' : null,
      esIndividual: (value, values) => 
        !value && !values.esGrupal ? 'Debe seleccionar al menos individual o grupal' : null,
      esGrupal: (value, values) => 
        !value && !values.esIndividual ? 'Debe seleccionar al menos individual o grupal' : null,
    },
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    form.reset();
    open();
  };

  const handleOpenEdit = (item: TipoDesafio) => {
    setEditingItem(item);
    form.setValues({
      nombre: item.nombre,
      nombreMostrar: item.nombreMostrar,
      descripcion: item.descripcion || '',
      esIndividual: item.esIndividual,
      esGrupal: item.esGrupal,
    });
    open();
  };

  const handleSubmit = async (values: TipoDesafioFormData) => {
    try {
      if (editingItem) {
        await actualizarTipoDesafio(editingItem.id, values);
        notifications.show({
          title: 'Éxito',
          message: 'Tipo de desafío actualizado correctamente',
          color: 'green',
        });
      } else {
        await crearTipoDesafio(values);
        notifications.show({
          title: 'Éxito',
          message: 'Tipo de desafío creado correctamente',
          color: 'green',
        });
      }
      close();
      refetchIndividuales();
      refetchGrupales();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: editingItem ? 'Error al actualizar' : 'Error al crear',
        color: 'red',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarTipoDesafio(id);
      notifications.show({
        title: 'Éxito',
        message: 'Tipo de desafío eliminado correctamente',
        color: 'green',
      });
      closeDeleteModal();
      setItemToDelete(null);
      refetchIndividuales();
      refetchGrupales();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error al eliminar el tipo de desafío',
        color: 'red',
      });
    }
  };

  const handleOpenDelete = (item: TipoDesafio) => {
    setItemToDelete(item);
    openDeleteModal();
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      buscarPorNombre(searchValue.trim());
    }
  };

  const renderTable = (data: TipoDesafio[], loading: boolean, error: string | null) => {
    if (loading) return <LoadingOverlay visible />;
    if (error) return <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>;
    if (!data.length) return <Text c="dimmed" ta="center" py="xl">No hay registros</Text>;

    return (
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Nombre a Mostrar</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th>Tipo</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>{item.nombre}</Table.Td>
              <Table.Td>{item.nombreMostrar}</Table.Td>
              <Table.Td>{item.descripcion}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {item.esIndividual && (
                    <Badge color="blue" variant="light" leftSection={<IconUser size={12} />}>
                      Individual
                    </Badge>
                  )}
                  {item.esGrupal && (
                    <Badge color="green" variant="light" leftSection={<IconUsers size={12} />}>
                      Grupal
                    </Badge>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => handleOpenEdit(item)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleOpenDelete(item)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Title order={2}>Gestión de Tipos de Desafío</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
            Nuevo Tipo
          </Button>
        </Flex>

        {/* Buscador */}
        <Card withBorder>
          <Group>
            <TextInput
              placeholder="Buscar por nombre..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearch} loading={loadingBusqueda}>
              Buscar
            </Button>
          </Group>
          
          {resultadoBusqueda && (
            <Stack gap="xs" mt="md">
              <Text size="sm" fw={500}>Resultado de búsqueda:</Text>
              {renderTable([resultadoBusqueda], false, null)}
            </Stack>
          )}
          
          {errorBusqueda && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mt="md">
              {errorBusqueda}
            </Alert>
          )}
        </Card>

        {/* Tabs para Individuales y Grupales */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="individuales" leftSection={<IconUser size={16} />}>
              Tipos Individuales
            </Tabs.Tab>
            <Tabs.Tab value="grupales" leftSection={<IconUsers size={16} />}>
              Tipos Grupales
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="individuales" pt="md">
            <Card withBorder>
              {renderTable(tiposIndividuales, loadingIndividuales, errorIndividuales)}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="grupales" pt="md">
            <Card withBorder>
              {renderTable(tiposGrupales, loadingGrupales, errorGrupales)}
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Modal para crear/editar */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingItem ? 'Editar Tipo de Desafío' : 'Crear Tipo de Desafío'}
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Ingrese el nombre"
              required
              {...form.getInputProps('nombre')}
            />

            <TextInput
              label="Nombre a Mostrar"
              placeholder="Ingrese el nombre a mostrar"
              required
              {...form.getInputProps('nombreMostrar')}
            />

            <Textarea
              label="Descripción"
              placeholder="Ingrese la descripción (opcional)"
              autosize
              minRows={3}
              {...form.getInputProps('descripcion')}
            />

            <Stack gap="sm">
              <Text size="sm" fw={500}>Tipo de Desafío</Text>
              <Switch
                label="Individual"
                {...form.getInputProps('esIndividual', { type: 'checkbox' })}
              />
              <Switch
                label="Grupal"
                {...form.getInputProps('esGrupal', { type: 'checkbox' })}
              />
            </Stack>

            {(createError || updateError) && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {createError || updateError}
              </Alert>
            )}

            <Group justify="flex-end">
              <Button variant="subtle" onClick={close}>
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={creatingLoading || updatingLoading}
              >
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirmar Eliminación"
        size="md"
        centered
      >
        <Stack gap="md">
          <Group gap="md">
            <IconAlertTriangle size={32} color="red" />
            <div>
              <Text fw={500}>¿Está seguro de eliminar este tipo de desafío?</Text>
              <Text size="sm" c="dimmed">Esta acción no se puede deshacer.</Text>
            </div>
          </Group>

          {itemToDelete && (
            <Card withBorder bg="gray.0">
              <Stack gap="xs">
                <Group>
                  <Text size="sm" fw={500}>Nombre:</Text>
                  <Text size="sm">{itemToDelete.nombre}</Text>
                </Group>
                <Group>
                  <Text size="sm" fw={500}>Nombre a mostrar:</Text>
                  <Text size="sm">{itemToDelete.nombreMostrar}</Text>
                </Group>
                <Group>
                  <Text size="sm" fw={500}>Tipo:</Text>
                  <Group gap="xs">
                    {itemToDelete.esIndividual && (
                      <Badge color="blue" variant="light" size="sm">
                        Individual
                      </Badge>
                    )}
                    {itemToDelete.esGrupal && (
                      <Badge color="green" variant="light" size="sm">
                        Grupal
                      </Badge>
                    )}
                  </Group>
                </Group>
              </Stack>
            </Card>
          )}

          {deleteError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {deleteError}
            </Alert>
          )}

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => itemToDelete && handleDelete(itemToDelete.id)}
              loading={deletingLoading}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};
