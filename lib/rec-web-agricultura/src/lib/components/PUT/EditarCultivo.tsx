import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Button,
  Group,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Grid,
  LoadingOverlay,
  Stack,
  Alert,
  Badge,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconDeviceFloppy, IconAlertCircle } from '@tabler/icons-react';
import { useCultivos } from '../../hooks/useCultivos';
import { EstadoCultivo } from '../../enums/Enums';
import { Cultivo } from '../../types/model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DateInput } from '@mantine/dates';
import { useCultivosNavigation } from '../../CultivosManager';

const VARIEDADES_CACAO = [
  'Trinitario',
  'Criollo',
  'Forastero',
  'Nacional',
  'CCN-51',
  'ICS-1',
  'ICS-6',
  'TSH-565'
];

const TIPOS_SUELO = [
  'Arcilloso',
  'Limoso',
  'Arenoso',
  'Franco',
  'Franco-arcilloso',
  'Franco-limoso',
  'Franco-arenoso'
];

const SISTEMAS_RIEGO = [
  'Por goteo',
  'Por aspersión',
  'Por surcos',
  'Por inundación',
  'Manual',
  'Sin sistema de riego'
];

interface EditarCultivoProps {
  id: string;
}
 
export const EditarCultivo: React.FC<EditarCultivoProps> = ({ id }) => {
 
 
  const { goBack, navigateTo } = useCultivosNavigation();
  const { 
    cultivo, 
    loading, 
    error,
    fetchCultivo, 
    actualizarCultivo,
    cambiarEstadoCultivo,
    clearError,
    clearCultivo
  } = useCultivos();

 const form = useForm<Cultivo>({
   initialValues: {
     id: '', 
     usuarioId: '',
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
     estadoCultivo: EstadoCultivo.ACTIVO,
     notas: '',
     fechaCreacion: '', 
     fechaActualizacion: '', 
     
     analisisImagenes: [],
     parametrosMonitoreo: [],
     alertasMonitoreo: [],
     cultivoMedidasPreventivas: [],
     reportesGenerados: []
   },
   validate: {
     nombreCultivo: (value) => (value?.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null),
     variedadCacao: (value) => (!value ? 'Debe seleccionar una variedad de cacao' : null),
     fechaSiembra: (value) => (!value ? 'Debe seleccionar la fecha de siembra' : null),
     areaHectareas: (value) => (!value || value <= 0 ? 'El área debe ser mayor a 0 hectáreas' : null),
     ubicacionNombre: (value) => (!value || value.trim().length < 3 ? 'La ubicación debe tener al menos 3 caracteres' : null),
     latitud: (value) => (value === undefined || value < -90 || value > 90 ? 'La latitud debe estar entre -90 y 90' : null),
     longitud: (value) => (value === undefined || value < -180 || value > 180 ? 'La longitud debe estar entre -180 y 180' : null),
     altitud: (value) => (value === undefined || value < 0 ? 'La altitud no puede ser negativa' : null),
     tipoSuelo: (value) => (!value ? 'Debe seleccionar un tipo de suelo' : null),
     sistemaRiego: (value) => (!value ? 'Debe seleccionar un sistema de riego' : null)
   }
 });

  useEffect(() => {
    if (id) {
      fetchCultivo(id);
    }
    
    return () => {
      clearCultivo();
      clearError();
    };
  }, [id]);

  useEffect(() => {
    if (cultivo && cultivo.id === id) {
      form.setValues({
        id: cultivo.id,
        nombreCultivo: cultivo.nombreCultivo,
        variedadCacao: cultivo.variedadCacao,
        fechaSiembra: cultivo.fechaSiembra,
        areaHectareas: cultivo.areaHectareas,
        ubicacionNombre: cultivo.ubicacionNombre,
        latitud: cultivo.latitud,
        longitud: cultivo.longitud,
        altitud: cultivo.altitud,
        tipoSuelo: cultivo.tipoSuelo,
        sistemaRiego: cultivo.sistemaRiego,
        estadoCultivo: cultivo.estadoCultivo,
        notas: cultivo.notas || ''
      });
    }
  }, [cultivo]);

  const handleSubmit = async (values: Cultivo) => {
    if (!id) return;

    const cultivoData = {
      ...values,
      id,
      fechaSiembra: new Date(values.fechaSiembra!).toISOString().split('T')[0]
    };

    const resultado = await actualizarCultivo(id, cultivoData);
    if (resultado) {
      navigateTo('listar');
    }
  };

  const handleCambiarEstado = async (nuevoEstado: EstadoCultivo) => {
    if (!id) return;
    
    const resultado = await cambiarEstadoCultivo(id, nuevoEstado);
    if (resultado) {
      // El estado se actualizará automáticamente en el form
      form.setFieldValue('estadoCultivo', nuevoEstado);
    }
  };

  const handleCancel = () => {
    goBack();
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'Sin fecha';
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadgeColor = (estado: EstadoCultivo) => {
    switch (estado) {
      case EstadoCultivo.ACTIVO:
        return 'green';
      case EstadoCultivo.INACTIVO:
        return 'gray';
      case EstadoCultivo.COSECHADO:
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (!id) {
    return (
      <Container size="lg" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          ID de cultivo no válido
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        <LoadingOverlay visible={loading} />
        
        <Stack gap="lg">
          <Group justify="space-between">
            <div>
              <Title order={2}>Editar Cultivo</Title>
              {cultivo && (
                <Group gap="sm" mt="xs">
                  <Text size="sm" c="dimmed">
                    Creado: {formatearFecha(cultivo.fechaCreacion)}
                  </Text>
                  {cultivo.fechaActualizacion !== cultivo.fechaCreacion && (
                    <Text size="sm" c="dimmed">
                      • Actualizado: {formatearFecha(cultivo.fechaActualizacion)}
                    </Text>
                  )}
                  <Badge 
                    color={getEstadoBadgeColor(cultivo.estadoCultivo)}
                    variant="light"
                  >
                    {cultivo.estadoCultivo}
                  </Badge>
                </Group>
              )}
            </div>
            <Button 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleCancel}
            >
              Volver
            </Button>
          </Group>

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

          {cultivo && (
            <Paper shadow="xs" p="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={500}>Acciones rápidas</Text>
              </Group>
              <Group gap="sm">
                <Button
                  size="sm"
                  variant={cultivo.estadoCultivo === EstadoCultivo.ACTIVO ? "filled" : "outline"}
                  color="green"
                  onClick={() => handleCambiarEstado(EstadoCultivo.ACTIVO)}
                  disabled={cultivo.estadoCultivo === EstadoCultivo.ACTIVO}
                >
                  Activar
                </Button>
                <Button
                  size="sm"
                  variant={cultivo.estadoCultivo === EstadoCultivo.INACTIVO ? "filled" : "outline"}
                  color="gray"
                  onClick={() => handleCambiarEstado(EstadoCultivo.INACTIVO)}
                  disabled={cultivo.estadoCultivo === EstadoCultivo.INACTIVO}
                >
                  Desactivar
                </Button>
                <Button
                  size="sm"
                  variant={cultivo.estadoCultivo === EstadoCultivo.COSECHADO ? "filled" : "outline"}
                  color="blue"
                  onClick={() => handleCambiarEstado(EstadoCultivo.COSECHADO)}
                  disabled={cultivo.estadoCultivo === EstadoCultivo.COSECHADO}
                >
                  Marcar Cosechado
                </Button>
              </Group>
            </Paper>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Nombre del Cultivo"
                    placeholder="Ingrese el nombre del cultivo"
                    required
                    {...form.getInputProps('nombreCultivo')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Variedad de Cacao"
                    placeholder="Seleccione la variedad"
                    data={VARIEDADES_CACAO}
                    required
                    searchable
                    {...form.getInputProps('variedadCacao')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <DateInput
                    label="Fecha de Siembra"
                    placeholder="Seleccione la fecha"
                    required
                    valueFormat="YYYY-MM-DD"
                    {...form.getInputProps('fechaSiembra')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Área (Hectáreas)"
                    placeholder="0.00"
                    min={0.01}
                    step={0.01}
                    decimalScale={2}
                    required
                    {...form.getInputProps('areaHectareas')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <TextInput
                    label="Nombre de Ubicación"
                    placeholder="Ej: Finca El Paraíso, Sector Norte"
                    required
                    {...form.getInputProps('ubicacionNombre')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <NumberInput
                    label="Altitud (msnm)"
                    placeholder="0"
                    min={0}
                    required
                    {...form.getInputProps('altitud')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Latitud"
                    placeholder="Ej: -2.1700"
                    min={-90}
                    max={90}
                    step={0.000001}
                    decimalScale={6}
                    required
                    {...form.getInputProps('latitud')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Longitud"
                    placeholder="Ej: -79.9224"
                    min={-180}
                    max={180}
                    step={0.000001}
                    decimalScale={6}
                    required
                    {...form.getInputProps('longitud')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Tipo de Suelo"
                    placeholder="Seleccione el tipo de suelo"
                    data={TIPOS_SUELO}
                    required
                    searchable
                    {...form.getInputProps('tipoSuelo')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Sistema de Riego"
                    placeholder="Seleccione el sistema"
                    data={SISTEMAS_RIEGO}
                    required
                    searchable
                    {...form.getInputProps('sistemaRiego')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Estado del Cultivo"
                    data={[
                      { value: EstadoCultivo.ACTIVO, label: 'Activo' },
                      { value: EstadoCultivo.INACTIVO, label: 'Inactivo' },
                      { value: EstadoCultivo.COSECHADO, label: 'Cosechado' }
                    ]}
                    {...form.getInputProps('estadoCultivo')}
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Notas"
                placeholder="Observaciones adicionales sobre el cultivo..."
                minRows={3}
                {...form.getInputProps('notas')}
              />

              <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  leftSection={<IconDeviceFloppy size={16} />}
                  loading={loading}
                >
                  Guardar Cambios
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};