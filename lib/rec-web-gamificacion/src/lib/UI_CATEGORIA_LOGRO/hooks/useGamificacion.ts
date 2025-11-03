import { useState, useEffect } from 'react';
import { CategoriaLogro } from '../../types/model';
import {  service } from '../services/gamificacion.service';
import { GET_ERROR } from '../../utils/utilidad';
import { CategoriaInput } from '../../types/dto';
import { useNotifications } from '@rec-shell/rec-web-shared';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaLogro[]>([]);
  const [todasLasCategorias, setTodasLasCategorias] = useState<CategoriaLogro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();

  const cargarTodasLasCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET();
      setTodasLasCategorias(data);
      return data;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cargarCategoriasActivas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_ACTIVE();
      setCategorias(data);
      
      return data;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const obtenerCategoriaPorId = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const categoria = await service.GET_BY_ID(id);
      return categoria;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buscarCategoriasPorNombre = async (nombre: string) => {
    if (!nombre.trim()) {
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const resultados = await service.GET_BY_NAME(nombre);
      return resultados;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const CREAR = async (nuevaCategoria: CategoriaInput) => {
    setLoading(true);
    try {
      const categoriaCreada = await service.POST(nuevaCategoria);
      setCategorias(prev => [...prev, categoriaCreada]);
      setTodasLasCategorias(prev => [...prev, categoriaCreada]);
      
      notifications.success();
      return categoriaCreada;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const ACTUALIZAR = async (id: string, categoriaActualizada: CategoriaInput) => {
    setLoading(true);
    try {
      const categoriaEditada = await service.PUT(id, categoriaActualizada);
      
      setCategorias(prev => 
        prev.map(cat => cat.id === id ? categoriaEditada : cat)
      );
      setTodasLasCategorias(prev => 
        prev.map(cat => cat.id === id ? categoriaEditada : cat)
      );
      
      notifications.success();
      return categoriaEditada;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const ELIMINAR = async (id: string) => {
    setLoading(true);
    try {
      await service.DELETE(id);
      
      setCategorias(prev => prev.filter(cat => cat.id !== id));
      setTodasLasCategorias(prev => prev.filter(cat => cat.id !== id));
      
      notifications.success();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refrescarCategoriasActivas = () => {
    return cargarCategoriasActivas();
  };

  const refrescarTodasLasCategorias = () => {
    return cargarTodasLasCategorias();
  };

  useEffect(() => {
    cargarCategoriasActivas();
  }, []);

  return {
    categorias,
    todasLasCategorias,
    loading,
    error,
    cargarCategoriasActivas,
    cargarTodasLasCategorias,
    obtenerCategoriaPorId,
    buscarCategoriasPorNombre,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    refrescarCategoriasActivas,
    refrescarTodasLasCategorias,
  };
};