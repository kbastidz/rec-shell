import { useState } from 'react';
import { NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { GET_ERROR } from '../../../utils/utils';
import { GenerarPlanAnalisisRequest, PlanGeneradoResponse, PlanTratamientoNuevo } from '../../../types/dto';
import { service } from '../services/agricultura.service';

export function   usePlanesTratamiento() {
  const [loading, setLoading] = useState(false);
  const [planGenerado, setPlanGenerado] = useState<PlanGeneradoResponse | null>(null);
  const [listaPlanes, setListaPlanes] = useState<PlanTratamientoNuevo[]>([]);
  const notifications = useNotifications();

  const obtenerTodosPlanes = async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await service.GET();
      setListaPlanes(response);
    } catch (error: unknown) {
      console.error('Error al obtener planes de tratamiento:', error);
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        GET_ERROR(error)
      );
    } finally {
      setLoading(false);
    }
  };

    const generarPlan = async (request: GenerarPlanAnalisisRequest): Promise<PlanGeneradoResponse | null> => {
    setLoading(true);

    try {
      const response = await service.POST(request);
      setPlanGenerado(response);
      
      notifications.success();
      await obtenerTodosPlanes();

      return response;
    } catch (error: unknown) {
      console.error('Error al generar plan de tratamiento:', error);
      notifications.error(
        NOTIFICATION_MESSAGES.GENERAL.ERROR.title,
        GET_ERROR(error)
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    planGenerado,
    listaPlanes,
    generarPlan,
    obtenerTodosPlanes,
  };
}