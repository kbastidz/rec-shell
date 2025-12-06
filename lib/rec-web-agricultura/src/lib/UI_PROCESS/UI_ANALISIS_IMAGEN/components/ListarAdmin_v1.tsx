import { useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Center,
  Paper,
  ActionIcon,
  Table,
  Avatar,
  Button,
  Tooltip,
} from '@mantine/core';
import {
  IconRefresh,
  IconPlant,
  IconFileText,
} from '@tabler/icons-react';
import { useGuardarAnalisis } from '../../UI_CARGA_IMAGEN/hook/useAgricultura';
import { usePlanesTratamiento } from '../hooks/useAgricultura';
import { PaginationControls, usePagination } from '@rec-shell/rec-web-shared';

export function ListarAdminV1() {
  const { 
    loading, 
    listaAnalisis, 
    obtenerTodosAnalisis
  } = useGuardarAnalisis();

  const {
    loading: loadingPlan,
    generarPlan
  } = usePlanesTratamiento();

  
 // Ref Paginacion Global
    const lista = Array.isArray(listaAnalisis) ? listaAnalisis : [];
    const {
      currentPage,
      totalPages,
      paginatedData,
      setPage,
      setItemsPerPage,
      itemsPerPage,
      startIndex,
      endIndex,
      totalItems,
      searchTerm,
      setSearchTerm
    } = usePagination({
      data: lista,
      itemsPerPage: 5,
      searchFields: ['nombreImagen'] 
    });

  useEffect(() => {
    obtenerTodosAnalisis();
  }, []);

  const handleRefresh = () => {
    obtenerTodosAnalisis();
  };

  const handleGenerarPlan = async (analisis: any) => {
    if (!analisis.cultivoId || !analisis.id) {
      console.error('Datos incompletos para generar plan');
      return;
    }

    await generarPlan(analisis.cultivoId, analisis.id);
  };

  const getEstadoColor = (estado: string) => {
    const est = estado?.toUpperCase() || '';
    switch (est) {
      case 'COMPLETADO':
        return 'green';
      case 'PROCESANDO':
        return 'blue';
      case 'FALLIDO':
        return 'red';
      case 'PENDIENTE':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && (!listaAnalisis || listaAnalisis.length === 0)) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text c="dimmed">Cargando análisis...</Text>
        </Stack>
      </Center>
    );
  }

 

  const rows = paginatedData?.map((analisis: any) => {
    const baseUrl = '';
    const imagenUrl = analisis.rutaImagenProcesada 
      ? `${baseUrl}${analisis.rutaImagenProcesada}`
      : `${baseUrl}${analisis.rutaImagenOriginal}`;

    const diagnosticoPrincipal = analisis.resultadosDiagnostico?.find(
      (r: any) => r.diagnosticoPrincipal
    );

    return (
      <Table.Tr key={analisis.id}>
        <Table.Td>
          <Group gap="sm">
            <Avatar src={imagenUrl} size="md" radius="sm" />
            <div>
              <Text size="sm" fw={500}>
                {analisis.nombreImagen}
              </Text>
              {diagnosticoPrincipal?.deficienciaNutriente && (
                <Text size="xs" c="dimmed">
                  {diagnosticoPrincipal.deficienciaNutriente.nombre}
                </Text>
              )}
            </div>
          </Group>
        </Table.Td>
        
        <Table.Td>
          <Text size="sm">{analisis.nombreCultivo || 'N/A'}</Text>
        </Table.Td>
        
        <Table.Td>
          <Badge
            color={getEstadoColor(analisis.estadoProcesamiento)}
            variant="dot"
          >
            {analisis.estadoProcesamiento}
          </Badge>
        </Table.Td>
        
        <Table.Td>
          <Text size="sm">{analisis.condicionesClima || 'N/A'}</Text>
        </Table.Td>
        
        <Table.Td>
          <Text size="sm">{analisis.notasUsuario || 'N/A'}</Text>
        </Table.Td>
        
        <Table.Td>
          <Text size="sm">{formatearFecha(analisis.fechaAnalisis)}</Text>
        </Table.Td>
        
        <Table.Td>
          {analisis.tiempoProcesamintoSegundos ? (
            <Text size="sm">{analisis.tiempoProcesamintoSegundos}s</Text>
          ) : (
            <Text size="sm" c="dimmed">-</Text>
          )}
        </Table.Td>

        <Table.Td>
          <Tooltip label="Generar plan de tratamiento">
            <Button
              size="xs"
              variant="light"
              color="blue"
              leftSection={<IconFileText size={16} />}
              onClick={() => handleGenerarPlan(analisis)}
              loading={loadingPlan}
              disabled={analisis.estadoProcesamiento !== 'COMPLETADO'}
            >
              Generar Plan
            </Button>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Generación de plan de tratamiento</Title>
            <Text c="dimmed" size="sm">
              Visualiza todos los análisis realizados
            </Text>
          </div>
          <ActionIcon
            size="lg"
            variant="light"
            onClick={handleRefresh}
            loading={loading}
          >
            <IconRefresh size={20} />
          </ActionIcon>
        </Group>

        {/* Contador de resultados */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {listaAnalisis?.length || 0} {listaAnalisis?.length === 1 ? 'análisis' : 'análisis'}
          </Text>
        </Group>

        {/* Tabla de análisis */}
        {!listaAnalisis || listaAnalisis.length === 0 ? (
          <Paper shadow="xs" p="xl" radius="md">
            <Center>
              <Stack align="center" gap="md">
                <IconPlant size={48} stroke={1.5} style={{ color: 'gray' }} />
                <Text c="dimmed">{searchTerm
                ? 'No se encontraron resultados para tu búsqueda'
                : 'No se encontraron registros'}</Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <Paper shadow="xs" radius="md" withBorder>
            
              <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Imagen / Diagnóstico</Table.Th>
                    <Table.Th>Cultivo</Table.Th>
                    <Table.Th>Estado</Table.Th>
                    <Table.Th>Condiciones clima</Table.Th>
                    <Table.Th>Notas</Table.Th>
                    <Table.Th>Fecha</Table.Th>
                    <Table.Th>Procesamiento</Table.Th>
                    <Table.Th>Acciones</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            
            {/* Ref paginacion Global - Controles de paginación */}
                  {lista.length > 0 && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={(value) => value && setItemsPerPage(Number(value))}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      totalItems={totalItems}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      searchPlaceholder="Buscar por código, nombre o nutriente..."
                    />
                  )}
                  
          </Paper>
        )}
      </Stack>
    </Container>
  );
}