import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Paper,
  Title,
  Table,
  Badge,
  Select,
  Group,
  Text,
  Loader,
  Alert,
  Stack,
  TextInput,
  ActionIcon,
  Tooltip,
  Modal,
  NumberInput,
  Button,
} from '@mantine/core';
import { IconAlertCircle, IconMinus } from '@tabler/icons-react';
import { useTransaccionPuntos } from '../hook/useGamificacion';
import { TransaccionPuntos } from '../../../types/model';
import { useNotifications } from '@rec-shell/rec-web-shared';

export const TransaccionPuntosAdmin = () => {
  const { transacciones, loading, error, users, getTransaccionesActivas, updateTransaccion } = useTransaccionPuntos();
  const [selectedUsuario, setSelectedUsuario] = useState<string>('all');
  const [selectedTipoPunto, setSelectedTipoPunto] = useState<string>('all');
  const [filteredTransacciones, setFilteredTransacciones] = useState<TransaccionPuntos[]>([]);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const notifications = useNotifications();
  
  // Estado para el modal de resta
  const [modalOpened, setModalOpened] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState<TransaccionPuntos | null>(null);
  const [cantidadARestar, setCantidadARestar] = useState<number>(0);

  // Convertir usuarios a formato Select
  const usuariosOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'Todos los usuarios' }];
    
    const userOptions = users.map(user => ({
      value: String(user.id),
      label: `${user.firstName} ${user.lastName}`.trim() || user.username || user.email,
    }));
    
    return [...options, ...userOptions];
  }, [users]);

  // Obtener tipos de punto únicos
  const tiposPuntoOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'Todos los tipos' }];
    
    const tipos = Array.from(new Set(transacciones.map(t => t.tipoPuntoNombre)))
      .filter(Boolean)
      .sort()
      .map(tipo => ({
        value: tipo,
        label: tipo,
      }));
    
    return [...options, ...tipos];
  }, [transacciones]);

  useEffect(() => {
    getTransaccionesActivas();
  }, []);

  useEffect(() => {
    let filtered = transacciones;

    // Filtrar por usuario
    if (selectedUsuario !== 'all') {
      filtered = filtered.filter(t => t.usuarioId === Number(selectedUsuario));
    }

    // Filtrar por tipo de punto
    if (selectedTipoPunto !== 'all') {
      filtered = filtered.filter(t => t.tipoPuntoNombre === selectedTipoPunto);
    }

    // Filtrar por fecha desde
    if (fechaDesde) {
      const fechaDesdeDate = new Date(fechaDesde + 'T00:00:00');
      filtered = filtered.filter(t => {
        const transaccionDate = new Date(t.creadoEn);
        return transaccionDate >= fechaDesdeDate;
      });
    }

    // Filtrar por fecha hasta
    if (fechaHasta) {
      const fechaHastaDate = new Date(fechaHasta + 'T23:59:59.999');
      filtered = filtered.filter(t => {
        const transaccionDate = new Date(t.creadoEn);
        return transaccionDate <= fechaHastaDate;
      });
    }

    setFilteredTransacciones(filtered);
  }, [selectedUsuario, selectedTipoPunto, transacciones, fechaDesde, fechaHasta]);

  const getBadgeColor = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'ganancia':
      case 'ingreso':
        return 'green';
      case 'gasto':
      case 'egreso':
        return 'red';
      case 'ajuste':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpenModalRestar = (transaccion: TransaccionPuntos) => {
    setTransaccionSeleccionada(transaccion);
    setCantidadARestar(Math.abs(transaccion.cantidad));
    setModalOpened(true);
  };

  const handleRestarTransaccion = async () => {
    if (!transaccionSeleccionada || cantidadARestar <= 0) {
      return;
    }
    transaccionSeleccionada.cantidad = transaccionSeleccionada.cantidad - cantidadARestar;
    transaccionSeleccionada.balanceDespues = transaccionSeleccionada.balanceDespues - cantidadARestar;
    
    console.log('Restando transacción:', {
      transaccionId: transaccionSeleccionada.id,
      cantidadOriginal: transaccionSeleccionada.cantidad - cantidadARestar,
      //cantidadARestar: cantidadARestar,
      balanceAntes: transaccionSeleccionada.balanceDespues,
      balanceNuevo: transaccionSeleccionada.balanceDespues - cantidadARestar,
    });
    
    await updateTransaccion(transaccionSeleccionada.id, transaccionSeleccionada);
    notifications.success(); 
    
    setModalOpened(false);
    setTransaccionSeleccionada(null);
    setCantidadARestar(0);
  };

  const handleCancelarRestar = () => {
    setModalOpened(false);
    setTransaccionSeleccionada(null);
    setCantidadARestar(0);
  };

  const limpiarFiltros = () => {
    setSelectedUsuario('all');
    setSelectedTipoPunto('all');
    setFechaDesde('');
    setFechaHasta('');
  };

  if (loading && transacciones.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Group justify="center" mt="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title order={2}>Conciliación actividades por usuario</Title>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        <Paper shadow="xs" p="md" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={500}>Filtros</Text>
            <Button 
              variant="light" 
              size="xs" 
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </Button>
          </Group>
          
          <Group gap="sm" mb="md">
            <TextInput
              type="date"
              placeholder="Fecha desde"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.currentTarget.value)}
              style={{ width: 160 }}
              label="Desde"
              size="sm"
            />
            <TextInput
              type="date"
              placeholder="Fecha hasta"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.currentTarget.value)}
              style={{ width: 160 }}
              label="Hasta"
              size="sm"
            />
            <Select
              placeholder="Seleccionar usuario"
              data={usuariosOptions}
              value={selectedUsuario}
              onChange={(value) => setSelectedUsuario(value || 'all')}
              style={{ width: 200 }}
              label="Usuario"
              size="sm"
              searchable
              disabled={loading || users.length === 0}
            />
            <Select
              placeholder="Seleccionar tipo"
              data={tiposPuntoOptions}
              value={selectedTipoPunto}
              onChange={(value) => setSelectedTipoPunto(value || 'all')}
              style={{ width: 180 }}
              label="Tipo Punto"
              size="sm"
              searchable
              disabled={loading}
            />
          </Group>

          <Text size="sm" c="dimmed">
            Total de transacciones: {filteredTransacciones.length}
          </Text>
        </Paper>

        <Paper shadow="xs" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tipo Punto</Table.Th>
                <Table.Th>Tipo Transacción</Table.Th>
                <Table.Th>Cantidad</Table.Th>
                <Table.Th>Balance</Table.Th>
                <Table.Th>Descripción</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th style={{ width: 80 }}>Acción</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredTransacciones.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      No hay transacciones para mostrar
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredTransacciones.map((transaccion) => (
                  <Table.Tr key={transaccion.id}>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {transaccion.tipoPuntoNombre}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={getBadgeColor(transaccion.tipoTransaccion)} 
                        size="sm"
                      >
                        {transaccion.tipoTransaccion}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text 
                        size="sm" 
                        fw={500}
                        c={transaccion.cantidad >= 0 ? 'green' : 'red'}
                      >
                        {transaccion.cantidad >= 0 ? '+' : ''}{transaccion.cantidad}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{transaccion.balanceDespues}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {transaccion.descripcion || '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {formatDate(transaccion.creadoEn)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Restar cantidad y balance">
                        <ActionIcon
                          color="red"
                          variant="light"
                          size="sm"
                          onClick={() => handleOpenModalRestar(transaccion)}
                        >
                          <IconMinus size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      {/* Modal para restar transacción */}
      <Modal
        opened={modalOpened}
        onClose={handleCancelarRestar}
        title="Restar Transacción"
        centered
      >
        {transaccionSeleccionada && (
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              Esta acción restará puntos del balance del usuario
            </Alert>

            <Paper p="sm" withBorder>
              <Stack gap="xs">
                <Group justify="apart">
                  <Text size="sm" c="dimmed">Tipo de Punto:</Text>
                  <Badge variant="light" size="sm">
                    {transaccionSeleccionada.tipoPuntoNombre}
                  </Badge>
                </Group>
                <Group justify="apart">
                  <Text size="sm" c="dimmed">Cantidad Original:</Text>
                  <Text size="sm" fw={500}>
                    {transaccionSeleccionada.cantidad >= 0 ? '+' : ''}
                    {transaccionSeleccionada.cantidad}
                  </Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm" c="dimmed">Balance Actual:</Text>
                  <Text size="sm" fw={500}>
                    {transaccionSeleccionada.balanceDespues}
                  </Text>
                </Group>
              </Stack>
            </Paper>

            <NumberInput
              label="Cantidad a restar"
              description="Ingrese el valor que desea restar del balance"
              placeholder="0"
              value={cantidadARestar}
              onChange={(value) => setCantidadARestar(Number(value) || 0)}
              min={0}
              max={transaccionSeleccionada.balanceDespues}
              step={1}
              required
            />

            {cantidadARestar > 0 && (
              <Paper p="sm" withBorder bg="red.0">
                <Group justify="apart">
                  <Text size="sm" fw={500}>Balance después de restar:</Text>
                  <Text size="lg" fw={700} c="red">
                    {transaccionSeleccionada.balanceDespues - cantidadARestar}
                  </Text>
                </Group>
              </Paper>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleCancelarRestar}>
                Cancelar
              </Button>
              <Button 
                color="red" 
                onClick={handleRestarTransaccion}
                disabled={cantidadARestar <= 0 || cantidadARestar > transaccionSeleccionada.balanceDespues}
              >
                Restar Puntos
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};