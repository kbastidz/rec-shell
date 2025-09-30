import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Button,
  Table,
  Group,
  TextInput,
  Modal,
  Stack,
  Select,
  NumberInput,
  Badge,
  ActionIcon,
  Text,
  Loader,
  Alert,
  Flex,
  Card,
  Grid,
  Textarea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconPlus, 
  IconSearch, 
  IconEdit, 
  IconTrash, 
  IconAlertCircle,
  IconLeaf,
  IconMapPin
} from '@tabler/icons-react';
import { useCultivos } from '../hooks/useAgricultura';
import { CultivoFormData } from '../../types/dto';
import { DeleteConfirmModal } from '@rec-shell/rec-web-shared';

export const CultivosAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cultivoSeleccionado, setCultivoSeleccionado] = useState<any>(null);
  const [cultivoAEliminar, setCultivoAEliminar] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [eliminando, setEliminando] = useState(false);
  const [formData, setFormData] = useState<CultivoFormData>({
    nombreCultivo: '',
    variedadCacao: '',
    fechaSiembra: '',
    areaHectareas: 0,
    ubicacionNombre: '',
    latitud: 0,
    longitud: 0,
    altitud: 0,
    tipoSuelo: '',
    sistemaRiego: '',
    estadoCultivo: 'ACTIVO',
    notas: ''
  });

  const {
    cultivos,
    loading,
    error,
    areaTotalActiva,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    BUSCAR,
    fetchAreaTotalActiva,
    clearError
  } = useCultivos();

  useEffect(() => {
    BUSCAR();
    if (fetchAreaTotalActiva) {
      fetchAreaTotalActiva();
    }
  }, []);

  const cultivosFiltrados = cultivos.filter(c =>
    c.nombreCultivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.variedadCacao?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.ubicacionNombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevo = () => {
    setModoEdicion(false);
    setCultivoSeleccionado(null);
    setFormData({
      nombreCultivo: '',
      variedadCacao: '',
      fechaSiembra: '',
      areaHectareas: 0,
      ubicacionNombre: '',
      latitud: 0,
      longitud: 0,
      altitud: 0,
      tipoSuelo: '',
      sistemaRiego: '',
      estadoCultivo: 'ACTIVO',
      notas: ''
    });
    open();
  };

  const handleEditar = (cultivo: any) => {
    setModoEdicion(true);
    setCultivoSeleccionado(cultivo);
    setFormData({
      nombreCultivo: cultivo.nombreCultivo || '',
      variedadCacao: cultivo.variedadCacao || '',
      fechaSiembra: cultivo.fechaSiembra || '',
      areaHectareas: cultivo.areaHectareas || 0,
      ubicacionNombre: cultivo.ubicacionNombre || '',
      latitud: cultivo.latitud || 0,
      longitud: cultivo.longitud || 0,
      altitud: cultivo.altitud || 0,
      tipoSuelo: cultivo.tipoSuelo || '',
      sistemaRiego: cultivo.sistemaRiego || '',
      estadoCultivo: cultivo.estadoCultivo || 'ACTIVO',
      notas: cultivo.notas || ''
    });
    open();
  };

  const handleEliminar = (cultivo: any) => {
    setCultivoAEliminar(cultivo);
    setDeleteOpened(true);
  };

  const confirmarEliminacion = async () => {
    if (cultivoAEliminar) {
      setEliminando(true);
      try {
        await ELIMINAR(cultivoAEliminar.id);
        if (fetchAreaTotalActiva) {
          await fetchAreaTotalActiva();
        }
        setDeleteOpened(false);
        setCultivoAEliminar(null);
      } catch (error) {
        console.error('Error al eliminar:', error);
      } finally {
        setEliminando(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (modoEdicion && cultivoSeleccionado) {
        await ACTUALIZAR(cultivoSeleccionado.id, formData as any);
      } else {
        await CREAR(formData as any);
      }
      if (fetchAreaTotalActiva) {
        await fetchAreaTotalActiva();
      }
      close();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      ACTIVO: 'green',
      INACTIVO: 'gray',
      COSECHADO: 'blue',
      SUSPENDIDO: 'red'
    };
    return <Badge color={colores[estado] || 'gray'}>{estado}</Badge>;
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Title order={1}>
              <Group>
                <IconLeaf size={32} />
                Gestión de Cultivos
              </Group>
            </Title>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Text size="sm" c="dimmed">Área Total Activa</Text>
              <Text size="xl" fw={700}>
                {areaTotalActiva ? areaTotalActiva.toFixed(2) : '0.00'} ha
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red"
            withCloseButton
            onClose={clearError}
          >
            {error}
          </Alert>
        )}

        <Paper p="md" withBorder>
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: 'column', sm: 'row' }}
            gap="md"
          >
            <TextInput
              placeholder="Buscar por nombre, variedad o ubicación..."
              leftSection={<IconSearch size={16} />}
              value={busqueda}
              onChange={(e) => setBusqueda(e.currentTarget.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={handleNuevo}
            >
              Registrar
            </Button>
          </Flex>
        </Paper>

        <Paper withBorder>
          {loading ? (
            <Flex justify="center" align="center" py="xl">
              <Loader size="lg" />
            </Flex>
          ) : cultivosFiltrados.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              No se encontraron cultivos
            </Text>
          ) : (
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th>Variedad Cacao</Table.Th>
                    <Table.Th>Área (ha)</Table.Th>
                    <Table.Th>Ubicación</Table.Th>
                    <Table.Th>Fecha Siembra</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {cultivosFiltrados.map((cultivo) => (
                    <Table.Tr key={cultivo.id}>
                      <Table.Td>
                        <Text fw={500}>{cultivo.nombreCultivo}</Text>
                      </Table.Td>
                      <Table.Td>{cultivo.variedadCacao || '-'}</Table.Td>
                      <Table.Td>{cultivo.areaHectareas?.toFixed(2) || '0.00'}</Table.Td>
                      <Table.Td>
                        {cultivo.ubicacionNombre ? (
                          <Group gap="xs">
                            <IconMapPin size={14} />
                            <Text size="sm">{cultivo.ubicacionNombre}</Text>
                          </Group>
                        ) : '-'}
                      </Table.Td>
                      <Table.Td>
                        {cultivo.fechaSiembra ? new Date(cultivo.fechaSiembra).toLocaleDateString() : '-'}
                      </Table.Td>
                      <Table.Td>{getEstadoBadge(cultivo.estadoCultivo)}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleEditar(cultivo)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => handleEliminar(cultivo)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>
      </Stack>

      {/* Modal de Formulario */}
      <Modal
        opened={opened}
        onClose={close}
        title={modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre del Cultivo"
            placeholder="Ej: Cacao Nacional"
            required
            value={formData.nombreCultivo}
            onChange={(e) => setFormData({ ...formData, nombreCultivo: e.currentTarget.value })}
          />
          
          <TextInput
            label="Variedad de Cacao"
            placeholder="Ej: CCN-51, Nacional Fino"
            value={formData.variedadCacao}
            onChange={(e) => setFormData({ ...formData, variedadCacao: e.currentTarget.value })}
          />

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Área (hectáreas)"
                placeholder="0.0"
                required
                min={0}
                step={0.1}
                decimalScale={2}
                value={formData.areaHectareas}
                onChange={(val) => setFormData({ ...formData, areaHectareas: typeof val === 'number' ? val : 0 })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Fecha de Siembra"
                type="date"
                required
                value={formData.fechaSiembra}
                onChange={(e) => setFormData({ ...formData, fechaSiembra: e.currentTarget.value })}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Nombre de Ubicación"
            placeholder="Ej: Parcela Norte, Lote 5"
            value={formData.ubicacionNombre}
            onChange={(e) => setFormData({ ...formData, ubicacionNombre: e.currentTarget.value })}
          />

          <Grid>
            <Grid.Col span={4}>
              <NumberInput
                label="Latitud"
                placeholder="-2.1234"
                step={0.000001}
                decimalScale={6}
                value={formData.latitud}
                onChange={(val) => setFormData({ ...formData, latitud: typeof val === 'number' ? val : 0 })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Longitud"
                placeholder="-79.1234"
                step={0.000001}
                decimalScale={6}
                value={formData.longitud}
                onChange={(val) => setFormData({ ...formData, longitud: typeof val === 'number' ? val : 0 })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Altitud (m)"
                placeholder="500"
                min={0}
                value={formData.altitud}
                onChange={(val) => setFormData({ ...formData, altitud: typeof val === 'number' ? val : undefined })}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Tipo de Suelo"
                placeholder="Seleccione tipo de suelo"
                value={formData.tipoSuelo}
                onChange={(val) => setFormData({ ...formData, tipoSuelo: val || '' })}
                data={[
                  { value: 'ARCILLOSO', label: 'Arcilloso' },
                  { value: 'ARENOSO', label: 'Arenoso' },
                  { value: 'LIMOSO', label: 'Limoso' },
                  { value: 'FRANCO', label: 'Franco' },
                  { value: 'HUMIFERO', label: 'Humífero' }
                ]}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Sistema de Riego"
                placeholder="Seleccione sistema"
                value={formData.sistemaRiego}
                onChange={(val) => setFormData({ ...formData, sistemaRiego: val || '' })}
                data={[
                  { value: 'GOTEO', label: 'Goteo' },
                  { value: 'ASPERSION', label: 'Aspersión' },
                  { value: 'GRAVEDAD', label: 'Gravedad' },
                  { value: 'MICROASPERSION', label: 'Microaspersión' },
                  { value: 'NATURAL', label: 'Natural (lluvia)' }
                ]}
              />
            </Grid.Col>
          </Grid>

          <Select
            label="Estado del Cultivo"
            required
            value={formData.estadoCultivo}
            onChange={(val) => setFormData({ ...formData, estadoCultivo: val || 'ACTIVO' })}
            data={[
              { value: 'ACTIVO', label: 'Activo' },
              { value: 'INACTIVO', label: 'Inactivo' },
              { value: 'COSECHADO', label: 'Cosechado' },
              { value: 'SUSPENDIDO', label: 'Suspendido' }
            ]}
          />

          <Textarea
            label="Notas"
            placeholder="Observaciones adicionales sobre el cultivo..."
            minRows={3}
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.currentTarget.value })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {modoEdicion ? 'Actualizar' : 'Crear'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal Generico de Eliminación */}
       <DeleteConfirmModal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        onConfirm={confirmarEliminacion}
        itemName={cultivoAEliminar?.nombreCultivo || ''}
        itemType="registro"
      />
      
    </Container>
  );
};