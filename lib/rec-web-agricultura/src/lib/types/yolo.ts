interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ancho: number;
  alto: number;
}

interface Deteccion {
  deficiencia: string;
  confianza: number;
  bbox: BoundingBox;
  area: number;
}

interface Estadisticas {
  total_detecciones: number;
  deficiencias_unicas: number;
  confianza_promedio: number;
  confianza_maxima: number;
  por_tipo: {
    [key: string]: number;
  };
}

interface Metadata {
  dimensiones_imagen: {
    ancho: number;
    alto: number;
  };
  umbral_confianza: number;
  umbral_iou: number;
}

export interface ResultDataYOLO {
  es_valido: boolean;
  mensaje: string;
  tipo_alerta: string;
  detecciones: Deteccion[];
  estadisticas: Estadisticas;
  metadata: Metadata;
  recomendaciones?: string[];
  imagen_procesada?: string; // base64 si usas /predict/visual
}

export interface APIResponse {
  success: boolean;
  data: ResultDataYOLO;
  archivo: string;
  timestamp: string;
}

export interface AnalisisImagenYOLO_DTO {
  id? : number
  // Información general
  archivo: string;
  imagenBase64: string;
  fecha: string;
  
  // Resultados del análisis YOLO
  es_valido: boolean;
  mensaje: string;
  tipo_alerta: string;
  
  // Estadísticas generales
  estadisticas: EstadisticasDTO;
  
  // Detalle de cada detección
  detecciones: DeteccionDTO[];
  
  // Recomendaciones de IA
  recomendaciones: Record<string, any>;
  
  // Metadata opcional
  metadata?: {
    modelo: string;
    version: string;
    umbral_confianza: number;
    dimensiones_imagen: {
      ancho: number;
      alto: number;
    };
  };
}


interface DeteccionDTO {
  region: number;                    // Número de región (1, 2, 3...)
  deficiencia: string;               // Nombre de la deficiencia
  confianza: number;                 // Confianza de esta detección específica
  ubicacion: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  area: number;                      // Área de la región en píxeles
}

interface EstadisticasDTO {
  total_detecciones: number;
  deficiencias_unicas: number;
  confianza_promedio: number;
  confianza_maxima: number;
  por_tipo: {
    [key: string]: number;           // Ej: { "Potasio": 2, "Nitrogeno": 1 }
  };
}

export const construirAnalisisDTO = (
  results: ResultDataYOLO,
  selectedFile: File,
  imagenBase64: string,
  recomendaciones: Record<string, any>
): AnalisisImagenYOLO_DTO => {
  
  // Mapear las detecciones al formato DTO
  const deteccionesDTO: DeteccionDTO[] = results.detecciones.map((det, index) => ({
    region: index + 1,
    deficiencia: det.deficiencia,
    confianza: det.confianza,
    ubicacion: {
      x1: det.bbox.x1,
      y1: det.bbox.y1,
      x2: det.bbox.x2,
      y2: det.bbox.y2
    },
    area: det.area
  }));

  // Construir el DTO completo
  const analisisDTO: AnalisisImagenYOLO_DTO = {
    // Información general
    archivo: selectedFile.name,
    imagenBase64: imagenBase64,
    fecha: new Date().toISOString().split('T')[0],
    
    // Resultados del análisis
    es_valido: results.es_valido,
    mensaje: results.mensaje,
    tipo_alerta: results.tipo_alerta,
    
    // Estadísticas
    estadisticas: {
      total_detecciones: results.estadisticas.total_detecciones,
      deficiencias_unicas: results.estadisticas.deficiencias_unicas,
      confianza_promedio: results.estadisticas.confianza_promedio,
      confianza_maxima: results.estadisticas.confianza_maxima,
      por_tipo: results.estadisticas.por_tipo
    },
    
    // Detecciones individuales
    detecciones: deteccionesDTO,
    
    // Recomendaciones
    recomendaciones: recomendaciones,
    
    // Metadata (opcional)
    metadata: {
      modelo: 'YOLOv8',
      version: '3.0.0',
      umbral_confianza: results.metadata.umbral_confianza,
      dimensiones_imagen: results.metadata.dimensiones_imagen
    }
  };

  return analisisDTO;
};