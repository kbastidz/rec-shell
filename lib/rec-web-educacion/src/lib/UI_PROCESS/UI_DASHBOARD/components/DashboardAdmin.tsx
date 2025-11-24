// components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, Loader, Center, Title, Text, Alert, Paper } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { StatsGrid } from './StatsGrid';
import { DistributionChart } from './DistributionChart';
import { StudentsTable } from './StudentsTable';
import { useDashboard } from '../hook/useDashboard';

export function DashboardAdmin() {
  const {
    loading,
    error,
    getDashboardGeneral,
    getDistribucionNiveles
  } = useDashboard();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [distribucion, setDistribucion] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const [generalData, distribucionData] = await Promise.all([
        getDashboardGeneral(),
        getDistribucionNiveles()
      ]);

      if (generalData) {
        setDashboardData(generalData);
      }

      if (distribucionData) {
        // Convertir Map a objeto para el componente
        /*const distribucionObj = Object.fromEntries(distribucionData);
        setDistribucion(distribucionObj);*/
        setDistribucion(distribucionData);
      }
    };

    loadData();
  }, [getDashboardGeneral, getDistribucionNiveles]);

  if (loading && !dashboardData) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!dashboardData || !distribucion) {
    return (
      <Center h={400}>
        <Text>No se pudieron cargar los datos</Text>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center">
        Dashboard del Docente
      </Title>
      
      <StatsGrid data={dashboardData} />
      
      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <StudentsTable
            title="Estudiantes en Riesgo"
            students={dashboardData.estudiantesRiesgo}
            type="risk"
            itemsPerPage={3}
          />
        </Grid.Col>        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <StudentsTable
            title="Top Estudiantes"
            students={dashboardData.topEstudiantes}
            type="top"
            itemsPerPage={3}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DistributionChart data={distribucion} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Text fz="lg" fw={700} mb="md">
              Resumen por Materias
            </Text>
            {dashboardData.estadisticasPorMateria.map((materia: any) => (
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