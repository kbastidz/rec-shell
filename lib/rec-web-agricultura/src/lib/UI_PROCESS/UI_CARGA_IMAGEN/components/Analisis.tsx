import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Group, Tabs, Alert, Stack } from '@mantine/core';
import { IconLeaf, IconPhoto, IconEye, IconBulb } from '@tabler/icons-react';
import { useFileUpload } from '../hook/useFileUpload';
import { useImageAnalysis } from '../hook/useImageAnalysis';
import { useRecommendations } from '../hook/useRecommendations';

import { UploadTab } from './tabs/UploadTab';
import { ImagesTab } from './tabs/ImagesTab';
import { RecommendationsTab } from './tabs/RecommendationsTab';

import { construirAnalisisDTO } from '../../../types/yolo';
import { useCultivos } from '../../../UI_CULTIVO/hooks/useAgricultura';
import { useAnalisisImagen } from '../hook/useAgriculturaMchl';
import { ST_GET_USER_ID } from '../../../utils/utils';

export function Analisis() {
  const [activeTab, setActiveTab] = useState<string | null>('upload');
  const [nombreCultivo, setNombreCultivo] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);

  // Custom hooks
  const {
    imagenes,
    setImagenes,
    isDragging,
    setIsDragging,
    handleFileSelect,
    eliminarImagen,
    limpiarImagenes,
  } = useFileUpload();

  const { analizarImagen, analizarTodasLasImagenes, estadisticasGlobales } =
    useImageAnalysis(imagenes, setImagenes);

  const {
    recomendacionesGlobal,
    isLoadingRecommendations,
    errorGemini,
    generarRecomendacionesConsolidadas,
    setRecomendacionesGlobal,
  } = useRecommendations(imagenes, setActiveTab);

  const {
    loading: guardandoAnalisis,
    error: errorGuardar,
    REGISTRAR,
  } = useAnalisisImagen();

  const { cultivos, LISTAR } = useCultivos();

  // Cargar cultivos al montar
  useEffect(() => {
    LISTAR();
  }, []);

  const listCultivos = cultivos.map((cultivo) => ({
    value: `${cultivo.nombreCultivo} - ${cultivo.variedadCacao}`,
    label: `${cultivo.nombreCultivo} - ${cultivo.variedadCacao}`,
  }));

  // Auto-analizar imágenes pendientes
  useEffect(() => {
    const imagenesPendientes = imagenes.filter(img => img.estado === 'pendiente');
    
    imagenesPendientes.forEach((imagen) => {
      analizarImagen(imagen.id);
    });
  }, [imagenes.length]);

  // Wrapper para agregar auto-análisis al cargar archivos
  const handleFileSelectWithAutoAnalysis = async (files: FileList | null) => {
    const nuevosIds = await handleFileSelect(files);
    if (nuevosIds && nuevosIds.length > 0) {
      setActiveTab('images');
    }
  };

  // Handlers para drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelectWithAutoAnalysis(e.dataTransfer.files);
  };

  // Guardar análisis
  const handleGuardarAnalisis = async () => {
    const imagenesCompletadas = imagenes.filter(
      (img) => img.estado === 'completado' && img.resultado
    );

    if (imagenesCompletadas.length === 0 || !recomendacionesGlobal) return;

    if (!nombreCultivo) {
      return;
    }

    for (const imagen of imagenesCompletadas) {
      if (!imagen.resultado) continue;
      
      const usuarioId = ST_GET_USER_ID();
      const analisisDTO = construirAnalisisDTO(
        imagen.resultado,
        imagen.file,
        imagen.base64,
        recomendacionesGlobal,
        nombreCultivo,
        sector,
        usuarioId
      );
      await REGISTRAR(analisisDTO);
    }

    limpiarImagenes();
    setRecomendacionesGlobal(null);
    setActiveTab('upload');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: '#f5f7fa' }}>
      <Container size="xl">
        {/* Header */}
        <Group justify="center" mb="xl">
          <IconLeaf size={36} color="#667eea" />
          <div>
            <Title order={1} size="h2" style={{ margin: 0 }}>
              Detector de Deficiencias en Cacao
            </Title>
            <Text size="sm" c="dimmed">
              Análisis de deficiencias nutricionales con IA YOLO
            </Text>
          </div>
        </Group>

        {/* Tabs principales */}
        <Tabs value={activeTab} onChange={setActiveTab} radius="md">
          <Tabs.List grow>
            <Tabs.Tab value="upload" leftSection={<IconPhoto size={16} />}>
              Cargar Imágenes
            </Tabs.Tab>
            <Tabs.Tab
              value="images"
              leftSection={<IconEye size={16} />}
              disabled={imagenes.length === 0}
            >
              Imágenes ({imagenes.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="recommendations"
              leftSection={<IconBulb size={16} />}
              disabled={!recomendacionesGlobal}
            >
              Recomendaciones
            </Tabs.Tab>
          </Tabs.List>

          {/* Tab 1: Upload */}
          <Tabs.Panel value="upload" pt="md">
            <UploadTab
              isDragging={isDragging}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelectWithAutoAnalysis}
              imagenes={imagenes}
              estadisticasGlobales={estadisticasGlobales}
              analizarTodasLasImagenes={analizarTodasLasImagenes}
              setActiveTab={setActiveTab}
            />
          </Tabs.Panel>

          {/* Tab 2: Imágenes */}
          <Tabs.Panel value="images" pt="md">
            <ImagesTab
              imagenes={imagenes}
              estadisticasGlobales={estadisticasGlobales}
              analizarImagen={analizarImagen}
              eliminarImagen={eliminarImagen}
              generarRecomendacionesConsolidadas={generarRecomendacionesConsolidadas}
              isLoadingRecommendations={isLoadingRecommendations}
            />
          </Tabs.Panel>

          {/* Tab 3: Recomendaciones */}
          <Tabs.Panel value="recommendations" pt="md">
            <RecommendationsTab
              recomendacionesGlobal={recomendacionesGlobal}
              isLoadingRecommendations={isLoadingRecommendations}
              guardandoAnalisis={guardandoAnalisis}
              handleGuardarAnalisis={handleGuardarAnalisis}
              listCultivos={listCultivos}
              nombreCultivo={nombreCultivo}
              setNombreCultivo={setNombreCultivo}
              sector={sector}
              setSector={setSector}
            />
          </Tabs.Panel>
        </Tabs>

        {/* Errores globales */}
        {(errorGuardar || errorGemini) && (
          <Stack gap="sm" mt="md">
            {errorGuardar && (
              <Alert color="red" title="Error al guardar" radius="md">
                {errorGuardar}
              </Alert>
            )}
            {errorGemini && (
              <Alert color="orange" title="Error al generar recomendaciones" radius="md">
                {errorGemini}
              </Alert>
            )}
          </Stack>
        )}
      </Container>
    </div>
  );
}