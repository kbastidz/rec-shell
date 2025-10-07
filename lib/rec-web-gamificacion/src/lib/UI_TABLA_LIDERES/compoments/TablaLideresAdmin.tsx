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
  Text,
  Loader,
  Alert,
  Tabs,
  Box
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  IconPlus,
  IconEdit,
  IconRefresh,
  IconEye,
  IconCalendar,
  IconAlertCircle
} from '@tabler/icons-react';
import { useTablaLideres } from '../hooks/useGamificacion';
import { TablaLideres } from '../../types/model';
import { TablaFormData } from '../../types/dto';
import { TIPOS_TABLA } from '../../utils/utilidad';
import { useNotifications } from '@rec-shell/rec-web-shared';
import { PeriodoTiempo } from '../../enums/Enums';

const PERIODOS_TIEMPO = [
  { value: 'DIARIO', label: 'Diario' },
  { value: 'SEMANAL', label: 'Semanal' },
  { value: 'MENSUAL', label: 'Mensual' },
  { value: 'ANUAL', label: 'Anual' },
  { value: 'HISTORICO', label: 'Histórico' }
];

export const TablaLideresAdmin: React.FC = () => {
  const {
    tablas,
    entradas,
    loading,
    error,
    CREAR,
    BUSCAR,
    obtenerEntradasTabla,
    ACTUALIZAR,
    obtenerEntradasPorPeriodo,
    clearError
  } = useTablaLideres();

  const [opened, { open, close }] = useDisclosure(false);
  const [entriesOpened, { open: openEntries, close: closeEntries }] = useDisclosure(false);
  const [periodOpened, { open: openPeriod, close: closePeriod }] = useDisclosure(false);
  const [selectedTable, setSelectedTable] = useState<TablaLideres | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('list');
  const notifications = useNotifications();

  const form = useForm<TablaFormData>({
    initialValues: {
      nombre: '',
      descripcion: '',
      tipoTablaLideres: '',
      criterio: '',
      periodoTiempo: PeriodoTiempo.DIARIO,
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
      await BUSCAR();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values: TablaFormData) => {
    try {
      if (isEditing && selectedTable) {
        await ACTUALIZAR(selectedTable.id, values);
        notifications.success();
      } else {
        await CREAR(values);
        notifications.success();
      }
      
      close();
      form.reset();
      setIsEditing(false);
      setSelectedTable(null);
      await loadTablasActivas();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (tabla: TablaLideres) => {
    form.setValues({
      nombre: tabla.nombre,
      descripcion: tabla.descripcion || '',
      tipoTablaLideres: tabla.tipoTablaLideres,
      criterio: tabla.criterio,
      periodoTiempo: tabla.periodoTiempo,
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
      console.log(error);
    }
  };

  const handleRefresh = async (tablaId: string) => {
    try {
      await loadTablasActivas();
    } catch (error) {
      console.log(error);
     
    }
  };

  const handleViewPeriod = (tabla: TablaLideres) => {
    setSelectedTable(tabla);
    openPeriod();
  };

  const handlePeriodSearch = async (values: any) => {
    if (!selectedTable) return;
    
    try {
      const inicioPeriodo = values.inicioPeriodo;
      const finPeriodo = values.finPeriodo; 
      
      await obtenerEntradasPorPeriodo(selectedTable.id, inicioPeriodo, finPeriodo);
      closePeriod();
      openEntries();
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleCloseModal = () => {
    close();
    form.reset();
    setIsEditing(false);
    setSelectedTable(null);
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
            title="Editar"
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="green"
            onClick={() => handleViewEntries(tabla)}
            title="Ver entradas"
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="orange"
            onClick={() => handleRefresh(tabla.id)}
            title="Refrescar"
          >
            <IconRefresh size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="violet"
            onClick={() => handleViewPeriod(tabla)}
            title="Buscar por período"
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
    <Box p="md">
      <Paper shadow="sm" p="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Gestión de Tablas de Líderes</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              form.reset();
              setIsEditing(false);
              setSelectedTable(null);
              open();
            }}
          >
            Registrar
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
            ) : tablas.length > 0 ? (
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
            ) : (
              <Text c="dimmed" ta="center" p="xl">
                No se encontraron registros
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Modal para crear/editar tabla */}
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={isEditing ? 'Editar Registro' : 'Nuevo Registro'}
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
            
            <Select
              label="Período de Tiempo"
              placeholder="Seleccione el período"
              data={PERIODOS_TIEMPO}
              {...form.getInputProps('periodoTiempo')}
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
              <Button variant="light" onClick={handleCloseModal}>
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
            <TextInput
              label="Fecha de Inicio"
              type="date"
              {...periodForm.getInputProps('inicioPeriodo')}
              required
            />       

            <TextInput
              label="Fecha de Fin"
              type="date"
              {...periodForm.getInputProps('finPeriodo')}
              required
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
    </Box>
  );
};