import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';

import { hasAcceptedCookies } from '@graasp/sdk';
import '@graasp/ui/dist/bundle.css';

import { BrowserTracing, init as SentryInit } from '@sentry/react';

import pkg from '../package.json';
import Root from './components/Root';
import {
  APP_VERSION,
  GA_MEASUREMENT_ID,
  SENTRY_DSN,
  SENTRY_ENV,
} from './config/env';
import { SENTRY_TRACE_SAMPLE_RATE } from './config/sentry';

if (GA_MEASUREMENT_ID && hasAcceptedCookies() && import.meta.env.PROD) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
}

SentryInit({
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing()],
  environment: SENTRY_ENV,
  release: `${pkg.name}@${APP_VERSION}`,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
