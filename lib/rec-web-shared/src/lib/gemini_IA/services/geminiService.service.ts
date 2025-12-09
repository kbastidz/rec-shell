import { GeminiRequest, GeminiResponse } from "../model/dominio";

class GeminiService {
  
  private API_URL = 'https://generativelanguage.googleapis.com/v1';
  
  private API_KEY = `AIzaSyC7ZrIEg8z9jP9FjO3m6_eDiXbwcHvsajA`;
  private API_MODEL = 'gemini-2.5-flash';

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

export const service = new GeminiService();