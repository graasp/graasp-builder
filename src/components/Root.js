import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
  },
});

const Root = () => {
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </div>
  );
};

export default Root;
