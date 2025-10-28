import { useState } from 'react';
import { Container, Tabs, Paper, Title, Box } from '@mantine/core';
import { IconDice, IconTicket, IconWheel, IconBrain } from '@tabler/icons-react';
import { Bingo } from './Bingo';
import { RaspaGana } from './RaspaGana';
import { Ruleta } from './Ruleta';
import { Trivia } from './Trivia';


export  function Juegos() {
  const [activeTab, setActiveTab] = useState<string | null>('bingo');

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={1} mb="xl" ta="center">
          <span role="img" aria-label="celebración">🧩</span> Centro de Juegos
        </Title>

        <Tabs value={activeTab} onChange={setActiveTab} variant="pills">
          <Tabs.List grow mb="xl">
            <Tabs.Tab value="bingo" leftSection={<IconTicket size={20} />}>
              Bingo
            </Tabs.Tab>
            <Tabs.Tab value="raspa-gana" leftSection={<IconDice size={20} />}>
              Raspa y Gana
            </Tabs.Tab>
            <Tabs.Tab value="ruleta" leftSection={<IconWheel size={20} />}>
              Ruleta
            </Tabs.Tab>
            <Tabs.Tab value="trivia" leftSection={<IconBrain size={20} />}>
              Trivia
            </Tabs.Tab>
          </Tabs.List>

          <Box mt="xl">
            <Tabs.Panel value="bingo">
              <Bingo />
            </Tabs.Panel>

            <Tabs.Panel value="raspa-gana">
              <RaspaGana />
            </Tabs.Panel>

            <Tabs.Panel value="ruleta">
              <Ruleta />
            </Tabs.Panel>

            <Tabs.Panel value="trivia">
              <Trivia />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Paper>
    </Container>
  );
}