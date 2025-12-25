/*import { generateSummaryPrompt, GENERATION_CONFIGS, generateQuestionsPrompt } from "../../../utils/prompts.util";

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
  private API_KEY = "AIzaSyD6Tm675FfOKRzMk0P_TBMSEVE_6X_S73U"; 
  private API_MODEL = 'gemini-2.5-flash';

  /**
   * Convierte un archivo PDF a base64
   
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
            text: generateSummaryPrompt()
          },
          {
            inline_data: {
              mime_type: "application/pdf",
              data: pdfBase64
            }
          }
        ]
      }],
      generationConfig: GENERATION_CONFIGS.summary
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
   * @param summary - El resumen del documento
   * @param numberOfQuestions - Cantidad de preguntas a generar
   
  async generateQuestions(summary: string, numberOfQuestions = 10): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('API Key es requerida');
    }
    if (!summary) {
      throw new Error('El resumen es requerido');
    }

    const prompt = generateQuestionsPrompt(summary, numberOfQuestions);
    const url = `${this.API_URL}/models/${this.API_MODEL}:generateContent?key=${this.API_KEY}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: GENERATION_CONFIGS.questions
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

export const geminiService = new GeminiService();*/