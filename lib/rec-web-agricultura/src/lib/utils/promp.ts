import { APIResponse, ResultDataYOLO } from "../types/yolo";
import { ImagenAnalisis } from "../UI_PROCESS/UI_CARGA_IMAGEN/components/Analisis";
import { generarFallbackRecomendaciones } from "./utils";

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

export const generarPromptRecomendacionesYOLO_v1 = (data: ResultDataYOLO): string => {
  const { detecciones, estadisticas } = data;

  if (detecciones.length === 0) {
    return `
Devuelve SOLO un JSON válido.

Formato:
{
  "deficiencias": [],
  "confianza_general": 0
}
`;
  }

  const deficienciasEncontradas = detecciones.map(d => d.deficiencia);
  const deficienciasUnicas = [...new Set(deficienciasEncontradas)];

  const  resumenDeficiencias = deficienciasUnicas.map(deficiencia => {
    const cantidad = estadisticas.por_tipo[deficiencia] || 0;
    const deteccionesDeEsteTipo = detecciones.filter(d => d.deficiencia === deficiencia);
    const confianzaPromedio =
      deteccionesDeEsteTipo.reduce((sum, d) => sum + d.confianza, 0) / cantidad;

    return {
      deficiencia,
      regiones_afectadas: cantidad,
      confianza_promedio: Number(confianzaPromedio.toFixed(1))
    };
  });

  return `
Devuelve EXCLUSIVAMENTE un JSON válido.
NO incluyas texto adicional.
NO uses markdown.
NO agregues explicaciones fuera del JSON.

Datos detectados:
${JSON.stringify(resumenDeficiencias, null, 2)}

Confianza general: ${estadisticas.confianza_promedio.toFixed(1)}%

Formato de respuesta OBLIGATORIO:
{
  "confianza_general": number,
  "deficiencias": [
    {
      "nombre": string,
      "confianza": number,
      "recomendaciones": {
        "tratamiento_inmediato": string[],
        "fertilizantes_recomendados": string[],
        "medidas_preventivas": string[]
      }
    }
  ]
}
`;
};


export const generarPromptRecomendacionesYOLO = (data: ResultDataYOLO): string => {
  const { detecciones, estadisticas } = data;

  if (detecciones.length === 0) {
    return `
Devuelve SOLO un JSON válido.

Formato:
{
  "deficiencias": [],
  "confianza_general": 0
}
`;
  }

  const deficienciasEncontradas = detecciones.map(d => d.deficiencia);
  const deficienciasUnicas = [...new Set(deficienciasEncontradas)];

  const resumenDeficiencias = deficienciasUnicas.map(deficiencia => {
    const cantidad = estadisticas.por_tipo[deficiencia] || 0;
    const deteccionesDeEsteTipo = detecciones.filter(d => d.deficiencia === deficiencia);
    const confianzaPromedio =
      deteccionesDeEsteTipo.reduce((sum, d) => sum + d.confianza, 0) / cantidad;

    return {
      deficiencia,
      regiones_afectadas: cantidad,
      confianza_promedio: Number(confianzaPromedio.toFixed(1))
    };
  });

  return `
Eres un experto agrónomo especializado en cultivo de cacao.

IMPORTANTE: Detectamos ${deficienciasUnicas.length} TIPO(S) de deficiencia(s). 
Debes generar EXACTAMENTE ${deficienciasUnicas.length} recomendación(es) en el array "deficiencias".
UNA recomendación por cada TIPO único de deficiencia detectada.

Datos detectados:
${JSON.stringify(resumenDeficiencias, null, 2)}

Confianza general del análisis: ${estadisticas.confianza_promedio.toFixed(1)}%

INSTRUCCIONES:
- Si detectaste "Nitrogeno" en 5 regiones diferentes → Genera 1 sola entrada para "Nitrogeno" 
- Si detectaste "Potasio" en 3 regiones diferentes → Genera 1 sola entrada para "Potasio"
- El array "deficiencias" debe tener ${deficienciasUnicas.length} elemento(s)
- Considera la cantidad de regiones afectadas para determinar la severidad

Devuelve EXCLUSIVAMENTE un JSON válido.
NO incluyas texto adicional.
NO uses markdown.
NO agregues explicaciones fuera del JSON.

Formato de respuesta OBLIGATORIO:
{
  "confianza_general": <número entre 0-100>,
  "deficiencias": [
    {
      "nombre": "<nombre exacto de la deficiencia>",
      "confianza": <confianza promedio de esta deficiencia>,
      "recomendaciones": {
        "tratamiento_inmediato": [
          "<acción urgente 1>",
          "<acción urgente 2>",
          "<acción urgente 3>"
        ],
        "fertilizantes_recomendados": [
          "<fertilizante específico con dosis>",
          "<fertilizante alternativo>",
          "<opción orgánica>"
        ],
        "medidas_preventivas": [
          "<medida preventiva 1>",
          "<medida preventiva 2>",
          "<medida preventiva 3>",
          "<medida preventiva 4>"
        ]
      }
    }
  ]
}
`;
};




export function generarFallbackDesdeImagenes(
  imagenes: ImagenAnalisis[]
) {
  const todasLasDetecciones = imagenes
    .filter(img => img.resultado?.detecciones?.length)
    .flatMap(img => img.resultado!.detecciones!);

  if (todasLasDetecciones.length === 0) {
    return null;
  }

  const porTipo = todasLasDetecciones.reduce<Record<string, number>>(
    (acc, det) => {
      acc[det.deficiencia] = (acc[det.deficiencia] || 0) + 1;
      return acc;
    },
    {}
  );

  const confianzaPromedio =
    todasLasDetecciones.reduce((sum, det) => sum + det.confianza, 0) /
    todasLasDetecciones.length;

  return generarFallbackRecomendaciones({
    detecciones: todasLasDetecciones,
    estadisticas: {
      total_detecciones: todasLasDetecciones.length,
      deficiencias_unicas: new Set(
        todasLasDetecciones.map(d => d.deficiencia)
      ).size,
      confianza_promedio: confianzaPromedio,
      confianza_maxima: Math.max(
        ...todasLasDetecciones.map(d => d.confianza)
      ),
      por_tipo: porTipo
    },
    metadata: {
      dimensiones_imagen: {
        ancho: 640,
        alto: 640
      },
      umbral_confianza: 0.5,
      umbral_iou: 0.45
    },
    es_valido: true,
    mensaje: 'Recomendaciones generadas localmente',
    tipo_alerta: 'warning',
    recomendaciones: []
  });
}

