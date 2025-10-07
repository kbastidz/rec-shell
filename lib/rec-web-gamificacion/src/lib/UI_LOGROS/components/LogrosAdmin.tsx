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
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconStar,
  IconAward,
  IconPhoto
} from '@tabler/icons-react';
import { useLogros } from '../hooks/useGamificacion';
import { Rareza } from '../../enums/Enums';
import { Logro } from '../../types/model';
import { rarezaColors, rarezaOptions } from '../../utils/utilidad';
import { DeleteConfirmModal, NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';


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

export const LogrosAdmin: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLogro, setEditingLogro] = useState<Logro | null>(null);
  const [selectedLogro, setSelectedLogro] = useState<Logro | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Logro | null>(null);
  const [activePage, setActivePage] = useState(1);
  const notifications = useNotifications();
  const itemsPerPage = 10;

  const {
    logros,
    loading,
    error,
    GET,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
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
      criterioDesbloqueo: ''
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      descripcion: (value) => (!value ? 'La descripción es requerida' : null),
      recompensaPuntos: (value) => (value < 0 ? 'Los puntos no pueden ser negativos' : null),
      criterioDesbloqueo: (value) => (!value ? 'El criterio es requerido' : null),
    }
  });

  useEffect(() => {
    GET();
  }, []);

  useEffect(() => {
    if (error) {
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title,error); 
      clearError();
    }
  }, [error, clearError, notifications]);

  // Filtrar logros por término de búsqueda
  const filteredLogros = logros.filter(logro =>
    logro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    logro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      GET();
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
      criterioDesbloqueo: logro.criterioDesbloqueo
    });
    open();
  };

  const handleView = (logro: Logro) => {
    setSelectedLogro(logro);
    openDetails();
  };

  const handleDeleteClick = (logro: Logro) => {
    setItemToDelete(logro);
    openDeleteModal();
  };

  const handleDelete = async (id: string) => {
    await ELIMINAR(id);
    notifications.success(); 
    closeDeleteModal();
    GET();
  };

  const handleSubmit = async (values: LogroFormData) => {
    try {
      const logroData: Partial<Logro> = {
        ...values
      };

      if (editingLogro) {
        await ACTUALIZAR(editingLogro.id, { ...editingLogro, ...logroData } as Logro);
        notifications.success(); 
      } else {
        await CREAR(logroData as Logro);
        notifications.success(); 
      }
      
      close();
      GET();
    } catch (error) {
      console.log(error);
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
    <Box p="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Gestión de Logros</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
            Registrar
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
                            onClick={() => handleDeleteClick(logro)}
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
          title={editingLogro ? 'Editar Registro' : 'Nuevo Registro'}
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
                label="Criterio de Desbloqueo"
                placeholder='Criterios'
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

        {/* Modal para Eliminar */}
        <DeleteConfirmModal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(itemToDelete?.id || "")}
          itemName={itemToDelete?.nombre || ""}
          itemType="logro"
        />
      </Stack>
    </Box>
  );
};