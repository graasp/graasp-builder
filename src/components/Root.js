import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { grey } from '@material-ui/core/colors';
import { ToastContainer } from 'react-toastify';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';
import '@uppy/core/dist/style.css';

import App from './App';
import {
  QueryClientProvider,
  queryClient,
  ReactQueryDevtools,
} from '../config/queryClient';
import i18nConfig from '../config/i18n';
import { SHOW_NOTIFICATIONS, NODE_ENV, ENV } from '../config/constants';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5050d2',
      selected: '#cbcbef',
    },
    secondary: { main: '#ffffff' },
  },
  zIndex: {
    drawer: 1000,
  },
  overrides: {
    MuiAvatar: {
      colorDefault: {
        backgroundColor: grey[400],
      },
    },
  },
});

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <MuiThemeProvider theme={theme}>
        {SHOW_NOTIFICATIONS && (
          <ToastContainer position="bottom-right" theme="colored" />
        )}
        <App />
      </MuiThemeProvider>
    </I18nextProvider>
    {NODE_ENV === ENV.DEVELOPMENT && <ReactQueryDevtools />}
  </QueryClientProvider>
);

export default Root;
