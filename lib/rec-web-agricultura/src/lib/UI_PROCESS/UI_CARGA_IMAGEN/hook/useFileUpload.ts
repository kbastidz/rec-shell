import { useState, useCallback } from 'react';
import { useNotifications, NOTIFICATION_MESSAGES } from '@rec-shell/rec-web-shared';
import { ImagenAnalisis } from '../../../types/yolo';
export const useFileUpload = () => {
  const [imagenes, setImagenes] = useState<ImagenAnalisis[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const notifications = useNotifications();

  const generarId = () =>
    `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nuevasImagenes: ImagenAnalisis[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        notifications.error(
          NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
          `${file.name} no es una imagen válida`
        );
        continue;
      }

      try {
        const base64 = await convertirABase64(file);
        const objectUrl = URL.createObjectURL(file);

        nuevasImagenes.push({
          id: generarId(),
          file,
          previewUrl: objectUrl,
          base64,
          resultado: null,
          estado: 'pendiente',
        });
      } catch (error) {
        console.error(`Error al procesar ${file.name}:`, error);
      }
    }

    if (nuevasImagenes.length > 0) {
      setImagenes(prev => [...prev, ...nuevasImagenes]);
      notifications.success(
        'Imágenes cargadas',
        `Iniciando análisis automático de ${nuevasImagenes.length} imagen${nuevasImagenes.length > 1 ? 'es' : ''}...`
      );
      return nuevasImagenes.map(img => img.id);
    }

    return [];
  }, [notifications]);

  const eliminarImagen = useCallback((id: string) => {
    setImagenes(prev => {
      const imagen = prev.find(img => img.id === id);
      if (imagen?.previewUrl) {
        URL.revokeObjectURL(imagen.previewUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const limpiarImagenes = useCallback(() => {
    imagenes.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImagenes([]);
  }, [imagenes]);

  return {
    imagenes,
    setImagenes,
    isDragging,
    setIsDragging,
    handleFileSelect,
    eliminarImagen,
    limpiarImagenes,
  };
};