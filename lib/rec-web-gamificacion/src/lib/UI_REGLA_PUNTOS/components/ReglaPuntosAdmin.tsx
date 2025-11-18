import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Group,
  Stack,
  ActionIcon,
  Card,
  Title,
  Badge,
  Loader,
  Alert,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import { ReglaPuntos } from '../../types/model';
import { ReglaPuntosInput } from '../../types/dto';
import { useReglaPuntos } from '../hook/useGamificacion';
import { ActionButtons } from '@rec-shell/rec-web-shared';
import { DeleteConfirmModal } from '@rec-shell/rec-web-shared';

export function ReglaPuntosAdmin() {
  const { loading, error, reglasPuntos, crear, obtenerTodos, actualizar, eliminar, tipoPuntos, obtenerTipoPuntos } = useReglaPuntos();
  const [modalOpened, setModalOpened] = useState(false);
  const [modalEliminarOpened, setModalEliminarOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reglaSeleccionada, setReglaSeleccionada] = useState<ReglaPuntos | null>(null);

  useEffect(() => {
    obtenerTodos();
    obtenerTipoPuntos();
  }, []);

  const form = useForm<{
    nombre: string;
    descripcion: string;
    tipoPunto: number;
    eventoDisparador: string;
    puntosOtorgados: number;
    condiciones: string;
    estaActivo: boolean;
    prioridad: number;
  }>({
    initialValues: {
      nombre: '',
      descripcion: '',
      tipoPunto: 0,
      eventoDisparador: '',
      puntosOtorgados: 0,
      condiciones: '',
      estaActivo: true,
      prioridad: 1,
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      tipoPunto: (value) => (!value ? 'El tipo de punto es requerido' : null),
      eventoDisparador: (value) => (!value ? 'El evento disparador es requerido' : null),
      puntosOtorgados: (value) => (value <= 0 ? 'Debe ser mayor a 0' : null),
    },
  });

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setReglaSeleccionada(null);
    form.reset();
    setModalOpened(true);
  };

  const abrirModalEditar = (regla: ReglaPuntos) => {
    setModoEdicion(true);
    setReglaSeleccionada(regla);
    form.setValues({
      nombre: regla.nombre,
      descripcion: regla.descripcion || '',
      tipoPunto: regla.tipoPunto.id,
      eventoDisparador: regla.eventoDisparador,
      puntosOtorgados: regla.puntosOtorgados,
      condiciones: JSON.stringify(regla.condiciones),
      estaActivo: regla.estaActivo,
      prioridad: regla.prioridad,
    });
    setModalOpened(true);
  };

  const abrirModalEliminar = (regla: ReglaPuntos) => {
    setReglaSeleccionada(regla);
    setModalEliminarOpened(true);
  };

  const handleSubmit = async () => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    const values = form.values;
    
    let condicionesJSON: Record<string, any> = {};
    if (values.condiciones && values.condiciones.trim()) {
      try {
        condicionesJSON = JSON.parse(values.condiciones);
      } catch {
        condicionesJSON = { descripcion: values.condiciones };
      }
    }

    const tipoPuntoObj = tipoPuntos.find(t => t.id === Number(values.tipoPunto));

    if (!tipoPuntoObj) {
      return;
    }

    const data: ReglaPuntosInput = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      tipoPunto: tipoPuntoObj,
      eventoDisparador: values.eventoDisparador,
      puntosOtorgados: values.puntosOtorgados,
      condiciones: condicionesJSON,
      estaActivo: values.estaActivo,
      prioridad: values.prioridad,
    };

    if (modoEdicion && reglaSeleccionada) {
      await actualizar(reglaSeleccionada.id, data);
    } else {
      await crear(data);
    }

    setModalOpened(false);
    form.reset();
     await obtenerTodos();
  };

  const handleEliminar = async (id: string, nombre: string) => {
    await eliminar(id);
    setModalEliminarOpened(false);
    setReglaSeleccionada(null);
  };

  const tiposPuntoOptions = tipoPuntos.map((tipo) => ({
    value: String(tipo.id),
    label: tipo.nombreMostrar,
  }));

  const prioridadOptions = [
    { value: '1', label: 'Alta (1)' },
    { value: '2', label: 'Media (2)' },
    { value: '3', label: 'Baja (3)' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Reglas de Puntos</Title>
          <ActionButtons.Modal onClick={abrirModalCrear} />
        </Group>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Loader size="lg" />
          </div>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Evento</Table.Th>
                <Table.Th>Puntos</Table.Th>
                <Table.Th>Prioridad</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {reglasPuntos.map((regla) => {
                const tipoPuntoData = tipoPuntos.find(t => t.id === regla.tipoPunto.id);
                return (
                  <Table.Tr key={regla.id}>
                    <Table.Td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{regla.nombre}</div>
                        {regla.descripcion && (
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            {regla.descripcion}
                          </div>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">
                        {tipoPuntoData?.nombreMostrar || regla.tipoPunto.nombre}
                      </Badge>
                    </Table.Td>
                    <Table.Td style={{ fontSize: '0.875rem' }}>{regla.eventoDisparador}</Table.Td>
                    <Table.Td>
                      <Badge color="green" variant="filled">
                        {regla.puntosOtorgados}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={regla.prioridad === 1 ? 'red' : regla.prioridad === 2 ? 'orange' : 'blue'}>
                        {regla.prioridad === 1 ? 'Alta' : regla.prioridad === 2 ? 'Media' : 'Baja'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={regla.estaActivo ? 'green' : 'gray'}>
                        {regla.estaActivo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          onClick={() => abrirModalEditar(regla)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                       {/*} <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => abrirModalEliminar(regla)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>*/}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      {/* Modal de Edición/Creación */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Nombre"
            placeholder="Ej: Puntos por Registro"
            required
            {...form.getInputProps('nombre')}
          />

          <Textarea
            label="Descripción"
            placeholder="Descripción de la regla"
            minRows={2}
            {...form.getInputProps('descripcion')}
          />

          <Select
            label="Tipo de Punto"
            placeholder="Selecciona un tipo"
            data={tiposPuntoOptions}
            required
            searchable
            {...form.getInputProps('tipoPunto')}
          />

          <TextInput
            label="Evento Disparador"
            placeholder="Ej: usuario.registro"
            required
            {...form.getInputProps('eventoDisparador')}
          />

          <NumberInput
            label="Puntos Otorgados"
            placeholder="100"
            required
            min={1}
            {...form.getInputProps('puntosOtorgados')}
          />

          <Select
            label="Prioridad"
            placeholder="Selecciona la prioridad"
            data={prioridadOptions}
            required
            {...form.getInputProps('prioridad')}
            onChange={(value) => form.setFieldValue('prioridad', Number(value))}
            value={String(form.values.prioridad)}
          />

          <Textarea
            label="Condiciones"
            placeholder='Escribe las condiciones. Ej: {"montoMinimo": 100, "categoria": "premium"}'
            description="Puedes escribir texto normal o JSON. Si escribes JSON válido se usará directamente."
            minRows={3}
            autosize
            {...form.getInputProps('condiciones')}
          />

          <Switch
            label="Regla activa"
            size="md"
            color="teal"
            disabled={loading}
            {...form.getInputProps('estaActivo', { type: 'checkbox' })}
          />

          <Group justify="center" mt="xl">
            <ActionButtons.Cancel onClick={() => setModalOpened(false)} />
            <ActionButtons.Save
              onClick={form.onSubmit(handleSubmit)}
              loading={loading}
            />              
          </Group>
        </Stack>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <DeleteConfirmModal
        opened={modalEliminarOpened}
        onClose={() => {
          setModalEliminarOpened(false);
          setReglaSeleccionada(null);
        }}
        onConfirm={async () => {
          if (reglaSeleccionada) {
            await handleEliminar(
              reglaSeleccionada.id,
              reglaSeleccionada.nombre
            );
          }
        }}
        itemName={reglaSeleccionada?.nombre || ''}
        itemType="regla de puntos"
      />
    </div>
  );
}