import React, { useEffect, useState } from 'react';
import {
  MantineProvider,
  Container,
  Title,
  Button,
  Table,
  Modal,
  NumberInput,
  Select,
  Stack,
  Group,
  Paper,
  Grid,
  Text,
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { Estudiante, Materia } from '../interfaces/interface';
import { useEstudiantes } from '../hook/useEducacionNotas';

// ===== Funciones auxiliares =====
const crearMateriaVacia = (nombre: string): Materia => ({
  nombre,
  trimestres: { t1: 0, t2: 0, t3: 0 },
  promedioFinal: 0,
});

const calcularPromedioMateria = (t1: number, t2: number, t3: number): number =>
  Number(((t1 + t2 + t3) / 3).toFixed(2));

// ===== Configuración de materias =====
const materiasConfig = [
  { value: 'lenguaExtranjera', label: 'Lengua Extranjera' },
  { value: 'educacionFisica', label: 'Educación Física' },
  {
    value: 'educacionCulturalArtistica',
    label: 'Educación Cultural y Artística',
  },
  { value: 'estudiosSociales', label: 'Estudios Sociales' },
  { value: 'cienciasNaturales', label: 'Ciencias Naturales' },
  { value: 'matematica', label: 'Matemática' },
  { value: 'lenguaLiteratura', label: 'Lengua y Literatura' },
];

// ===== Mock de estudiantes =====
const estudiantesMock: Estudiante[] = [
  {
    id: '1',
    no: 1,
    apellidos: 'Pérez',
    nombres: 'María',
    materias: {
      lenguaExtranjera: crearMateriaVacia('Lengua Extranjera'),
      educacionFisica: crearMateriaVacia('Educación Física'),
      educacionCulturalArtistica: crearMateriaVacia(
        'Educación Cultural y Artística'
      ),
      estudiosSociales: crearMateriaVacia('Estudios Sociales'),
      cienciasNaturales: crearMateriaVacia('Ciencias Naturales'),
      matematica: crearMateriaVacia('Matemática'),
      lenguaLiteratura: crearMateriaVacia('Lengua y Literatura'),
    },
    acompanamientoIntegral: 0,
    animacionLectura: 0,
  },
  {
    id: '2',
    no: 2,
    apellidos: 'Gómez',
    nombres: 'Carlos',
    materias: {
      lenguaExtranjera: crearMateriaVacia('Lengua Extranjera'),
      educacionFisica: crearMateriaVacia('Educación Física'),
      educacionCulturalArtistica: crearMateriaVacia(
        'Educación Cultural y Artística'
      ),
      estudiosSociales: crearMateriaVacia('Estudios Sociales'),
      cienciasNaturales: crearMateriaVacia('Ciencias Naturales'),
      matematica: crearMateriaVacia('Matemática'),
      lenguaLiteratura: crearMateriaVacia('Lengua y Literatura'),
    },
    acompanamientoIntegral: 0,
    animacionLectura: 0,
  },
];

export const HistoricoNotasAdmin: React.FC = () => {
  const {
    estudiantes: estudiantesApi,
    loading,
    error,
    saveEstudiante,
  } = useEstudiantes();

  // ✅ Mantén el estado local para ediciones
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [modoAccion, setModoAccion] = useState<'insert' | 'update' | null>(
    null
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Estudiante | null>(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<string>('');
  const [estudiantesModificados, setEstudiantesModificados] = useState<
    Set<string>
  >(new Set());

  const [t1, setT1] = useState<number>(0);
  const [t2, setT2] = useState<number>(0);
  const [t3, setT3] = useState<number>(0);

  // ✅ Sincroniza la data del API con el estado local
  useEffect(() => {
    if (estudiantesApi.length > 0) {
      setEstudiantes(estudiantesApi);
      //setEstudiantes(estudiantesMock);
    }
  }, [estudiantesApi]);

  const handleGuardar = () => {
    if (!estudianteSeleccionado || !materiaSeleccionada) return;

    const promedio = calcularPromedioMateria(t1, t2, t3);

    const nuevosEstudiantes = estudiantes.map((est) => {
      if (est.id === estudianteSeleccionado.id) {
        const nuevasMaterias = { ...est.materias };
        const materiaKey = materiaSeleccionada as keyof typeof nuevasMaterias;

        nuevasMaterias[materiaKey] = {
          ...nuevasMaterias[materiaKey],
          trimestres: { t1, t2, t3 },
          promedioFinal: promedio,
        };

        return { ...est, materias: nuevasMaterias };
      }
      return est;
    });

    setEstudiantes(nuevosEstudiantes);

    // ✅ Marca este estudiante como modificado
    setEstudiantesModificados((prev) =>
      new Set(prev).add(estudianteSeleccionado.id)
    );

    setModalAbierto(false);
    setMateriaSeleccionada('');
    setT1(0);
    setT2(0);
    setT3(0);
  };

  // ✅ Nueva función: Abre el modal con datos existentes para EDITAR
  const abrirModal = (estudiante: Estudiante, materia?: string) => {
    setEstudianteSeleccionado(estudiante);

    // Si se proporciona una materia, carga sus notas existentes
    if (materia) {
      setModoAccion('update');
      const materiaData =
        estudiante.materias[materia as keyof typeof estudiante.materias];
      setMateriaSeleccionada(materia);
      setT1(materiaData.trimestres.t1 || 0);
      setT2(materiaData.trimestres.t2 || 0);
      setT3(materiaData.trimestres.t3 || 0);
    } else {
      setModoAccion('insert');
      // Nuevo ingreso
      setMateriaSeleccionada('');
      setT1(0);
      setT2(0);
      setT3(0);
    }

    setModalAbierto(true);
  };

  return (
    <MantineProvider>
      <Container size="xl" py="xl">
        <Paper shadow="sm" p="md" mb="lg">
          <Title order={2} ta="center">
            Registro de Calificaciones
          </Title>
          <Text ta="center" c="dimmed">
            Todas las materias del periodo lectivo
          </Text>
        </Paper>

        <Paper shadow="sm" p="md" style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>No.</Table.Th>
                <Table.Th>Apellidos y Nombres</Table.Th>
                {materiasConfig.map((mat) => (
                  <Table.Th
                    key={mat.value}
                    colSpan={4}
                    style={{ textAlign: 'center' }}
                  >
                    {mat.label}
                  </Table.Th>
                ))}
                <Table.Th>Acomp. Integral</Table.Th>
                <Table.Th>Anim. Lectura</Table.Th>
                <Table.Th>Suma Total</Table.Th>
                <Table.Th>Promedio Total</Table.Th>
                <Table.Th>Supletorio</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
              <Table.Tr>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                {materiasConfig.map((_) => (
                  <React.Fragment key={_.value}>
                    <Table.Th>T1</Table.Th>
                    <Table.Th>T2</Table.Th>
                    <Table.Th>T3</Table.Th>
                    <Table.Th>Prom</Table.Th>
                  </React.Fragment>
                ))}
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {estudiantes.map((est) => {
                const promedios = materiasConfig.map(
                  (mat) =>
                    est.materias[mat.value as keyof typeof est.materias]
                      .promedioFinal || 0
                );
                const sumaTotal = promedios.reduce((a, b) => a + b, 0);
                const promedioTotal = Number(
                  (sumaTotal / promedios.length).toFixed(2)
                );
                const supletorio = promedioTotal < 7 ? '-' : '';

                return (
                  <Table.Tr key={est.id}>
                    <Table.Td>{est.no}</Table.Td>
                    <Table.Td>{`${est.apellidos} ${est.nombres}`}</Table.Td>
                    {materiasConfig.map((mat) => {
                      const materia =
                        est.materias[mat.value as keyof typeof est.materias];
                      const tieneNotas =
                        materia.trimestres.t1 > 0 ||
                        materia.trimestres.t2 > 0 ||
                        materia.trimestres.t3 > 0;

                      return (
                        <React.Fragment key={mat.value}>
                          {/* ✅ Celdas clicables para editar */}
                          <Table.Td
                            style={{
                              cursor: tieneNotas ? 'pointer' : 'default',
                              backgroundColor: tieneNotas
                                ? '#f8f9fa'
                                : 'transparent',
                            }}
                            onClick={() =>
                              tieneNotas && abrirModal(est, mat.value)
                            }
                          >
                            {materia.trimestres.t1 || '-'}
                          </Table.Td>
                          <Table.Td
                            style={{
                              cursor: tieneNotas ? 'pointer' : 'default',
                              backgroundColor: tieneNotas
                                ? '#f8f9fa'
                                : 'transparent',
                            }}
                            onClick={() =>
                              tieneNotas && abrirModal(est, mat.value)
                            }
                          >
                            {materia.trimestres.t2 || '-'}
                          </Table.Td>
                          <Table.Td
                            style={{
                              cursor: tieneNotas ? 'pointer' : 'default',
                              backgroundColor: tieneNotas
                                ? '#f8f9fa'
                                : 'transparent',
                            }}
                            onClick={() =>
                              tieneNotas && abrirModal(est, mat.value)
                            }
                          >
                            {materia.trimestres.t3 || '-'}
                          </Table.Td>
                          <Table.Td fw={700}>
                            {materia.promedioFinal || '-'}
                          </Table.Td>
                        </React.Fragment>
                      );
                    })}
                    <Table.Td>{est.acompanamientoIntegral || '-'}</Table.Td>
                    <Table.Td>{est.animacionLectura || '-'}</Table.Td>
                    <Table.Td fw={700}>{sumaTotal}</Table.Td>
                    <Table.Td fw={700}>{promedioTotal}</Table.Td>
                    <Table.Td>{supletorio}</Table.Td>
                    <Table.Td>
                      <Button
                        leftSection={<IconEdit size={14} />}
                        size="xs"
                        variant="light"
                        onClick={() => abrirModal(est)}
                      >
                        Agregar Nota
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Paper>

        <Group justify="flex-end" mt="lg">
          <Button
            color="green"
            onClick={async () => {
              // ✅ Solo guarda los estudiantes modificados
              for (const est of estudiantes) {
                if (estudiantesModificados.has(est.id)) {
                  // Determina si es insert o update basado en si existía en estudiantesApi
                  const esNuevo = !estudiantesApi.find((e) => e.id === est.id);
                  await saveEstudiante(est, esNuevo ? 'insert' : 'update');
                }
              }
              // Limpia la lista de modificados después de guardar
              setEstudiantesModificados(new Set());
            }}
            loading={loading}
            disabled={estudiantesModificados.size === 0}
          >
            Guardar Cambios ({estudiantesModificados.size})
          </Button>
        </Group>

        <Modal
          opened={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setMateriaSeleccionada('');
            setT1(0);
            setT2(0);
            setT3(0);
          }}
          title={
            estudianteSeleccionado
              ? `${materiaSeleccionada ? 'Editar' : 'Agregar'} notas: ${
                  estudianteSeleccionado.apellidos
                } ${estudianteSeleccionado.nombres}`
              : 'Agregar notas'
          }
          size="lg"
        >
          <Stack gap="md">
            <Select
              label="Materia"
              placeholder="Seleccione una materia"
              required
              data={materiasConfig}
              value={materiaSeleccionada}
              onChange={(value) => {
                if (value && estudianteSeleccionado) {
                  // ✅ Al cambiar la materia, carga sus notas si existen
                  const materiaData =
                    estudianteSeleccionado.materias[
                      value as keyof typeof estudianteSeleccionado.materias
                    ];
                  setMateriaSeleccionada(value);
                  setT1(materiaData.trimestres.t1 || 0);
                  setT2(materiaData.trimestres.t2 || 0);
                  setT3(materiaData.trimestres.t3 || 0);
                }
              }}
            />
            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Trimestre 1"
                  min={0}
                  max={10}
                  value={t1}
                  onChange={(v) => setT1(Number(v))}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Trimestre 2"
                  min={0}
                  max={10}
                  value={t2}
                  onChange={(v) => setT2(Number(v))}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Trimestre 3"
                  min={0}
                  max={10}
                  value={t3}
                  onChange={(v) => setT3(Number(v))}
                />
              </Grid.Col>
            </Grid>
            <Paper p="sm" bg="gray.0">
              <Text size="sm" fw={500}>
                Promedio: {calcularPromedioMateria(t1, t2, t3)}
              </Text>
            </Paper>
            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => {
                  setModalAbierto(false);
                  setMateriaSeleccionada('');
                  setT1(0);
                  setT2(0);
                  setT3(0);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleGuardar}>
                {modoAccion === 'update' ? 'Actualizar' : 'Guardar'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </MantineProvider>
  );
};
