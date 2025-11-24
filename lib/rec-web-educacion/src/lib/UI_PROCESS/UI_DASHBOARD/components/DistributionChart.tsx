// components/DistributionChart.tsx
import React from 'react';
import { Paper, Text, RingProgress, Group, Center } from '@mantine/core';
import { DistribucionEstados } from './useDashboardData';

interface DistributionChartProps {
  data: DistribucionEstados;
}

export function DistributionChart({ data }: DistributionChartProps) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  console.log(data);
  const segments = [
    { value: (data.EXCELENTE / total) * 100, color: 'green', tooltip: `Excelente: ${data.EXCELENTE}` },
    { value: (data.BUENO / total) * 100, color: 'blue', tooltip: `Bueno: ${data.BUENO}` },
    { value: (data.REGULAR / total) * 100, color: 'yellow', tooltip: `Regular: ${data.REGULAR}` },
    { value: (data.NECESITA_APOYO / total) * 100, color: 'red', tooltip: `Necesita Apoyo: ${data.NECESITA_APOYO}` },
  ];

  return (
    <Paper withBorder p="md" radius="md">
      <Text fz="lg" fw={700} mb="md">
        Distribución de Estudiantes
      </Text>
      <Center>
        <RingProgress
          size={200}
          thickness={20}
          sections={segments}
          label={
            <Text size="xs" ta="center">
              Total: {total}
            </Text>
          }
        />
      </Center>
      <Group justify="center" mt="md">
        {segments.map((segment, index) => (
          <Group key={index} gap="xs">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: segment.color,
              }}
            />
            <Text size="sm">{segment.tooltip}</Text>
          </Group>
        ))}
      </Group>
    </Paper>
  );
}