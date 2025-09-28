import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Table,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Switch,
  Group,
  Alert,
  Loader,
  Badge,
  Stack,
  Card,
  Flex,
  Text
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconX,
  IconExclamationMark
} from '@tabler/icons-react';
import { useDeficienciaNutriente } from '../hooks/useDeficienciaNutriente';
import { DeficienciaNutrienteInput } from '../services/agricultura.service';
import { DeficienciaNutriente } from '../../types/model';

export const NutrienteCRUD = () => {
  const {
    deficiencias,
    loading,
    error,
    crearDeficiencia,
    obtenerTodas,
    actualizar,
    eliminar,
    activar,
    desactivar,
    clearError
  } = useDeficienciaNutriente();

  // Estados para modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [deficienciaSeleccionada, setDeficienciaSeleccionada] = useState<DeficienciaNutriente | null>(null);
  const [editando, setEditando] = useState(false);

  // Estados del formulario
  const [formulario, setFormulario] = useState<DeficienciaNutrienteInput>({
    codigo: '',
    nombre: '',
    descripcion: '',
    sintomasVisuales: '',
    nutrienteDeficiente: '',
    activo: true
  });

  // Cargar datos al montar
  useEffect(() => {
    obtenerTodas();
  }, []);

  const limpiarFormulario = () => {
    setFormulario({
      codigo: '',
      nombre: '',
      descripcion: '',
      sintomasVisuales: '',
      nutrienteDeficiente: '',
      activo: true
    });
  };

  const abrirModal = (deficiencia?: DeficienciaNutriente) => {
    if (deficiencia) {
      setEditando(true);
      setFormulario({
        codigo: deficiencia.codigo,
        nombre: deficiencia.nombre,
        descripcion: deficiencia.descripcion || '',
        sintomasVisuales: deficiencia.sintomasVisuales || '',
        nutrienteDeficiente: deficiencia.nutrienteDeficiente || '',
        activo: deficiencia.activo
      });
      setDeficienciaSeleccionada(deficiencia);
    } else {
      setEditando(false);
      limpiarFormulario();
      setDeficienciaSeleccionada(null);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(false);
    limpiarFormulario();
    setDeficienciaSeleccionada(null);
    clearError();
  };

  const manejarSubmit = async () => {
    
    if (editando && deficienciaSeleccionada) {
      const resultado = await actualizar(deficienciaSeleccionada.id.toString(), formulario);
      if (resultado) {
        cerrarModal();
      }
    } else {
      const resultado = await crearDeficiencia(formulario);
      if (resultado) {
        cerrarModal();
      }
    }
  };

  const manejarEliminar = async () => {
    if (deficienciaSeleccionada) {
      const exito = await eliminar(deficienciaSeleccionada.id.toString());
      if (exito) {
        setModalEliminar(false);
        setDeficienciaSeleccionada(null);
      }
    }
  };

  const cambiarEstado = async (deficiencia: DeficienciaNutriente) => {
    if (deficiencia.activo) {
      await desactivar(deficiencia.id.toString());
    } else {
      await activar(deficiencia.id.toString());
    }
  };

  const verDetalle = (deficiencia: DeficienciaNutriente) => {
    setDeficienciaSeleccionada(deficiencia);
    setModalDetalle(true);
  };

  const rows = deficiencias.map((deficiencia) => (
    <Table.Tr key={deficiencia.id}>
      <Table.Td>{deficiencia.codigo}</Table.Td>
      <Table.Td>{deficiencia.nombre}</Table.Td>
      <Table.Td>{deficiencia.nutrienteDeficiente || '-'}</Table.Td>
      <Table.Td>
        <Badge color={deficiencia.activo ? 'green' : 'red'}>
          {deficiencia.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => verDetalle(deficiencia)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="yellow"
            onClick={() => abrirModal(deficiencia)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color={deficiencia.activo ? 'red' : 'green'}
            onClick={() => cambiarEstado(deficiencia)}
          >
            {deficiencia.activo ? <IconX size={16} /> : <IconCheck size={16} />}
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => {
              setDeficienciaSeleccionada(deficiencia);
              setModalEliminar(true);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" p="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>Gestión de Deficiencias de Nutrientes</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => abrirModal()}
        >
          Nueva Deficiencia
        </Button>
      </Flex>

      {error && (
        <Alert
          icon={<IconExclamationMark size={16} />}
          title="Error"
          color="red"
          mb="md"
          withCloseButton
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Flex justify="center" p="xl">
          <Loader size="md" />
        </Flex>
      ) : (
        <Card shadow="sm" p="lg">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Código</Table.Th>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Nutriente Deficiente</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : (
                <Table.Tr>
                  <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                    <Text c="dimmed">No hay deficiencias registradas</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* Modal de Crear/Editar */}
      <Modal
        opened={modalAbierto}
        onClose={cerrarModal}
        title={editando ? 'Editar Deficiencia' : 'Nueva Deficiencia'}
        size="md"
      >
        <div>
          <Stack gap="md">
            <TextInput
              label="Código"
              placeholder="Ej: DEF001"
              required
              value={formulario.codigo}
              onChange={(e) => setFormulario(prev => ({ ...prev, codigo: e.target.value }))}
            />
            
            <TextInput
              label="Nombre"
              placeholder="Nombre de la deficiencia"
              required
              value={formulario.nombre}
              onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
            />
            
            <Textarea
              label="Descripción"
              placeholder="Descripción detallada"
              rows={3}
              value={formulario.descripcion}
              onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
            />
            
            <Textarea
              label="Síntomas Visuales"
              placeholder="Síntomas que se pueden observar"
              rows={3}
              value={formulario.sintomasVisuales}
              onChange={(e) => setFormulario(prev => ({ ...prev, sintomasVisuales: e.target.value }))}
            />
            
            <TextInput
              label="Nutriente Deficiente"
              placeholder="Ej: Nitrógeno, Fósforo, Potasio"
              value={formulario.nutrienteDeficiente}
              onChange={(e) => setFormulario(prev => ({ ...prev, nutrienteDeficiente: e.target.value }))}
            />
            
            <Switch
              label="Activo"
              checked={formulario.activo}
              onChange={(e) => setFormulario(prev => ({ ...prev, activo: e.currentTarget.checked }))}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button onClick={manejarSubmit} loading={loading}>
                {editando ? 'Actualizar' : 'Crear'}
              </Button>
            </Group>
          </Stack>
        </div>
      </Modal>

      {/* Modal de Detalle */}
      <Modal
        opened={modalDetalle}
        onClose={() => setModalDetalle(false)}
        title="Detalle de Deficiencia"
        size="md"
      >
        {deficienciaSeleccionada && (
          <Stack gap="md">
            <Group>
              <Text fw={500}>Código:</Text>
              <Text>{deficienciaSeleccionada.codigo}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Nombre:</Text>
              <Text>{deficienciaSeleccionada.nombre}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Estado:</Text>
              <Badge color={deficienciaSeleccionada.activo ? 'green' : 'red'}>
                {deficienciaSeleccionada.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </Group>
            
            {deficienciaSeleccionada.nutrienteDeficiente && (
              <Group>
                <Text fw={500}>Nutriente Deficiente:</Text>
                <Text>{deficienciaSeleccionada.nutrienteDeficiente}</Text>
              </Group>
            )}
            
            {deficienciaSeleccionada.descripcion && (
              <div>
                <Text fw={500} mb="xs">Descripción:</Text>
                <Text>{deficienciaSeleccionada.descripcion}</Text>
              </div>
            )}
            
            {deficienciaSeleccionada.sintomasVisuales && (
              <div>
                <Text fw={500} mb="xs">Síntomas Visuales:</Text>
                <Text>{deficienciaSeleccionada.sintomasVisuales}</Text>
              </div>
            )}
          </Stack>
        )}
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        opened={modalEliminar}
        onClose={() => setModalEliminar(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <Stack gap="md">
          <Text>
            ¿Estás seguro de que deseas eliminar la deficiencia{' '}
            <Text span fw={500}>{deficienciaSeleccionada?.nombre}</Text>?
          </Text>
          <Text size="sm" c="dimmed">
            Esta acción no se puede deshacer.
          </Text>
          
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setModalEliminar(false)}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={manejarEliminar}
              loading={loading}
            >
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

