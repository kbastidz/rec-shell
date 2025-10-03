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
import { useDeficienciaNutriente } from '../hooks/useAgricultura';
import { DeficienciaNutriente } from '../../types/model';
import { DeficienciaNutrienteInput } from '../../types/dto';
import { DeleteConfirmModal } from '@rec-shell/rec-web-shared';

export const NutrienteAdmin = () => {
  const {
    deficiencias,
    loading,
    error,
    CREAR,
    BUSCAR,
    ACTUALIZAR,
    ELIMINAR,
    activar,
    desactivar,
    clearError
  } = useDeficienciaNutriente();

 
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalELIMINAR, setModalELIMINAR] = useState(false);
  const [deficienciaSeleccionada, setDeficienciaSeleccionada] = useState<DeficienciaNutriente | null>(null);
  const [editando, setEditando] = useState(false);
  
  const [formulario, setFormulario] = useState<DeficienciaNutrienteInput>({
    codigo: '',
    nombre: '',
    descripcion: '',
    sintomasVisuales: '',
    nutrienteDeficiente: '',
    activo: true
  });

  
  useEffect(() => {
    BUSCAR();
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

  const handlerSubmit = async () => {
    
    if (editando && deficienciaSeleccionada) {
      const resultado = await ACTUALIZAR(deficienciaSeleccionada.id.toString(), formulario);
      if (resultado) {
        cerrarModal();
      }
    } else {
      const resultado = await CREAR(formulario);
      if (resultado) {
        cerrarModal();
      }
    }
  };

  const handlerEliminar = async () => {
    if (deficienciaSeleccionada) {
      const exito = await ELIMINAR(deficienciaSeleccionada.id.toString());
      if (exito) {
        setModalELIMINAR(false);
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

  const handlerDetalle = (deficiencia: DeficienciaNutriente) => {
    setDeficienciaSeleccionada(deficiencia);
    setModalDetalle(true);
  };

  const lista = Array.isArray(deficiencias) ? deficiencias : [];
  const rows = lista.map((deficiencia) => (
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
            onClick={() => handlerDetalle(deficiencia)}
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
              setModalELIMINAR(true);
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
          Registrar
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
                    <Text c="dimmed">
                      No se encontraron registros
                    </Text>
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
        title={editando ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
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
            onChange={(e) => setFormulario(prev => ({ ...prev, activo: e.target.checked }))}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button onClick={handlerSubmit} loading={loading}>
                {editando ? 'ACTUALIZAR' : 'Crear'}
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
      <DeleteConfirmModal
        opened={modalELIMINAR}
        onClose={() => setModalELIMINAR(false)}
        onConfirm={handlerEliminar}
        itemName={deficienciaSeleccionada?.nombre || ""}
        itemType="cultivo"
      />
     
    </Container>
  );
};

