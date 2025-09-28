import { InvokeApi } from '@rec-shell/rec-web-shared';
import { TablaLideres, EntradaTablaLideres } from '../../types/model';

const API_URL = `/gamificacion/tabla-lideres`;

export class ConexionService extends InvokeApi {
  async crearTablaLideres(tablaLideres: Omit<TablaLideres, 'id' | 'creadoEn' | 'actualizadoEn' | 'entradas'>): Promise<TablaLideres> {
    const response = await this.post<TablaLideres>(API_URL, tablaLideres);
    return response;
  }

  async obtenerTablasActivas(): Promise<TablaLideres[]> {
    const response = await this.get<TablaLideres[]>(`${API_URL}/activas`);
    return response;
  }

  async obtenerEntradasTabla(tablaId: string): Promise<EntradaTablaLideres[]> {
    const response = await this.get<EntradaTablaLideres[]>(`${API_URL}/${tablaId}/entradas`);
    return response;
  }

  async actualizarTablaLideres(tablaId: string): Promise<string> {
    const response = await this.post<string>(`${API_URL}/${tablaId}/actualizar`, {});
    return response;
  }

  async obtenerEntradasPorPeriodo(
    tablaId: string, 
    inicioPeriodo: string, 
    finPeriodo: string
  ): Promise<EntradaTablaLideres[]> {
    const params = new URLSearchParams({
      inicioPeriodo,
      finPeriodo
    });
    const response = await this.get<EntradaTablaLideres[]>(
      `${API_URL}/${tablaId}/entradas/periodo?${params.toString()}`
    );
    return response;
  }
}

export const service = new ConexionService();