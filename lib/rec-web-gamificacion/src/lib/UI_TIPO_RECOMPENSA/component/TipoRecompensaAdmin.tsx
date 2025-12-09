import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  TextInput,
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
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
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
import { useTipoRecompensa } from '../hooks/useGamificacion';
import { TipoRecompensaForm } from '../../types/dto';
import { ActionButtons, DeleteConfirmModal, PaginatedTable, useNotifications } from '@rec-shell/rec-web-shared';
import { getBadgeColor, getBadgeText } from '../../utils/utilidad';

export const TipoRecompensaAdmin: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoRecompensa | null>(null);
  const [selectedItem, setSelectedItem] = useState<TipoRecompensa | null>(null);
  const [tiposRecompensa, setTiposRecompensa] = useState<TipoRecompensa[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [localLoading, setLocalLoading] = useState(false);
  const notifications = useNotifications();

  const {
    loading,
    error,
    CREAR,
    buscarRecompensasFisicas,
    buscarRecompensasDigitales,
    buscarPorNombre,
    ACTUALIZAR,
    ELIMINAR,
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
        data = await buscarRecompensasFisicas();
      } else if (tab === 'digitales') {
        data = await buscarRecompensasDigitales();
      } else {
        const [fisicas, digitales] = await Promise.all([
          buscarRecompensasFisicas(),
          buscarRecompensasDigitales()
        ]);
        data = [...fisicas, ...digitales];
      }
      
      setTiposRecompensa(data);
    } catch (error) {
      console.error('Error al cargar:', error);
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
      console.error('Error al cargar:', error);
    }
  };

  const handleSubmit = async (values: TipoRecompensaForm) => {
    try {
      if (editingItem) {
        await ACTUALIZAR(editingItem.id, values);
        notifications.success(); 
      } else {
        await CREAR(values);
        notifications.success(); 
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error al guardar:', error);
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

  const handleDelete = (item: TipoRecompensa) => {
    setSelectedItem(item);
    setDeleteModalOpened(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      await ELIMINAR(selectedItem.id);
      notifications.success();
      setDeleteModalOpened(false);
      setSelectedItem(null);
      loadData();
    } catch (error) {
      console.error('Error al eliminar:', error);
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

  // Configuración de columnas
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      width: '20%',
    },
    {
      key: 'nombreMostrar',
      label: 'Nombre a Mostrar',
      width: '20%',
    },
    {
      key: 'tipo',
      label: 'Tipo',
      width: '15%',
      render: (item: TipoRecompensa) => (
        <Badge color={getBadgeColor(item)} variant="light">
          {getBadgeText(item)}
        </Badge>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      width: '25%',
      render: (item: TipoRecompensa) => item.descripcion || 'Sin descripción',
    },
    {
      key: 'recompensas',
      label: 'Recompensas',
      width: '10%',
      render: (item: TipoRecompensa) => item.recompensas?.length || 0,
    },
  ];

  // Configuración de acciones
  const actions = [
    {
      icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
      label: 'Editar',
      color: 'blue',
      onClick: (item: TipoRecompensa) => handleEdit(item),
    },
    {
      icon: <IconTrash style={{ width: rem(16), height: rem(16) }} />,
      label: 'Eliminar',
      color: 'red',
      onClick: (item: TipoRecompensa) => handleDelete(item),
    },
  ];

  return (
    <Box p="md">
      <LoadingOverlay visible={localLoading} />
      
      <Group justify="space-between" mb="lg">
        <Title order={2}>Gestión de Tipos de Recompensa</Title>
        <ActionButtons.Modal 
          onClick={handleNewItem} 
          loading={loading} 
        />
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
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
        <PaginatedTable
          data={tiposRecompensa}
          columns={columns}
          actions={actions}
          loading={loading}
          searchFields={['nombre', 'nombreMostrar', 'descripcion']}
          itemsPerPage={10}
          emptyMessage="No se encontraron tipos de recompensa registrados"
          searchPlaceholder="Buscar por nombre, nombre a mostrar o descripción..."
          getRowKey={(item) => item.id}
        />
      </Card>

      {/* Modal de formulario */}
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Registro' : 'Nuevo Registro'}
        size="md"
      >
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
            color="teal"
            size="md"
            description="Indica si la recompensa es de tipo físico"
            {...form.getInputProps('esFisico', { type: 'checkbox' })}
          />

          <Switch
            label="Es Digital"
            color="teal"
            size="md"
            description="Indica si la recompensa es de tipo digital"
            {...form.getInputProps('esDigital', { type: 'checkbox' })}
          />

          <Group justify="center" mt="md">
            <ActionButtons.Cancel onClick={handleCloseModal} />
            <ActionButtons.Save 
              onClick={form.onSubmit(handleSubmit)} 
              loading={loading} 
            />              
          </Group>
        </Stack>
      </Modal>

      {/* Modal genérico de confirmación para Eliminar */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem ? selectedItem.nombreMostrar : ""}
        itemType="tipo de recompensa"
      />
    </Box>
  );
};