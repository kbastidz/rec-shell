import React, { useState, useMemo, useEffect } from 'react';
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
  Loader,
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
  IconEye,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { useEstudiantes } from '../hook/useEducacionNotas';
import { Estudiante } from '../interfaces/interface';
import { PaginatedTable } from '@rec-shell/rec-web-shared';

export const DashboardNotasAcademico = () => {
  const { estudiantes, loading, error, fetchEstudiantes } = useEstudiantes();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>('todos');

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  // Filtrar estudiantes por curso
  const filteredStudents = useMemo(() => {
    if (selectedCourse === 'todos' || !selectedCourse) {
      return estudiantes;
    }
    return estudiantes.filter(est => est.curso === selectedCourse);
  }, [estudiantes, selectedCourse]);

  // Función para obtener el promedio de historia de un estudiante
  const getPromedioHistoria = (est: Estudiante) => {
    return est.materias.historia.promedioFinal;
  };

  // Cálculos y análisis actualizados
  const analytics = useMemo(() => {
    const totalEstudiantes = filteredStudents.length;
    
    if (totalEstudiantes === 0) {
      return {
        totalEstudiantes: 0,
        promedioGeneral: "0.00",
        tasaAprobacion: "0.0",
        estudiantesRiesgo: 0,
        sobresalientes: 0,
        notables: 0,
        insuficientes: 0,
        promediosTrimestrales: { t1: 0, t2: 0, t3: 0 },
        tendencia: 'stable',
        cursosAnalisis: [],
        estudiantesConPromedio: [],
        estudiantesRiesgoDetalle: [],
      };
    }

    // Calcular promedio general por estudiante (solo historia)
    const estudiantesConPromedio = filteredStudents.map(est => ({
      ...est,
      promedioGeneral: getPromedioHistoria(est),
    }));

    // Promedios trimestrales globales (solo historia)
    const promediosTrimestrales = { t1: 0, t2: 0, t3: 0 };
    filteredStudents.forEach(est => {
      const historia = est.materias.historia;
      promediosTrimestrales.t1 += historia.trimestres.t1;
      promediosTrimestrales.t2 += historia.trimestres.t2;
      promediosTrimestrales.t3 += historia.trimestres.t3;
    });
    
    promediosTrimestrales.t1 /= totalEstudiantes;
    promediosTrimestrales.t2 /= totalEstudiantes;
    promediosTrimestrales.t3 /= totalEstudiantes;

    // Tendencia
    let tendencia = 'stable';
    if (totalEstudiantes > 0) {
      const difT2T1 = promediosTrimestrales.t2 - promediosTrimestrales.t1;
      const difT3T2 = promediosTrimestrales.t3 - promediosTrimestrales.t2;
      const promedioMejora = (difT2T1 + difT3T2) / 2;
      if (promedioMejora > 0.2) tendencia = 'up';
      else if (promedioMejora < -0.2) tendencia = 'down';
    }

    // Distribución
    const sobresalientes = estudiantesConPromedio.filter(e => e.promedioGeneral >= 9).length;
    const notables = estudiantesConPromedio.filter(e => e.promedioGeneral >= 7 && e.promedioGeneral < 9).length;
    const insuficientes = estudiantesConPromedio.filter(e => e.promedioGeneral < 7).length;

    // Promedio general
    const promedioGeneral = estudiantesConPromedio.reduce((acc, e) => acc + e.promedioGeneral, 0) / totalEstudiantes;
    
    const tasaAprobacion = ((sobresalientes + notables) / totalEstudiantes) * 100;
    
    const estudiantesRiesgo = insuficientes;

    // Análisis por curso - obtener cursos dinámicamente
    const cursosUnicos = Array.from(new Set(filteredStudents.map(e => e.curso)));
    const cursosAnalisis = cursosUnicos.map(curso => {
      const estudiantesCurso = filteredStudents.filter(e => e.curso === curso);
      const totalCurso = estudiantesCurso.length;

      const calificaciones = estudiantesCurso.map(e => getPromedioHistoria(e));
      const promedio = calificaciones.reduce((a, b) => a + b, 0) / totalCurso;
      const reprobados = calificaciones.filter(c => c < 7).length;
      const porcentajeReprobacion = (reprobados / totalCurso) * 100;
      
      let estado = 'success';
      if (porcentajeReprobacion > 30) estado = 'danger';
      else if (porcentajeReprobacion > 15) estado = 'warning';

      return {
        curso,
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
        let nivelRiesgo = 'medio';
        if (e.promedioGeneral < 5.5) nivelRiesgo = 'crítico';
        else if (e.promedioGeneral >= 6.5) nivelRiesgo = 'leve';

        return {
          ...e,
          materiasReprobadas: e.promedioGeneral < 7 ? 1 : 0,
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
      cursosAnalisis,
      estudiantesConPromedio: estudiantesConPromedio.sort((a, b) => b.promedioGeneral - a.promedioGeneral),
      estudiantesRiesgoDetalle,
    };
  }, [filteredStudents]);

  // FUNCIONES PARA MANEJO DE ACCIONES DE LA TABLA
  const handleView = (estudiante: Estudiante) => {
    console.log('Ver detalle de:', estudiante);
    setSelectedStudent(estudiante.id.toString());
  };

  const handleEdit = (estudiante: Estudiante) => {
    console.log('Editar:', estudiante);
  };

  const handleDelete = (estudiante: Estudiante) => {
    console.log('Eliminar:', estudiante);
  };

  // Columnas Dinamica Ini
 // Columnas Dinamica Ini
const columns = [
  { 
    key: 'index', 
    label: '#',
    render: (item: any) => {
      // Necesitamos obtener el índice de otra manera
      // Como alternativa, podemos agregar una propiedad de índice a los datos
      const posicion = (analytics.estudiantesConPromedio.findIndex(e => e.id === item.id) + 1) || 1;
      return (
        <Group gap="xs">
          {posicion === 1 ? (
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconTrophy size={14} />
            </ThemeIcon>
          ) : (
            <Text size="sm">{posicion}</Text>
          )}
        </Group>
      );
    }
  },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'nombres', label: 'Nombres' },
  { 
    key: 'curso', 
    label: 'Curso',
    render: (item: Estudiante) => (
      <Badge variant="light">{item.curso}</Badge>
    )
  },
  { 
    key: 'promedioGeneral', 
    label: 'Promedio Historia',
    render: (item: any) => {
      const promedio = item.promedioGeneral || getPromedioHistoria(item);
      return (
        <Text fw={700} c={promedio >= 9 ? 'teal' : promedio >= 7 ? 'blue' : 'red'}>
          {promedio.toFixed(2)}
        </Text>
      );
    }
  },
  { 
    key: 'estado', 
    label: 'Estado',
    render: (item: any) => {
      const promedio = item.promedioGeneral || getPromedioHistoria(item);
      return (
        <Badge
          color={promedio >= 9 ? 'teal' : promedio >= 7 ? 'blue' : 'red'}
          variant="light"
        >
          {promedio >= 9 ? 'Sobresaliente' : promedio >= 7 ? 'Aprobado' : 'En Riesgo'}
        </Badge>
      );
    }
  },
];

// Columnas Dinamica Fin

  
  // Columnas Dinamica Fin

  // Mostrar loading
  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center h={400}>
          <Stack align="center">
            <Loader size="xl" />
            <Text>Cargando estudiantes...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="Error" icon={<IconAlertTriangle />}>
          {error}
        </Alert>
      </Container>
    );
  }

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
                  { 
                    value: analytics.totalEstudiantes > 0 ? (analytics.sobresalientes / analytics.totalEstudiantes) * 100 : 0, 
                    color: 'teal', 
                    tooltip: 'Sobresalientes (9-10)' 
                  },
                  { 
                    value: analytics.totalEstudiantes > 0 ? (analytics.notables / analytics.totalEstudiantes) * 100 : 0, 
                    color: 'blue', 
                    tooltip: 'Notables (7-8.9)' 
                  },
                  { 
                    value: analytics.totalEstudiantes > 0 ? (analytics.insuficientes / analytics.totalEstudiantes) * 100 : 0, 
                    color: 'red', 
                    tooltip: 'Insuficientes (<7)' 
                  },
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
            <Title order={4} mb="md">Evolución Trimestral - Historia</Title>
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
                {analytics.tendencia === 'up' && 'El rendimiento en Historia está mejorando'}
                {analytics.tendencia === 'down' && 'El rendimiento en Historia está descendiendo'}
                {analytics.tendencia === 'stable' && 'El rendimiento en Historia se mantiene estable'}
              </Alert>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );

  // Tab 2: Por Cursos
  const PorCursos = () => (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Promedio por Curso - Historia</Title>
        <Stack gap="md">
          {analytics.cursosAnalisis.map((curso, idx) => (
            <div key={idx}>
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <Text size="sm" fw={500}>Historia - {curso.curso}</Text>
                  <Badge
                    color={curso.estado === 'success' ? 'green' : curso.estado === 'warning' ? 'yellow' : 'red'}
                    size="sm"
                  >
                    {curso.estado === 'success' ? 'Estable' : curso.estado === 'warning' ? 'Atención' : 'Crítico'}
                  </Badge>
                </Group>
                <Text size="sm" fw={700}>{curso.promedio}</Text>
              </Group>
              <Progress
                value={(parseFloat(curso.promedio) / 10) * 100}
                color={curso.estado === 'success' ? 'green' : curso.estado === 'warning' ? 'yellow' : 'red'}
                size="lg"
              />
            </div>
          ))}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Comparativa entre Cursos</Title>
        <Stack gap="md">
          {analytics.cursosAnalisis
            .sort((a, b) => parseFloat(b.porcentajeReprobacion) - parseFloat(a.porcentajeReprobacion))
            .map((curso, idx) => (
              <Paper key={idx} p="md" withBorder>
                <Group justify="space-between" mb="sm">
                  <Text fw={500}>Historia - {curso.curso}</Text>
                  <Badge color={curso.estado === 'success' ? 'green' : curso.estado === 'warning' ? 'yellow' : 'red'}>
                    {curso.reprobados} reprobados
                  </Badge>
                </Group>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Tasa de reprobación:</Text>
                  <Text size="sm" fw={700} c={curso.estado === 'danger' ? 'red' : 'dark'}>
                    {curso.porcentajeReprobacion}%
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
      ? analytics.estudiantesConPromedio.find(e => e.id.toString() === selectedStudent)
      : null;

    return (
      <Stack gap="lg">
        {/* Tabla paginada usando PaginatedTable */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">Ranking de Estudiantes - Historia</Title>
          
          {/* Columnas Dinamica Ini */}
          <PaginatedTable
            data={analytics.estudiantesConPromedio}
            columns={columns}
            
            loading={loading}
            searchFields={['nombres', 'apellidos', 'curso']}
            itemsPerPage={10}
            searchPlaceholder="Buscar por nombre, apellido o curso..."
            getRowKey={(item) => item.id.toString()}
          />
          {/* Columnas Dinamica Fin */}
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">Perfil del Estudiante</Title>
          <Select
            label="Selecciona un estudiante"
            placeholder="Elige un estudiante"
            data={analytics.estudiantesConPromedio.map(e => ({
              value: e.id.toString(),
              label: `${e.apellidos}, ${e.nombres} (${e.curso})`,
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
                    <Text size="sm" c="dimmed">Número:</Text>
                    <Text size="sm" fw={500}>{selectedStudentData.no}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Curso:</Text>
                    <Badge>{selectedStudentData.curso}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Promedio Historia:</Text>
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
                  <Text size="sm" fw={700}>Calificaciones de Historia por Trimestre</Text>
                  <Divider />
                  <Group justify="space-between">
                    <Text size="sm">Trimestre 1</Text>
                    <Badge color={selectedStudentData.materias.historia.trimestres.t1 >= 7 ? 'green' : 'red'}>
                      {selectedStudentData.materias.historia.trimestres.t1.toFixed(1)}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Trimestre 2</Text>
                    <Badge color={selectedStudentData.materias.historia.trimestres.t2 >= 7 ? 'green' : 'red'}>
                      {selectedStudentData.materias.historia.trimestres.t2.toFixed(1)}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Trimestre 3</Text>
                    <Badge color={selectedStudentData.materias.historia.trimestres.t3 >= 7 ? 'green' : 'red'}>
                      {selectedStudentData.materias.historia.trimestres.t3.toFixed(1)}
                    </Badge>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text size="sm" fw={700}>Promedio Final</Text>
                    <Badge color={selectedStudentData.materias.historia.promedioFinal >= 7 ? 'green' : 'red'} size="lg">
                      {selectedStudentData.materias.historia.promedioFinal.toFixed(1)}
                    </Badge>
                  </Group>
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
        Hay {analytics.estudiantesRiesgoDetalle.length} estudiante(s) con rendimiento por debajo del nivel esperado en Historia
      </Alert>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {analytics.cursosAnalisis
          .filter(curso => curso.estado === 'danger')
          .map((curso, idx) => (
            <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" fw={700}>Historia - {curso.curso}</Text>
                  <ThemeIcon color="red" variant="light">
                    <IconAlertTriangle size={16} />
                  </ThemeIcon>
                </Group>
                <Center>
                  <RingProgress
                    size={120}
                    thickness={12}
                    sections={[
                      { value: parseFloat(curso.porcentajeReprobacion), color: 'red' },
                    ]}
                    label={
                      <Center>
                        <Stack gap={0} align="center">
                          <Text size="xl" fw={700} c="red">{curso.porcentajeReprobacion}%</Text>
                          <Text size="xs" c="dimmed">reprobados</Text>
                        </Stack>
                      </Center>
                    }
                  />
                </Center>
                <Text size="xs" c="dimmed" ta="center">
                  {curso.reprobados} de {analytics.totalEstudiantes} estudiantes
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
                  <Text size="sm" c="dimmed">Curso: {est.curso} | Promedio: {est.promedioGeneral.toFixed(2)}</Text>
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
                  <Text size="sm">Historia: {est.materias.historia.promedioFinal.toFixed(1)}</Text>
                </Group>
                <Divider />
                <Text size="sm" fw={500} mb="xs">Calificaciones por trimestre:</Text>
                <SimpleGrid cols={3}>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">T1</Text>
                    <Badge size="sm" color={est.materias.historia.trimestres.t1 >= 7 ? 'green' : 'red'}>
                      {est.materias.historia.trimestres.t1.toFixed(1)}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">T2</Text>
                    <Badge size="sm" color={est.materias.historia.trimestres.t2 >= 7 ? 'green' : 'red'}>
                      {est.materias.historia.trimestres.t2.toFixed(1)}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">T3</Text>
                    <Badge size="sm" color={est.materias.historia.trimestres.t3 >= 7 ? 'green' : 'red'}>
                      {est.materias.historia.trimestres.t3.toFixed(1)}
                    </Badge>
                  </Group>
                </SimpleGrid>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Card>

      {analytics.estudiantesRiesgoDetalle.length === 0 && (
        <Alert icon={<IconCheck size={20} />} title="¡Excelente!" color="green" variant="light">
          No hay estudiantes en riesgo académico en Historia en este momento.
        </Alert>
      )}
    </Stack>
  );

  // Obtener cursos únicos para el filtro
  const cursosDisponibles = Array.from(new Set(estudiantes.map(e => e.curso)));

  return (
    <Box size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>Dashboard de Historia</Title>
            <Text size="sm" c="dimmed">Análisis del rendimiento en Historia</Text>
          </div>
          <Group>
            <Select
              label="Filtrar por curso"
              placeholder="Todos los cursos"
              data={[
                { value: 'todos', label: 'Todos los cursos' },
                ...cursosDisponibles.map(curso => ({
                  value: curso,
                  label: curso,
                })),
              ]}
              value={selectedCourse}
              onChange={setSelectedCourse}
              w={200}
            />
            <ThemeIcon size="xl" variant="light" color="blue">
              <IconChartBar size={28} />
            </ThemeIcon>
          </Group>
        </Group>

        <Tabs defaultValue="resumen" color="blue">
          <Tabs.List>
            <Tabs.Tab value="resumen" leftSection={<IconHome size={16} />}>
              Resumen
            </Tabs.Tab>
            <Tabs.Tab value="cursos" leftSection={<IconBook size={16} />}>
              Por Cursos
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

          <Tabs.Panel value="cursos" pt="lg">
            <PorCursos />
          </Tabs.Panel>

          <Tabs.Panel value="estudiantes" pt="lg">
            <PorEstudiantes />
          </Tabs.Panel>

          <Tabs.Panel value="alertas" pt="lg">
            <AlertasRiesgos />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  );
};