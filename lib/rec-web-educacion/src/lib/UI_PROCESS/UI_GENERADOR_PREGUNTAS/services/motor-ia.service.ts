interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  pdfBase64?: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiService {
  private API_URL = 'https://generativelanguage.googleapis.com/v1';
  private API_KEY = "" ; //"AIzaSyDYbVK9H0N-KbAv0pEqmkyfh-te5iPyhME";
  private API_MODEL = 'gemini-2.5-flash';

  /**
   * Convierte un archivo PDF a base64
   */
  async pdfToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:application/pdf;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Genera un resumen del PDF usando Gemini AI
   */
  async summarizePDF(file: File): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('API Key es requerida');
    }

    const pdfBase64 = await this.pdfToBase64(file);
    const url = `${this.API_URL}/models/${this.API_MODEL}:generateContent?key=${this.API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [
          {
            text: "Por favor, analiza este documento PDF y genera un resumen completo que incluya:\n\n1. Tema principal del documento\n2. Puntos clave y conceptos importantes\n3. Conclusiones o resultados relevantes\n4. Cualquier dato o estadística significativa\n\nProporciona el resumen en español de forma clara y estructurada."
          },
          {
            inline_data: {
              mime_type: "application/pdf",
              data: pdfBase64
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 
          `Error HTTP: ${response.status}`
        );
      }

      const data: GeminiResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta del modelo');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al generar resumen');
    }
  }

  /**
   * Genera preguntas de opción múltiple basadas en un resumen
   */
  async generateQuestions(summary: string): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('API Key es requerida');
    }
    if (!summary) {
      throw new Error('El resumen es requerido');
    }

    const prompt = `
Basándote en el siguiente resumen, genera exactamente 10 preguntas de opción múltiple.
Para cada pregunta, proporciona 3 opciones: 1 correcta y 2 incorrectas.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido en el siguiente formato, sin texto adicional antes o después:
{
  "preguntas": [
    {
      "pregunta": "texto de la pregunta",
      "opciones": ["opción correcta", "opción incorrecta 1", "opción incorrecta 2"],
      "respuestaCorrecta": 0
    }
  ]
}

REGLAS:
- Genera exactamente 10 preguntas
- Cada pregunta debe tener exactamente 3 opciones
- La primera opción (índice 0) siempre debe ser la correcta
- Las opciones incorrectas deben ser plausibles pero claramente incorrectas
- Las preguntas deben cubrir diferentes aspectos del resumen
- Usa un lenguaje claro y preciso

Resumen:
${summary}
`;

    const url = `${this.API_URL}/models/${this.API_MODEL}:generateContent?key=${this.API_KEY}`;
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 
          `Error HTTP: ${response.status}`
        );
      }

      const data: GeminiResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta del modelo');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al generar preguntas');
    }
  }

  /**
   * Método original para generar texto
   */
  async generateText({
    prompt,
    temperature = 0.7,
    maxTokens = 2048
  }: GeminiRequest): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('API Key es requerida');
    }
    if (!prompt) {
      throw new Error('El prompt es requerido');
    }

    const url = `${this.API_URL}/models/${this.API_MODEL}:generateContent?key=${this.API_KEY}`;
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 
          `Error HTTP: ${response.status}`
        );
      }

      const data: GeminiResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta del modelo');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al generar texto');
    }
  }
}

export const geminiService = new GeminiService();