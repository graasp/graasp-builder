import '@uppy/core/dist/style.css';
import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-material.min.css';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme as GraaspTheme } from '@graasp/ui';

import { ENV, NODE_ENV } from '../config/constants';
import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  queryClient,
} from '../config/queryClient';
import App from './App';
import { CurrentUserContextProvider } from './context/CurrentUserContext';
import ModalProviders from './context/ModalProviders';

const Root = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <ThemeProvider theme={GraaspTheme}>
        <CssBaseline />
        {true && <ToastContainer position="bottom-right" theme="colored" />}
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
