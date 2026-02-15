import React, { useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Progress,
  SimpleGrid,
  Paper,
  Center,
  Loader,
  Box
} from '@mantine/core';
import {
  TrendingUp,
  Zap,
  Flame,
  Calendar,
  Activity,
  TrendingDown
} from 'lucide-react';
import { useDashboardUser } from '../hook/useDashboardUser';
import { ST_GET_USER_ID } from '../../../utils/utilidad';
import { TransaccionesTable } from './TransaccionesTable';
import { TransaccionPunto, TransaccionesRecientesDTO } from '../services/gamificacion.usuario.service';

// Helper para normalizar datos (soporta camelCase y snake_case)
const normalizarTransaccion = (t: TransaccionPunto) => ({
  ...t,
  tipoTransaccion: t.tipoTransaccion || t.tipo_transaccion || 'GANAR',
  tipoOrigen: t.tipoOrigen || t.tipo_origen || '',
  creadoEn: t.creadoEn || t.creado_en || '',
});

export const DashboardUser = () => {
  const {
    transaccionesRecientes,
    loading,
    error,
    fetchDashboardCompleto,
  } = useDashboardUser();

  useEffect(() => {
    const userId = Number(ST_GET_USER_ID());
    fetchDashboardCompleto(userId);
  }, []);

  // Calcular métricas desde transacciones
  const metricas = useMemo(() => {
    const transaccionesRaw: TransaccionPunto[] = transaccionesRecientes?.transacciones ?? [];
    const transacciones = transaccionesRaw.map(normalizarTransaccion);
    
    console.log('Transacciones normalizadas:', transacciones);
    
    if (transacciones.length === 0) {
      return {
        balanceActual: 0,
        totalGanado: 0,
        totalGastado: 0,
        diasActivos: 0,
        rachaActual: 0,
        mejorRacha: 0,
        actividadPorDia: [] as Array<{
          fecha: string;
          transacciones: number;
          puntosGanados: number;
          puntosGastados: number;
        }>,
        estadisticasPorOrigen: [] as Array<{
          tipo: string;
          cantidad: number;
          puntos: number;
        }>
      };
    }

    // Balance actual (último balanceDespues)
    const balanceActual = transacciones[0]?.balanceDespues || 0;

    // Total ganado y gastado
    const totalGanado = transacciones
      .filter(t => t.tipoTransaccion === 'GANAR')
      .reduce((sum, t) => sum + t.cantidad, 0);
    
    const totalGastado = transacciones
      .filter(t => t.tipoTransaccion === 'GASTAR')
      .reduce((sum, t) => sum + Math.abs(t.cantidad), 0);

    // Actividad por día
    const actividadPorDiaMap = new Map<string, {
      fecha: string;
      transacciones: number;
      puntosGanados: number;
      puntosGastados: number;
    }>();
    
    transacciones.forEach(t => {
      const fecha = new Date(t.creadoEn).toLocaleDateString();
      if (!actividadPorDiaMap.has(fecha)) {
        actividadPorDiaMap.set(fecha, {
          fecha: t.creadoEn,
          transacciones: 0,
          puntosGanados: 0,
          puntosGastados: 0
        });
      }
      const dia = actividadPorDiaMap.get(fecha)!;
      dia.transacciones++;
      if (t.tipoTransaccion === 'GANAR') {
        dia.puntosGanados += t.cantidad;
      } else {
        dia.puntosGastados += Math.abs(t.cantidad);
      }
    });

    const actividadPorDia = Array.from(actividadPorDiaMap.values())
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 7);

    // Días activos
    const diasActivos = actividadPorDiaMap.size;

    // Calcular rachas
    const fechasUnicas = Array.from(actividadPorDiaMap.keys())
      .map(f => new Date(f))
      .sort((a, b) => b.getTime() - a.getTime());

    let rachaActual = 0;
    let mejorRacha = 0;
    let rachaTemp = 0;

    for (let i = 0; i < fechasUnicas.length; i++) {
      if (i === 0) {
        rachaTemp = 1;
        rachaActual = 1;
      } else {
        const diffDias = Math.floor(
          (fechasUnicas[i - 1].getTime() - fechasUnicas[i].getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDias === 1) {
          rachaTemp++;
          if (i === 1) rachaActual = rachaTemp;
        } else {
          rachaTemp = 1;
        }
      }
      mejorRacha = Math.max(mejorRacha, rachaTemp);
    }

    // Estadísticas por tipo de origen
    const origenMap = new Map<string, {
      tipo: string;
      cantidad: number;
      puntos: number;
    }>();
    
    transacciones.forEach(t => {
      if (!origenMap.has(t.tipoOrigen)) {
        origenMap.set(t.tipoOrigen, {
          tipo: t.tipoOrigen,
          cantidad: 0,
          puntos: 0
        });
      }
      const origen = origenMap.get(t.tipoOrigen)!;
      origen.cantidad++;
      if (t.tipoTransaccion === 'GANAR') {
        origen.puntos += t.cantidad;
      }
    });

    const estadisticasPorOrigen = Array.from(origenMap.values())
      .sort((a, b) => b.puntos - a.puntos);

    return {
      balanceActual,
      totalGanado,
      totalGastado,
      diasActivos,
      rachaActual,
      mejorRacha,
      actividadPorDia,
      estadisticasPorOrigen
    };
  }, [transaccionesRecientes]);

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="xl" />
          <Text size="lg" c="dimmed">
            Cargando tu progreso...
          </Text>
        </Stack>
      </Center>
    );
  }

  const transacciones = transaccionesRecientes?.transacciones ?? [];

  const origenColors: Record<string, string> = {
    TRIVIA: 'blue',
    RULETA: 'grape',
    BINGO: 'orange',
    MATERIA_COMPLETA: 'green',
    DESAFIO: 'cyan',
    RECOMPENSA: 'pink',
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={1}>Mi Progreso</Title>
          <Text c="dimmed" size="sm">
            Visualiza tu desempeño y actividad
          </Text>
        </div>

        {/* Cards de métricas principales */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
          {/* Balance Actual */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Balance Actual
              </Text>
              <Zap size={20} color="#fab005" />
            </Group>
            <Text size="xl" fw={700} c="orange">
              {metricas.balanceActual.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Puntos disponibles
            </Text>
          </Card>

          {/* Total Ganado */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total Ganado
              </Text>
              <TrendingUp size={20} color="#51cf66" />
            </Group>
            <Text size="xl" fw={700} c="green">
              +{metricas.totalGanado.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Puntos acumulados
            </Text>
          </Card>

         

          {/* Racha Actual */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Racha Actual
              </Text>
              <Flame size={20} color="#fd7e14" />
            </Group>
            <Text size="xl" fw={700} c="orange">
              {metricas.rachaActual}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              Días consecutivos
            </Text>
          </Card>
        </SimpleGrid>

        {/* Balance y Actividad */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Title order={3} mb="md">
                Resumen de Balance
              </Title>
              <Stack gap="md">
                <SimpleGrid cols={3}>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Ganados
                    </Text>
                    <Text size="lg" fw={700} c="green">
                      +{metricas.totalGanado.toLocaleString()}
                    </Text>
                  </Paper>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Gastados
                    </Text>
                    <Text size="lg" fw={700} c="red">
                      -{metricas.totalGastado.toLocaleString()}
                    </Text>
                  </Paper>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Balance
                    </Text>
                    <Text size="lg" fw={700} c="blue">
                      {metricas.balanceActual.toLocaleString()}
                    </Text>
                  </Paper>
                </SimpleGrid>

                <div>
                  <Text size="sm" fw={500} mb="md">
                    Actividades Realizadas:
                  </Text>
                  {metricas.estadisticasPorOrigen.map((origen, idx) => (
                    <Box key={`${origen.tipo}-${idx}`} mb="md">
                      <Group justify="space-between" mb={5}>
                        <Group gap="xs">
                          <Badge color={origenColors[origen.tipo] || 'gray'}>
                            {origen.tipo}
                          </Badge>
                          <Text size="sm">{origen.cantidad} veces</Text>
                        </Group>
                        <Text size="sm" fw={500} c="green">
                          +{origen.puntos} pts
                        </Text>
                      </Group>
                      <Progress
                        value={(origen.puntos / metricas.totalGanado) * 100}
                        color={origenColors[origen.tipo] || 'gray'}
                        size="sm"
                      />
                    </Box>
                  ))}
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Title order={3} mb="md">
                <Group gap="xs">
                  <Activity size={24} />
                  Estadísticas de Actividad
                </Group>
              </Title>
              <Stack gap="md">
                <SimpleGrid cols={3}>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Días Activos
                    </Text>
                    <Text size="xl" fw={700}>
                      {metricas.diasActivos}
                    </Text>
                  </Paper>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Racha Actual
                    </Text>
                    <Text size="xl" fw={700} c="orange">
                      {metricas.rachaActual}
                    </Text>
                  </Paper>
                  <Paper p="md" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Mejor Racha
                    </Text>
                    <Text size="xl" fw={700} c="blue">
                      {metricas.mejorRacha}
                    </Text>
                  </Paper>
                </SimpleGrid>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Total de Transacciones:
                  </Text>
                  <Paper p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <Text size="lg" fw={700}>
                        {transacciones.length}
                      </Text>
                      <Text size="xs" c="dimmed">
                        actividades registradas
                      </Text>
                    </Group>
                  </Paper>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Actividad Reciente */}
        {metricas.actividadPorDia.length > 0 && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              <Group gap="xs">
                <Calendar size={24} />
                Actividad de los Últimos 7 Días
              </Group>
            </Title>
            <Stack gap="xs">
              {metricas.actividadPorDia.map((dia, idx) => (
                <Paper key={idx} p="sm" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>
                      {new Date(dia.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <Group gap="md">
                      <Badge variant="light" color="blue">
                        {dia.transacciones} actividades
                      </Badge>
                      {dia.puntosGanados > 0 && (
                        <Badge variant="light" color="green">
                          +{dia.puntosGanados} pts
                        </Badge>
                      )}
                      {dia.puntosGastados > 0 && (
                        <Badge variant="light" color="red">
                          -{dia.puntosGastados} pts
                        </Badge>
                      )}
                    </Group>
                  </Group>
                  <Progress
                    value={Math.min((dia.puntosGanados / 100) * 100, 100)}
                    color="blue"
                    size="sm"
                  />
                </Paper>
              ))}
            </Stack>
          </Card>
        )}

        {/* Transacciones Recientes */}
        <TransaccionesTable transacciones={transacciones} />
      </Stack>
    </Container>
  );
};