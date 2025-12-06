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