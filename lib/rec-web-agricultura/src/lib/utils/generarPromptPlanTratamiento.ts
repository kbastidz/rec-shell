import { AnalisisImagenMCHLDTO } from "../types/dto";
import { AnalisisImagenYOLO_DTO } from "../types/yolo";

/**
 * Genera el prompt para crear un plan de tratamiento agronómico
 * basado en el análisis de imagen de cultivo de cacao
 */
export const generarPromptPlanTratamiento = (
  analisis: AnalisisImagenYOLO_DTO
): string => {
  const analisisJSON = JSON.stringify(analisis, null, 2);

  return `Actúa como un ingeniero agrónomo experto en nutrición vegetal especializado en cultivos de cacao.

Con base EXCLUSIVA en el siguiente análisis dinámico en formato JSON (NO modifiques este bloque):

${analisisJSON}

Tu única tarea es generar un PLAN DE TRATAMIENTO AGRONÓMICO detallado, estructurado y técnicamente correcto.

⚠️ REGLAS OBLIGATORIAS:
- No incluyas explicaciones.
- No incluyas introducciones.
- No agregues texto fuera del JSON.
- NO uses bloques markdown ni etiquetas json.
- Todos los valores deben ser técnicamente coherentes con la deficiencia detectada.
- Usa la dosis, frecuencia y tratamiento proporcionados como base.
- Si algún dato no se puede determinar con certeza, usa null.
- La respuesta DEBE ser SOLO el objeto JSON final.

El formato de salida obligatorio es:

{
  "tratamiento": "",

  "planAplicacion": {
    "tipo": "Foliar",
    "dosisPorLitro": "",
    "volumenPorHectareaEstimado_L": 500,
    "dosisPorHectareaEstimada": "",
    "frecuenciaDias": 0,
    "numeroAplicaciones": 0,
    "duracionTratamientoDias": 0,
    "horaRecomendada": "06:00 - 09:00",
    "precauciones": ""
  },

  "tratamientoSuelo": {
    "accion": "",
    "productoSugerido": "",
    "dosisOrientativa": "",
    "metodo": ""
  },

  "seguimiento": {
    "observableMejora": null,
    "notasTecnico": "",
    "imagenesSeguimiento": []
  }
}`;
};

/**
 * Interface para el tipo de respuesta esperada del plan de tratamiento
 */
export interface PlanTratamientoResponse {
  tratamiento: string;
  planAplicacion: {
    tipo: string;
    dosisPorLitro: string;
    volumenPorHectareaEstimado_L: number;
    dosisPorHectareaEstimada: string;
    frecuenciaDias: number;
    numeroAplicaciones: number;
    duracionTratamientoDias: number;
    horaRecomendada: string;
    precauciones: string;
  };
  tratamientoSuelo: {
    accion: string;
    productoSugerido: string;
    dosisOrientativa: string;
    metodo: string;
  };
  seguimiento: {
    observableMejora: string | null;
    notasTecnico: string;
    imagenesSeguimiento: string[];
  };
}

export const fallbackPlan: PlanTratamientoResponse = {
            tratamiento: "Error al generar plan - Consultar especialista",
            planAplicacion: {
              tipo: "Foliar",
              dosisPorLitro: "Por determinar",
              volumenPorHectareaEstimado_L: 500,
              dosisPorHectareaEstimada: "Por determinar",
              frecuenciaDias: 0,
              numeroAplicaciones: 0,
              duracionTratamientoDias: 0,
              horaRecomendada: "06:00 - 09:00",
              precauciones: "Consultar con especialista agrícola"
            },
            tratamientoSuelo: {
              accion: "Por determinar",
              productoSugerido: "Por determinar",
              dosisOrientativa: "Por determinar",
              metodo: "Por determinar"
            },
            seguimiento: {
              observableMejora: null,
              notasTecnico: "Error en la generación automática",
              imagenesSeguimiento: []
            }
          };