// components/StatsGrid.tsx
import React from 'react';
import { Group, Paper, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import { IconUsers, IconStar, IconTrendingUp, IconAlertTriangle } from '@tabler/icons-react';

interface StatsGridProps {
  data: {
    totalEstudiantes: number;
    promedioGeneral: number;
    estudiantesExcelentes: number;
    estudiantesNecesitanApoyo: number;
  };
}

export function StatsGrid({ data }: StatsGridProps) {
  const stats = [
    {
      title: 'Total Estudiantes',
      value: data.totalEstudiantes,
      icon: IconUsers,
      color: 'blue',
    },
    {
      title: 'Promedio General',
      value: data.promedioGeneral.toFixed(1),
      icon: IconTrendingUp,
      color: 'green',
    },
    {
      title: 'Estudiantes Excelentes',
      value: data.estudiantesExcelentes,
      icon: IconStar,
      color: 'yellow',
    },
    {
      title: 'Necesitan Apoyo',
      value: data.estudiantesNecesitanApoyo,
      icon: IconAlertTriangle,
      color: 'red',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 2, md: 4 }}>
      {stats.map((stat) => (
        <Paper withBorder p="md" radius="md" key={stat.title}>
          <Group justify="space-between">
            <div>
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                {stat.title}
              </Text>
              <Text fw={700} fz="xl">
                {stat.value}
              </Text>
            </div>
            <ThemeIcon color={stat.color} variant="light" size={38} radius="md">
              <stat.icon size="1.8rem" />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}