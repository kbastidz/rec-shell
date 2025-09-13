import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';


const basename = import.meta.env.PROD ? '/rec-shell' : '';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
   <StrictMode>
    <MantineProvider>
      <ModalsProvider> 
        <Notifications /> 
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ModalsProvider> 
    </MantineProvider>
  </StrictMode>
);
