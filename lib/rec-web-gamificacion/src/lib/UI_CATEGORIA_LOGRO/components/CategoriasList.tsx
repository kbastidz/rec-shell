// components/categorias/CategoriasList.tsx
import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Grid,
  TextInput,
  Group,
  Text,
  LoadingOverlay,
  Paper,
  Badge,
  ActionIcon,
  Tooltip,
  Alert,
  Stack,
  Center,
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconRefresh, 
  IconSchool,
  IconSparkles,
  IconHeart
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useDebouncedValue } from '@mantine/hooks';
import { CategoriaLogro } from '../../types/model';
import { useCategorias } from '../hooks/useCategorias';
import { CategoriaInput } from '../services/gamificacion.service';
import { CategoriaCard } from './CategoriaCard';
import { CategoriaForm } from './CategoriaForm';



export const CategoriasList: React.FC = () => {
  const {
    categorias,
    loading,
    error,
    refrescarCategoriasActivas,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    buscarCategoriasPorNombre,
  } = useCategorias();

  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaLogro | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [debouncedBusqueda] = useDebouncedValue(busqueda, 300);
  const [procesando, setProcesando] = useState<boolean>(false);
  const [categoriasBuscadas, setCategoriasBuscadas] = useState<CategoriaLogro[]>([]);
  const [buscandoEnServidor, setBuscandoEnServidor] = useState<boolean>(false);

  // Función para manejar búsqueda
  const manejarBusqueda = async (termino: string): Promise<void> => {
    if (!termino.trim()) {
      setCategoriasBuscadas([]);
      return;
    }

    setBuscandoEnServidor(true);
    try {
      const resultados = await buscarCategoriasPorNombre(termino);
      setCategoriasBuscadas(resultados);
    } catch (error) {
      // El error ya se maneja en el hook
      setCategoriasBuscadas([]);
    } finally {
      setBuscandoEnServidor(false);
    }
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    manejarBusqueda(debouncedBusqueda);
  }, [debouncedBusqueda]);

  // Determinar qué categorías mostrar
  const categoriasAMostrar = busqueda.trim() 
    ? categoriasBuscadas 
    : categorias;

  // Abrir modal para crear nueva categoría
  const abrirModalCrear = (): void => {
    setCategoriaEditando(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar categoría
  const abrirModalEditar = (categoria: CategoriaLogro): void => {
    setCategoriaEditando(categoria);
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = (): void => {
    setModalAbierto(false);
    setCategoriaEditando(null);
  };

  // Manejar envío del formulario
  const manejarEnvio = async (datosCategoria: CategoriaInput, idCategoria?: string): Promise<void> => {
    setProcesando(true);
    try {
      if (idCategoria) {
        // Actualizar categoría existente
        await actualizarCategoria(idCategoria, datosCategoria);
      } else {
        // Crear nueva categoría
        await crearCategoria(datosCategoria);
      }
      cerrarModal();
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setProcesando(false);
    }
  };

  // Confirmar eliminación
  const confirmarEliminacion = (id: string, nombre: string): void => {
    modals.openConfirmModal({
      title: '🤔 ¿Estás seguro?',
      children: (
        <div>
          <Text size="sm" mb="md">
            ¿Realmente quieres eliminar la categoría <strong>{nombre}</strong>?
          </Text>
          <Alert color="yellow" variant="light" icon={<IconHeart size="1rem" />}>
            <Text size="xs">
              ¡Esta acción no se puede deshacer! Los niños ya no podrán ver esta categoría.
            </Text>
          </Alert>
        </div>
      ),
      labels: { confirm: '🗑️ Sí, eliminar', cancel: '❌ Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => eliminarCategoria(id),
      radius: 'md',
      centered: true,
    });
  };

  // Función para refrescar
  const manejarRefresh = (): void => {
    if (busqueda.trim()) {
      // Si hay búsqueda activa, buscar de nuevo
      manejarBusqueda(busqueda);
    } else {
      // Si no hay búsqueda, refrescar categorías activas
      refrescarCategoriasActivas();
    }
  };

  return (
    <Container size="xl" py="xl">
      <LoadingOverlay visible={loading && categorias.length === 0} />

      {/* Barra de herramientas */}
      <Group justify="space-between" mb="xl">
        <TextInput
          placeholder="🔍 Buscar categorías..."
          value={busqueda}
          onChange={(event) => setBusqueda(event.currentTarget.value)}
          leftSection={<IconSearch size="1rem" />}
          size="md"
          radius="md"
          style={{ flex: 1, maxWidth: 400 }}
          rightSection={buscandoEnServidor ? <LoadingOverlay loaderProps={{ size: 'xs' }} /> : null}
        />
        
        <Group gap="md">
          <Tooltip label={busqueda.trim() ? "Buscar de nuevo" : "Actualizar lista"} withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              radius="md"
              onClick={manejarRefresh}
              loading={loading || buscandoEnServidor}
            >
              <IconRefresh size="1.1rem" />
            </ActionIcon>
          </Tooltip>
          
          <Button
            leftSection={<IconPlus size="1.1rem" />}
            onClick={abrirModalCrear}
            radius="md"
            size="md"
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            variant="gradient"
          >
            🌟 Nueva Categoría
          </Button>
        </Group>
      </Group>

      {/* Mensaje de error */}
      {error && (
        <Alert color="red" variant="light" mb="xl" radius="md">
          <Text>😔 {error}</Text>
        </Alert>
      )}

      {/* Indicador de búsqueda */}
      {busqueda.trim() && (
        <Alert color="blue" variant="light" mb="md" radius="md">
          <Text size="sm">
            🔍 Mostrando resultados para: <strong>"{busqueda}"</strong>
            {buscandoEnServidor && " - Buscando..."}
          </Text>
        </Alert>
      )}

      {/* Lista de categorías */}
      {categoriasAMostrar.length === 0 ? (
        <Paper p="xl" radius="lg" style={{ textAlign: 'center' }}>
          <Center>
            <Stack align="center" gap="md">
              <Text size="xl" fw={500} c="dimmed">
                {(() => {
                  if (busqueda.trim()) {
                    return buscandoEnServidor
                      ? "🔄 Buscando categorías..."
                      : `😅 No encontramos categorías con "${busqueda}"`;
                  }
                  return loading 
                    ? "🔄 Cargando categorías..." 
                    : "🎯 ¡Aún no hay categorías! ¿Creamos la primera?";
                })()}
              </Text>
              {!busqueda.trim() && !loading && (
                <Button
                  leftSection={<IconPlus size="1rem" />}
                  onClick={abrirModalCrear}
                  variant="light"
                  color="blue"
                  radius="md"
                >
                  🚀 Crear primera categoría
                </Button>
              )}
            </Stack>
          </Center>
        </Paper>
      ) : (
        <Grid>
          {categoriasAMostrar.map((categoria) => (
            <Grid.Col key={categoria.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <CategoriaCard
                categoria={categoria}
                onEdit={abrirModalEditar}
                onDelete={confirmarEliminacion}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}

      {/* Modal del formulario */}
      <CategoriaForm
        opened={modalAbierto}
        onClose={cerrarModal}
        onSubmit={manejarEnvio}
        categoria={categoriaEditando}
        loading={procesando}
      />
    </Container>
  );
};