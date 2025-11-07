import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Evaluacion, EvaluacionParsed, Pregunta } from '../interfaces/interface';

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
    
    const response = await this.post<any>(API_URL, {
      preguntas: cuestionarioData.preguntas,
      resumen: cuestionarioData.resumen,
      nombreArchivo: cuestionarioData.nombreArchivo
    });
    return response;
  }

  async GET(): Promise<Pregunta[]> {
    const response = await this.get<Evaluacion[]>(`${API_URL}`);
    const evaluacion = response[0];
    const datos: EvaluacionParsed["datosEvaluacion"] = JSON.parse(evaluacion.datosEvaluacion);
    return datos.preguntas;
  }

}

export const service = new ConexionService();