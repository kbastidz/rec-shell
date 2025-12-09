import React, { useState, useEffect } from 'react';
import {
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
  Alert,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconAlertCircle } from '@tabler/icons-react';
import { ReglaPuntos } from '../../types/model';
import { ReglaPuntosInput } from '../../types/dto';
import { useReglaPuntos } from '../hook/useGamificacion';
import { ActionButtons, PaginatedTable } from '@rec-shell/rec-web-shared';
import { DeleteConfirmModal } from '@rec-shell/rec-web-shared';

export function ReglaPuntosAdmin() {
  const {
    loading,
    error,
    reglasPuntos,
    CREAR,
    OBTENER,
    ACTUALIZAR,
    ELIMINAR,
    tipoPuntos,
    obtenerTipoPuntos,
  } = useReglaPuntos();

  const [modalOpened, setModalOpened] = useState(false);
  const [modalEliminarOpened, setModalEliminarOpened] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reglaSeleccionada, setReglaSeleccionada] =
    useState<ReglaPuntos | null>(null);

  useEffect(() => {
    OBTENER();
    obtenerTipoPuntos();
  }, []);

  const form = useForm<{
    nombre: string;
    descripcion: string;
    tipoPunto: string;
    eventoDisparador: string;
    puntosOtorgados: number;
    condiciones: string;
    estaActivo: boolean;
    prioridad: string;
  }>({
    initialValues: {
      nombre: '',
      descripcion: '',
      tipoPunto: '',
      eventoDisparador: '',
      puntosOtorgados: 0,
      condiciones: '',
      estaActivo: true,
      prioridad: '1',
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      tipoPunto: (value) => (!value ? 'El tipo de punto es requerido' : null),
      eventoDisparador: (value) =>
        !value ? 'El evento disparador es requerido' : null,
      puntosOtorgados: (value) => (value <= 0 ? 'Debe ser mayor a 0' : null),
      prioridad: (value) => (!value ? 'La prioridad es requerida' : null),
    },
  });

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setReglaSeleccionada(null);
    form.reset();
    setModalOpened(true);
  };

  // ✅✅✅ AQUÍ ESTA LA CORRECCIÓN PRINCIPAL
  const abrirModalEditar = (regla: ReglaPuntos) => {
    setModoEdicion(true);
    setReglaSeleccionada(regla);

    form.setValues({
      nombre: regla.nombre ?? '',
      descripcion: regla.descripcion ?? '',
      tipoPunto: String(regla.tipoPunto?.id ?? ''),
      eventoDisparador: regla.eventoDisparador ?? '',
      puntosOtorgados: regla.puntosOtorgados ?? 0,

      condiciones:
        typeof regla.condiciones === 'object'
          ? JSON.stringify(regla.condiciones, null, 2)
          : String(regla.condiciones ?? ''),

      estaActivo: Boolean(regla.estaActivo),

      prioridad: String(regla.prioridad ?? '1'),
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
    if (values.condiciones?.trim()) {
      try {
        condicionesJSON = JSON.parse(values.condiciones);
      } catch {
        condicionesJSON = { descripcion: values.condiciones };
      }
    }

    const tipoPuntoObj = tipoPuntos.find(
      (t) => t.id === Number(values.tipoPunto)
    );

    if (!tipoPuntoObj) return;

    const data: ReglaPuntosInput = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      tipoPunto: tipoPuntoObj,
      eventoDisparador: values.eventoDisparador,
      puntosOtorgados: values.puntosOtorgados,
      condiciones: condicionesJSON,
      estaActivo: values.estaActivo,
      prioridad: Number(values.prioridad),
    };

    if (modoEdicion && reglaSeleccionada) {
      await ACTUALIZAR(reglaSeleccionada.id, data);
    } else {
      await CREAR(data);
    }

    setModalOpened(false);
    form.reset();
    await OBTENER();
  };

  const handleEliminar = async (id: string): Promise<void> => {
    await ELIMINAR(id);
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

  // Columnas Dinamica Ini
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (regla: ReglaPuntos) => (
        <div>
          <div style={{ fontWeight: 600 }}>{regla.nombre}</div>
          {regla.descripcion && (
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              {regla.descripcion}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'tipoPunto',
      label: 'Tipo',
      render: (regla: ReglaPuntos) => (
        <Badge color="blue">{regla.tipoPunto.nombre}</Badge>
      ),
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (regla: ReglaPuntos) => (
        <Badge
          color={
            regla.prioridad === 1
              ? 'red'
              : regla.prioridad === 2
              ? 'orange'
              : 'blue'
          }
        >
          {regla.prioridad === 1
            ? 'Alta'
            : regla.prioridad === 2
            ? 'Media'
            : 'Baja'}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      icon: <IconEdit size={16} />,
      label: 'Editar',
      color: 'blue',
      onClick: (regla: ReglaPuntos) => abrirModalEditar(regla),
    },
  ];
  //Columnas Dinamica Fin

  return (
    <div style={{ padding: '2rem' }}>
      <Card withBorder shadow="sm">
        <Group justify="space-between" mb="lg">
          <Title>Gestión de Reglas de Puntos</Title>
          <ActionButtons.Modal onClick={abrirModalCrear} />
        </Group>

        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        )}

        {/* Columnas Dinamica Ini */}
        <PaginatedTable
          data={reglasPuntos}
          columns={columns}
          actions={actions}
          loading={loading}
          searchFields={['nombre', 'descripcion', 'eventoDisparador']}
          itemsPerPage={10}
          getRowKey={(r) => r.id}
        />
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={modoEdicion ? 'Editar Registro' : 'Nuevo Registro'}
      >
        <Stack>
          <TextInput label="Nombre" required {...form.getInputProps('nombre')} />

          <Textarea
            label="Descripción"
            {...form.getInputProps('descripcion')}
          />

          <Select
            label="Tipo de Punto"
            data={tiposPuntoOptions}
            required
            searchable
            {...form.getInputProps('tipoPunto')}
          />

          <TextInput
            label="Evento"
            required
            {...form.getInputProps('eventoDisparador')}
          />

          <NumberInput
            label="Puntos"
            required
            min={1}
            {...form.getInputProps('puntosOtorgados')}
          />

          <Select
            label="Prioridad"
            data={prioridadOptions}
            required
            {...form.getInputProps('prioridad')}
          />

          <Textarea
            label="Condiciones"
            {...form.getInputProps('condiciones')}
          />

          <Switch
            label="Activo"
            {...form.getInputProps('estaActivo', { type: 'checkbox' })}
          />

          <Group justify="center">
            <ActionButtons.Cancel onClick={() => setModalOpened(false)} />
            <ActionButtons.Save
              onClick={form.onSubmit(handleSubmit)}
              loading={loading}
            />
          </Group>
        </Stack>
      </Modal>

      <DeleteConfirmModal
        opened={modalEliminarOpened}
        onClose={() => {
          setModalEliminarOpened(false);
          setReglaSeleccionada(null);
        }}
        onConfirm={async () => {
          if (!reglaSeleccionada) return;
          await handleEliminar(reglaSeleccionada.id);
        }}
        itemName={reglaSeleccionada?.nombre || ''}
        itemType="regla de puntos"
      />
    </div>
  );
}
