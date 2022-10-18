import '@uppy/core/dist/style.css';
import 'ag-grid-community/dist/styles/ag-grid.min.css';
import 'ag-grid-community/dist/styles/ag-theme-material.min.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme as GraaspTheme } from '@graasp/ui';

import { ENV, NODE_ENV, SHOW_NOTIFICATIONS } from '../config/constants';
import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  queryClient,
} from '../config/queryClient';
import App from './App';
import { CurrentUserContextProvider } from './context/CurrentUserContext';
import ModalProviders from './context/ModalProviders';

const theme = createTheme(GraaspTheme);

const Root: FC = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <ThemeProvider theme={theme}>
        {SHOW_NOTIFICATIONS && (
          <ToastContainer position="bottom-right" theme="colored" />
        )}
        <Router>
          <ModalProviders>
            <CurrentUserContextProvider>
              <App />
            </CurrentUserContextProvider>
          </ModalProviders>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
    {NODE_ENV === ENV.DEVELOPMENT && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default Root;
