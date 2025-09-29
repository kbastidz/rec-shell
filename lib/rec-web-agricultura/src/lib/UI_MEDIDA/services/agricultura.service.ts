import { InvokeApi } from '@rec-shell/rec-web-shared';
import { MedidaPreventiva } from '../../types/model';

// Interface para el input de creación/actualización
export interface MedidaPreventivaInput {
  deficienciaNutrienteId?: number;
  titulo: string;
  descripcion: string;
  tipoMedida?: string;
  frecuenciaRecomendada?: string;
  temporadaAplicacion?: string;
  costoEstimado?: number;
  efectividadPorcentaje?: number;
  activo: boolean;
}

const API_URL = `/agricultura/medidas-preventivas`;

export class ConexionService extends InvokeApi {
  
  async crearMedidaPreventiva(medidaPreventiva: MedidaPreventivaInput): Promise<MedidaPreventiva> {
    const response = await this.post<MedidaPreventiva>(API_URL, medidaPreventiva);
    return response;
  }

  async obtenerMedidaPorId(id: number): Promise<MedidaPreventiva> {
    const response = await this.getById<MedidaPreventiva>(API_URL, id.toString());
    return response;
  }

  async obtenerTodasLasMedidas(): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(API_URL);
    return response;
  }

  async obtenerMedidasPorDeficiencia(deficienciaId: number): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/deficiencia/${deficienciaId}`);
    return response;
  }

  async obtenerMedidasActivas(): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/activas`);
    return response;
  }

  async obtenerMedidasPorTipo(tipoMedida: string): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/tipo/${encodeURIComponent(tipoMedida)}`);
    return response;
  }

  async obtenerMedidasActivasPorDeficiencia(deficienciaId: number): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/deficiencia/${deficienciaId}/activas`);
    return response;
  }

  async obtenerMedidasPorEfectividadMinima(efectividadMinima: number): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/efectividad-minima/${efectividadMinima}`);
    return response;
  }

  async actualizarMedida(id: number, medidaPreventiva: MedidaPreventivaInput): Promise<MedidaPreventiva> {
    const response = await this.put<MedidaPreventiva>(`${API_URL}/${id}`, medidaPreventiva);
    return response;
  }

  async eliminarMedida(id: number): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async activarMedida(id: number): Promise<MedidaPreventiva> {
    const response = await this.patch<MedidaPreventiva>(`${API_URL}/${id}/activar`);
    return response;
  }

  async desactivarMedida(id: number): Promise<MedidaPreventiva> {
    const response = await this.patch<MedidaPreventiva>(`${API_URL}/${id}/desactivar`);
    return response;
  }
}

export const service = new ConexionService();