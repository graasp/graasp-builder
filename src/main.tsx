import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';

import {
  BUILDER_ITEMS_PREFIX,
  ClientHostManager,
  Context,
  LIBRARY_ITEMS_PREFIX,
  PLAYER_ITEMS_PREFIX,
  hasAcceptedCookies,
} from '@graasp/sdk';

import * as Sentry from '@sentry/react';

import pkg from '../package.json';
import Root from './components/Root';
import {
  APP_VERSION,
  GA_MEASUREMENT_ID,
  GRAASP_LIBRARY_HOST,
  GRAASP_PLAYER_HOST,
  SENTRY_DSN,
  SENTRY_ENV,
} from './config/env';
import { SENTRY_TRACE_SAMPLE_RATE } from './config/sentry';

if (GA_MEASUREMENT_ID && hasAcceptedCookies() && import.meta.env.PROD) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
}

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  environment: SENTRY_ENV,
  release: `${pkg.name}@${APP_VERSION}`,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
});

// Add the hosts of the different clients
ClientHostManager.getInstance()
  .addPrefix(Context.Builder, BUILDER_ITEMS_PREFIX)
  .addPrefix(Context.Library, LIBRARY_ITEMS_PREFIX)
  .addPrefix(Context.Player, PLAYER_ITEMS_PREFIX)
  .addHost(Context.Builder, new URL(window.location.origin))
  .addHost(Context.Library, new URL(GRAASP_LIBRARY_HOST))
  .addHost(Context.Player, new URL(GRAASP_PLAYER_HOST));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
