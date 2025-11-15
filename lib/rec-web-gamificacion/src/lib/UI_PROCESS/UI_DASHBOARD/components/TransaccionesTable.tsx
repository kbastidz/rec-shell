import { useState } from 'react';
import {
  Table,
  TextInput,
  Select,
  Pagination,
  Group,
  Text,
  Card,
  ScrollArea,
  Avatar,
  Badge,
} from '@mantine/core';
import { Search } from 'lucide-react';
import { TransaccionDetalleDTO } from '../dtos/dtos';
import { TransaccionesTableLogic } from '../hook/useTransaccionesTableLogic';

interface Props {
  transacciones: TransaccionDetalleDTO[];
}

export const TransaccionesTable = ({ transacciones }: Props) => {
  const logic = new TransaccionesTableLogic();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');

  // 1. Aplicar filtro
  const transaccionesFiltradas = logic.filtrarTransacciones(
    transacciones,
    searchTerm,
    tipoFilter
  );

  // 2. Paginación
  const totalPages = logic.getTotalPages(transaccionesFiltradas);
  const transaccionesPaginadas = logic.paginarTransacciones(
    transaccionesFiltradas,
    page
  );

  const tipoTransaccionColor: Record<string, string> = {
    GANAR: 'green',
    GASTAR: 'red',
    BONUS: 'blue',
  };

  return (
    <Card withBorder shadow="sm" radius="md" padding="lg">
      <Group justify="space-between" mb="md">
        <Text fw={700}>Transacciones Recientes</Text>
      </Group>

      {/* filtros */}
      <Group grow mb="md">
        <TextInput
          placeholder="Buscar usuario o descripción..."
          leftSection={<Search size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          label="Tipo"
          placeholder="Todos"
          data={[
            { value: 'todos', label: 'Todos' },
            { value: 'Puntos de Trivia', label: 'Puntos de Trivia' },
            { value: 'Puntos de Raspa Gana', label: 'Puntos de Raspa Gana' },
          ]}
          value={tipoFilter}
          onChange={(v) => setTipoFilter(v || 'todos')}
        />
      </Group>

      {/* tabla */}
      <ScrollArea h={300}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Tipo Punto</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Fecha</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {transaccionesPaginadas.length > 0 ? (
              transaccionesPaginadas.map((tx, index) => (
                <Table.Tr key={tx.transaccionId || `tx-${index}`}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl" size="sm">
                        {tx.nombreUsuario.charAt(0)}
                      </Avatar>
                      <Text size="sm" fw={500}>
                        {tx.nombreUsuario}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={tipoTransaccionColor[tx.tipoTransaccion]}
                      variant="light"
                      size="sm"
                    >
                      {tx.tipoTransaccion}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      fw={700}
                      c={tx.cantidad > 0 ? 'green' : 'red'}
                      size="sm"
                    >
                      {tx.cantidad > 0 ? '+' : ''}
                      {tx.cantidad}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline" size="sm">
                      {tx.tipoPunto}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" lineClamp={2} w={220}>
                      {tx.descripcion}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {new Date(tx.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed" py="xl">
                    No se encontraron transacciones
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* paginación */}
      <Pagination mt="md" total={totalPages} value={page} onChange={setPage} />
    </Card>
  );
};
