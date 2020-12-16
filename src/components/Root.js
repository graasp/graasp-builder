import React from 'react';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import configureStore from '../store/configure';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
  },
});

const { store } = configureStore();

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>
);

export default Root;
