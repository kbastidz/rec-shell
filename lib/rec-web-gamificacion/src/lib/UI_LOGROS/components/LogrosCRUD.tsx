import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Table,
  TextInput,
  Group,
  ActionIcon,
  Modal,
  Stack,
  Select,
  Textarea,
  NumberInput,
  Switch,
  Badge,
  Image,
  Card,
  Text,
  Loader,
  Alert,
  Pagination,
  Flex,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconAlertCircle,
  IconStar,
  IconAward,
  IconPhoto
} from '@tabler/icons-react';
import { useLogros } from '../hooks/useLogros';
import { Rareza } from '../../enums/Enums';
import { Logro } from '../../types/model';

// Opciones para el select de rareza
const rarezaOptions = [
  { value: 'COMUN', label: 'Común' },
  { value: 'POCO_COMUN', label: 'Poco Común' },
  { value: 'RARO', label: 'Raro' },
  { value: 'EPICO', label: 'Épico' },
  { value: 'LEGENDARIO', label: 'Legendario' }
];

// Colores para las rarezas
const rarezaColors: Record<string, string> = {
  COMUN: 'gray',
  POCO_COMUN: 'green',
  RARO: 'blue',
  EPICO: 'violet',
  LEGENDARIO: 'orange'
};

interface LogroFormData {
  nombre: string;
  descripcion: string;
  urlImagenInsignia: string;
  rareza: Rareza;
  recompensaPuntos: number;
  esSecreto: boolean;
  estaActivo: boolean;
  mensajeDesbloqueo: string;
  criterioDesbloqueo: string;
}

export const LogrosCRUD: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLogro, setEditingLogro] = useState<Logro | null>(null);
  const [selectedLogro, setSelectedLogro] = useState<Logro | null>(null);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const {
    logros,
    loading,
    error,
    obtenerLogrosActivos,
    crearLogro,
    actualizarLogro,
    eliminarLogro,
    buscarPorTexto,
    clearError
  } = useLogros();

  const form = useForm<LogroFormData>({
    initialValues: {
      nombre: '',
      descripcion: '',
      urlImagenInsignia: '',
      rareza: 'COMUN' as Rareza,
      recompensaPuntos: 0,
      esSecreto: false,
      estaActivo: true,
      mensajeDesbloqueo: '',
      criterioDesbloqueo: '{}'
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      descripcion: (value) => (!value ? 'La descripción es requerida' : null),
      recompensaPuntos: (value) => (value < 0 ? 'Los puntos no pueden ser negativos' : null),
      criterioDesbloqueo: (value) => {
        try {
          JSON.parse(value);
          return null;
        } catch {
          return 'Debe ser un JSON válido';
        }
      }
    }
  });

  useEffect(() => {
    obtenerLogrosActivos();
  }, []);

  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: error,
        color: 'red',
        icon: <IconAlertCircle />
      });
      clearError();
    }
  }, [error, clearError]);

  // Filtrar logros por término de búsqueda
  const filteredLogros = logros.filter(logro =>
    logro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    logro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const paginatedLogros = filteredLogros.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogros.length / itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setActivePage(1);
    if (value.trim()) {
      buscarPorTexto(value);
    } else {
      obtenerLogrosActivos();
    }
  };

  const handleCreate = () => {
    setEditingLogro(null);
    form.reset();
    open();
  };

  const handleEdit = (logro: Logro) => {
    setEditingLogro(logro);
    form.setValues({
      nombre: logro.nombre,
      descripcion: logro.descripcion,
      urlImagenInsignia: logro.urlImagenInsignia || '',
      rareza: logro.rareza,
      recompensaPuntos: logro.recompensaPuntos,
      esSecreto: logro.esSecreto,
      estaActivo: logro.estaActivo,
      mensajeDesbloqueo: logro.mensajeDesbloqueo || '',
      criterioDesbloqueo: JSON.stringify(logro.criterioDesbloqueo, null, 2)
    });
    open();
  };

  const handleView = (logro: Logro) => {
    setSelectedLogro(logro);
    openDetails();
  };

  const handleDelete = (logro: Logro) => {
    modals.openConfirmModal({
      title: 'Eliminar Logro',
      children: (
        <Text>
          ¿Estás seguro de que deseas eliminar el logro <strong>{logro.nombre}</strong>?
          Esta acción no se puede deshacer.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await eliminarLogro(logro.id);
        notifications.show({
          title: 'Éxito',
          message: 'Logro eliminado correctamente',
          color: 'green'
        });
        obtenerLogrosActivos();
      }
    });
  };

  const handleSubmit = async (values: LogroFormData) => {
    try {
      const logroData: Partial<Logro> = {
        ...values,
        criterioDesbloqueo: JSON.parse(values.criterioDesbloqueo)
      };

      if (editingLogro) {
        await actualizarLogro(editingLogro.id, { ...editingLogro, ...logroData } as Logro);
        notifications.show({
          title: 'Éxito',
          message: 'Logro actualizado correctamente',
          color: 'green'
        });
      } else {
        await crearLogro(logroData as Logro);
        notifications.show({
          title: 'Éxito',
          message: 'Logro creado correctamente',
          color: 'green'
        });
      }
      
      close();
      obtenerLogrosActivos();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error al guardar el logro',
        color: 'red'
      });
    }
  };

  const getBadgeColor = (rareza: Rareza) => {
    return rarezaColors[rareza] || 'gray';
  };

  const getRarezaIcon = (rareza: Rareza) => {
    switch (rareza) {
      case 'LEGENDARIO':
        return <IconAward size={14} />;
      case 'EPICO':
        return <IconStar size={14} />;
      default:
        return null;
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Gestión de Logros</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
            Nuevo Logro
          </Button>
        </Group>

        {/* Búsqueda */}
        <TextInput
          placeholder="Buscar logros..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />

        {/* Tabla */}
        <Card withBorder>
          {loading ? (
            <Flex justify="center" align="center" h={200}>
              <Loader />
            </Flex>
          ) : (
            <>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Imagen</Table.Th>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Descripción</Table.Th>
                    <Table.Th>Rareza</Table.Th>
                    <Table.Th>Puntos</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedLogros.map((logro) => (
                    <Table.Tr key={logro.id}>
                      <Table.Td>
                        {logro.urlImagenInsignia ? (
                          <Image
                            src={logro.urlImagenInsignia}
                            alt={logro.nombre}
                            w={40}
                            h={40}
                            radius="sm"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E"
                          />
                        ) : (
                          <Box w={40} h={40} bg="gray.1" style={{ borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconPhoto size={20} color="gray" />
                          </Box>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>{logro.nombre}</Text>
                        {logro.esSecreto && (
                          <Badge size="xs" color="orange" variant="light">
                            Secreto
                          </Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text lineClamp={2} size="sm" c="dimmed">
                          {logro.descripcion}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getBadgeColor(logro.rareza)}
                          variant="light"
                          leftSection={getRarezaIcon(logro.rareza)}
                        >
                          {rarezaOptions.find(r => r.value === logro.rareza)?.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>{logro.recompensaPuntos}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={logro.estaActivo ? 'green' : 'red'} variant="light">
                          {logro.estaActivo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleView(logro)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="yellow"
                            onClick={() => handleEdit(logro)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleDelete(logro)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {/* Paginación */}
              {totalPages > 1 && (
                <Group justify="center" mt="md">
                  <Pagination
                    value={activePage}
                    onChange={setActivePage}
                    total={totalPages}
                  />
                </Group>
              )}
            </>
          )}
        </Card>

        {/* Modal de Creación/Edición */}
        <Modal
          opened={opened}
          onClose={close}
          title={editingLogro ? 'Editar Logro' : 'Crear Nuevo Logro'}
          size="lg"
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="Nombre"
                  placeholder="Nombre del logro"
                  required
                  {...form.getInputProps('nombre')}
                />
                <Select
                  label="Rareza"
                  placeholder="Selecciona rareza"
                  data={rarezaOptions}
                  required
                  {...form.getInputProps('rareza')}
                />
              </Group>

              <Textarea
                label="Descripción"
                placeholder="Descripción del logro"
                required
                rows={3}
                {...form.getInputProps('descripcion')}
              />

              <TextInput
                label="URL de Imagen"
                placeholder="https://ejemplo.com/imagen.png"
                {...form.getInputProps('urlImagenInsignia')}
              />

              <Group grow>
                <NumberInput
                  label="Puntos de Recompensa"
                  placeholder="0"
                  min={0}
                  required
                  {...form.getInputProps('recompensaPuntos')}
                />
                <div />
              </Group>

              <Textarea
                label="Mensaje de Desbloqueo"
                placeholder="¡Felicitaciones! Has desbloqueado..."
                rows={2}
                {...form.getInputProps('mensajeDesbloqueo')}
              />

              <Textarea
                label="Criterio de Desbloqueo (JSON)"
                placeholder='{"tipo": "puntos", "valor": 100}'
                rows={4}
                {...form.getInputProps('criterioDesbloqueo')}
              />

              <Group>
                <Switch
                  label="Es secreto"
                  {...form.getInputProps('esSecreto', { type: 'checkbox' })}
                />
                <Switch
                  label="Está activo"
                  {...form.getInputProps('estaActivo', { type: 'checkbox' })}
                />
              </Group>

              <Group justify="flex-end" gap="sm">
                <Button variant="light" onClick={close}>
                  Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                  {editingLogro ? 'Actualizar' : 'Crear'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Modal de Detalles */}
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title="Detalles del Logro"
          size="md"
        >
          {selectedLogro && (
            <Stack gap="md">
              {selectedLogro.urlImagenInsignia && (
                <Group justify="center">
                  <Image
                    src={selectedLogro.urlImagenInsignia}
                    alt={selectedLogro.nombre}
                    w={80}
                    h={80}
                    radius="md"
                  />
                </Group>
              )}
              
              <Title order={3} ta="center">{selectedLogro.nombre}</Title>
              
              <Group justify="center">
                <Badge
                  color={getBadgeColor(selectedLogro.rareza)}
                  variant="light"
                  size="lg"
                  leftSection={getRarezaIcon(selectedLogro.rareza)}
                >
                  {rarezaOptions.find(r => r.value === selectedLogro.rareza)?.label}
                </Badge>
                <Badge color="blue" variant="light" size="lg">
                  {selectedLogro.recompensaPuntos} puntos
                </Badge>
              </Group>

              <Text>{selectedLogro.descripcion}</Text>

              {selectedLogro.mensajeDesbloqueo && (
                <Alert color="green" title="Mensaje de Desbloqueo">
                  {selectedLogro.mensajeDesbloqueo}
                </Alert>
              )}

              <Group>
                {selectedLogro.esSecreto && (
                  <Badge color="orange" variant="light">Secreto</Badge>
                )}
                <Badge color={selectedLogro.estaActivo ? 'green' : 'red'} variant="light">
                  {selectedLogro.estaActivo ? 'Activo' : 'Inactivo'}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                <strong>Creado:</strong> {new Date(selectedLogro.creadoEn).toLocaleDateString()}
              </Text>
              
              {selectedLogro.actualizadoEn && (
                <Text size="sm" c="dimmed">
                  <strong>Actualizado:</strong> {new Date(selectedLogro.actualizadoEn).toLocaleDateString()}
                </Text>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};