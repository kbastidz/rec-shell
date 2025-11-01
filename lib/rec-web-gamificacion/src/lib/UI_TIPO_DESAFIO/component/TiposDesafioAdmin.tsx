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
  Flex,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconUsers,
  IconUser,
  IconAlertCircle
} from '@tabler/icons-react';
import {
  useTiposIndividuales,
  useTiposGrupales,
  useBuscarTipoPorNombre,
  useCrear,
  useActualizar,
  useEliminar
} from '../hooks/useGamificacion';
import { TipoDesafio } from '../../types/model';
import { ActionButtons, DeleteConfirmModal, useNotifications } from '@rec-shell/rec-web-shared';

interface TipoDesafioFormData {
  nombre: string;
  nombreMostrar: string;
  descripcion: string;
  esIndividual: boolean;
  esGrupal: boolean;
}

export const TiposDesafioAdmin: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [editingItem, setEditingItem] = useState<TipoDesafio | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TipoDesafio | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('individuales');
  const [searchValue, setSearchValue] = useState('');
  const notifications = useNotifications();

  const { data: tiposIndividuales, loading: loadingIndividuales, error: errorIndividuales, refetch: refetchIndividuales } = useTiposIndividuales();
  const { data: tiposGrupales, loading: loadingGrupales, error: errorGrupales, refetch: refetchGrupales } = useTiposGrupales();
  const { data: resultadoBusqueda, loading: loadingBusqueda, error: errorBusqueda, buscarPorNombre } = useBuscarTipoPorNombre();

  const { CREAR, loading: creatingLoading, error: createError } = useCrear();
  const { ACTUALIZAR, loading: updatingLoading, error: updateError } = useActualizar();
  const { ELIMINAR, loading: deletingLoading, error: deleteError } = useEliminar();
  

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
        await ACTUALIZAR(editingItem.id, values);
        notifications.success(); 
      } else {
        await CREAR(values);
        notifications.success(); 
      }
      close();
      refetchIndividuales();
      refetchGrupales();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ELIMINAR(id);
      notifications.success();
      closeDeleteModal();
      setItemToDelete(null);
      refetchIndividuales();
      refetchGrupales();
    } catch (error) {
      console.log(error);
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
    if (!data.length) return <Text c="dimmed" ta="center" py="xl">No se encontraron registros</Text>;

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
    <Box p="md">
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Title order={2}>Gestión de Tipos de Desafío</Title>
          <ActionButtons.Modal 
            onClick={handleOpenCreate}             
          />
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
        title={editingItem ? 'Editar Registro' : 'Nuevo Registro'}
        size="md"
      >
        
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
                color="teal"
                size="md"
                {...form.getInputProps('esIndividual', { type: 'checkbox' })}
              />
              <Switch
                label="Grupal"
                color="teal"
                size="md"
                {...form.getInputProps('esGrupal', { type: 'checkbox' })}
              />
            </Stack>

            {(createError || updateError) && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {createError || updateError}
              </Alert>
            )}

            <Group justify="center">
              <ActionButtons.Cancel onClick={close} />
              <ActionButtons.Save 
                onClick={form.onSubmit(handleSubmit)} 
                loading={creatingLoading || updatingLoading} />
            </Group>
          </Stack>
        
      </Modal>

      {/* Modal para Eliminar */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(itemToDelete?.id || "")}
        itemName={itemToDelete?.nombre || ""}
        itemType="Tipo de desafío"
      />     
    </Box>
  );
};
