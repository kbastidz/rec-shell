import { Table } from '@mantine/core';

export function AnalisisAdminTableHeader() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Archivo</Table.Th>
        <Table.Th>Estado</Table.Th>
        <Table.Th>Detecciones</Table.Th>
        <Table.Th>Confianza Promedio</Table.Th>
        <Table.Th>Deficiencias Detectadas</Table.Th>
        <Table.Th>Fecha</Table.Th>
        <Table.Th>Acciones</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}