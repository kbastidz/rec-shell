import { InvokeApi } from '@rec-shell/rec-web-shared';
import { TablaLideres, EntradaTablaLideres } from '../../types/model';

const API_URL = `/gamificacion/tabla-lideres`;

export class ConexionService extends InvokeApi {

  async POST(tablaLideres: Omit<TablaLideres, 'id' | 'creadoEn' | 'actualizadoEn' | 'entradas'>): Promise<TablaLideres> {
    const response = await this.post<TablaLideres>(API_URL, tablaLideres);
    return response;
  }

  async GET_ACTIVE(): Promise<TablaLideres[]> {
    const response = await this.get<TablaLideres[]>(`${API_URL}/activas`);
    return response;
  }

  async GET_ENTRADAS(tablaId: string): Promise<EntradaTablaLideres[]> {
    const response = await this.get<EntradaTablaLideres[]>(`${API_URL}/${tablaId}/entradas`);
    return response;
  }


  async PUT(id: string, entrada: Partial<Omit<TablaLideres, 'id' | 'creadoEn' | 'actualizadoEn' | 'entradas'>>): Promise<TablaLideres> {
    const response = await this.put<TablaLideres>(`${API_URL}/${id}`, entrada);
    return response;
  }

  async GET_BY_PERIODO(tablaId: string, inicioPeriodo: string, finPeriodo: string): Promise<EntradaTablaLideres[]> {
    const params = new URLSearchParams({inicioPeriodo, finPeriodo});
    const response = await this.get<EntradaTablaLideres[]>(
      `${API_URL}/${tablaId}/entradas/periodo?${params.toString()}`
    );
    return response;
  }
}

export const service = new ConexionService();