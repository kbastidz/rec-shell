import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Estudiante } from '../interfaces/interface';

const API_URL = `/educacion/estudiantes`;

export class ConexionService extends InvokeApi {
  
  async GET(): Promise<Estudiante[]> {
    const response = await this.get<Estudiante[]>(API_URL);
    return response;
  }

  async POST(estudiante: Estudiante): Promise<Estudiante> {
    const response = await this.post<Estudiante>(API_URL, estudiante);
    return response;
  }

  async PUT(id: string, estudiante: Estudiante): Promise<Estudiante> {
    const response = await this.put<Estudiante>(`${API_URL}/${id}`, estudiante);
    return response;
  }
}

export const service = new ConexionService();