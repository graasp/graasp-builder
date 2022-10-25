import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga4';

import { hasAcceptedCookies } from '@graasp/sdk';
import '@graasp/ui/dist/bundle.css';

// import Root from './components/Root';
import {
  ENV,
  GA_MEASUREMENT_ID,
  NODE_ENV,
  SENTRY_DSN,
} from './config/constants';
import { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } from './config/sentry';
import './index.css';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    environment: SENTRY_ENVIRONMENT,
    release: `${process.env.npm_package_name}@v${process.env.npm_package_version}`,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
  });
}

if (GA_MEASUREMENT_ID && hasAcceptedCookies() && NODE_ENV !== ENV.TEST) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send('pageview');
}

ReactDOM.render(<StrictMode />, document.getElementById('root'));
