import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { theme as GraaspTheme } from '@graasp/ui';

import '@ag-grid-community/styles/ag-grid.min.css';
import '@ag-grid-community/styles/ag-theme-material.min.css';
import * as Sentry from '@sentry/react';
import '@uppy/core/dist/style.css';

import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  queryClient,
} from '../config/queryClient';
import App from './App';
import FallbackComponent from './Fallback';
import { CurrentUserContextProvider } from './context/CurrentUserContext';
import { FilterItemsContextProvider } from './context/FilterItemsContext';
import ModalProviders from './context/ModalProviders';

const Root = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <ThemeProvider theme={GraaspTheme}>
        <CssBaseline />
        <ToastContainer position="bottom-right" theme="colored" />
        <Router>
          <Sentry.ErrorBoundary fallback={<FallbackComponent />}>
            <ModalProviders>
              <CurrentUserContextProvider>
                <FilterItemsContextProvider>
                  <App />
                </FilterItemsContextProvider>
              </CurrentUserContextProvider>
            </ModalProviders>
          </Sentry.ErrorBoundary>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
    {import.meta.env.DEV && import.meta.env.MODE !== 'test' && (
      <ReactQueryDevtools position="bottom-right" />
    )}
  </QueryClientProvider>
);

export default Root;
