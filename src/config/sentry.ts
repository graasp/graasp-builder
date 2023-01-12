import { ENV, NODE_ENV } from './constants';

const generateSentryConfig = () => {
  let SENTRY_ENVIRONMENT = ENV.DEVELOPMENT;
  let SENTRY_TRACE_SAMPLE_RATE = 1.0;
  switch (NODE_ENV) {
    case ENV.PRODUCTION:
      SENTRY_ENVIRONMENT = ENV.PRODUCTION;
      SENTRY_TRACE_SAMPLE_RATE = 0.1;
      break;
    case ENV.TEST:
      SENTRY_TRACE_SAMPLE_RATE = 0.0;
      break;
    case ENV.DEVELOPMENT:
      SENTRY_TRACE_SAMPLE_RATE = 0.0;
      break;
    default:
  }

  return { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE };
};

export const { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } =
  generateSentryConfig();
