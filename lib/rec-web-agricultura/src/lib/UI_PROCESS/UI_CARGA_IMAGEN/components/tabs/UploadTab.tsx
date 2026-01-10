import React from 'react';
import { Paper, Stack, Group, Button } from '@mantine/core';
import { ImagenAnalisis } from '../../../../types/yolo';
import { UploadZone } from '../UploadZone';
import { StatsGrid } from '../StatsGrid';

interface UploadTabProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
  imagenes: ImagenAnalisis[];
  estadisticasGlobales: {
    completadas: number;
    analizando: number;
    error: number;
    pendientes: number;
  };
  analizarTodasLasImagenes: () => void;
  setActiveTab: (tab: string) => void;
}

export const UploadTab: React.FC<UploadTabProps> = ({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  imagenes,
  estadisticasGlobales,
  analizarTodasLasImagenes,
  setActiveTab,
}) => {
  return (
    <Paper shadow="sm" radius="lg" p="xl" style={{ background: 'white' }}>
      <Stack gap="lg">
        {/* Zona de carga */}
        <UploadZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />

        {/* Estadísticas rápidas */}
        {imagenes.length > 0 && (
          <>
            <StatsGrid
              total={imagenes.length}
              pendientes={estadisticasGlobales.pendientes}
              completadas={estadisticasGlobales.completadas}
              errores={estadisticasGlobales.error}
            />

            <Group grow>
              {(estadisticasGlobales.pendientes > 0 ||
                estadisticasGlobales.error > 0) && (
                <Button
                  size="lg"
                  radius="md"
                  onClick={analizarTodasLasImagenes}
                  loading={estadisticasGlobales.analizando > 0}
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2' }}
                >
                  Re-analizar{' '}
                  {estadisticasGlobales.pendientes + estadisticasGlobales.error}{' '}
                  pendiente
                  {estadisticasGlobales.pendientes + estadisticasGlobales.error > 1
                    ? 's'
                    : ''}
                </Button>
              )}

              <Button
                size="lg"
                radius="md"
                variant="light"
                onClick={() => setActiveTab('images')}
              >
                Ver Imágenes
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Paper>
  );
};