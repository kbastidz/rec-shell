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
  Card,
  Alert,
  Loader,
  Menu,
  rem
} from '@mantine/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
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
  IconRefresh
} from '@tabler/icons-react';
import { useDesafio } from '../hooks/useDesafio';
import { Dificultad } from '../../enums/Enums';
import { Desafio } from '../../types/model';

interface DesafioFormData {
  titulo: string;
  descripcion: string;
  dificultad: Dificultad;
  categoria: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  maxParticipantes: number;
  esDiario: boolean;
  esSemanal: boolean;
  esEspecial: boolean;
  estaActivo: boolean;
  criterioCompletado: string;
  recompensas: string;
}

const dificultadColors = {
  FACIL: 'green',
  MEDIO: 'yellow',
  DIFICIL: 'orange',
  EXTREMO: 'red',
  EXPERTO: 'blue'
};

const tipoDesafioOptions = [
  { value: 'DIARIO', label: 'Diario' },
  { value: 'SEMANAL', label: 'Semanal' },
  { value: 'ESPECIAL', label: 'Especial' }
];

export const DesafiosCRUD: React.FC = () => {
  const {
    desafios,
    loading,
    error,
    crearDesafio,
    obtenerDesafiosActivos,
    obtenerDesafiosDiarios,
    obtenerDesafiosSemanales,
    procesarDesafiosVencidos,
    clearError
  } = useDesafio();

  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('activos');
  const [editingDesafio, setEditingDesafio] = useState<Desafio | null>(null);

  const form = useForm<DesafioFormData>({
    initialValues: {
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
      criterioCompletado: '{}',
      recompensas: '{}'
    },
    validate: {
      titulo: (value) => value.length < 3 ? 'El título debe tener al menos 3 caracteres' : null,
      descripcion: (value) => value.length < 10 ? 'La descripción debe tener al menos 10 caracteres' : null,
      categoria: (value) => value.length < 2 ? 'La categoría es requerida' : null,
      maxParticipantes: (value) => value < 1 ? 'Debe permitir al menos 1 participante' : null
    }
  });

  useEffect(() => {
    loadDesafios();
  }, [filterType]);

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
          await obtenerDesafiosActivos();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron cargar los desafíos',
        color: 'red'
      });
    }
  };

  const handleSubmit = async (values: DesafioFormData) => {
    try {
      const desafioData: Partial<Desafio> = {
        ...values,
        criterioCompletado: JSON.parse(values.criterioCompletado || '{}'),
        recompensas: JSON.parse(values.recompensas || '{}'),
       
        fechaInicio: values.fechaInicio
  ? new Date(values.fechaInicio).toISOString()
  : undefined,
   fechaFin: values.fechaFin
  ? new Date(values.fechaFin).toISOString()
  : undefined,

       // fechaFin: values.fechaFin?.toISOString(),
        creadoEn: new Date().toISOString(),
        participaciones: []
      };

      await crearDesafio(desafioData);
      
      notifications.show({
        title: 'Éxito',
        message: 'Desafío creado correctamente',
        color: 'green'
      });

      form.reset();
      close();
      loadDesafios();
    } catch (error) {
        console.log('error', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo crear el desafío',
        color: 'red'
      });
    }
  };

  const handleEdit = (desafio: Desafio) => {
    setEditingDesafio(desafio);
    form.setValues({
      titulo: desafio.titulo,
      descripcion: desafio.descripcion,
      dificultad: desafio.dificultad,
      categoria: desafio.categoria || '',
      fechaInicio: desafio.fechaInicio ? new Date(desafio.fechaInicio) : null,
      fechaFin: desafio.fechaFin ? new Date(desafio.fechaFin) : null,
      maxParticipantes: desafio.maxParticipantes || 0,
      esDiario: desafio.esDiario,
      esSemanal: desafio.esSemanal,
      esEspecial: desafio.esEspecial,
      estaActivo: desafio.estaActivo,
      criterioCompletado: JSON.stringify(desafio.criterioCompletado, null, 2),
      recompensas: JSON.stringify(desafio.recompensas, null, 2)
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
      notifications.show({
        title: 'Éxito',
        message: 'Desafíos vencidos procesados correctamente',
        color: 'green'
      });
      loadDesafios();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'No se pudieron procesar los desafíos vencidos',
        color: 'red'
      });
    }
  };

  const filteredDesafios = desafios.filter(desafio =>
    desafio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    desafio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    desafio.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container size="xl" py="xl">
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
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={open}
              >
                Nuevo Desafío
              </Button>
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
                  { value: 'semanales', label: 'Semanales' }
                ]}
                value={filterType}
                onChange={(value) => setFilterType(value || 'activos')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Group justify="flex-end">
                <Button
                  variant="light"
                  leftSection={<IconRefresh size={16} />}
                  onClick={loadDesafios}
                  loading={loading}
                >
                  Actualizar
                </Button>
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
                          {desafio.esDiario && <Badge size="sm" color="green">Diario</Badge>}
                          {desafio.esSemanal && <Badge size="sm" color="blue">Semanal</Badge>}
                          {desafio.esEspecial && <Badge size="sm" color="purple">Especial</Badge>}
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
                            {desafio.participaciones.length}
                            {desafio.maxParticipantes && `/${desafio.maxParticipantes}`}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          {desafio.fechaInicio && (
                            <Text size="xs" c="dimmed">
                              Inicio: {new Date(desafio.fechaInicio).toLocaleDateString()}
                            </Text>
                          )}
                          {desafio.fechaFin && (
                            <Text size="xs" c="dimmed">
                              Fin: {new Date(desafio.fechaFin).toLocaleDateString()}
                            </Text>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                              onClick={() => handleEdit(desafio)}
                            >
                              Editar
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                              color="red"
                            >
                              Eliminar
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
              <Text c="dimmed">No se encontraron desafíos</Text>
            </Stack>
          )}
        </Paper>

        {/* Modal */}
        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title={editingDesafio ? 'Editar Desafío' : 'Nuevo Desafío'}
          size="lg"
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    label="Título"
                    placeholder="Ingrese el título del desafío"
                    required
                    {...form.getInputProps('titulo')}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Textarea
                    label="Descripción"
                    placeholder="Describa el desafío..."
                    required
                    rows={3}
                    {...form.getInputProps('descripcion')}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Select
                    label="Dificultad"
                    required
                    data={[
                      { value: 'FACIL', label: 'Fácil' },
                      { value: 'MEDIO', label: 'Medio' },
                      { value: 'DIFICIL', label: 'Difícil' },
                      { value: 'EXTREMO', label: 'Extremo' }
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

                <Grid.Col span={6}>
                  <DateInput
                    label="Fecha de Inicio"
                    placeholder="Seleccione la fecha"
                    {...form.getInputProps('fechaInicio')}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <DateInput
                    label="Fecha de Fin"
                    placeholder="Seleccione la fecha"
                    {...form.getInputProps('fechaFin')}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <NumberInput
                    label="Máximo de Participantes"
                    placeholder="0 = sin límite"
                    min={0}
                    {...form.getInputProps('maxParticipantes')}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>Configuración</Text>
                    <Switch
                      label="Es Diario"
                      {...form.getInputProps('esDiario', { type: 'checkbox' })}
                    />
                    <Switch
                      label="Es Semanal"
                      {...form.getInputProps('esSemanal', { type: 'checkbox' })}
                    />
                    <Switch
                      label="Es Especial"
                      {...form.getInputProps('esEspecial', { type: 'checkbox' })}
                    />
                    <Switch
                      label="Está Activo"
                      {...form.getInputProps('estaActivo', { type: 'checkbox' })}
                    />
                  </Stack>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Textarea
                    label="Criterios de Completado (JSON)"
                    placeholder='{"puntos": 100, "dias": 7}'
                    rows={4}
                    {...form.getInputProps('criterioCompletado')}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <Textarea
                    label="Recompensas (JSON)"
                    placeholder='{"puntos": 50, "insignia": "novato"}'
                    rows={4}
                    {...form.getInputProps('recompensas')}
                  />
                </Grid.Col>
              </Grid>

              <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                  {editingDesafio ? 'Actualizar' : 'Crear'} Desafío
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
  );
};