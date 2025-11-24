import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Title,
  Text,
  Table,
  Button,
  Modal,
  Stack,
  Select,
  NumberInput,
  Grid,
  Group,
  TextInput,
  Badge,
  Collapse,
  Tooltip,
  Pagination,
  Alert,
} from '@mantine/core';
import {
  Edit,
  Search,
  FilterX,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useEstudiantes } from '../hook/useEducacionNotas';

// ===== Tipos =====
interface Trimestres {
  t1: number;
  t2: number;
  t3: number;
}

interface Materia {
  nombre: string;
  trimestres: Trimestres;
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
  { value: 'educacionCulturalArtistica', label: 'Educación Cultural y Artística' },
  { value: 'estudiosSociales', label: 'Estudios Sociales' },
  { value: 'cienciasNaturales', label: 'Ciencias Naturales' },
  { value: 'matematica', label: 'Matemática' },
  { value: 'lenguaLiteratura', label: 'Lengua y Literatura' },
];


export  function HistoricoNotasAdmin() {
  const { estudiantes: estudiantesApi, loading, saveEstudiante } = useEstudiantes();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<string>('');
  const [estudiantesModificados, setEstudiantesModificados] = useState<Set<string>>(new Set());
  const [modoAccion, setModoAccion] = useState<'insert' | 'update' | null>(null);

  const [t1, setT1] = useState<number>(0);
  const [t2, setT2] = useState<number>(0);
  const [t3, setT3] = useState<number>(0);

  // ===== NUEVOS ESTADOS PARA FILTROS =====
  const [busqueda, setBusqueda] = useState('');
  const [filtroMateria, setFiltroMateria] = useState<string>('');
  const [filtroRendimiento, setFiltroRendimiento] = useState<string>('');
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);

  // ===== ESTADOS DE PAGINACIÓN =====
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);

  useEffect(() => {
    if (estudiantesApi.length > 0) {
      setEstudiantes(estudiantesApi);
    }
  }, [estudiantesApi]);

  // ===== FILTRADO DE ESTUDIANTES =====
  const estudiantesFiltrados = useMemo(() => {
    let resultado = [...estudiantes];

    // Filtro por búsqueda (nombre/apellido)
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(
        (est) =>
          est.nombres.toLowerCase().includes(busquedaLower) ||
          est.apellidos.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtro por materia con bajo rendimiento (<7)
    if (filtroMateria) {
      resultado = resultado.filter((est) => {
        const materia = est.materias[filtroMateria as keyof typeof est.materias];
        return materia.promedioFinal > 0 && materia.promedioFinal < 7;
      });
    }

    // Filtro por rendimiento general
    if (filtroRendimiento) {
      resultado = resultado.filter((est) => {
        const promedios = materiasConfig.map(
          (mat) => est.materias[mat.value as keyof typeof est.materias].promedioFinal || 0
        );
        const promedioTotal = promedios.reduce((a, b) => a + b, 0) / promedios.length;

        if (filtroRendimiento === 'excelente') return promedioTotal >= 9;
        if (filtroRendimiento === 'bueno') return promedioTotal >= 7 && promedioTotal < 9;
        if (filtroRendimiento === 'regular') return promedioTotal < 7;
        return true;
      });
    }

    return resultado;
  }, [estudiantes, busqueda, filtroMateria, filtroRendimiento]);

  // ===== PAGINACIÓN =====
  const totalPaginas = Math.ceil(estudiantesFiltrados.length / elementosPorPagina);
  const estudiantesPaginados = estudiantesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Reset paginación cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroMateria, filtroRendimiento, elementosPorPagina]);

  // ===== FUNCIONES =====
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroMateria('');
    setFiltroRendimiento('');
  };

  const hayFiltrosActivos = busqueda || filtroMateria || filtroRendimiento;

  const exportarDatos = () => {
    const csv = [
      ['Apellidos', 'Nombres', ...materiasConfig.map((m) => m.label), 'Acomp. Integral', 'Anim. Lectura', 'Promedio Total'].join(','),
      ...estudiantesFiltrados.map((est) => {
        const promedios = materiasConfig.map(
          (mat) => est.materias[mat.value as keyof typeof est.materias].promedioFinal || 0
        );
        const promedioTotal = Number((promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(2));
        return [
          est.apellidos,
          est.nombres,
          ...promedios,
          est.acompanamientoIntegral || '-',
          est.animacionLectura || '-',
          promedioTotal,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calificaciones.csv';
    a.click();
  };

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
    setEstudiantesModificados((prev) => new Set(prev).add(estudianteSeleccionado.id));

    setModalAbierto(false);
    setMateriaSeleccionada('');
    setT1(0);
    setT2(0);
    setT3(0);
  };

  const abrirModal = (estudiante: Estudiante, materia?: string) => {
    setEstudianteSeleccionado(estudiante);

    if (materia) {
      setModoAccion('update');
      const materiaData = estudiante.materias[materia as keyof typeof estudiante.materias];
      setMateriaSeleccionada(materia);
      setT1(materiaData.trimestres.t1 || 0);
      setT2(materiaData.trimestres.t2 || 0);
      setT3(materiaData.trimestres.t3 || 0);
    } else {
      setModoAccion('insert');
      setMateriaSeleccionada('');
      setT1(0);
      setT2(0);
      setT3(0);
    }

    setModalAbierto(true);
  };

  const getColorPromedio = (promedio: number) => {
    if (promedio < 7) return '#fa5252';
    if (promedio >= 9) return '#51cf66';
    return undefined;
  };

  return (
    <Box>
      <Paper shadow="sm" p="md" mb="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Registro de Calificaciones</Title>
            <Text c="dimmed" size="sm">
              Todas las materias del periodo lectivo
            </Text>
          </div>
          <Badge size="lg" variant="filled" color="blue">
            {estudiantesFiltrados.length} estudiante{estudiantesFiltrados.length !== 1 ? 's' : ''}
          </Badge>
        </Group>
      </Paper>

      {/* ===== PANEL DE FILTROS ===== */}
      <Paper shadow="sm" p="md" mb="md">
        <Group justify="space-between" mb="sm">
          <Group>
            <Text fw={600} size="lg">
              Filtros
            </Text>
            {hayFiltrosActivos && (
              <Badge color="orange" variant="light">
                {[busqueda, filtroMateria, filtroRendimiento].filter(Boolean).length} activo(s)
              </Badge>
            )}
          </Group>
          <Button
            variant="subtle"
            size="xs"
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            rightSection={filtrosAbiertos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          >
            {filtrosAbiertos ? 'Ocultar' : 'Mostrar'}
          </Button>
        </Group>

        <Collapse in={filtrosAbiertos}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                placeholder="Buscar por nombre o apellido..."
                leftSection={<Search size={16} />}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Materia con bajo rendimiento (<7)"
                data={[{ value: '', label: 'Todas las materias' }, ...materiasConfig]}
                value={filtroMateria}
                onChange={(value) => setFiltroMateria(value || '')}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Rendimiento general"
                data={[
                  { value: '', label: 'Todos los niveles' },
                  { value: 'excelente', label: 'Excelente (≥9)' },
                  { value: 'bueno', label: 'Bueno (7-8.9)' },
                  { value: 'regular', label: 'Regular (<7)' },
                ]}
                value={filtroRendimiento}
                onChange={(value) => setFiltroRendimiento(value || '')}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Tooltip label="Limpiar todos los filtros">
                <Button
                  fullWidth
                  variant="light"
                  color="gray"
                  leftSection={<FilterX size={16} />}
                  onClick={limpiarFiltros}
                  disabled={!hayFiltrosActivos}
                >
                  Limpiar filtros
                </Button>
              </Tooltip>
            </Grid.Col>
          </Grid>
        </Collapse>
      </Paper>

      {/* ===== TABLA ===== */}
      <Paper shadow="sm" p="md" style={{ overflowX: 'auto' }}>
        {estudiantesFiltrados.length === 0 ? (
          <Alert icon={<AlertCircle size={16} />} title="Sin resultados" color="yellow">
            No se encontraron estudiantes con los filtros aplicados. Intenta ajustar los criterios de búsqueda.
          </Alert>
        ) : (
          <>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Agregar Nota</Table.Th>
                  <Table.Th>Apellidos y Nombres</Table.Th>
                  {materiasConfig.map((mat) => (
                    <Table.Th key={mat.value} colSpan={4} style={{ textAlign: 'center' }}>
                      {mat.label}
                    </Table.Th>
                  ))}
                  <Table.Th>Acomp. Integral</Table.Th>
                  <Table.Th>Anim. Lectura</Table.Th>
                  <Table.Th>Suma Total</Table.Th>
                  <Table.Th>Promedio Total</Table.Th>
                  <Table.Th>Supletorio</Table.Th>
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
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {estudiantesPaginados.map((est) => {
                  const promedios = materiasConfig.map(
                    (mat) => est.materias[mat.value as keyof typeof est.materias].promedioFinal || 0
                  );
                  const sumaTotal = Number(promedios.reduce((a, b) => a + b, 0).toFixed(2));
                  const promedioTotal = Number((sumaTotal / promedios.length).toFixed(2));

                  return (
                    <Table.Tr key={est.id}>
                      <Table.Td>
                        <Button leftSection={<Edit size={14} />} size="xs" variant="light" onClick={() => abrirModal(est)}>
                          Agregar
                        </Button>
                      </Table.Td>
                      <Table.Td>{`${est.apellidos} ${est.nombres}`}</Table.Td>
                      {materiasConfig.map((mat) => {
                        const materia = est.materias[mat.value as keyof typeof est.materias];
                        const tieneNotas = materia.trimestres.t1 > 0 || materia.trimestres.t2 > 0 || materia.trimestres.t3 > 0;

                        return (
                          <React.Fragment key={mat.value}>
                            <Table.Td
                              style={{ cursor: tieneNotas ? 'pointer' : 'default', backgroundColor: tieneNotas ? '#f8f9fa' : 'transparent' }}
                              onClick={() => tieneNotas && abrirModal(est, mat.value)}
                            >
                              {materia.trimestres.t1 || '-'}
                            </Table.Td>
                            <Table.Td
                              style={{ cursor: tieneNotas ? 'pointer' : 'default', backgroundColor: tieneNotas ? '#f8f9fa' : 'transparent' }}
                              onClick={() => tieneNotas && abrirModal(est, mat.value)}
                            >
                              {materia.trimestres.t2 || '-'}
                            </Table.Td>
                            <Table.Td
                              style={{ cursor: tieneNotas ? 'pointer' : 'default', backgroundColor: tieneNotas ? '#f8f9fa' : 'transparent' }}
                              onClick={() => tieneNotas && abrirModal(est, mat.value)}
                            >
                              {materia.trimestres.t3 || '-'}
                            </Table.Td>
                            <Table.Td fw={700} style={{ color: materia.promedioFinal ? getColorPromedio(materia.promedioFinal) : undefined }}>
                              {materia.promedioFinal || '-'}
                            </Table.Td>
                          </React.Fragment>
                        );
                      })}
                      <Table.Td>{est.acompanamientoIntegral || '-'}</Table.Td>
                      <Table.Td>{est.animacionLectura || '-'}</Table.Td>
                      <Table.Td fw={700}>{sumaTotal}</Table.Td>
                      <Table.Td fw={700} style={{ color: getColorPromedio(promedioTotal) }}>
                        {promedioTotal}
                      </Table.Td>
                      <Table.Td>
                        {promedioTotal < 7 && promedioTotal > 0 && (
                          <Badge color="orange" size="sm">
                            Supletorio
                          </Badge>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>

            {/* ===== CONTROLES DE PAGINACIÓN ===== */}
            <Group justify="space-between" mt="lg">
              <Group>
                <Text size="sm" c="dimmed">
                  Elementos por página:
                </Text>
                <Select
                  size="xs"
                  data={['5', '10', '20', '50']}
                  value={String(elementosPorPagina)}
                  onChange={(value) => setElementosPorPagina(Number(value))}
                  style={{ width: 80 }}
                />
                <Text size="sm" c="dimmed">
                  Mostrando {(paginaActual - 1) * elementosPorPagina + 1} -{' '}
                  {Math.min(paginaActual * elementosPorPagina, estudiantesFiltrados.length)} de {estudiantesFiltrados.length}
                </Text>
              </Group>

              <Pagination total={totalPaginas} value={paginaActual} onChange={setPaginaActual} siblings={1} boundaries={1} />
            </Group>
          </>
        )}
      </Paper>

      {/* ===== BOTONES DE ACCIÓN ===== */}
      <Group justify="space-between" mt="lg">
        <Button leftSection={<Download size={16} />} variant="light" onClick={exportarDatos} disabled={estudiantesFiltrados.length === 0}>
          Exportar datos
        </Button>
        <Button
          color="green"
          onClick={async () => {
            for (const est of estudiantes) {
              if (estudiantesModificados.has(est.id)) {
                const esNuevo = !estudiantesApi.find((e) => e.id === est.id);
                await saveEstudiante(est, esNuevo ? 'insert' : 'update');
              }
            }
            setEstudiantesModificados(new Set());
          }}
          loading={loading}
          disabled={estudiantesModificados.size === 0}
        >
          Guardar Cambios ({estudiantesModificados.size})
        </Button>
      </Group>

      {/* ===== MODAL ===== */}
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
            ? `${materiaSeleccionada ? 'Editar' : 'Agregar'} notas: ${estudianteSeleccionado.apellidos} ${estudianteSeleccionado.nombres}`
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
                const materiaData = estudianteSeleccionado.materias[value as keyof typeof estudianteSeleccionado.materias];
                setMateriaSeleccionada(value);
                setT1(materiaData.trimestres.t1 || 0);
                setT2(materiaData.trimestres.t2 || 0);
                setT3(materiaData.trimestres.t3 || 0);
              }
            }}
          />
          <Grid>
            <Grid.Col span={4}>
              <NumberInput label="Trimestre 1" min={0} max={10} value={t1} onChange={(v) => setT1(Number(v))} />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Trimestre 2" min={0} max={10} value={t2} onChange={(v) => setT2(Number(v))} />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Trimestre 3" min={0} max={10} value={t3} onChange={(v) => setT3(Number(v))} />
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
            <Button onClick={handleGuardar}>{modoAccion === 'update' ? 'Actualizar' : 'Guardar'}</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}