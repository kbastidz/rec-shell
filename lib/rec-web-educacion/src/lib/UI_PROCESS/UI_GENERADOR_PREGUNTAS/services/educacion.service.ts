import { InvokeApi } from '@rec-shell/rec-web-shared';

const API_URL = `/educacion/evaluaciones`;

export class ConexionService extends InvokeApi {
  
  async POST(cuestionarioData: {
    preguntas: Array<{
      pregunta: string;
      opciones: string[];
      respuestaCorrecta: number;
    }>;
    resumen?: string;
    nombreArchivo?: string;
  }): Promise<any> {
    console.log(cuestionarioData);
    const response = await this.post<any>(API_URL, {
      preguntas: cuestionarioData.preguntas,
      resumen: cuestionarioData.resumen,
      nombreArchivo: cuestionarioData.nombreArchivo
    });
    return response;
  }
}

export const service = new ConexionService();