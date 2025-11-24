import React, { useState } from 'react';
import { Paper, Table, Text, Badge, Group, ThemeIcon, Pagination, ScrollArea } from '@mantine/core';
import { IconStar, IconAlertTriangle } from '@tabler/icons-react';
import { Estudiante } from './useDashboardData';


interface StudentsTableProps {
  title: string;
  students: Estudiante[];
  type: 'top' | 'risk';
  itemsPerPage?: number;
}

export function StudentsTable({ title, students, type, itemsPerPage = 3 }: StudentsTableProps) {
  const [activePage, setActivePage] = useState(1);
  
  // Calcular estudiantes a mostrar
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'EXCELENTE': return 'green';
      case 'BUENO': return 'blue';
      case 'REGULAR': return 'yellow';
      case 'NECESITA_APOYO': return 'red';
      default: return 'gray';
    }
  };

  const rows = paginatedStudents.map((student) => (
    <Table.Tr key={student.id}>
      <Table.Td>
        <Group gap="sm">
          {type === 'top' ? (
            <ThemeIcon size="sm" variant="light" color="yellow">
              <IconStar size="0.9rem" />
            </ThemeIcon>
          ) : (
            <ThemeIcon size="sm" variant="light" color="red">
              <IconAlertTriangle size="0.9rem" />
            </ThemeIcon>
          )}
          <div>
            <Text fz="sm" fw={500}>
              {student.nombreCompleto}
            </Text>
            <Text fz="xs" c="dimmed">
              {student.nombres}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{student.promedioGeneral.toFixed(1)}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{student.promedioEvaluaciones.toFixed(1)}%</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{student.totalEvaluacionesRealizadas}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{student.acompaniamientoIntegral.toFixed(1)}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{student.animacionLectura.toFixed(1)}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color={getEstadoColor(student.estadoGeneral)} variant="light">
          {student.estadoGeneral.replace('_', ' ')}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <Text fz="lg" fw={700}>
          {title}
        </Text>
        <Text fz="sm" c="dimmed">
          Total: {students.length} estudiantes
        </Text>
      </Group>
      
      <ScrollArea>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Estudiante</Table.Th>
                <Table.Th>Promedio</Table.Th>
                <Table.Th>Evaluaciones %</Table.Th>
                <Table.Th>Total Eval.</Table.Th>
                <Table.Th>Acompañamiento</Table.Th>
                <Table.Th>Lectura</Table.Th>
                <Table.Th>Estado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination 
            value={activePage} 
            onChange={setActivePage} 
            total={totalPages}
            size="sm"
          />
        </Group>
      )}
    </Paper>
  );
}