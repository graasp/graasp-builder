// hack to have the text editor styles available without having to bundle them with graasp/ui
import 'katex/dist/katex.min.css';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { CssBaseline } from '@mui/material';

import { getCurrentAccountLang } from '@graasp/sdk';
import { DEFAULT_LANG, langs } from '@graasp/translations';
import { ThemeProvider } from '@graasp/ui';

import * as Sentry from '@sentry/react';

import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import App from './App';
import FallbackComponent from './Fallback';
import { CurrentUserContextProvider } from './context/CurrentUserContext';
import { FilterItemsContextProvider } from './context/FilterItemsContext';
import ModalProviders from './context/ModalProviders';

const ThemeWrapper = () => {
  const { data: currentMember } = hooks.useCurrentMember();

  return (
    <ThemeProvider
      langs={langs}
      languageSelectSx={{ mb: 2, mr: 2 }}
      i18n={i18nConfig}
      defaultDirection={i18nConfig.dir(
        getCurrentAccountLang(currentMember, DEFAULT_LANG),
      )}
    >
      <CssBaseline />
      <ToastContainer stacked position="bottom-left" theme="colored" />
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
  );
};

const Root = (): JSX.Element => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nConfig}>
        <ThemeWrapper />
      </I18nextProvider>
      {import.meta.env.DEV && import.meta.env.MODE !== 'test' && (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  </HelmetProvider>
);

export default Root;
