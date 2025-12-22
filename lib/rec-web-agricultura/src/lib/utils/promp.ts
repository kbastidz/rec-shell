import { APIResponse, ResultDataYOLO } from "../types/yolo";

// 1. Define la interfaz para los datos de entrada
interface DiagnosticoData {
    deficiencia: 'Nitrogeno' | 'Fosforo' | 'Potasio' | string;
    confianza: number;
    probabilidades: {
        Potasio: number;
        Nitrogeno: number;
        Fosforo: number;
        [key: string]: number; // Permite otros nutrientes en 'probabilidades'
    };
}

/**
 * Genera el prompt completo que instruye al modelo de lenguaje a 
 * actuar como especialista agrícola y aplicar las reglas de tratamiento.
 * * @param data Los datos de diagnóstico de deficiencia de nutrientes.
 * @returns Una cadena de texto (el prompt) listo para ser enviado al modelo.
 */
export function generarPromptRecomendaciones(data: DiagnosticoData): string {
    // Convierte el objeto de datos en una cadena JSON parcial para la sección de ENTRADA
    const entradaJson = JSON.stringify(data, null, 4)
        .replace(/^{|}$/g, '') // Elimina las llaves exteriores
        .trim();

    const prompt = `
Actúa como un Especialista Agrícola en Nutrición de Cultivos. 
Tu tarea es aplicar las "REGLAS DE TRATAMIENTO" al "FORMATO DE ENTRADA" proporcionado y devolver el resultado en el "FORMATO DE SALIDA" JSON.

---

### FORMATO DE ENTRADA (Diagnóstico Actual):
Se te proporciona el siguiente diagnóstico de deficiencia. 
La clave "deficiencia" indica el nutriente principal identificado:

${entradaJson}

---

### REGLAS DE TRATAMIENTO:
Asume que el cultivo es un cultivo de hoja verde genérico y que el tratamiento es foliar.
1.  Si la "deficiencia" es **Nitrógeno**:
    -   Tratamiento: Urea (46% N) o Nitrato de Amonio
    -   Dosis: 3 g / L
    -   Frecuencia: Cada 7 días
2.  Si la "deficiencia" es **Fósforo**:
    -   Tratamiento: Fosfato Monopotásico (MKP) o Ácido Fosfórico
    -   Dosis: 2 ml / L
    -   Frecuencia: Cada 10 días
3.  Si la "deficiencia" es **Potasio**:
    -   Tratamiento: Nitrato de Potasio (KNO3) o Sulfato de Potasio
    -   Dosis: 4 g / L
    -   Frecuencia: Cada 7 días
4.  Si la "deficiencia" es **Otros** (o no coincide con los 3 principales):
    -   Tratamiento: Fertilización balanceada general (NPK 20-20-20)
    -   Dosis: 2 g / L
    -   Frecuencia: Cada 14 días
5.  **Regla de Confianza**: Si la "confianza" es inferior al **70%**:
    -   Tratamiento: Monitoreo y repetir el diagnóstico. Aplicar NPK balanceado preventivo.
    -   Dosis: 2 g / L
    -   Frecuencia: Cada 14 días

---

### FORMATO DE SALIDA (Obligatorio):
Debes devolver la información exclusivamente en el siguiente formato JSON, aplicando rigurosamente las reglas anteriores:

{
    "recomendaciones": {
        "tratamiento": "[Nombre del producto o acción]",
        "dosis": "[Cantidad y unidad de dosis]",
        "frecuencia": "[Periodicidad y unidad de tiempo]"
    }
}
`;
    return prompt;
}

export const generarPromptRecomendacionesYOLO = (data: ResultDataYOLO): string => {
  const { detecciones, estadisticas } = data;
  
  if (detecciones.length === 0) {
    return "No se detectaron deficiencias";
  }

  // Obtener información de las detecciones
  const deficienciasEncontradas = detecciones.map(d => d.deficiencia);
  const deficienciasUnicas = [...new Set(deficienciasEncontradas)];
  
  let prompt = `Se detectaron ${estadisticas.total_detecciones} deficiencia(s) nutricional(es) en hojas de cacao:\n\n`;
  
  // Detallar cada tipo de deficiencia encontrada
  deficienciasUnicas.forEach(deficiencia => {
    const cantidad = estadisticas.por_tipo[deficiencia] || 0;
    const deteccionesDeEsteTipo = detecciones.filter(d => d.deficiencia === deficiencia);
    const confianzaPromedio = deteccionesDeEsteTipo.reduce((sum, d) => sum + d.confianza, 0) / cantidad;
    
    prompt += `- ${deficiencia}: ${cantidad} región(es) afectada(s) (confianza promedio: ${confianzaPromedio.toFixed(1)}%)\n`;
  });
  
  prompt += `\nConfianza general: ${estadisticas.confianza_promedio.toFixed(1)}%\n\n`;
  prompt += `Por favor, genera recomendaciones específicas y prácticas para cada deficiencia detectada, `;
  prompt += `incluyendo tratamientos, fertilizantes recomendados y medidas preventivas.`;
  
  return prompt;
};

export const FALLBACK_DATA_YOLO: APIResponse = {
  success: true,
  data: {
    es_valido: true,
    mensaje: "Se detectaron 2 deficiencia(s) en la hoja",
    tipo_alerta: "success",
    detecciones: [
      {
        deficiencia: "Potasio",
        confianza: 87.5,
        bbox: {
          x1: 100,
          y1: 150,
          x2: 300,
          y2: 350,
          ancho: 200,
          alto: 200
        },
        area: 40000
      },
      {
        deficiencia: "Nitrogeno",
        confianza: 92.3,
        bbox: {
          x1: 400,
          y1: 180,
          x2: 600,
          y2: 380,
          ancho: 200,
          alto: 200
        },
        area: 40000
      }
    ],
    estadisticas: {
      total_detecciones: 2,
      deficiencias_unicas: 2,
      confianza_promedio: 89.9,
      confianza_maxima: 92.3,
      por_tipo: {
        "Potasio": 1,
        "Nitrogeno": 1
      }
    },
    metadata: {
      dimensiones_imagen: {
        ancho: 1920,
        alto: 1080
      },
      umbral_confianza: 0.15,
      umbral_iou: 0.60
    }
  },
  archivo: "hoja_cacao.jpg",
  timestamp: new Date().toISOString()
};