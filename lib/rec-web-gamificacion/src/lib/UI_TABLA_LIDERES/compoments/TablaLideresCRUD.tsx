import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Table,
  Badge,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Switch,
  Stack,
  Grid,
  Card,
  Text,
  Loader,
  Alert,
  Tabs
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconRefresh,
  IconEye,
  IconCalendar,
  IconAlertCircle
} from '@tabler/icons-react';
import { useTablaLideres } from '../hooks/useTablaLideres';
import { TablaLideres } from '../../types/model';

interface TablaFormData {
  nombre: string;
  descripcion: string;
  tipoTablaLideres: string;
  criterio: Record<string, any>;
  maxEntradas: number;
  estaActivo: boolean;
}

const TIPOS_TABLA = [
  { value: 'PUNTUACION', label: 'Puntuación' },
  { value: 'TIEMPO', label: 'Tiempo' },
  { value: 'COMPLETADOS', label: 'Completados' },
  { value: 'RACHA', label: 'Racha' }
];

export const TablaLideresCRUD: React.FC = () => {
  const {
    tablas,
    entradas,
    loading,
    error,
    crearTabla,
    obtenerTablasActivas,
    obtenerEntradasTabla,
    actualizarTabla,
    obtenerEntradasPorPeriodo,
    clearError
  } = useTablaLideres();

  const [opened, { open, close }] = useDisclosure(false);
  const [entriesOpened, { open: openEntries, close: closeEntries }] = useDisclosure(false);
  const [periodOpened, { open: openPeriod, close: closePeriod }] = useDisclosure(false);
  const [selectedTable, setSelectedTable] = useState<TablaLideres | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('list');

  const form = useForm<TablaFormData>({
    initialValues: {
      nombre: '',
      descripcion: '',
      tipoTablaLideres: '',
      criterio: {},
      maxEntradas: 10,
      estaActivo: true
    },
    validate: {
      nombre: (value) => !value ? 'El nombre es requerido' : null,
      tipoTablaLideres: (value) => !value ? 'El tipo de tabla es requerido' : null,
      maxEntradas: (value) => value < 1 ? 'Debe ser mayor a 0' : null
    }
  });

  const periodForm = useForm({
    initialValues: {
      inicioPeriodo: new Date(),
      finPeriodo: new Date()
    }
  });

  useEffect(() => {
    loadTablasActivas();
  }, []);

  const loadTablasActivas = async () => {
    try {
      await obtenerTablasActivas();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar las tablas',
        color: 'red'
      });
    }
  };

  const handleSubmit = async (values: TablaFormData) => {
    try {
      await crearTabla({
        ...values,
        periodoTiempo: undefined
      });
      
      notifications.show({
        title: 'Éxito',
        message: isEditing ? 'Tabla actualizada correctamente' : 'Tabla creada correctamente',
        color: 'green'
      });
      
      close();
      form.reset();
      setIsEditing(false);
      loadTablasActivas();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo guardar la tabla',
        color: 'red'
      });
    }
  };

  const handleEdit = (tabla: TablaLideres) => {
    form.setValues({
      nombre: tabla.nombre,
      descripcion: tabla.descripcion || '',
      tipoTablaLideres: tabla.tipoTablaLideres,
      criterio: tabla.criterio,
      maxEntradas: tabla.maxEntradas,
      estaActivo: tabla.estaActivo
    });
    setSelectedTable(tabla);
    setIsEditing(true);
    open();
  };

  const handleViewEntries = async (tabla: TablaLideres) => {
    setSelectedTable(tabla);
    try {
      await obtenerEntradasTabla(tabla.id);
      openEntries();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar las entradas',
        color: 'red'
      });
    }
  };

  const handleRefresh = async (tablaId: string) => {
    try {
      await actualizarTabla(tablaId);
      notifications.show({
        title: 'Éxito',
        message: 'Tabla actualizada correctamente',
        color: 'green'
      });
      loadTablasActivas();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar la tabla',
        color: 'red'
      });
    }
  };

  const handleViewPeriod = (tabla: TablaLideres) => {
    setSelectedTable(tabla);
    openPeriod();
  };

  const handlePeriodSearch = async (values: any) => {
    if (!selectedTable) return;
    
    try {
      const inicioPeriodo = values.inicioPeriodo.toISOString().split('T')[0];
      const finPeriodo = values.finPeriodo.toISOString().split('T')[0];
      
      await obtenerEntradasPorPeriodo(selectedTable.id, inicioPeriodo, finPeriodo);
      closePeriod();
      openEntries();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar las entradas del período',
        color: 'red'
      });
    }
  };

  const rows = tablas.map((tabla) => (
    <Table.Tr key={tabla.id}>
      <Table.Td>{tabla.nombre}</Table.Td>
      <Table.Td>{tabla.descripcion}</Table.Td>
      <Table.Td>
        <Badge color={tabla.tipoTablaLideres === 'PUNTUACION' ? 'blue' : 'green'}>
          {tabla.tipoTablaLideres}
        </Badge>
      </Table.Td>
      <Table.Td>{tabla.maxEntradas}</Table.Td>
      <Table.Td>
        <Badge color={tabla.estaActivo ? 'green' : 'red'}>
          {tabla.estaActivo ? 'Activo' : 'Inactivo'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => handleEdit(tabla)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="green"
            onClick={() => handleViewEntries(tabla)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="orange"
            onClick={() => handleRefresh(tabla.id)}
          >
            <IconRefresh size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="violet"
            onClick={() => handleViewPeriod(tabla)}
          >
            <IconCalendar size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const entriesRows = entradas.map((entrada) => (
    <Table.Tr key={entrada.id}>
      <Table.Td>{entrada.posicion}</Table.Td>
      <Table.Td>{entrada.usuario?.username || entrada.usuario?.email || 'Usuario'}</Table.Td>
      <Table.Td>{entrada.puntuacion}</Table.Td>
      <Table.Td>
        {entrada.actualizadoEn ? new Date(entrada.actualizadoEn).toLocaleDateString() : '-'}
      </Table.Td>
    </Table.Tr>
  ));

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
          {error}
          <Button variant="light" size="xs" onClick={clearError} ml="md">
            Cerrar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Gestión de Tablas de Líderes</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              form.reset();
              setIsEditing(false);
              open();
            }}
          >
            Nueva Tabla
          </Button>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="list">Lista de Tablas</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="list" pt="lg">
            {loading ? (
              <Group justify="center" p="xl">
                <Loader />
              </Group>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Descripción</Table.Th>
                    <Table.Th>Tipo</Table.Th>
                    <Table.Th>Max Entradas</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Modal para crear/editar tabla */}
      <Modal
        opened={opened}
        onClose={close}
        title={isEditing ? 'Editar Tabla de Líderes' : 'Nueva Tabla de Líderes'}
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Ingrese el nombre de la tabla"
              required
              {...form.getInputProps('nombre')}
            />
            
            <Textarea
              label="Descripción"
              placeholder="Descripción opcional"
              {...form.getInputProps('descripcion')}
            />
            
            <Select
              label="Tipo de Tabla"
              placeholder="Seleccione el tipo"
              data={TIPOS_TABLA}
              required
              {...form.getInputProps('tipoTablaLideres')}
            />
            
            <NumberInput
              label="Máximo de Entradas"
              placeholder="10"
              min={1}
              required
              {...form.getInputProps('maxEntradas')}
            />
            
            <Switch
              label="Tabla Activa"
              {...form.getInputProps('estaActivo', { type: 'checkbox' })}
            />
            
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal para ver entradas */}
      <Modal
        opened={entriesOpened}
        onClose={closeEntries}
        title={`Entradas - ${selectedTable?.nombre}`}
        size="lg"
      >
        {loading ? (
          <Group justify="center" p="xl">
            <Loader />
          </Group>
        ) : entradas.length > 0 ? (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Posición</Table.Th>
                <Table.Th>Usuario</Table.Th>
                <Table.Th>Puntuación</Table.Th>
                <Table.Th>Fecha</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{entriesRows}</Table.Tbody>
          </Table>
        ) : (
          <Text c="dimmed" ta="center" p="xl">
            No hay entradas disponibles
          </Text>
        )}
      </Modal>

      {/* Modal para búsqueda por período */}
      <Modal
        opened={periodOpened}
        onClose={closePeriod}
        title="Buscar Entradas por Período"
        size="md"
      >
        <form onSubmit={periodForm.onSubmit(handlePeriodSearch)}>
          <Stack gap="md">
            <DateInput
              label="Fecha de Inicio"
              placeholder="Seleccione fecha de inicio"
              required
              {...periodForm.getInputProps('inicioPeriodo')}
            />
            
            <DateInput
              label="Fecha de Fin"
              placeholder="Seleccione fecha de fin"
              required
              {...periodForm.getInputProps('finPeriodo')}
            />
            
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={closePeriod}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Buscar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};