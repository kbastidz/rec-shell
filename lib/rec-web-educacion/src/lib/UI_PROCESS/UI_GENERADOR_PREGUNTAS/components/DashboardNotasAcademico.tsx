import React, { useState, useMemo } from 'react';
import {
  Container,
  Tabs,
  Paper,
  Grid,
  Title,
  Text,
  Badge,
  Card,
  Group,
  Stack,
  RingProgress,
  Progress,
  Table,
  Select,
  Alert,
  ThemeIcon,
  SimpleGrid,
  Center,
  Divider,
  Box,
  ScrollArea,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconAlertTriangle,
  IconTrophy,
  IconCheck,
  IconUsers,
  IconChartBar,
  IconUserExclamation,
  IconHome,
  IconBook,
} from '@tabler/icons-react';

// Tipos
interface Trimestre {
  t1: number;
  t2: number;
  t3: number;
}

interface Materia {
  nombre: string;
  trimestres: Trimestre;
  promedioFinal: number;
}

interface Estudiante {
  id: string;
  no: number;
  apellidos: string;
  nombres: string;
  materias: {
    lenguaExtranjera: Materia;
    educacionFisica: Materia;
    educacionCulturalArtistica: Materia;
    estudiosSociales: Materia;
    cienciasNaturales: Materia;
    matematica: Materia;
    lenguaLiteratura: Materia;
  };
  acompanamientoIntegral: number;
  animacionLectura: number;
}

// Función auxiliar
const crearMateriaVacia = (nombre: string) => ({ nombre });

// Datos mock
const estudiantesMock: Estudiante[] = [
  {
    id: '1',
    no: 1,
    apellidos: 'García',
    nombres: 'Ana',
    materias: {
      lenguaExtranjera: { ...crearMateriaVacia('Lengua Extranjera'), trimestres: { t1: 8.5, t2: 9.0, t3: 9.2 }, promedioFinal: 8.9 },
      educacionFisica: { ...crearMateriaVacia('Educación Física'), trimestres: { t1: 9.0, t2: 9.5, t3: 9.8 }, promedioFinal: 9.4 },
      educacionCulturalArtistica: { ...crearMateriaVacia('Educación Cultural y Artística'), trimestres: { t1: 8.0, t2: 8.5, t3: 9.0 }, promedioFinal: 8.5 },
      estudiosSociales: { ...crearMateriaVacia('Estudios Sociales'), trimestres: { t1: 7.5, t2: 8.0, t3: 8.5 }, promedioFinal: 8.0 },
      cienciasNaturales: { ...crearMateriaVacia('Ciencias Naturales'), trimestres: { t1: 8.0, t2: 8.5, t3: 8.8 }, promedioFinal: 8.4 },
      matematica: { ...crearMateriaVacia('Matemática'), trimestres: { t1: 7.0, t2: 7.5, t3: 8.0 }, promedioFinal: 7.5 },
      lenguaLiteratura: { ...crearMateriaVacia('Lengua y Literatura'), trimestres: { t1: 8.5, t2: 9.0, t3: 9.2 }, promedioFinal: 8.9 },
    },
    acompanamientoIntegral: 9,
    animacionLectura: 8,
  },
  {
    id: '2',
    no: 2,
    apellidos: 'Rodríguez',
    nombres: 'Carlos',
    materias: {
      lenguaExtranjera: { ...crearMateriaVacia('Lengua Extranjera'), trimestres: { t1: 6.0, t2: 6.5, t3: 6.8 }, promedioFinal: 6.4 },
      educacionFisica: { ...crearMateriaVacia('Educación Física'), trimestres: { t1: 8.0, t2: 8.5, t3: 8.8 }, promedioFinal: 8.4 },
      educacionCulturalArtistica: { ...crearMateriaVacia('Educación Cultural y Artística'), trimestres: { t1: 7.0, t2: 7.2, t3: 7.5 }, promedioFinal: 7.2 },
      estudiosSociales: { ...crearMateriaVacia('Estudios Sociales'), trimestres: { t1: 5.5, t2: 6.0, t3: 6.5 }, promedioFinal: 6.0 },
      cienciasNaturales: { ...crearMateriaVacia('Ciencias Naturales'), trimestres: { t1: 6.0, t2: 6.5, t3: 6.8 }, promedioFinal: 6.4 },
      matematica: { ...crearMateriaVacia('Matemática'), trimestres: { t1: 5.0, t2: 5.5, t3: 6.0 }, promedioFinal: 5.5 },
      lenguaLiteratura: { ...crearMateriaVacia('Lengua y Literatura'), trimestres: { t1: 6.5, t2: 7.0, t3: 7.2 }, promedioFinal: 6.9 },
    },
    acompanamientoIntegral: 6,
    animacionLectura: 7,
  },
];

export const DashboardNotasAcademico = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Cálculos y análisis
  const analytics = useMemo(() => {
    const totalEstudiantes = estudiantesMock.length;
    
    // Calcular promedio general por estudiante
    const estudiantesConPromedio = estudiantesMock.map(est => {
      const materias = Object.values(est.materias);
      const sumaPromedios = materias.reduce((acc, mat) => acc + mat.promedioFinal, 0);
      const promedio = sumaPromedios / materias.length;
      return { ...est, promedioGeneral: promedio };
    });

    // Promedios trimestrales globales
    const promediosTrimestrales = { t1: 0, t2: 0, t3: 0 };
    estudiantesMock.forEach(est => {
      Object.values(est.materias).forEach(mat => {
        promediosTrimestrales.t1 += mat.trimestres.t1;
        promediosTrimestrales.t2 += mat.trimestres.t2;
        promediosTrimestrales.t3 += mat.trimestres.t3;
      });
    });
    const totalCalificaciones = totalEstudiantes * 7;
    promediosTrimestrales.t1 /= totalCalificaciones;
    promediosTrimestrales.t2 /= totalCalificaciones;
    promediosTrimestrales.t3 /= totalCalificaciones;

    // Tendencia
    let tendencia = 'stable';
    const difT2T1 = promediosTrimestrales.t2 - promediosTrimestrales.t1;
    const difT3T2 = promediosTrimestrales.t3 - promediosTrimestrales.t2;
    const promedioMejora = (difT2T1 + difT3T2) / 2;
    if (promedioMejora > 0.2) tendencia = 'up';
    else if (promedioMejora < -0.2) tendencia = 'down';

    // Distribución
    const sobresalientes = estudiantesConPromedio.filter(e => e.promedioGeneral >= 9).length;
    const notables = estudiantesConPromedio.filter(e => e.promedioGeneral >= 7 && e.promedioGeneral < 9).length;
    const insuficientes = estudiantesConPromedio.filter(e => e.promedioGeneral < 7).length;

    // Promedio general
    const promedioGeneral = estudiantesConPromedio.reduce((acc, e) => acc + e.promedioGeneral, 0) / totalEstudiantes;
    const tasaAprobacion = ((sobresalientes + notables) / totalEstudiantes) * 100;
    const estudiantesRiesgo = insuficientes;

    // Análisis por materia
    const materiasList = ['lenguaExtranjera', 'educacionFisica', 'educacionCulturalArtistica', 
                         'estudiosSociales', 'cienciasNaturales', 'matematica', 'lenguaLiteratura'];
    
    const materiasAnalisis = materiasList.map(key => {
      const materiaKey = key as keyof Estudiante['materias'];
      const calificaciones = estudiantesMock.map(e => e.materias[materiaKey].promedioFinal);
      const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
      const reprobados = calificaciones.filter(c => c < 7).length;
      const porcentajeReprobacion = (reprobados / totalEstudiantes) * 100;
      
      let estado = 'success';
      if (porcentajeReprobacion > 30) estado = 'danger';
      else if (porcentajeReprobacion > 15) estado = 'warning';

      return {
        nombre: estudiantesMock[0].materias[materiaKey].nombre,
        promedio: promedio.toFixed(2),
        reprobados,
        porcentajeReprobacion: porcentajeReprobacion.toFixed(1),
        estado,
      };
    });

    // Estudiantes en riesgo
    const estudiantesRiesgoDetalle = estudiantesConPromedio
      .filter(e => e.promedioGeneral < 7)
      .map(e => {
        const materiasReprobadas = Object.values(e.materias).filter(m => m.promedioFinal < 7);
        let nivelRiesgo = 'medio';
        if (e.promedioGeneral < 5.5) nivelRiesgo = 'crítico';
        else if (e.promedioGeneral >= 6.5) nivelRiesgo = 'leve';

        return {
          ...e,
          materiasReprobadas: materiasReprobadas.length,
          nivelRiesgo,
        };
      })
      .sort((a, b) => a.promedioGeneral - b.promedioGeneral);

    return {
      totalEstudiantes,
      promedioGeneral: promedioGeneral.toFixed(2),
      tasaAprobacion: tasaAprobacion.toFixed(1),
      estudiantesRiesgo,
      sobresalientes,
      notables,
      insuficientes,
      promediosTrimestrales,
      tendencia,
      materiasAnalisis,
      estudiantesConPromedio: estudiantesConPromedio.sort((a, b) => b.promedioGeneral - a.promedioGeneral),
      estudiantesRiesgoDetalle,
    };
  }, []);

  // Tab 1: Resumen General
  const ResumenGeneral = () => (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Promedio General</Text>
            <Group gap="xs">
              <Text size="xl" fw={700} c="blue">{analytics.promedioGeneral}</Text>
              <Text size="sm" c="dimmed">/ 10</Text>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Tasa de Aprobación</Text>
            <Group gap="xs">
              <Text size="xl" fw={700} c="green">{analytics.tasaAprobacion}%</Text>
              <ThemeIcon color="green" variant="light" size="sm">
                <IconCheck size={14} />
              </ThemeIcon>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Estudiantes</Text>
            <Group gap="xs">
              <Text size="xl" fw={700}>{analytics.totalEstudiantes}</Text>
              <ThemeIcon color="gray" variant="light" size="sm">
                <IconUsers size={14} />
              </ThemeIcon>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>En Riesgo</Text>
            <Group gap="xs">
              <Text size="xl" fw={700} c="red">{analytics.estudiantesRiesgo}</Text>
              <ThemeIcon color="red" variant="light" size="sm">
                <IconAlertTriangle size={14} />
              </ThemeIcon>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Title order={4} mb="md">Distribución de Estudiantes</Title>
            <Center>
              <RingProgress
                size={220}
                thickness={20}
                sections={[
                  { value: (analytics.sobresalientes / analytics.totalEstudiantes) * 100, color: 'teal', tooltip: 'Sobresalientes (9-10)' },
                  { value: (analytics.notables / analytics.totalEstudiantes) * 100, color: 'blue', tooltip: 'Notables (7-8.9)' },
                  { value: (analytics.insuficientes / analytics.totalEstudiantes) * 100, color: 'red', tooltip: 'Insuficientes (<7)' },
                ]}
                label={
                  <Center>
                    <Stack gap={0} align="center">
                      <Text size="xs" c="dimmed">Total</Text>
                      <Text size="xl" fw={700}>{analytics.totalEstudiantes}</Text>
                    </Stack>
                  </Center>
                }
              />
            </Center>
            <Stack gap="xs" mt="lg">
              <Group justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg="teal" style={{ borderRadius: 2 }} />
                  <Text size="sm">Sobresalientes (9-10)</Text>
                </Group>
                <Badge color="teal">{analytics.sobresalientes}</Badge>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg="blue" style={{ borderRadius: 2 }} />
                  <Text size="sm">Notables (7-8.9)</Text>
                </Group>
                <Badge color="blue">{analytics.notables}</Badge>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg="red" style={{ borderRadius: 2 }} />
                  <Text size="sm">Insuficientes (&lt;7)</Text>
                </Group>
                <Badge color="red">{analytics.insuficientes}</Badge>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Title order={4} mb="md">Evolución Trimestral</Title>
            <Stack gap="lg">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Trimestre 1</Text>
                  <Text size="sm" fw={700}>{analytics.promediosTrimestrales.t1.toFixed(2)}</Text>
                </Group>
                <Progress value={(analytics.promediosTrimestrales.t1 / 10) * 100} color="blue" size="lg" />
              </div>
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Trimestre 2</Text>
                  <Text size="sm" fw={700}>{analytics.promediosTrimestrales.t2.toFixed(2)}</Text>
                </Group>
                <Progress value={(analytics.promediosTrimestrales.t2 / 10) * 100} color="cyan" size="lg" />
              </div>
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Trimestre 3</Text>
                  <Text size="sm" fw={700}>{analytics.promediosTrimestrales.t3.toFixed(2)}</Text>
                </Group>
                <Progress value={(analytics.promediosTrimestrales.t3 / 10) * 100} color="teal" size="lg" />
              </div>

              <Alert
                icon={
                  analytics.tendencia === 'up' ? <IconTrendingUp size={16} /> :
                  analytics.tendencia === 'down' ? <IconTrendingDown size={16} /> :
                  <IconMinus size={16} />
                }
                title="Tendencia"
                color={analytics.tendencia === 'up' ? 'green' : analytics.tendencia === 'down' ? 'red' : 'gray'}
              >
                {analytics.tendencia === 'up' && 'El rendimiento está mejorando'}
                {analytics.tendencia === 'down' && 'El rendimiento está descendiendo'}
                {analytics.tendencia === 'stable' && 'El rendimiento se mantiene estable'}
              </Alert>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  // Tab 2: Por Materias
  const PorMaterias = () => (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Promedio por Materia</Title>
        <Stack gap="md">
          {analytics.materiasAnalisis.map((materia, idx) => (
            <div key={idx}>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <Text size="sm" fw={500}>{materia.nombre}</Text>
                  <Badge
                    color={materia.estado === 'success' ? 'green' : materia.estado === 'warning' ? 'yellow' : 'red'}
                    size="sm"
                  >
                    {materia.estado === 'success' ? 'Estable' : materia.estado === 'warning' ? 'Atención' : 'Crítico'}
                  </Badge>
                </Group>
                <Text size="sm" fw={700}>{materia.promedio}</Text>
              </Group>
              <Progress
                value={(parseFloat(materia.promedio) / 10) * 100}
                color={materia.estado === 'success' ? 'green' : materia.estado === 'warning' ? 'yellow' : 'red'}
                size="lg"
              />
            </div>
          ))}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Análisis de Dificultad</Title>
        <Stack gap="md">
          {analytics.materiasAnalisis
            .sort((a, b) => parseFloat(b.porcentajeReprobacion) - parseFloat(a.porcentajeReprobacion))
            .map((materia, idx) => (
              <Paper key={idx} p="md" withBorder>
                <Group justify="space-between" mb="sm">
                  <Text fw={500}>{materia.nombre}</Text>
                  <Badge color={materia.estado === 'success' ? 'green' : materia.estado === 'warning' ? 'yellow' : 'red'}>
                    {materia.reprobados} reprobados
                  </Badge>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Tasa de reprobación:</Text>
                  <Text size="sm" fw={700} c={materia.estado === 'danger' ? 'red' : 'dark'}>
                    {materia.porcentajeReprobacion}%
                  </Text>
                </Group>
              </Paper>
            ))}
        </Stack>
      </Card>
    </Stack>
  );

  // Tab 3: Por Estudiantes
  const PorEstudiantes = () => {
    const selectedStudentData = selectedStudent 
      ? analytics.estudiantesConPromedio.find(e => e.id === selectedStudent)
      : null;

    return (
      <Stack gap="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">Ranking de Estudiantes</Title>
          <ScrollArea h={400}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Posición</Table.Th>
                  <Table.Th>Apellidos</Table.Th>
                  <Table.Th>Nombres</Table.Th>
                  <Table.Th>Promedio</Table.Th>
                  <Table.Th>Estado</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {analytics.estudiantesConPromedio.map((est, idx) => (
                  <Table.Tr key={est.id}>
                    <Table.Td>
                      {idx === 0 && <ThemeIcon color="yellow" variant="light" size="sm"><IconTrophy size={14} /></ThemeIcon>}
                      {idx !== 0 && <Text size="sm">{idx + 1}</Text>}
                    </Table.Td>
                    <Table.Td>{est.apellidos}</Table.Td>
                    <Table.Td>{est.nombres}</Table.Td>
                    <Table.Td>
                      <Text fw={700} c={est.promedioGeneral >= 9 ? 'teal' : est.promedioGeneral >= 7 ? 'blue' : 'red'}>
                        {est.promedioGeneral.toFixed(2)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={est.promedioGeneral >= 9 ? 'teal' : est.promedioGeneral >= 7 ? 'blue' : 'red'}
                        variant="light"
                      >
                        {est.promedioGeneral >= 9 ? 'Sobresaliente' : est.promedioGeneral >= 7 ? 'Aprobado' : 'En Riesgo'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">Perfil del Estudiante</Title>
          <Select
            label="Selecciona un estudiante"
            placeholder="Elige un estudiante"
            data={analytics.estudiantesConPromedio.map(e => ({
              value: e.id,
              label: `${e.apellidos}, ${e.nombres}`,
            }))}
            value={selectedStudent}
            onChange={setSelectedStudent}
            mb="lg"
          />

          {selectedStudentData && (
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" fw={700}>Información General</Text>
                  <Divider />
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Estudiante:</Text>
                    <Text size="sm" fw={500}>{selectedStudentData.nombres} {selectedStudentData.apellidos}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Promedio General:</Text>
                    <Text size="sm" fw={700} c={selectedStudentData.promedioGeneral >= 9 ? 'teal' : selectedStudentData.promedioGeneral >= 7 ? 'blue' : 'red'}>
                      {selectedStudentData.promedioGeneral.toFixed(2)}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Acompañamiento Integral:</Text>
                    <Text size="sm" fw={500}>{selectedStudentData.acompanamientoIntegral}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Animación a la Lectura:</Text>
                    <Text size="sm" fw={500}>{selectedStudentData.animacionLectura}</Text>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Text size="sm" fw={700}>Calificaciones por Materia</Text>
                  <Divider />
                  {Object.values(selectedStudentData.materias).map((materia, idx) => (
                    <Group key={idx} justify="space-between">
                      <Text size="sm">{materia.nombre}</Text>
                      <Badge color={materia.promedioFinal >= 7 ? 'green' : 'red'}>
                        {materia.promedioFinal.toFixed(1)}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          )}
        </Card>
      </Stack>
    );
  };

  // Tab 4: Alertas y Riesgos
  const AlertasRiesgos = () => (
    <Stack gap="lg">
      <Alert icon={<IconAlertTriangle size={20} />} title="Estudiantes que Requieren Atención" color="red" variant="light">
        Hay {analytics.estudiantesRiesgoDetalle.length} estudiante(s) con rendimiento por debajo del nivel esperado
      </Alert>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {analytics.materiasAnalisis
          .filter(m => m.estado === 'danger')
          .map((materia, idx) => (
            <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" fw={700}>{materia.nombre}</Text>
                  <ThemeIcon color="red" variant="light">
                    <IconAlertTriangle size={16} />
                  </ThemeIcon>
                </Group>
                <Center>
                  <RingProgress
                    size={120}
                    thickness={12}
                    sections={[
                      { value: parseFloat(materia.porcentajeReprobacion), color: 'red' },
                    ]}
                    label={
                      <Center>
                        <Stack gap={0} align="center">
                          <Text size="xl" fw={700} c="red">{materia.porcentajeReprobacion}%</Text>
                          <Text size="xs" c="dimmed">reprobados</Text>
                        </Stack>
                      </Center>
                    }
                  />
                </Center>
                <Text size="xs" c="dimmed" ta="center">
                  {materia.reprobados} de {analytics.totalEstudiantes} estudiantes
                </Text>
              </Stack>
            </Card>
          ))}
      </SimpleGrid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Estudiantes en Riesgo - Detalle</Title>
        <Stack gap="md">
          {analytics.estudiantesRiesgoDetalle.map((est, idx) => (
            <Paper key={idx} p="md" withBorder style={{ borderLeft: `4px solid ${est.nivelRiesgo === 'crítico' ? '#fa5252' : est.nivelRiesgo === 'medio' ? '#fd7e14' : '#fab005'}` }}>
              <Group justify="space-between" mb="sm">
                <div>
                  <Text fw={700}>{est.nombres} {est.apellidos}</Text>
                  <Text size="sm" c="dimmed">Promedio: {est.promedioGeneral.toFixed(2)}</Text>
                </div>
                <Badge
                  size="lg"
                  color={est.nivelRiesgo === 'crítico' ? 'red' : est.nivelRiesgo === 'medio' ? 'orange' : 'yellow'}
                >
                  Riesgo {est.nivelRiesgo}
                </Badge>
              </Group>

              <Stack gap="xs">
                <Group gap="xs">
                  <IconUserExclamation size={16} />
                  <Text size="sm">Materias reprobadas: {est.materiasReprobadas}</Text>
                </Group>
                <Divider />
                <Text size="sm" fw={500} mb="xs">Calificaciones por materia:</Text>
                <SimpleGrid cols={2}>
                  {Object.values(est.materias).map((materia, mIdx) => (
                    <Group key={mIdx} justify="space-between">
                      <Text size="xs" c="dimmed">{materia.nombre.substring(0, 20)}...</Text>
                      <Badge size="sm" color={materia.promedioFinal >= 7 ? 'green' : 'red'}>
                        {materia.promedioFinal.toFixed(1)}
                      </Badge>
                    </Group>
                  ))}
                </SimpleGrid>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Card>

      {analytics.estudiantesRiesgoDetalle.length === 0 && (
        <Alert icon={<IconCheck size={20} />} title="¡Excelente!" color="green" variant="light">
          No hay estudiantes en riesgo académico en este momento.
        </Alert>
      )}
    </Stack>
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Dashboard Académico</Title>
            <Text size="sm" c="dimmed">Análisis del rendimiento académico</Text>
          </div>
          <ThemeIcon size="xl" variant="light" color="blue">
            <IconChartBar size={28} />
          </ThemeIcon>
        </Group>

        <Tabs defaultValue="resumen" color="blue">
          <Tabs.List>
            <Tabs.Tab value="resumen" leftSection={<IconHome size={16} />}>
              Resumen
            </Tabs.Tab>
            <Tabs.Tab value="materias" leftSection={<IconBook size={16} />}>
              Por Materias
            </Tabs.Tab>
            <Tabs.Tab value="estudiantes" leftSection={<IconUsers size={16} />}>
              Por Estudiantes
            </Tabs.Tab>
            <Tabs.Tab value="alertas" leftSection={<IconAlertTriangle size={16} />}>
              Alertas
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="resumen" pt="lg">
            <ResumenGeneral />
          </Tabs.Panel>

          <Tabs.Panel value="materias" pt="lg">
            <PorMaterias />
          </Tabs.Panel>

          <Tabs.Panel value="estudiantes" pt="lg">
            <PorEstudiantes />
          </Tabs.Panel>

          <Tabs.Panel value="alertas" pt="lg">
            <AlertasRiesgos />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

