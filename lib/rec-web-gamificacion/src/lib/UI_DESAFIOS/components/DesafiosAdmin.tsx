import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Group,
  Button,
  Table,
  Badge,
  Text,
  Stack,
  Select,
  TextInput,
  ActionIcon,
  Modal,
  Textarea,
  NumberInput,
  Switch,
  Grid,
  Alert,
  Loader,
  Menu,
  rem,
  Box,
  Tabs,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconCalendarStats,
  IconTarget,
  IconTrophy,
  IconAlertCircle,
  IconDotsVertical,
  IconRefresh,
  IconInfoCircle,
  IconCalendar,
} from '@tabler/icons-react';
import { useDesafio } from '../hooks/useGamificacion';
import { Dificultad } from '../../enums/Enums';
import { Desafio, TipoDesafio } from '../../types/model';
import { DesafioFormData } from '../../types/dto';
import { dificultadColors, ST_GET_USER_ID } from '../../utils/utilidad';
import {
  ActionButtons,
  NOTIFICATION_MESSAGES,
  useNotifications,
} from '@rec-shell/rec-web-shared';
import { useListarTiposDesafios } from '../../UI_TIPO_DESAFIO/hooks/useGamificacion';

export const DesafiosAdmin: React.FC = () => {
  const {
    desafios,
    loading,
    error,
    CREAR,
    ACTUALIZAR,
    BUSCAR,
    obtenerDesafiosDiarios,
    obtenerDesafiosSemanales,
    procesarDesafiosVencidos,
    clearError,
  } = useDesafio();

  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('activos');
  const [editingDesafio, setEditingDesafio] = useState<Desafio | null>(null);
  const notifications = useNotifications();

  const form = useForm<DesafioFormData>({
    initialValues: {
      tipoDesafioId: '',
      titulo: '',
      descripcion: '',
      dificultad: 'FACIL' as Dificultad,
      categoria: '',
      fechaInicio: null,
      fechaFin: null,
      maxParticipantes: 0,
      esDiario: false,
      esSemanal: false,
      esEspecial: false,
      estaActivo: true,
      criterioCompletado: '',
      recompensas: '',
    },
    validate: {
      tipoDesafioId: (value) =>
        !value ? 'El tipo de desafío es requerido' : null,
      titulo: (value) =>
        value.length < 3 ? 'El título debe tener al menos 3 caracteres' : null,
      descripcion: (value) =>
        value.length < 10
          ? 'La descripción debe tener al menos 10 caracteres'
          : null,
      categoria: (value) =>
        value.length < 2 ? 'La categoría es requerida' : null,
      maxParticipantes: (value) =>
        value < 1 ? 'Debe permitir al menos 1 participante' : null,
    },
  });

  useEffect(() => {
    loadDesafios();
  }, [filterType]);

  //Ref 1 Consumir hook para combo v1
  const { data: tiposDesafios, LISTAR } = useListarTiposDesafios();
  useEffect(() => {
    LISTAR();
  }, []);
  const listTipoDesafios = tiposDesafios.map((desafio) => ({
    value: desafio.id.toString(),
    label: `${desafio.nombre} - ${desafio.nombreMostrar}`,
  }));
  //Ref 1 Consumir hook para combo v1

  const loadDesafios = async () => {
    try {
      switch (filterType) {
        case 'diarios':
          await obtenerDesafiosDiarios();
          break;
        case 'semanales':
          await obtenerDesafiosSemanales();
          break;
        default:
          await BUSCAR();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values: DesafioFormData) => {
    try {
      const desafioData: Partial<Desafio> = {
        ...values,
        /*fechaInicio: values.fechaInicio
          ? new Date(values.fechaInicio).toISOString()
          : undefined,
        fechaFin: values.fechaFin
          ? new Date(values.fechaFin).toISOString()
          : undefined,*/
        fechaInicio: values.fechaInicio || undefined,
        fechaFin: values.fechaFin || undefined,
        creadoPor: ST_GET_USER_ID(),
        tipoDesafio: {
          id: values.tipoDesafioId,
        } as TipoDesafio,
      };
      console.log(desafioData);
      if (editingDesafio) {
        await ACTUALIZAR(editingDesafio.id, desafioData);
        notifications.success(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          'Desafío actualizado correctamente'
        );
      } else {
        desafioData.creadoEn = new Date().toISOString();
        desafioData.participaciones = [];
        await CREAR(desafioData);
        notifications.success(
          NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
          'Desafío creado correctamente'
        );
      }

      form.reset();
      handleCloseModal();
      loadDesafios();
    } catch (error) {
      console.log('error', error);
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        'Error al guardar el desafío'
      );
    }
  };

  const handleEdit = (desafio: Desafio) => {
    setEditingDesafio(desafio);
    console.log('desafio', desafio);
    form.setValues({
      //tipoDesafioId: desafio.tipoDesafio?.id || '',
      tipoDesafioId:
        desafio.idTipoDesafio?.toString() ||
        desafio.tipoDesafio?.id?.toString() ||
        '',
      titulo: desafio.titulo,
      descripcion: desafio.descripcion,
      dificultad: desafio.dificultad,
      categoria: desafio.categoria || '',
      fechaInicio: desafio.fechaInicio || null,
      fechaFin: desafio.fechaFin || null,
      maxParticipantes: desafio.maxParticipantes || 0,
      esDiario: desafio.esDiario,
      esSemanal: desafio.esSemanal,
      esEspecial: desafio.esEspecial,
      estaActivo: desafio.estaActivo,
      criterioCompletado: desafio.criterioCompletado,
      recompensas: desafio.recompensas,
    });
    open();
  };

  const handleCloseModal = () => {
    close();
    setEditingDesafio(null);
    form.reset();
  };

  const handleProcesarVencidos = async () => {
    try {
      await procesarDesafiosVencidos();
      notifications.success(
        NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
        'Desafíos vencidos procesados correctamente'
      );
      loadDesafios();
    } catch (error) {
      console.log('error', error);
    }
  };

  const filteredDesafios = desafios.filter(
    (desafio) =>
      desafio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desafio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desafio.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p="md">
      <Stack gap="lg">
        {/* Header */}
        <Paper p="md" withBorder>
          <Group justify="space-between" align="center">
            <Title order={2}>
              <Group gap="xs">
                <IconTarget size={28} />
                Gestión de Desafíos
              </Group>
            </Title>
            <Group gap="md">
              <Button
                leftSection={<IconRefresh size={16} />}
                variant="light"
                onClick={handleProcesarVencidos}
                loading={loading}
              >
                Procesar Vencidos
              </Button>
              <ActionButtons.Modal onClick={open} loading={loading} />
            </Group>
          </Group>
        </Paper>

        {/* Filters */}
        <Paper p="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Buscar desafíos..."
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                placeholder="Filtrar por tipo"
                leftSection={<IconFilter size={16} />}
                data={[
                  { value: 'activos', label: 'Activos' },
                  { value: 'diarios', label: 'Diarios' },
                  { value: 'semanales', label: 'Semanales' },
                ]}
                value={filterType}
                onChange={(value) => setFilterType(value || 'activos')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group justify="flex-end">
                <ActionButtons.Refresh
                  onClick={loadDesafios}
                  loading={loading}
                />
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            onClose={clearError}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* Table */}
        <Paper withBorder>
          {loading ? (
            <Stack align="center" p="xl">
              <Loader size="lg" />
              <Text>Cargando desafíos...</Text>
            </Stack>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Título</Table.Th>
                    <Table.Th>Categoría</Table.Th>
                    <Table.Th>Dificultad</Table.Th>
                    <Table.Th>Tipo</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Participantes</Table.Th>
                    <Table.Th>Fechas</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredDesafios.map((desafio) => (
                    <Table.Tr key={desafio.id}>
                      <Table.Td>
                        <Stack gap={4}>
                          <Text fw={500}>{desafio.titulo}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {desafio.descripcion}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue">
                          {desafio.categoria}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={dificultadColors[desafio.dificultad]}>
                          {desafio.dificultad}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          {desafio.esDiario && (
                            <Badge size="sm" color="green">
                              Diario
                            </Badge>
                          )}
                          {desafio.esSemanal && (
                            <Badge size="sm" color="blue">
                              Semanal
                            </Badge>
                          )}
                          {desafio.esEspecial && (
                            <Badge size="sm" color="purple">
                              Especial
                            </Badge>
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={desafio.estaActivo ? 'green' : 'red'}>
                          {desafio.estaActivo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <IconTrophy size={16} />
                          <Text size="sm">
                            {desafio.totalParticipantes}
                            {desafio.maxParticipantes &&
                              `/${desafio.maxParticipantes}`}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          {desafio.fechaInicio && (
                            <Text size="xs" c="dimmed">
                              Inicio:{' '}
                              {new Date(
                                desafio.fechaInicio
                              ).toLocaleDateString()}
                            </Text>
                          )}
                          {desafio.fechaFin && (
                            <Text size="xs" c="dimmed">
                              Fin:{' '}
                              {new Date(desafio.fechaFin).toLocaleDateString()}
                            </Text>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical
                                style={{ width: rem(16), height: rem(16) }}
                              />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={
                                <IconEdit
                                  style={{ width: rem(14), height: rem(14) }}
                                />
                              }
                              onClick={() => handleEdit(desafio)}
                            >
                              Editar
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}

          {!loading && filteredDesafios.length === 0 && (
            <Stack align="center" p="xl">
              <IconCalendarStats size={48} stroke={1.5} color="gray" />
              <Text c="dimmed">No se encontraron registros</Text>
            </Stack>
          )}
        </Paper>

        {/* Modal */}
        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title={editingDesafio ? 'Editar Registro' : 'Nuevo Registro'}
          size="xl"
          padding="lg"
        >
          <Tabs defaultValue="info" variant="pills">
            <Tabs.List grow mb="md">
              <Tabs.Tab value="info" leftSection={<IconInfoCircle size={16} />}>
                Información
              </Tabs.Tab>
              <Tabs.Tab value="dates" leftSection={<IconCalendar size={16} />}>
                Fechas y Config
              </Tabs.Tab>
              <Tabs.Tab value="rewards" leftSection={<IconTrophy size={16} />}>
                Criterios y Recompensas
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="info">
              <Stack gap="md">
                <Select
                  label="Tipo de Desafío"
                  placeholder="Seleccione un tipo"
                  data={listTipoDesafios}
                  {...form.getInputProps('tipoDesafioId')}
                  required
                  searchable
                />

                <TextInput
                  label="Título"
                  placeholder="Ingrese el título del desafío"
                  required
                  {...form.getInputProps('titulo')}
                />

                <Textarea
                  label="Descripción"
                  placeholder="Describa el desafío..."
                  required
                  rows={4}
                  {...form.getInputProps('descripcion')}
                />

                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label="Dificultad"
                      required
                      data={[
                        { value: 'FACIL', label: '🟢 Fácil' },
                        { value: 'MEDIO', label: '🟡 Medio' },
                        { value: 'DIFICIL', label: '🟠 Difícil' },
                        { value: 'EXTREMO', label: '🔴 Extremo' },
                      ]}
                      {...form.getInputProps('dificultad')}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <TextInput
                      label="Categoría"
                      placeholder="Ej: Fitness, Lectura..."
                      required
                      {...form.getInputProps('categoria')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="dates">
              <Stack gap="md">
                <Paper p="md" withBorder>
                  <Text size="sm" fw={500} mb="sm">
                    Período del Desafío
                  </Text>
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Fecha de Inicio"
                        type="date"
                        {...form.getInputProps('fechaInicio')}
                        required
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <TextInput
                        label="Fecha de Fin"
                        type="date"
                        {...form.getInputProps('fechaFin')}
                        required
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>

                <Paper p="md" withBorder>
                  <Text size="sm" fw={500} mb="sm">
                    Configuración General
                  </Text>
                  <Grid>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Máximo de Participantes"
                        placeholder="0 = sin límite"
                        min={0}
                        description="Deja en 0 para participantes ilimitados"
                        {...form.getInputProps('maxParticipantes')}
                      />
                    </Grid.Col>

                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed" mb={4}>
                          Tipo de Desafío
                        </Text>
                        <Switch
                          label="Es Diario"
                          {...form.getInputProps('esDiario', {
                            type: 'checkbox',
                          })}
                        />
                        <Switch
                          label="Es Semanal"
                          {...form.getInputProps('esSemanal', {
                            type: 'checkbox',
                          })}
                        />
                        <Switch
                          label="Es Especial"
                          {...form.getInputProps('esEspecial', {
                            type: 'checkbox',
                          })}
                        />
                      </Stack>
                    </Grid.Col>
                  </Grid>

                  <Switch
                    label="Está Activo"
                    size="md"
                    color="teal"
                    {...form.getInputProps('estaActivo', { type: 'checkbox' })}
                  />
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="rewards">
              <Stack gap="md">
                <Textarea
                  label="Criterios de Completado"
                  placeholder="Ejemplo: puntos: 100, dias: 7"
                  description="Define las condiciones para completar el desafío"
                  rows={5}
                  {...form.getInputProps('criterioCompletado')}
                />

                <Textarea
                  label="Recompensas"
                  placeholder="Ejemplo: {puntos: 50, insignia: 'novato'}"
                  description="Define las recompensas que recibirán los participantes"
                  rows={5}
                  {...form.getInputProps('recompensas')}
                />
              </Stack>
            </Tabs.Panel>
          </Tabs>

          <Group
            justify="center"
            mt="xl"
            pt="md"
            style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}
          >
            <ActionButtons.Cancel
              onClick={handleCloseModal}
              loading={loading}
            />

            <ActionButtons.Save
              onClick={() => form.onSubmit(handleSubmit)()}
              loading={loading}
            />
          </Group>
        </Modal>
      </Stack>
    </Box>
  );
};
