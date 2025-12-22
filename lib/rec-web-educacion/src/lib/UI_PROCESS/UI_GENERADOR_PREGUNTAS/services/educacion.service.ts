import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Evaluacion, EvaluacionParsed } from '../interfaces/interface';

const API_URL = `/educacion/evaluaciones`;

interface GuardarCuestionarioRequest {
  preguntas: Array<{
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: number;
  }>;
  titulo: string;
  descripcion?: string;
  codigoUnico: string;
  fechaCreacion: string;
  estado: 'activo' | 'inactivo' | 'borrador';
   idCurso: string,
  fechaEvaluacion: string,
  resumen?: string;
  nombreArchivo?: string;
}

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}

// Interfaz que representa la respuesta completa del backend
interface EvaluacionBackendResponse {
  id: number;
  fechaCreacion: string;
  titulo: string;
  descripcion: string | null;
  codigoUnico: string;
  fechaEvaluacion: string,
  estado: 'activo' | 'inactivo' | 'borrador';
  nombreArchivo: string | null;
  datosEvaluacion: string; // JSON string que contiene resumen y preguntas
}

// Interfaz del JSON parseado dentro de datosEvaluacion
interface DatosEvaluacionJSON {
  resumen: string;
  preguntas: Pregunta[];
}

// Interfaz de respuesta limpia para el frontend
interface CuestionarioResponse {
  preguntas: Pregunta[];
  titulo: string;
  descripcion?: string;
  codigoUnico: string;
  fechaCreacion: string;
  estado: 'activo' | 'inactivo' | 'borrador';
  resumen?: string;
  nombreArchivo?: string;
}

export class ConexionService extends InvokeApi {
  
  async POST(cuestionarioData: GuardarCuestionarioRequest): Promise<any> {
    const response = await this.post<any>(API_URL, {
      preguntas: cuestionarioData.preguntas,
      titulo: cuestionarioData.titulo,
      descripcion: cuestionarioData.descripcion,
      codigoUnico: cuestionarioData.codigoUnico,
      fechaCreacion: cuestionarioData.fechaCreacion,
      estado: cuestionarioData.estado,
      idCurso: cuestionarioData.idCurso,
      fechaEvaluacion: cuestionarioData.fechaEvaluacion,
      resumen: cuestionarioData.resumen,
      nombreArchivo: cuestionarioData.nombreArchivo
    });
    
    return response;
  }

  async GET(): Promise<Pregunta[]> {
    const response = await this.get<EvaluacionBackendResponse[]>(`${API_URL}`);
    
    if (!response || response.length === 0) {
      return [];
    }
    
    const evaluacion = response[0];
    
    // Parsear el JSON de datosEvaluacion
    const datosJSON: DatosEvaluacionJSON = JSON.parse(evaluacion.datosEvaluacion);
    
    return datosJSON.preguntas;
  }

  async GET_BY_CODE(codigo: string): Promise<CuestionarioResponse> {
    try {
      // El backend retorna un array con una evaluación
      const response = await this.get<EvaluacionBackendResponse[]>(
        `${API_URL}/codigo/${codigo.toUpperCase()}`
      );
      
      console.log('Response del backend:', response);
      
      if (!response || response.length === 0) {
        throw new Error('Código no encontrado');
      }

      const evaluacion = response[0];
      
      // Parsear el JSON que está dentro de datosEvaluacion
      const datosJSON: DatosEvaluacionJSON = JSON.parse(evaluacion.datosEvaluacion);
      
      // Validar que tenga preguntas
      if (!datosJSON.preguntas || !Array.isArray(datosJSON.preguntas)) {
        throw new Error('El cuestionario no tiene preguntas válidas');
      }

      // Verificar que el código coincida
      if (evaluacion.codigoUnico !== codigo.toUpperCase()) {
        throw new Error('El código no coincide con el cuestionario');
      }
      
      // Construir la respuesta combinando campos directos y del JSON
      const cuestionario: CuestionarioResponse = {
        // Preguntas vienen del JSON parseado
        preguntas: datosJSON.preguntas,
        
        // Campos que vienen directos del backend
        titulo: evaluacion.titulo,
        descripcion: evaluacion.descripcion || '',
        codigoUnico: evaluacion.codigoUnico,
        fechaCreacion: evaluacion.fechaCreacion,
        estado: evaluacion.estado,
        nombreArchivo: evaluacion.nombreArchivo || '',
        
        // Resumen viene del JSON parseado
        resumen: datosJSON.resumen || ''
      };

      // Validar estado activo
      if (cuestionario.estado !== 'activo') {
        throw new Error('Este cuestionario no está disponible actualmente');
      }

      console.log('Cuestionario procesado:', cuestionario);
      return cuestionario;
      
    } catch (error) {
      console.error('Error al obtener el cuestionario:', error);
      
      // Re-lanzar el error con el mensaje original si es uno de nuestros errores
      if (error instanceof Error) {
        if (error.message.includes('Código no encontrado') || 
            error.message.includes('no está disponible') ||
            error.message.includes('no coincide') ||
            error.message.includes('no tiene preguntas')) {
          throw error;
        }
        
        // Error HTTP específico
        if (error.message.includes('404')) {
          throw new Error('Código no encontrado');
        }
        if (error.message.includes('403')) {
          throw new Error('No tienes permiso para acceder a este cuestionario');
        }
      }
      
      throw new Error('Error al obtener el cuestionario');
    }
  }

  async GET_BY_ID_USUARIO(cedula: string): Promise<EvaluacionBackendResponse[]> {
    const response = await this.get<EvaluacionBackendResponse[]>(`${API_URL}/lista-evaluaciones/${cedula}`);
    console.log('Response del backend:', response);  
    return response;
  }

}

export const service = new ConexionService();