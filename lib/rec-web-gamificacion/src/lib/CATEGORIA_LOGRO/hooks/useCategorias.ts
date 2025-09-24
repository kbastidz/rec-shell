// hooks/useCategorias.ts
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { CategoriaLogro } from '../../types/model';
import { CategoriaInput, service } from '../services/gamificacion.service';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaLogro[]>([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState<CategoriaLogro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las categorías
  const cargarTodasLasCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerTodasLasCategorias();
      setTodasLasCategorias(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      notifications.show({
        title: '¡Ups! 😅',
        message: 'No pudimos cargar todas las categorías. ¿Intentamos de nuevo?',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías activas
  const cargarCategoriasActivas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.obtenerCategoriasActivas();
      setCategorias(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      notifications.show({
        title: '¡Ups! 😅',
        message: 'No pudimos cargar las categorías activas. ¿Intentamos de nuevo?',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener categoría por ID
  const obtenerCategoriaPorId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const categoria = await service.obtenerCategoriaPorId(id);
      return categoria;
    } catch (err: any) {
      setError(err.message);
      notifications.show({
        title: '¡Ups! 😔',
        message: 'No pudimos encontrar la categoría solicitada.',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar categorías por nombre
  const buscarCategoriasPorNombre = async (nombre: string) => {
    if (!nombre.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const resultados = await service.buscarCategoriasPorNombre(nombre);
      return resultados;
    } catch (err: any) {
      setError(err.message);
      notifications.show({
        title: '¡Ups! 🔍',
        message: 'No pudimos realizar la búsqueda. Inténtalo de nuevo.',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva categoría
  const crearCategoria = async (nuevaCategoria: CategoriaInput) => {
    setLoading(true);
    try {
      const categoriaCreada = await service.crearCategoria(nuevaCategoria);
      
      // Actualizar ambos estados si es necesario
      setCategorias(prev => [...prev, categoriaCreada]);
      setTodasLasCategorias(prev => [...prev, categoriaCreada]);
      
      notifications.show({
        title: '¡Genial! 🎉',
        message: 'Nueva categoría creada exitosamente',
        color: 'green',
      });
      return categoriaCreada;
    } catch (err: any) {
      notifications.show({
        title: '¡Oops! 😔',
        message: 'No pudimos crear la categoría. Inténtalo de nuevo.',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar categoría existente
  const actualizarCategoria = async (id: string, categoriaActualizada: CategoriaInput) => {
    setLoading(true);
    try {
      const categoriaEditada = await service.actualizarCategoria(id, categoriaActualizada);
      
      // Actualizar en ambos estados
      setCategorias(prev => 
        prev.map(cat => cat.id === id ? categoriaEditada : cat)
      );
      setTodasLasCategorias(prev => 
        prev.map(cat => cat.id === id ? categoriaEditada : cat)
      );
      
      notifications.show({
        title: '¡Súper! ✨',
        message: 'Categoría actualizada correctamente',
        color: 'blue',
      });
      return categoriaEditada;
    } catch (err: any) {
      notifications.show({
        title: '¡Ups! 😅',
        message: 'No pudimos actualizar la categoría. ¿Intentamos otra vez?',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar categoría
  const eliminarCategoria = async (id: string) => {
    setLoading(true);
    try {
      await service.eliminarCategoria(id);
      
      // Eliminar de ambos estados
      setCategorias(prev => prev.filter(cat => cat.id !== id));
      setTodasLasCategorias(prev => prev.filter(cat => cat.id !== id));
      
      notifications.show({
        title: '¡Listo! 👋',
        message: 'Categoría eliminada correctamente',
        color: 'orange',
      });
    } catch (err: any) {
      notifications.show({
        title: '¡Ups! 😔',
        message: 'No pudimos eliminar la categoría. Inténtalo de nuevo.',
        color: 'red',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar categorías activas
  const refrescarCategoriasActivas = () => {
    return cargarCategoriasActivas();
  };

  // Refrescar todas las categorías
  const refrescarTodasLasCategorias = () => {
    return cargarTodasLasCategorias();
  };

  // Cargar categorías activas al montar el componente por defecto
  useEffect(() => {
    cargarCategoriasActivas();
  }, []);

  return {
    // Estados
    categorias, // Solo categorías activas
    todasLasCategorias, // Todas las categorías (activas e inactivas)
    loading,
    error,

    // Métodos de carga
    cargarCategoriasActivas,
    cargarTodasLasCategorias,
    obtenerCategoriaPorId,
    buscarCategoriasPorNombre,

    // Métodos de modificación
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,

    // Métodos de utilidad
    refrescarCategoriasActivas,
    refrescarTodasLasCategorias,
  };
};