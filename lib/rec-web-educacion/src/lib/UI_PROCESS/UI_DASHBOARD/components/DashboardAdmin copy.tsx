// components/Dashboard.tsx
import React from 'react';
import { Container, Grid, Loader, Center, Title, Text, Paper } from '@mantine/core';

import { StatsGrid } from './StatsGrid';
import { DistributionChart } from './DistributionChart';
import { StudentsTable } from './StudentsTable';
import { useDashboardData } from './useDashboardData';

export function DashboardAdmin() {
  const { data, distribucion, loading } = useDashboardData();

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!data || !distribucion) {
    return (
      <Center h={400}>
        <Text>Error al cargar los datos</Text>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        Dashboard del Docente
      </Title>
      
      <StatsGrid data={data} />
      
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DistributionChart data={distribucion} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <StudentsTable
            title="Top Estudiantes"
            students={data.topEstudiantes}
            type="top"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <StudentsTable
            title="Estudiantes en Riesgo"
            students={data.estudiantesRiesgo}
            type="risk"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Text fz="lg" fw={700} mb="md">
              Resumen por Materias
            </Text>
            {data.estadisticasPorMateria.map((materia) => (
              <div key={materia.materiaId} style={{ marginBottom: '1rem' }}>
                <Text fw={500}>{materia.nombreMateria}</Text>
                <Text size="sm" c="dimmed">
                  Promedio: {materia.promedioGeneral} | Aprobados: {materia.aprobados}/{materia.totalEstudiantes}
                </Text>
              </div>
            ))}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}