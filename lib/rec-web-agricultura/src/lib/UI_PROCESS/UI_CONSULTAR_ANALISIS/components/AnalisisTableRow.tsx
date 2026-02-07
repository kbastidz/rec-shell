import {
  Table,
  Text,
  Badge,
  Group,
  Stack,
  ThemeIcon,
  ActionIcon,
} from '@mantine/core';
import {
  IconCalendar,
  IconEye,
  IconCheck,
  IconX,
  IconTarget,
} from '@tabler/icons-react';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import { formatDeficiencia, getConfianzaColor, getTipoAlertaColor } from '../../UI_CARGA_IMAGEN/utils/apiUtils';


interface AnalisisTableRowProps {
  analisis: AnalisisImagenYOLO_DTO;
  onViewDetails: (analisis: AnalisisImagenYOLO_DTO) => void;
}

export function AnalisisTableRow({ analisis, onViewDetails }: AnalisisTableRowProps) {
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
          leftSection={
            analisis.es_valido ? (
              <IconCheck size={14} />
            ) : (
              <IconX size={14} />
            )
          }
        >
          {analisis.mensaje}
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
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            {analisis.nombreCultivo}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            {analisis.sector}
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
                  ({cantidad})
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
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          onClick={() => onViewDetails(analisis)}
        >
          <IconEye size={18} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}