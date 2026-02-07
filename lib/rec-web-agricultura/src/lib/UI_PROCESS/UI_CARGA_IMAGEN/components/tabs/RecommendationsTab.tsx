import React from 'react';
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Divider,
  Card,
  Progress,
  Accordion,
  Badge,
  Select,
  Loader,
  TextInput,
} from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { RecomendacionesGemini} from '../../../../types/yolo';

interface RecommendationsTabProps {
  recomendacionesGlobal: RecomendacionesGemini | null;
  isLoadingRecommendations: boolean;
  guardandoAnalisis: boolean;
  handleGuardarAnalisis: () => void;
  listCultivos: { value: string; label: string }[];
  nombreCultivo: string | null;
  setNombreCultivo: (value: string | null) => void;
  sector: string | null;
  setSector: (value: string | null) => void;
}

export const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  recomendacionesGlobal,
  isLoadingRecommendations,
  guardandoAnalisis,
  handleGuardarAnalisis,
  listCultivos,
  nombreCultivo,
  setNombreCultivo,
  sector,
  setSector,
}) => {
  return (
    <Paper shadow="sm" radius="lg" p="xl" style={{ background: 'white' }}>
      <Stack gap="lg">
        {isLoadingRecommendations ? (
          <Group justify="center" p="xl">
            <Loader size="lg" />
            <Text>Generando recomendaciones con IA...</Text>
          </Group>
        ) : recomendacionesGlobal ? (
          <>
            <Group justify="space-between">
              <div>
                <Title order={2} size="h3">
                  <span role="img" aria-label="recomendaciones">
                    🌱
                  </span>{' '}
                  Recomendaciones IA
                </Title>
                <Text size="sm" c="dimmed">
                  Análisis consolidado de todas las imágenes
                </Text>
              </div>
              <Button
                size="lg"
                radius="md"
                onClick={handleGuardarAnalisis}
                disabled={guardandoAnalisis || !nombreCultivo}
                loading={guardandoAnalisis}
                leftSection={<IconDeviceFloppy size={20} />}
                variant="gradient"
                gradient={{ from: '#11998e', to: '#38ef7d' }}
              >
                Guardar Análisis
              </Button>
            </Group>

            <Divider />

            {/* Selector de cultivo */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group>
                <Select
                  label="Cultivo"
                  placeholder="Seleccione un cultivo"
                  data={listCultivos}
                  value={nombreCultivo}
                  onChange={setNombreCultivo}
                  required
                  searchable
                  style={{ flex: 1 }}
                />
              </Group>
              <Group>
                <TextInput
                  label="Ingrese Sector"
                  placeholder="Sector Norte A-1"
                  onChange={(event) => setSector(event.currentTarget.value)}
                />
              </Group>
            </Card>

            <Divider />

            {/* Confianza general */}
            <Card radius="md" padding="lg" style={{ background: '#f8f9ff' }}>
              <Text size="sm" fw={600} mb="sm">
                Confianza General del Análisis
              </Text>
              <Group align="center" gap="md">
                <Progress
                  value={recomendacionesGlobal.confianza_general}
                  size="xl"
                  radius="xl"
                  style={{ flex: 1 }}
                  styles={{
                    section: {
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    },
                  }}
                />
                <Text
                  size="2rem"
                  fw={700}
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {recomendacionesGlobal.confianza_general}%
                </Text>
              </Group>
            </Card>

            {/* Deficiencias con Accordion */}
            <Accordion
              variant="separated"
              radius="md"
              defaultValue={recomendacionesGlobal.deficiencias[0]?.nombre}
            >
              {recomendacionesGlobal.deficiencias.map((deficiencia, idx) => (
                <Accordion.Item key={idx} value={deficiencia.nombre}>
                  <Accordion.Control>
                    <Group justify="space-between">
                      <Text size="md" fw={600}>
                        {deficiencia.nombre}
                      </Text>
                      <Badge
                        variant="gradient"
                        gradient={{ from: '#667eea', to: '#764ba2' }}
                      >
                        {deficiencia.confianza.toFixed(1)}%
                      </Badge>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      {/* Tratamiento inmediato */}
                      <div>
                        <Text size="sm" fw={600} mb="xs" c="red">
                          <span role="img" aria-label="tratamiento">
                            🚨
                          </span>{' '}
                          Tratamiento Inmediato
                        </Text>
                        <Paper
                          p="sm"
                          radius="md"
                          style={{ background: '#fff5f5' }}
                        >
                          <Stack gap={5}>
                            {deficiencia.recomendaciones.tratamiento_inmediato.map(
                              (t, i) => (
                                <Text key={i} size="sm">
                                  • {t}
                                </Text>
                              )
                            )}
                          </Stack>
                        </Paper>
                      </div>

                      {/* Fertilizantes */}
                      <div>
                        <Text size="sm" fw={600} mb="xs" c="blue">
                          <span role="img" aria-label="fertilizantes">
                            💊
                          </span>{' '}
                          Fertilizantes Recomendados
                        </Text>
                        <Paper
                          p="sm"
                          radius="md"
                          style={{ background: '#f0f7ff' }}
                        >
                          <Stack gap={5}>
                            {deficiencia.recomendaciones.fertilizantes_recomendados.map(
                              (f, i) => (
                                <Text key={i} size="sm">
                                  • {f}
                                </Text>
                              )
                            )}
                          </Stack>
                        </Paper>
                      </div>

                      {/* Preventivas */}
                      <div>
                        <Text size="sm" fw={600} mb="xs" c="green">
                          <span role="img" aria-label="medidas preventivas">
                            🛡️
                          </span>{' '}
                          Medidas Preventivas
                        </Text>
                        <Paper
                          p="sm"
                          radius="md"
                          style={{ background: '#f0fff4' }}
                        >
                          <Stack gap={5}>
                            {deficiencia.recomendaciones.medidas_preventivas.map(
                              (m, i) => (
                                <Text key={i} size="sm">
                                  • {m}
                                </Text>
                              )
                            )}
                          </Stack>
                        </Paper>
                      </div>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </>
        ) : (
          <Text ta="center" c="dimmed" py="xl">
            No hay recomendaciones generadas aún
          </Text>
        )}
      </Stack>
    </Paper>
  );
};