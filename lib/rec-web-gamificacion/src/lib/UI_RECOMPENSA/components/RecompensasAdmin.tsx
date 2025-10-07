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
  Text,
  Select
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconToggleLeft,
  IconToggleRight,
  IconMinus,
  IconAlertCircle
} from '@tabler/icons-react';
import { Recompensa, TipoRecompensa } from '../../types/model';
import { useCrear, useActualizar, useReducirStock, useRecompensasAdmin, useEliminar, useActivarRecompensa, useDesactivarRecompensa } from '../hooks/useGamificacion';
import { DeleteConfirmModal, NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';

interface RecompensaFormModalProps {
  opened: boolean;
  onClose: () => void;
  recompensa: Recompensa | null;
  onSuccess: () => void;
}

const mockTiposRecompensa: TipoRecompensa[] = [
  {
    id: '1',
    nombre: 'PRODUCTO_FISICO',
    nombreMostrar: 'Producto Físico',
    descripcion: 'Productos tangibles que requieren envío',
    esFisico: true,
    esDigital: false,
    creadoEn: '2025-01-01',
    recompensas: []
  }
];

function useTiposRecompensa() {
  const [loading, setLoading] = useState(false);
  
  /* // Reemplaza esto con tu hook real
  const { data, isLoading } = useTuApiDeTipos();
  
  return {
    tiposRecompensa: data || [],
    loading: isLoading
  };*/
  
  return {
    tiposRecompensa: mockTiposRecompensa,
    loading
  };
}

function RecompensaFormModal({ 
  opened, 
  onClose, 
  recompensa, 
  onSuccess 
}: RecompensaFormModalProps) {
  const { CREAR, loading: creando } = useCrear();
  const { ACTUALIZAR, loading: actualizando } = useActualizar();
  const loading = creando || actualizando;
  const notifications = useNotifications();
  const { tiposRecompensa } = useTiposRecompensa();

  interface FormValues {
    tipoRecompensaId: string;
    nombre: string;
    descripcion: string;
    urlImagen: string;
    costoPuntos: number;
    cantidadStock: number;
    esIlimitado: boolean;
    estaActivo: boolean;
    terminosCondiciones: string;
    validoDesde: Date | null;
    validoHasta: Date | null;
  }

  const form = useForm<FormValues>({
    initialValues: {
      tipoRecompensaId: '',
      nombre: '',
      descripcion: '',
      urlImagen: '',
      costoPuntos: 0,
      cantidadStock: 0,
      esIlimitado: false,
      estaActivo: true,
      terminosCondiciones: '',
      validoDesde: null,
      validoHasta: null
    },
    validate: {
      tipoRecompensaId: (value) => (!value ? 'El tipo de recompensa es requerido' : null),
      nombre: (value) => (!value?.trim() ? 'El nombre es requerido' : null),
      costoPuntos: (value) => (value < 0 ? 'El costo debe ser mayor o igual a 0' : null),
      cantidadStock: (value, values) =>
        !values.esIlimitado && value < 0 ? 'El stock debe ser mayor o igual a 0' : null
    }
  });

  React.useEffect(() => {
    if (opened) {
      if (recompensa) {
        form.setValues({
          tipoRecompensaId: recompensa.tipoRecompensa?.id || '',
          nombre: recompensa.nombre || '',
          descripcion: recompensa.descripcion || '',
          urlImagen: recompensa.urlImagen || '',
          costoPuntos: recompensa.costoPuntos || 0,
          cantidadStock: recompensa.cantidadStock || 0,
          esIlimitado: recompensa.esIlimitado || false,
          estaActivo: recompensa.estaActivo ?? true,
          terminosCondiciones: recompensa.terminosCondiciones || '',
          validoDesde: recompensa.validoDesde ? new Date(recompensa.validoDesde) : null,
          validoHasta: recompensa.validoHasta ? new Date(recompensa.validoHasta) : null
        });
      } else {
        form.reset();
      }
    }
  }, [opened, recompensa]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const data: any = {
        ...values,
        tipoRecompensa: { id: values.tipoRecompensaId }
      };

      if (recompensa?.id) {
        await ACTUALIZAR(recompensa.id, data);
        notifications.success(); 
      } else {
        await CREAR(data);
        notifications.success(); 
      }
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
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
          {recompensa ? 'Editar Registro' : 'Nuevo Registro'}
        </Title>
      }
      size="lg"
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack gap="md">
        <Select
          label="Tipo de Recompensa"
          placeholder="Seleccione un tipo"
          required
          disabled={loading}
          data={tiposRecompensa.map(tipo => ({
            value: tipo.id,
            label: tipo.nombreMostrar
          }))}
          {...form.getInputProps('tipoRecompensaId')}
        />
        
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
            <TextInput
              label="Válido Desde"
              type="date"
              {...form.getInputProps('validoDesde')}
              required
            />            
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Válido Hasta"
              type="date"
              {...form.getInputProps('validoHasta')}
              required
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
            {recompensa ? 'ACTUALIZAR' : 'CREAR'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

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
  const notifications = useNotifications();

  const handleReducir = async () => {
    if (!recompensa?.id) return;

    try {
      await reducirStock(recompensa.id, cantidad);
      notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, `Stock reducido en ${cantidad} unidades`); 
     
      setCantidad(1);
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
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

export  function RecompensasAdmin() {
  const { recompensas, loading, error, refetch } = useRecompensasAdmin();
  const { eliminar } = useEliminar();
  const { activar } = useActivarRecompensa();
  const { desactivar } = useDesactivarRecompensa();

  const [modalOpened, setModalOpened] = useState(false);
  const [stockModalOpened, setStockModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedRecompensa, setSelectedRecompensa] = useState<Recompensa | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Recompensa | null>(null);
  const notifications = useNotifications();

  const handleNueva = () => {
    setSelectedRecompensa(null);
    setModalOpened(true);
  };

  const handleEditar = (recompensa: Recompensa) => {
    setSelectedRecompensa(recompensa);
    setModalOpened(true);
  };

  const handleEliminar = (recompensa: Recompensa) => {
    setItemToDelete(recompensa);
    setDeleteModalOpened(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpened(false);
    setItemToDelete(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await eliminar(id);
      if (success) {
        notifications.success(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          'Recompensa eliminada correctamente'
        );
        refetch();
      }
      closeDeleteModal();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error?.message || 'Error al eliminar',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />
      });
    }
  };

  const handleToggleEstado = async (recompensa: Recompensa) => {
    try {
      if (recompensa.estaActivo) {
        const success = await desactivar(recompensa.id);
        if (success) {
          notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, NOTIFICATION_MESSAGES.GENERAL.STATE.message); 
          refetch();
        }
      } else {
        const success = await activar(recompensa.id);
        if (success) {
          notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, NOTIFICATION_MESSAGES.GENERAL.STATE.message); 
          refetch();
        }
      }
    } catch (error) {
      console.log(error);
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
    <Box p="md">
      <Paper shadow="sm" p="md" withBorder>
        <Group justify="space-between" mb="lg">
          <Title order={2}>Gestión de Recompensas</Title>
          <Button 
            leftSection={<IconPlus size="1rem" />} 
            onClick={handleNueva}
          >
            Registrar
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
                      No se encontraron registros
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
                        ? `${recompensa.validoDesde} - ${recompensa.validoHasta}`
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

      {/* Modal para Eliminar */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(itemToDelete?.id || "")}
        itemName={itemToDelete?.nombre || ""}
        itemType="recompensa"
      />
    </Box>
  );
}