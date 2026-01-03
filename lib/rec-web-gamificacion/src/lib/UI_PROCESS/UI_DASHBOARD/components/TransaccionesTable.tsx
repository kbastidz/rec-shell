import { useState, useMemo } from 'react';
import {
  Table,
  TextInput,
  Select,
  Pagination,
  Group,
  Text,
  Card,
  ScrollArea,
  Badge,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import { Search, Filter, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface TransaccionPunto {
  id: number;
  usuarioId?: number;
  usuario_id?: number;
  cantidad: number;
  balanceDespues: number;
  tipoTransaccion?: 'GANAR' | 'GASTAR';
  tipo_transaccion?: 'GANAR' | 'GASTAR';
  tipoOrigen?: string;
  tipo_origen?: string;
  idOrigen?: number;
  id_origen?: number;
  idTipoPunto?: number;
  id_tipo_punto?: number;
  descripcion: string;
  metadatos: Record<string, any>;
  creadoEn?: string;
  creado_en?: string;
  expiraEn?: string | null;
  expira_en?: string | null;
}

interface Props {
  transacciones: TransaccionPunto[];
}

const ITEMS_PER_PAGE = 10;

// Helper para normalizar datos (soporta camelCase y snake_case)
const normalizarTransaccion = (t: TransaccionPunto) => ({
  id: t.id,
  cantidad: t.cantidad,
  balanceDespues: t.balanceDespues,
  tipoTransaccion: t.tipoTransaccion || t.tipo_transaccion || 'GANAR',
  tipoOrigen: t.tipoOrigen || t.tipo_origen || '',
  descripcion: t.descripcion,
  metadatos: t.metadatos,
  creadoEn: t.creadoEn || t.creado_en || '',
});

export const TransaccionesTable = ({ transacciones }: Props) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [origenFilter, setOrigenFilter] = useState<string>('todos');

  // Normalizar todas las transacciones
  const transaccionesNormalizadas = useMemo(
    () => transacciones.map(normalizarTransaccion),
    [transacciones]
  );

  // Filtrar transacciones
  const transaccionesFiltradas = transaccionesNormalizadas.filter((tx) => {
    const matchSearch = tx.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFilter === 'todos' || tx.tipoTransaccion === tipoFilter;
    const matchOrigen = origenFilter === 'todos' || tx.tipoOrigen === origenFilter;
    return matchSearch && matchTipo && matchOrigen;
  });

  // Paginación
  const totalPages = Math.ceil(transaccionesFiltradas.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const transaccionesPaginadas = transaccionesFiltradas.slice(startIndex, endIndex);

  // Obtener tipos de origen únicos
  const origenesUnicos = useMemo(() => {
    return [
      'todos',
      ...Array.from(
        new Set(
          transaccionesNormalizadas
            .map((t) => t.tipoOrigen)
            .filter((origen) => origen && origen.trim() !== '')
        )
      ),
    ];
  }, [transaccionesNormalizadas]);

  const tipoTransaccionColor: Record<string, string> = {
    GANAR: 'green',
    GASTAR: 'red',
  };

  const origenColors: Record<string, string> = {
    TRIVIA: 'blue',
    RULETA: 'grape',
    BINGO: 'orange',
    MATERIA_COMPLETA: 'green',
    DESAFIO: 'cyan',
    RECOMPENSA: 'pink',
  };

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleTipoFilterChange = (value: string | null) => {
    setTipoFilter(value || 'todos');
    setPage(1);
  };

  const handleOrigenFilterChange = (value: string | null) => {
    setOrigenFilter(value || 'todos');
    setPage(1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={3}>Historial de Transacciones</Title>
            <Text size="sm" c="dimmed">
              {transaccionesFiltradas.length} de {transacciones.length} transacciones
            </Text>
          </div>
        </Group>

        {/* Filtros */}
        <Group grow>
          <TextInput
            placeholder="Buscar en descripción..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Select
            placeholder="Tipo de transacción"
            leftSection={<Filter size={16} />}
            data={[
              { value: 'todos', label: 'Todas' },
              { value: 'GANAR', label: 'Ganancias' },
              { value: 'GASTAR', label: 'Gastos' },
            ]}
            value={tipoFilter}
            onChange={handleTipoFilterChange}
            clearable
          />

          <Select
            placeholder="Origen"
            leftSection={<Filter size={16} />}
            data={origenesUnicos.map((origen) => ({
              value: origen,
              label: origen === 'todos' ? 'Todos los orígenes' : origen,
            }))}
            value={origenFilter}
            onChange={handleOrigenFilterChange}
            clearable
          />
        </Group>

        {/* Tabla */}
        <ScrollArea>
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Group gap="xs">
                    <Calendar size={14} />
                    <Text size="xs" fw={700}>
                      Fecha
                    </Text>
                  </Group>
                </Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Origen</Table.Th>
                <Table.Th>Descripción</Table.Th>
                <Table.Th ta="right">Cantidad</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {transaccionesPaginadas.length > 0 ? (
                transaccionesPaginadas.map((tx) => {
                  const fecha = new Date(tx.creadoEn);
                  const fechaValida = !isNaN(fecha.getTime());

                  return (
                    <Table.Tr key={tx.id}>
                      <Table.Td>
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {fechaValida
                              ? fecha.toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })
                              : 'Fecha inválida'}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {fechaValida
                              ? fecha.toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '--:--'}
                          </Text>
                        </Stack>
                      </Table.Td>

                      <Table.Td>
                        <Badge
                          color={tipoTransaccionColor[tx.tipoTransaccion]}
                          variant="light"
                          size="sm"
                          leftSection={
                            tx.tipoTransaccion === 'GANAR' ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )
                          }
                        >
                          {tx.tipoTransaccion}
                        </Badge>
                      </Table.Td>

                      <Table.Td>
                        <Badge
                          color={origenColors[tx.tipoOrigen] || 'gray'}
                          variant="outline"
                          size="sm"
                        >
                          {tx.tipoOrigen || 'N/A'}
                        </Badge>
                      </Table.Td>

                      <Table.Td>
                        <Tooltip label={tx.descripcion} multiline w={300}>
                          <Text size="sm" lineClamp={2} maw={300}>
                            {tx.descripcion}
                          </Text>
                        </Tooltip>
                      </Table.Td>

                      <Table.Td ta="right">
                        <Text
                          fw={700}
                          c={tx.tipoTransaccion === 'GANAR' ? 'green' : 'red'}
                          size="sm"
                        >
                          {tx.tipoTransaccion === 'GANAR' ? '+' : '-'}
                          {Math.abs(tx.cantidad).toLocaleString()}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="xl">
                      No se encontraron transacciones con los filtros aplicados
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {/* Paginación */}
        {totalPages > 1 && (
          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Página {page} de {totalPages}
            </Text>
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              size="sm"
            />
          </Group>
        )}
      </Stack>
    </Card>
  );
};