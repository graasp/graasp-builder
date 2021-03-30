import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import configureStore from '../store/configure';
import i18nConfig from '../config/i18n';

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
});

const { store } = configureStore();

const Root = () => (
  <I18nextProvider i18n={i18nConfig}>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </I18nextProvider>
);

export default Root;
