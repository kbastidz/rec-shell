import React, { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Grid,
  Card,
  Text,
  Group,
  Stack,
  ThemeIcon,
  RingProgress,
  Timeline,
  Select,
  SimpleGrid,
  Tabs,
  Alert,
  Progress
} from '@mantine/core';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  Leaf,
  CheckCircle
} from 'lucide-react';

import { useAnalisisImagen } from '../../UI_CARGA_IMAGEN/hook/useAgriculturaMchl';

// Datos mock basados en la estructura de tu tabla
const analisisData = [
  {
    id: 1,
    es_valido: true,
    fecha: '2025-01-08 14:30:00',
    archivo: 'cacao_lote_A_001.jpg',
    mensaje: 'Análisis completado exitosamente',
    nombre_cultivo: 'Cacao',
    tipo_alerta: 'media',
    detecciones: [
      { area: 432540, bbox: { x1: 426, x2: 782, y1: 261, y2: 1476 }, region: 1, confianza: 94.3, deficiencia: 'Potasio' },
      { area: 19865, bbox: { x1: 1054, x2: 1199, y1: 2, y2: 139 }, region: 2, confianza: 50.15, deficiencia: 'Potasio' },
      { area: 59430, bbox: { x1: 989, x2: 1199, y1: 214, y2: 497 }, region: 3, confianza: 27.14, deficiencia: 'Potasio' }
    ],
    estadisticas: {
      por_tipo: { Potasio: 3 },
      confianza_maxima: 94.3,
      total_detecciones: 3,
      confianza_promedio: 57.2,
      deficiencias_unicas: 1
    }
  },
  {
    id: 2,
    es_valido: true,
    fecha: '2025-01-07 10:15:00',
    archivo: 'cacao_lote_B_002.jpg',
    mensaje: 'Análisis completado exitosamente',
    nombre_cultivo: 'Cacao',
    tipo_alerta: 'alta',
    detecciones: [
      { area: 523000, bbox: { x1: 300, x2: 900, y1: 200, y2: 1400 }, region: 1, confianza: 89.5, deficiencia: 'Nitrógeno' },
      { area: 145000, bbox: { x1: 100, x2: 400, y1: 50, y2: 500 }, region: 2, confianza: 76.2, deficiencia: 'Nitrógeno' }
    ],
    estadisticas: {
      por_tipo: { Nitrógeno: 2 },
      confianza_maxima: 89.5,
      total_detecciones: 2,
      confianza_promedio: 82.85,
      deficiencias_unicas: 1
    }
  },
  {
    id: 3,
    es_valido: true,
    fecha: '2025-01-06 16:45:00',
    archivo: 'cacao_lote_C_003.jpg',
    mensaje: 'Análisis completado exitosamente',
    nombre_cultivo: 'Cacao',
    tipo_alerta: 'baja',
    detecciones: [
      { area: 95000, bbox: { x1: 500, x2: 750, y1: 300, y2: 900 }, region: 1, confianza: 45.8, deficiencia: 'Magnesio' }
    ],
    estadisticas: {
      por_tipo: { Magnesio: 1 },
      confianza_maxima: 45.8,
      total_detecciones: 1,
      confianza_promedio: 45.8,
      deficiencias_unicas: 1
    }
  },
  {
    id: 4,
    es_valido: false,
    fecha: '2025-01-05 09:20:00',
    archivo: 'cacao_lote_D_004.jpg',
    mensaje: 'Imagen de baja calidad',
    nombre_cultivo: 'Cacao',
    tipo_alerta: null,
    detecciones: [],
    estadisticas: {
      por_tipo: {},
      confianza_maxima: 0,
      total_detecciones: 0,
      confianza_promedio: 0,
      deficiencias_unicas: 0
    }
  },
  {
    id: 5,
    es_valido: true,
    fecha: '2025-01-04 13:10:00',
    archivo: 'cacao_lote_E_005.jpg',
    mensaje: 'Análisis completado exitosamente',
    nombre_cultivo: 'Cacao',
    tipo_alerta: 'media',
    detecciones: [
      { area: 280000, bbox: { x1: 200, x2: 600, y1: 100, y2: 800 }, region: 1, confianza: 72.3, deficiencia: 'Fósforo' },
      { area: 180000, bbox: { x1: 650, x2: 950, y1: 200, y2: 950 }, region: 2, confianza: 68.9, deficiencia: 'Fósforo' }
    ],
    estadisticas: {
      por_tipo: { Fósforo: 2 },
      confianza_maxima: 72.3,
      total_detecciones: 2,
      confianza_promedio: 70.6,
      deficiencias_unicas: 1
    }
  }
];

// Datos mock de historial de tiempo de sesión del usuario
const sessionHistoryData = [
  { fecha: '2025-01-01', duracion: 45, sesiones: 2, horaInicio: '08:30', horaFin: '09:15' },
  { fecha: '2025-01-02', duracion: 120, sesiones: 3, horaInicio: '09:00', horaFin: '11:00' },
  { fecha: '2025-01-03', duracion: 90, sesiones: 2, horaInicio: '10:15', horaFin: '11:45' },
  { fecha: '2025-01-04', duracion: 180, sesiones: 4, horaInicio: '08:00', horaFin: '11:00' },
  { fecha: '2025-01-05', duracion: 60, sesiones: 1, horaInicio: '14:30', horaFin: '15:30' },
  { fecha: '2025-01-06', duracion: 150, sesiones: 3, horaInicio: '09:30', horaFin: '12:00' },
  { fecha: '2025-01-07', duracion: 105, sesiones: 2, horaInicio: '10:00', horaFin: '11:45' },
  { fecha: '2025-01-08', duracion: 135, sesiones: 3, horaInicio: '08:45', horaFin: '11:00' },
  { fecha: '2025-01-09', duracion: 75, sesiones: 2, horaInicio: '15:00', horaFin: '16:15' },
  { fecha: '2025-01-10', duracion: 95, sesiones: 2, horaInicio: '09:15', horaFin: '10:50' }
];

// Datos agregados para gráficos
const deficienciasPorTipo = analisisData
  .filter(item => item.es_valido)
  .reduce((acc: Record<string, number>, item) => {
    Object.entries(item.estadisticas.por_tipo).forEach(([tipo, cantidad]) => {
      acc[tipo] = (acc[tipo] || 0) + cantidad;
    });
    return acc;
  }, {} as Record<string, number>);

const chartDeficiencias = Object.entries(deficienciasPorTipo).map(([nombre, cantidad]) => ({
  nombre,
  cantidad
}));

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];

type AlertaPorDia = {
  fecha: string;
  alta: number;
  media: number;
  baja: number;
};

const alertasPorDia = analisisData
  .filter(item => item.es_valido && item.tipo_alerta)
  .reduce((acc: { [key: string]: AlertaPorDia }, item) => {
    const fecha = item.fecha.split(' ')[0];
    if (!acc[fecha]) {
      acc[fecha] = { fecha, alta: 0, media: 0, baja: 0 };
    }
    acc[fecha][item.tipo_alerta as 'alta' | 'media' | 'baja']++;
    return acc;
  }, {} as { [key: string]: AlertaPorDia });

const chartAlertas = Object.values(alertasPorDia);

export  function DashboardAdminM1() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const totalAnalisis = analisisData.length;
  const analisisValidos = analisisData.filter(a => a.es_valido).length;
  const tasaExito = ((analisisValidos / totalAnalisis) * 100).toFixed(1);
  const totalDetecciones = analisisData.reduce((sum, a) => sum + a.estadisticas.total_detecciones, 0);
  const promedioConfianza = (
    analisisData
      .filter(a => a.es_valido)
      .reduce((sum, a) => sum + a.estadisticas.confianza_promedio, 0) / analisisValidos
  ).toFixed(1);

  // Estadísticas de sesiones
  const totalTiempoSesion = sessionHistoryData.reduce((sum, s) => sum + s.duracion, 0);
  const promedioSesion = (totalTiempoSesion / sessionHistoryData.length).toFixed(0);
  const totalSesiones = sessionHistoryData.reduce((sum, s) => sum + s.sesiones, 0);

  const { loading, error, analisisList, OBTENER } = useAnalisisImagen();
 
    
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1} mb="xs">Dashboard de Análisis de Deficiencias</Title>
          <Text c="dimmed" size="lg">Monitoreo y análisis de cultivos de cacao</Text>
        </div>

        {/* KPIs */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Análisis</Text>
                <Text size="xl" fw={700} mt="xs">{totalAnalisis}</Text>
                <Text size="xs" c="teal" mt={4}>
                  {analisisValidos} válidos
                </Text>
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="blue">
                <BarChart3 size={30} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Tasa de Éxito</Text>
                <Text size="xl" fw={700} mt="xs">{tasaExito}%</Text>
                <Progress value={parseFloat(tasaExito)} mt="xs" size="sm" color="teal" />
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="teal">
                <CheckCircle size={30} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Detecciones</Text>
                <Text size="xl" fw={700} mt="xs">{totalDetecciones}</Text>
                <Text size="xs" c="orange" mt={4}>
                  {chartDeficiencias.length} tipos únicos
                </Text>
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="orange">
                <Leaf size={30} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Confianza Promedio</Text>
                <Text size="xl" fw={700} mt="xs">{promedioConfianza}%</Text>
                <RingProgress
                  size={50}
                  thickness={4}
                  sections={[{ value: parseFloat(promedioConfianza), color: 'violet' }]}
                  mt="xs"
                />
              </div>
              <ThemeIcon size={60} radius="md" variant="light" color="violet">
                <TrendingUp size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Tabs principales */}
        <Tabs defaultValue="deficiencias" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="deficiencias" leftSection={<Leaf size={16} />}>
              Análisis de Deficiencias
            </Tabs.Tab>
            <Tabs.Tab value="sesiones" leftSection={<Clock size={16} />}>
              Historial de Sesiones
            </Tabs.Tab>
          </Tabs.List>

          {/* TAB: Análisis de Deficiencias */}
          <Tabs.Panel value="deficiencias" pt="xl">
            <Grid gutter="lg">
              {/* Gráfico de barras - Deficiencias por tipo */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper shadow="xs" p="md" withBorder>
                  <Title order={3} mb="md">Deficiencias Detectadas por Tipo</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDeficiencias}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#4ecdc4" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid.Col>

              {/* Gráfico de pie - Distribución */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper shadow="xs" p="md" withBorder>
                  <Title order={3} mb="md">Distribución de Deficiencias</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartDeficiencias}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(p: any) => `${p.payload.nombre} ${(p.percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {chartDeficiencias.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid.Col>

              {/* Gráfico de alertas por día */}
              <Grid.Col span={12}>
                <Paper shadow="xs" p="md" withBorder>
                  <Title order={3} mb="md">Alertas por Severidad (Últimos 7 días)</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartAlertas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="alta" stackId="a" fill="#ff6b6b" name="Alta" />
                      <Bar dataKey="media" stackId="a" fill="#f9ca24" name="Media" />
                      <Bar dataKey="baja" stackId="a" fill="#6c5ce7" name="Baja" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid.Col>

           
            </Grid>
          </Tabs.Panel>

          {/* TAB: Historial de Sesiones */}
          <Tabs.Panel value="sesiones" pt="xl">
            <Stack gap="lg">
              {/* KPIs de sesiones */}
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Tiempo Total</Text>
                      <Text size="xl" fw={700} mt="xs">{totalTiempoSesion} min</Text>
                      <Text size="xs" c="blue" mt={4}>
                        {(totalTiempoSesion / 60).toFixed(1)} horas
                      </Text>
                    </div>
                    <ThemeIcon size={60} radius="md" variant="light" color="blue">
                      <Clock size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Promedio por Día</Text>
                      <Text size="xl" fw={700} mt="xs">{promedioSesion} min</Text>
                      <Text size="xs" c="teal" mt={4}>
                        Últimos 10 días
                      </Text>
                    </div>
                    <ThemeIcon size={60} radius="md" variant="light" color="teal">
                      <Activity size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Sesiones</Text>
                      <Text size="xl" fw={700} mt="xs">{totalSesiones}</Text>
                      <Text size="xs" c="violet" mt={4}>
                        {(totalSesiones / sessionHistoryData.length).toFixed(1)} por día
                      </Text>
                    </div>
                    <ThemeIcon size={60} radius="md" variant="light" color="violet">
                      <TrendingUp size={30} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </SimpleGrid>

              {/* Gráfico de tiempo de sesión */}
              <Paper shadow="xs" p="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={3}>Historial de Tiempo en Sistema</Title>
                  <Select
                    value={selectedPeriod}
                    onChange={(value) => {
                      if (value) setSelectedPeriod(value);
                    }}
                    data={[
                      { value: '7d', label: 'Últimos 7 días' },
                      { value: '30d', label: 'Últimos 30 días' },
                      { value: 'all', label: 'Todo el historial' }
                    ]}
                    style={{ width: 180 }}
                  />
                </Group>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={sessionHistoryData}>
                    <defs>
                      <linearGradient id="colorDuracion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="fecha" 
                      tickFormatter={(fecha) => new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <Paper p="sm" shadow="md" withBorder>
                              <Text size="sm" fw={700}>{data.fecha}</Text>
                              <Text size="xs" c="dimmed">Duración: {data.duracion} minutos</Text>
                              <Text size="xs" c="dimmed">Sesiones: {data.sesiones}</Text>
                              <Text size="xs" c="dimmed">Inicio: {data.horaInicio}</Text>
                              <Text size="xs" c="dimmed">Fin: {data.horaFin}</Text>
                            </Paper>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="duracion" 
                      stroke="#4ecdc4" 
                      fillOpacity={1} 
                      fill="url(#colorDuracion)"
                      name="Duración (min)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>

              {/* Gráfico de sesiones por día */}
              <Paper shadow="xs" p="md" withBorder>
                <Title order={3} mb="md">Número de Sesiones por Día</Title>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sessionHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="fecha" 
                      tickFormatter={(fecha) => new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sesiones" fill="#6c5ce7" name="Sesiones" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>

              {/* Timeline de sesiones */}
              <Paper shadow="xs" p="md" withBorder>
                <Title order={3} mb="md">Actividad Reciente</Title>
                <Timeline active={-1} bulletSize={24} lineWidth={2}>
                  {sessionHistoryData.slice(0, 5).map((sesion, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={<Clock size={12} />}
                      title={`${new Date(sesion.fecha).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}`}
                    >
                      <Text c="dimmed" size="sm">
                        {sesion.sesiones} {sesion.sesiones === 1 ? 'sesión' : 'sesiones'} • {sesion.duracion} minutos
                      </Text>
                      <Text size="xs" c="dimmed" mt={4}>
                        {sesion.horaInicio} - {sesion.horaFin}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Paper>

              {/* Información adicional */}
              <Alert
                variant="light"
                color="blue"
                title="Información del Sistema"
                icon={<Activity size={16} />}
              >
                El seguimiento de tiempo registra automáticamente cuando el usuario ingresa y sale del sistema.
                Los datos se actualizan en tiempo real y se mantienen por 90 días.
              </Alert>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}