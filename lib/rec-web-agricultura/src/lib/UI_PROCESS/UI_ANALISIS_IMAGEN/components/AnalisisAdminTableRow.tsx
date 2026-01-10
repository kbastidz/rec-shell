import {
  Table,
  Text,
  Badge,
  Group,
  Stack,
  ThemeIcon,
  Button,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconFileText,
  IconCheck,
  IconX,
  IconTarget,
} from '@tabler/icons-react';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import { formatDeficiencia, getConfianzaColor, getTipoAlertaColor } from '../../UI_CARGA_IMAGEN/utils/apiUtils';


interface AnalisisAdminTableRowProps {
  analisis: AnalisisImagenYOLO_DTO;
  onGenerarPlan: (analisis: AnalisisImagenYOLO_DTO) => void;
  loadingGemini: boolean;
}

export function AnalisisAdminTableRow({
  analisis,
  onGenerarPlan,
  loadingGemini,
}: AnalisisAdminTableRowProps) {
  return (
    <Table.Tr>
      <Table.Td>
        <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
          {analisis.archivo}
        </Text>
      </Table.Td>

      <Table.Td>
        <Badge
          color={getTipoAlertaColor(analisis.tipo_alerta)}
          variant="filled"
          size="sm"
          leftSection={
            analisis.es_valido ? (
              <IconCheck size={14} />
            ) : (
              <IconX size={14} />
            )
          }
        >
          {analisis.es_valido ? 'Válido' : 'Inválido'}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconTarget size={14} />
          </ThemeIcon>
          <Text size="sm" fw={500}>
            {analisis.estadisticas.total_detecciones}
          </Text>
          <Text size="xs" c="dimmed">
            ({analisis.estadisticas.deficiencias_unicas} únicas)
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge
          color={getConfianzaColor(analisis.estadisticas.confianza_promedio)}
          variant="light"
          size="lg"
        >
          {analisis.estadisticas.confianza_promedio.toFixed(1)}%
        </Badge>
      </Table.Td>

      <Table.Td>
        <Stack gap={4}>
          {Object.entries(analisis.estadisticas.por_tipo).map(
            ([deficiencia, cantidad]) => (
              <Group key={deficiencia} gap="xs">
                <Badge size="sm" variant="dot" color="teal">
                  {formatDeficiencia(deficiencia)}
                </Badge>
                <Text size="xs" c="dimmed">
                  ({cantidad}x)
                </Text>
              </Group>
            )
          )}
        </Stack>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="gray">
            <IconCalendar size={14} />
          </ThemeIcon>
          <Text size="xs">{formatDate(analisis.fecha)}</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <Tooltip label="Generar plan de tratamiento con IA">
            <Button
              size="xs"
              variant="light"
              color="green"
              leftSection={<IconFileText size={16} />}
              onClick={() => onGenerarPlan(analisis)}
              loading={loadingGemini}
              disabled={loadingGemini || !analisis.es_valido}
            >
              Plan
            </Button>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}