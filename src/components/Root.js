import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { QueryClientProvider } from 'react-query';
import ReduxToastr from 'react-redux-toastr';
import { grey } from '@material-ui/core/colors';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import configureStore from '../store/configure';
import i18nConfig from '../config/i18n';
import { SHOW_NOTIFICATIONS, NODE_ENV, ENV } from '../config/constants';
import queryClient from '../config/queryClient';

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

const { store } = configureStore();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18nConfig}>
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          {SHOW_NOTIFICATIONS && <ReduxToastr />}
          <App />
        </MuiThemeProvider>
      </Provider>
    </I18nextProvider>
    {NODE_ENV === ENV.DEVELOPMENT && <ReactQueryDevtools initialIsOpen />}
  </QueryClientProvider>
);

export default Root;
