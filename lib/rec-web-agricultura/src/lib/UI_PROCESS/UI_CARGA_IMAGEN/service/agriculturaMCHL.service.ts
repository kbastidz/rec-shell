import { InvokeApi } from '@rec-shell/rec-web-shared';
import { AnalisisImagenMCHLDTO } from '../../../types/dto';
import {AnalisisImagenMCHL } from '../../../types/model';

const API_URL_ANALISIS = `/agricultura/analisis-deficiencia`;

export class ConexionService extends InvokeApi {
  async POST(analisis: AnalisisImagenMCHLDTO): Promise<AnalisisImagenMCHL> {
    console.log('POST', analisis);
    const response = await this.post<AnalisisImagenMCHL>(API_URL_ANALISIS, analisis);
    return response;
  }

  async GET(): Promise<AnalisisImagenMCHLDTO[]> {
    const response = await this.get<AnalisisImagenMCHLDTO[]>(API_URL_ANALISIS);
    return response;
  }
}

export const service = new ConexionService();