import { InvokeApi } from '@rec-shell/rec-web-shared';
import { GenerarPlanRequest, PlanGeneradoResponse } from '../../../types/dto';
import { PlanTratamiento } from '../../../types/model';

const API_URL_ANALISIS = `/agricultura/planes-tratamiento`;

export class ConexionService extends InvokeApi {

  async GET(): Promise<PlanTratamiento[]> {
    const response = await this.get<PlanTratamiento[]>(API_URL_ANALISIS);
    console.log('response', response);
    return response;
  }

   async POST(request: GenerarPlanRequest): Promise<PlanGeneradoResponse> {
    const response = await this.post<PlanGeneradoResponse>(`${API_URL_ANALISIS}/generar`, request);
    console.log('response', response);
    return response;
  }
  
}

export const service = new ConexionService();