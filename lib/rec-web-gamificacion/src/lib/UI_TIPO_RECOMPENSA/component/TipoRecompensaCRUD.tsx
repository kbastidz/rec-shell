import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  TextInput,
  Table,
  ActionIcon,
  Modal,
  Stack,
  Switch,
  Textarea,
  Card,
  Badge,
  Tabs,
  Alert,
  LoadingOverlay,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconGift,
  IconDeviceDesktop,
  IconAlertCircle,
} from '@tabler/icons-react';
import { TipoRecompensa } from '../../types/model';
import { useTipoRecompensa } from '../hooks/useTipoRecompensa';

interface TipoRecompensaForm {
  nombre: string;
  nombreMostrar: string;
  descripcion: string;
  esFisico: boolean;
  esDigital: boolean;
}

export const TipoRecompensaCRUD: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingItem, setEditingItem] = useState<TipoRecompensa | null>(null);
  const [tiposRecompensa, setTiposRecompensa] = useState<TipoRecompensa[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [localLoading, setLocalLoading] = useState(false);

  const {
    loading,
    error,
    crearTipoRecompensa,
    obtenerRecompensasFisicas,
    obtenerRecompensasDigitales,
    buscarPorNombre,
    actualizarTipoRecompensa,
    eliminarTipoRecompensa,
  } = useTipoRecompensa();

  const form = useForm<TipoRecompensaForm>({
    initialValues: {
      nombre: '',
      nombreMostrar: '',
      descripcion: '',
      esFisico: false,
      esDigital: false,
    },
    validate: {
      nombre: (value) => (value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : null),
      nombreMostrar: (value) => (value.length < 2 ? 'El nombre a mostrar debe tener al menos 2 caracteres' : null),
    },
  });

  const loadData = async (tab: string = activeTab) => {
    setLocalLoading(true);
    try {
      let data: TipoRecompensa[] = [];
      
      if (tab === 'fisicas') {
        data = await obtenerRecompensasFisicas();
      } else if (tab === 'digitales') {
        data = await obtenerRecompensasDigitales();
      } else {
        // Para 'todos', combinamos físicas y digitales
        const [fisicas, digitales] = await Promise.all([
          obtenerRecompensasFisicas(),
          obtenerRecompensasDigitales()
        ]);
        data = [...fisicas, ...digitales];
      }
      
      setTiposRecompensa(data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar los tipos de recompensa',
        color: 'red',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }

    try {
      const resultado = await buscarPorNombre(searchQuery);
      setTiposRecompensa([resultado]);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se encontró el tipo de recompensa',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (values: TipoRecompensaForm) => {
    try {
      if (editingItem) {
        await actualizarTipoRecompensa(editingItem.id, values);
        notifications.show({
          title: 'Éxito',
          message: 'Tipo de recompensa actualizado correctamente',
          color: 'green',
        });
      } else {
        await crearTipoRecompensa(values);
        notifications.show({
          title: 'Éxito',
          message: 'Tipo de recompensa creado correctamente',
          color: 'green',
        });
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: editingItem 
          ? 'Error al actualizar el tipo de recompensa' 
          : 'Error al crear el tipo de recompensa',
        color: 'red',
      });
    }
  };

  const handleEdit = (item: TipoRecompensa) => {
    setEditingItem(item);
    form.setValues({
      nombre: item.nombre,
      nombreMostrar: item.nombreMostrar,
      descripcion: item.descripcion || '',
      esFisico: item.esFisico,
      esDigital: item.esDigital,
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este tipo de recompensa?')) {
      try {
        await eliminarTipoRecompensa(id);
        notifications.show({
          title: 'Éxito',
          message: 'Tipo de recompensa eliminado correctamente',
          color: 'green',
        });
        loadData();
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Error al eliminar el tipo de recompensa',
          color: 'red',
        });
      }
    }
  };

  const handleCloseModal = () => {
    close();
    form.reset();
    setEditingItem(null);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    form.reset();
    open();
  };

  const getBadgeColor = (item: TipoRecompensa) => {
    if (item.esFisico && item.esDigital) return 'blue';
    if (item.esFisico) return 'green';
    if (item.esDigital) return 'orange';
    return 'gray';
  };

  const getBadgeText = (item: TipoRecompensa) => {
    if (item.esFisico && item.esDigital) return 'Física & Digital';
    if (item.esFisico) return 'Física';
    if (item.esDigital) return 'Digital';
    return 'Sin tipo';
  };

  const rows = tiposRecompensa.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>{item.nombre}</Table.Td>
      <Table.Td>{item.nombreMostrar}</Table.Td>
      <Table.Td>
        <Badge color={getBadgeColor(item)} variant="light">
          {getBadgeText(item)}
        </Badge>
      </Table.Td>
      <Table.Td>{item.descripcion || 'Sin descripción'}</Table.Td>
      <Table.Td>{item.recompensas?.length || 0}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(item)}
            loading={loading}
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(item.id)}
            loading={loading}
          >
            <IconTrash style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="md">
      <LoadingOverlay visible={localLoading} />
      
      <Group justify="space-between" mb="lg">
        <Title order={2}>Gestión de Tipos de Recompensa</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleNewItem}>
          Nuevo Tipo
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
          {error}
        </Alert>
      )}

      <Card withBorder mb="md">
        <Group>
          <TextInput
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
            leftSection={<IconSearch size={16} />}
          />
          <Button onClick={handleSearch} loading={loading}>
            Buscar
          </Button>
          {searchQuery && (
            <Button variant="light" onClick={() => { setSearchQuery(''); loadData(); }}>
              Limpiar
            </Button>
          )}
        </Group>
      </Card>

      <Tabs value={activeTab} onChange={(value) => value && setActiveTab(value)}>
        <Tabs.List>
          <Tabs.Tab value="todos">Todos</Tabs.Tab>
          <Tabs.Tab value="fisicas" leftSection={<IconGift size={16} />}>
            Físicas
          </Tabs.Tab>
          <Tabs.Tab value="digitales" leftSection={<IconDeviceDesktop size={16} />}>
            Digitales
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Card withBorder mt="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Nombre a Mostrar</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Recompensas</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        {tiposRecompensa.length === 0 && !loading && (
          <Alert mt="md" color="blue">
            No se encontraron tipos de recompensa
          </Alert>
        )}
      </Card>

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Tipo de Recompensa' : 'Nuevo Tipo de Recompensa'}
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Nombre"
              placeholder="Nombre del tipo de recompensa"
              required
              {...form.getInputProps('nombre')}
            />

            <TextInput
              label="Nombre a Mostrar"
              placeholder="Nombre que se mostrará al usuario"
              required
              {...form.getInputProps('nombreMostrar')}
            />

            <Textarea
              label="Descripción"
              placeholder="Descripción opcional del tipo de recompensa"
              rows={3}
              {...form.getInputProps('descripcion')}
            />

            <Switch
              label="Es Físico"
              description="Indica si la recompensa es de tipo físico"
              {...form.getInputProps('esFisico', { type: 'checkbox' })}
            />

            <Switch
              label="Es Digital"
              description="Indica si la recompensa es de tipo digital"
              {...form.getInputProps('esDigital', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};