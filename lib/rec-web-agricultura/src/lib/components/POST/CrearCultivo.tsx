import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Stack
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';
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

export const CrearCultivo: React.FC = () => {
  const navigate = useNavigate();
  const { goBack, navigateTo } = useCultivosNavigation();

  const { crearCultivo, loading } = useCultivos();

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

  const handleSubmit = async (values: Cultivo) => {
    // TODO: Obtener usuario autenticado del contexto
    const cultivoData = {
      ...values,
      usuario: { id: 'current-user-id' },
      fechaSiembra: values.fechaSiembra
      ? new Date(values.fechaSiembra).toISOString().split('T')[0]
      : '',
    };

    const resultado = await crearCultivo(cultivoData);
    if (resultado) {
      navigateTo('listar');
    }
  };

  const handleCancel = () => {
     goBack();
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        <LoadingOverlay visible={loading} />
        
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={2}>Registrar Nuevo Cultivo</Title>
            <Button 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleCancel}
            >
              Volver
            </Button>
          </Group>

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
                  Registrar Cultivo
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};