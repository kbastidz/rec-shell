import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Table,
  Group,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Modal,
  ActionIcon,
  Badge,
  Stack,
  Grid,
  Box,
  Loader,
  Alert,
  Menu,
  Image,
  Text
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconToggleLeft,
  IconToggleRight,
  IconMinus,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';
import { Recompensa } from '../../types/model';
import { useCrearRecompensa, useActualizarRecompensa, useReducirStock, useRecompensasAdmin, useEliminarRecompensa, useActivarRecompensa, useDesactivarRecompensa } from '../hooks/useRecompensa';

// ========== COMPONENTE: MODAL DE FORMULARIO ==========
interface RecompensaFormModalProps {
  opened: boolean;
  onClose: () => void;
  recompensa: Recompensa | null;
  onSuccess: () => void;
}

function RecompensaFormModal({ 
  opened, 
  onClose, 
  recompensa, 
  onSuccess 
}: RecompensaFormModalProps) {
  const { crear, loading: creando } = useCrearRecompensa();
  const { actualizar, loading: actualizando } = useActualizarRecompensa();
  const loading = creando || actualizando;

  const form = useForm({
    initialValues: {
      nombre: recompensa?.nombre || '',
      descripcion: recompensa?.descripcion || '',
      urlImagen: recompensa?.urlImagen || '',
      costoPuntos: recompensa?.costoPuntos || 0,
      cantidadStock: recompensa?.cantidadStock || 0,
      esIlimitado: recompensa?.esIlimitado || false,
      estaActivo: recompensa?.estaActivo ?? true,
      terminosCondiciones: recompensa?.terminosCondiciones || '',
      validoDesde: recompensa?.validoDesde ? new Date(recompensa.validoDesde) : null,
      validoHasta: recompensa?.validoHasta ? new Date(recompensa.validoHasta) : null
    },
    validate: {
      nombre: (value) => (!value?.trim() ? 'El nombre es requerido' : null),
      costoPuntos: (value) => (value < 0 ? 'El costo debe ser mayor o igual a 0' : null),
      cantidadStock: (value, values) =>
        !values.esIlimitado && value < 0 ? 'El stock debe ser mayor o igual a 0' : null
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const data: any = {
        ...values,
        validoDesde: values.validoDesde?.toISOString(),
        validoHasta: values.validoHasta?.toISOString()
      };

      if (recompensa?.id) {
        await actualizar(recompensa.id, data);
        notifications.show({
          title: 'Éxito',
          message: 'Recompensa actualizada correctamente',
          color: 'green',
          icon: <IconCheck size="1rem" />
        });
      } else {
        await crear(data);
        notifications.show({
          title: 'Éxito',
          message: 'Recompensa creada correctamente',
          color: 'green',
          icon: <IconCheck size="1rem" />
        });
      }
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.message || 'Ocurrió un error al guardar',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!loading) {
          form.reset();
          onClose();
        }
      }}
      title={
        <Title order={3}>
          {recompensa ? 'Editar Recompensa' : 'Nueva Recompensa'}
        </Title>
      }
      size="lg"
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack gap="md">
        <TextInput
          label="Nombre"
          placeholder="Ingrese el nombre"
          required
          disabled={loading}
          {...form.getInputProps('nombre')}
        />

        <Textarea
          label="Descripción"
          placeholder="Ingrese la descripción"
          minRows={3}
          disabled={loading}
          {...form.getInputProps('descripcion')}
        />

        <TextInput
          label="URL de Imagen"
          placeholder="https://ejemplo.com/imagen.jpg"
          disabled={loading}
          {...form.getInputProps('urlImagen')}
        />

        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Costo en Puntos"
              placeholder="0"
              required
              min={0}
              disabled={loading}
              {...form.getInputProps('costoPuntos')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Cantidad en Stock"
              placeholder="0"
              min={0}
              disabled={loading || form.values.esIlimitado}
              {...form.getInputProps('cantidadStock')}
            />
          </Grid.Col>
        </Grid>

        <Switch
          label="Stock Ilimitado"
          disabled={loading}
          {...form.getInputProps('esIlimitado', { type: 'checkbox' })}
        />

        <Switch
          label="Activo"
          disabled={loading}
          {...form.getInputProps('estaActivo', { type: 'checkbox' })}
        />

        <Grid>
          <Grid.Col span={6}>
            <DateInput
              label="Válido Desde"
              placeholder="Seleccione fecha"
              disabled={loading}
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('validoDesde')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Válido Hasta"
              placeholder="Seleccione fecha"
              disabled={loading}
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('validoHasta')}
            />
          </Grid.Col>
        </Grid>

        <Textarea
          label="Términos y Condiciones"
          placeholder="Ingrese los términos y condiciones"
          minRows={3}
          disabled={loading}
          {...form.getInputProps('terminosCondiciones')}
        />

        <Group justify="flex-end" mt="md">
          <Button 
            variant="subtle" 
            onClick={() => {
              form.reset();
              onClose();
            }} 
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => form.onSubmit(handleSubmit)()} 
            loading={loading}
          >
            {recompensa ? 'Actualizar' : 'Crear'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ========== COMPONENTE: MODAL REDUCIR STOCK ==========
interface ReducirStockModalProps {
  opened: boolean;
  onClose: () => void;
  recompensa: Recompensa | null;
  onSuccess: () => void;
}

function ReducirStockModal({ 
  opened, 
  onClose, 
  recompensa, 
  onSuccess 
}: ReducirStockModalProps) {
  const { reducirStock, loading } = useReducirStock();
  const [cantidad, setCantidad] = useState(1);

  const handleReducir = async () => {
    if (!recompensa?.id) return;

    try {
      await reducirStock(recompensa.id, cantidad);
      notifications.show({
        title: 'Éxito',
        message: `Stock reducido en ${cantidad} unidades`,
        color: 'green',
        icon: <IconCheck size="1rem" />
      });
      setCantidad(1);
      onSuccess();
      onClose();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.message || 'Error al reducir stock',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!loading) {
          setCantidad(1);
          onClose();
        }
      }}
      title="Reducir Stock"
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm">
          Stock actual: <strong>{recompensa?.cantidadStock || 0}</strong>
        </Text>
        <NumberInput
          label="Cantidad a reducir"
          placeholder="Ingrese la cantidad"
          min={1}
          max={recompensa?.cantidadStock || 0}
          value={cantidad}
          onChange={(val) => setCantidad(Number(val))}
          disabled={loading}
          required
        />
        <Group justify="flex-end" mt="md">
          <Button 
            variant="subtle" 
            onClick={() => {
              setCantidad(1);
              onClose();
            }} 
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleReducir} 
            loading={loading} 
            color="orange"
          >
            Reducir Stock
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ========== COMPONENTE PRINCIPAL: CRUD RECOMPENSAS ==========
export  function RecompensasCRUD() {
  const { recompensas, loading, error, refetch } = useRecompensasAdmin();
  const { eliminar } = useEliminarRecompensa();
  const { activar } = useActivarRecompensa();
  const { desactivar } = useDesactivarRecompensa();

  const [modalOpened, setModalOpened] = useState(false);
  const [stockModalOpened, setStockModalOpened] = useState(false);
  const [selectedRecompensa, setSelectedRecompensa] = useState<Recompensa | null>(null);

  const handleNueva = () => {
    setSelectedRecompensa(null);
    setModalOpened(true);
  };

  const handleEditar = (recompensa: Recompensa) => {
    setSelectedRecompensa(recompensa);
    setModalOpened(true);
  };

  const handleEliminar = (recompensa: Recompensa) => {
    modals.openConfirmModal({
      title: 'Eliminar Recompensa',
      centered: true,
      children: (
        <Text size="sm">
          ¿Estás seguro de eliminar la recompensa{' '}
          <strong>{recompensa.nombre}</strong>? Esta acción no se puede deshacer.
        </Text>
      ),
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const success = await eliminar(recompensa.id);
          if (success) {
            notifications.show({
              title: 'Éxito',
              message: 'Recompensa eliminada correctamente',
              color: 'green',
              icon: <IconCheck size="1rem" />
            });
            refetch();
          }
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error?.message || 'Error al eliminar',
            color: 'red',
            icon: <IconAlertCircle size="1rem" />
          });
        }
      }
    });
  };

  const handleToggleEstado = async (recompensa: Recompensa) => {
    try {
      if (recompensa.estaActivo) {
        const success = await desactivar(recompensa.id);
        if (success) {
          notifications.show({
            title: 'Desactivada',
            message: 'Recompensa desactivada correctamente',
            color: 'blue'
          });
          refetch();
        }
      } else {
        const success = await activar(recompensa.id);
        if (success) {
          notifications.show({
            title: 'Activada',
            message: 'Recompensa activada correctamente',
            color: 'green'
          });
          refetch();
        }
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.message || 'Error al cambiar estado',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />
      });
    }
  };

  const handleReducirStock = (recompensa: Recompensa) => {
    setSelectedRecompensa(recompensa);
    setStockModalOpened(true);
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="md" withBorder>
        <Group justify="space-between" mb="lg">
          <Title order={2}>Gestión de Recompensas</Title>
          <Button 
            leftSection={<IconPlus size="1rem" />} 
            onClick={handleNueva}
          >
            Nueva Recompensa
          </Button>
        </Group>

        <Box style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Imagen</Table.Th>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Descripción</Table.Th>
                <Table.Th>Costo</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Vigencia</Table.Th>
                <Table.Th style={{ textAlign: 'center' }}>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recompensas.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8} style={{ textAlign: 'center' }}>
                    <Text c="dimmed" size="sm" py="xl">
                      No hay recompensas registradas
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                recompensas.map((recompensa) => (
                  <Table.Tr key={recompensa.id}>
                    <Table.Td>
                      {recompensa.urlImagen ? (
                        <Image
                          src={recompensa.urlImagen}
                          alt={recompensa.nombre}
                          w={50}
                          h={50}
                          fit="cover"
                          radius="sm"
                        />
                      ) : (
                        <Box 
                          w={50} 
                          h={50} 
                          bg="gray.2" 
                          style={{ 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Text size="xs" c="dimmed">Sin img</Text>
                        </Box>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{recompensa.nombre}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {recompensa.descripcion || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {recompensa.costoPuntos} pts
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {recompensa.esIlimitado ? (
                        <Badge color="green" variant="light">
                          Ilimitado
                        </Badge>
                      ) : (
                        <Text size="sm">{recompensa.cantidadStock}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={recompensa.estaActivo ? 'green' : 'red'}
                        variant="filled"
                      >
                        {recompensa.estaActivo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs">
                        {recompensa.validoDesde && recompensa.validoHasta
                          ? `${new Date(
                              recompensa.validoDesde
                            ).toLocaleDateString()} - ${new Date(
                              recompensa.validoHasta
                            ).toLocaleDateString()}`
                          : 'Sin límite'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group justify="center" gap="xs" wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleEditar(recompensa)}
                          title="Editar"
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>

                        <Menu shadow="md" width={200} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size="1rem" />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={
                                recompensa.estaActivo ? (
                                  <IconToggleLeft size="0.875rem" />
                                ) : (
                                  <IconToggleRight size="0.875rem" />
                                )
                              }
                              onClick={() => handleToggleEstado(recompensa)}
                            >
                              {recompensa.estaActivo
                                ? 'Desactivar'
                                : 'Activar'}
                            </Menu.Item>

                            {!recompensa.esIlimitado && (
                              <Menu.Item
                                leftSection={<IconMinus size="0.875rem" />}
                                onClick={() => handleReducirStock(recompensa)}
                              >
                                Reducir Stock
                              </Menu.Item>
                            )}

                            <Menu.Divider />

                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size="0.875rem" />}
                              onClick={() => handleEliminar(recompensa)}
                            >
                              Eliminar
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>

      {/* Modales */}
      <RecompensaFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        recompensa={selectedRecompensa}
        onSuccess={refetch}
      />

      <ReducirStockModal
        opened={stockModalOpened}
        onClose={() => setStockModalOpened(false)}
        recompensa={selectedRecompensa}
        onSuccess={refetch}
      />
    </Container>
  );
}