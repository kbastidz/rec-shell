import React, { useState, useEffect } from 'react';
import {
  Title,
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
  Text,
  Loader,
  Alert,
  Pagination,
  Flex,
  Box,
  Paper,
  ThemeIcon,
  Divider,
  Avatar,
  Tooltip
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
  IconPhoto,
  IconTrophy,
  IconLock,
  IconLockOpen,
  IconSparkles
} from '@tabler/icons-react';
import { useLogros } from '../hooks/useGamificacion';
import { Rareza } from '../../enums/Enums';
import { Logro } from '../../types/model';
import { rarezaColors, rarezaOptions } from '../../utils/utilidad';
import { ActionButtons, DeleteConfirmModal, NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';


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
    <Box size="xl" py="xl">
      <Stack gap="xl">
        {/* Header Mejorado */}
        <Paper shadow="xs" p="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Group gap="md">
              <ThemeIcon size={50} radius="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconTrophy size={28} />
              </ThemeIcon>
              <div>
                <Title order={2} fw={700}>Gestión de Logros</Title>
                <Text size="sm" c="dimmed">Administra los logros y recompensas del sistema</Text>
              </div>
            </Group>
            <ActionButtons.Modal 
              onClick={handleCreate} 
              loading={loading} 
            />
          </Group>
        </Paper>

        {/* Estadísticas Rápidas */}
        <Group grow>
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Logros</Text>
                <Text size="xl" fw={700}>{logros.length}</Text>
              </div>
              <ThemeIcon size={40} radius="md" variant="light" color="blue">
                <IconTrophy size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Activos</Text>
                <Text size="xl" fw={700}>{logros.filter(l => l.estaActivo).length}</Text>
              </div>
              <ThemeIcon size={40} radius="md" variant="light" color="green">
                <IconLockOpen size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
          
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Secretos</Text>
                <Text size="xl" fw={700}>{logros.filter(l => l.esSecreto).length}</Text>
              </div>
              <ThemeIcon size={40} radius="md" variant="light" color="orange">
                <IconLock size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </Group>

        {/* Búsqueda Mejorada */}
        <Paper shadow="xs" p="md" radius="md" withBorder>
          <TextInput
            placeholder="Buscar por nombre o descripción..."
            leftSection={<IconSearch size={18} />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            size="md"
            radius="md"
          />
        </Paper>

        {/* Tabla Mejorada */}
        <Paper shadow="sm" radius="md" withBorder>
          {loading ? (
            <Flex justify="center" align="center" h={300}>
              <Stack align="center" gap="md">
                <Loader size="lg" type="dots" />
                <Text c="dimmed">Cargando logros...</Text>
              </Stack>
            </Flex>
          ) : paginatedLogros.length === 0 ? (
            <Flex justify="center" align="center" h={200}>
              <Stack align="center" gap="md">
                <ThemeIcon size={60} radius="md" variant="light" color="gray">
                  <IconTrophy size={30} />
                </ThemeIcon>
                <Text c="dimmed" size="lg">No se encontraron logros</Text>
              </Stack>
            </Flex>
          ) : (
            <>
              <Box style={{ overflowX: 'auto' }}>
                <Table striped highlightOnHover withTableBorder={false}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Logro</Table.Th>
                      <Table.Th>Descripción</Table.Th>
                      <Table.Th>Rareza</Table.Th>
                      <Table.Th>Puntos</Table.Th>
                      <Table.Th>Estado</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>Acciones</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedLogros.map((logro) => (
                      <Table.Tr key={logro.id}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              src={logro.urlImagenInsignia}
                              size={50}
                              radius="md"
                            >
                              <IconPhoto size={24} />
                            </Avatar>
                            <div>
                              <Text fw={600} size="sm">{logro.nombre}</Text>
                              {logro.esSecreto && (
                                <Badge size="xs" color="orange" variant="light" leftSection={<IconLock size={10} />}>
                                  Secreto
                                </Badge>
                              )}
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td style={{ maxWidth: 300 }}>
                          <Text lineClamp={2} size="sm" c="dimmed">
                            {logro.descripcion}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={getBadgeColor(logro.rareza)}
                            variant="dot"
                            size="lg"
                            leftSection={getRarezaIcon(logro.rareza)}
                          >
                            {rarezaOptions.find(r => r.value === logro.rareza)?.label}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" color="blue" size="lg" leftSection={<IconSparkles size={14} />}>
                            {logro.recompensaPuntos}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={logro.estaActivo ? 'green' : 'gray'} 
                            variant="light"
                            size="md"
                          >
                            {logro.estaActivo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4} justify="flex-end">
                            <Tooltip label="Ver detalles">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                size="lg"
                                onClick={() => handleView(logro)}
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Editar">
                              <ActionIcon
                                variant="light"
                                color="yellow"
                                size="lg"
                                onClick={() => handleEdit(logro)}
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Eliminar">
                              <ActionIcon
                                variant="light"
                                color="red"
                                size="lg"
                                onClick={() => handleDeleteClick(logro)}
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>

              {totalPages > 1 && (
                <Box p="md">
                  <Group justify="center">
                    <Pagination
                      value={activePage}
                      onChange={setActivePage}
                      total={totalPages}
                      size="md"
                      radius="md"
                    />
                  </Group>
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Modal de Creación/Edición Mejorado */}
        <Modal
          opened={opened}
          onClose={close}
          title={
            <Group gap="sm">
              <ThemeIcon variant="light" size="lg" radius="md">
                {editingLogro ? <IconEdit size={20} /> : <IconPlus size={20} />}
              </ThemeIcon>
              <Text fw={600} size="lg">
                {editingLogro ? 'Editar Logro' : 'Nuevo Logro'}
              </Text>
            </Group>
          }
          size="lg"
          radius="md"
        >
          <Stack gap="md">
            <Divider />
            
            <Group grow>
              <TextInput
                label="Nombre del Logro"
                placeholder="Ej: Primer Paso"
                required
                leftSection={<IconTrophy size={16} />}
                {...form.getInputProps('nombre')}
              />
              <Select
                label="Rareza"
                placeholder="Selecciona rareza"
                data={rarezaOptions}
                required
                leftSection={<IconStar size={16} />}
                {...form.getInputProps('rareza')}
              />
            </Group>

            <Textarea
              label="Descripción"
              placeholder="Describe el logro y cómo conseguirlo..."
              required
              rows={3}
              {...form.getInputProps('descripcion')}
            />

            <TextInput
              label="URL de Imagen de Insignia"
              placeholder="https://ejemplo.com/imagen.png"
              leftSection={<IconPhoto size={16} />}
              {...form.getInputProps('urlImagenInsignia')}
            />

            <NumberInput
              label="Puntos de Recompensa"
              placeholder="100"
              min={0}
              required
              leftSection={<IconSparkles size={16} />}
              {...form.getInputProps('recompensaPuntos')}
            />

            <Textarea
              label="Mensaje de Desbloqueo"
              placeholder="¡Felicitaciones! Has desbloqueado..."
              rows={2}
              {...form.getInputProps('mensajeDesbloqueo')}
            />

            <Textarea
              label="Criterio de Desbloqueo"
              placeholder="Define los criterios para obtener este logro..."
              rows={3}
              {...form.getInputProps('criterioDesbloqueo')}
            />

            <Paper p="md" withBorder radius="md" bg="gray.0">
              <Group grow>
                <Switch
                  label="Es secreto"
                  description="No visible hasta desbloquear"
                  size="md"
                  {...form.getInputProps('esSecreto', { type: 'checkbox' })}
                />
                <Switch
                  label="Está activo"
                  description="Puede ser obtenido"
                  size="md"
                  {...form.getInputProps('estaActivo', { type: 'checkbox' })}
                />
              </Group>
            </Paper>

            <Group justify="center" gap="sm" mt="md">
              <ActionButtons.Cancel 
                onClick={close} 
                loading={loading} 
              />
              <ActionButtons.Save 
                onClick={form.onSubmit(handleSubmit)} 
                loading={loading} 
              />
            </Group>
          </Stack>
        </Modal>

        {/* Modal de Detalles Mejorado */}
        <Modal
          opened={detailsOpened}
          onClose={closeDetails}
          title={
            <Group gap="sm">
              <ThemeIcon variant="light" size="lg" radius="md" color="blue">
                <IconEye size={20} />
              </ThemeIcon>
              <Text fw={600} size="lg">Detalles del Logro</Text>
            </Group>
          }
          size="md"
          radius="md"
        >
          {selectedLogro && (
            <Stack gap="lg">
              <Divider />
              
              <Paper p="xl" radius="md" bg="gray.0" style={{ textAlign: 'center' }}>
                <Stack gap="md" align="center">
                  <Avatar
                    src={selectedLogro.urlImagenInsignia}
                    size={120}
                    radius="md"
                  >
                    <IconTrophy size={60} />
                  </Avatar>
                  
                  <Title order={3}>{selectedLogro.nombre}</Title>
                  
                  <Group justify="center">
                    <Badge
                      color={getBadgeColor(selectedLogro.rareza)}
                      variant="dot"
                      size="xl"
                      leftSection={getRarezaIcon(selectedLogro.rareza)}
                    >
                      {rarezaOptions.find(r => r.value === selectedLogro.rareza)?.label}
                    </Badge>
                    <Badge color="blue" variant="light" size="xl" leftSection={<IconSparkles size={16} />}>
                      {selectedLogro.recompensaPuntos} puntos
                    </Badge>
                  </Group>
                </Stack>
              </Paper>

              <Paper p="md" withBorder radius="md">
                <Text size="sm" c="dimmed" mb={8}>Descripción</Text>
                <Text>{selectedLogro.descripcion}</Text>
              </Paper>

              {selectedLogro.mensajeDesbloqueo && (
                <Alert color="green" title="🎉 Mensaje de Desbloqueo" radius="md">
                  {selectedLogro.mensajeDesbloqueo}
                </Alert>
              )}

              <Group>
                {selectedLogro.esSecreto && (
                  <Badge color="orange" variant="light" leftSection={<IconLock size={14} />}>
                    Logro Secreto
                  </Badge>
                )}
                <Badge color={selectedLogro.estaActivo ? 'green' : 'gray'} variant="light">
                  {selectedLogro.estaActivo ? 'Activo' : 'Inactivo'}
                </Badge>
              </Group>

              <Divider />

              <Group gap="xl">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Creado</Text>
                  <Text size="sm">{new Date(selectedLogro.creadoEn).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</Text>
                </div>
                
                {selectedLogro.actualizadoEn && (
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Actualizado</Text>
                    <Text size="sm">{new Date(selectedLogro.actualizadoEn).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</Text>
                  </div>
                )}
              </Group>
            </Stack>
          )}
        </Modal>

        {/* Modal de Confirmación de Eliminación */}
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