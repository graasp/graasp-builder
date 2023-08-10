const generateSentryConfig = () => {
  const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENV;
  // when app is built, PROD will be true
  // when running the app with `yarn dev` it will be false
  const SENTRY_TRACE_SAMPLE_RATE = import.meta.env.PROD ? 0.5 : 0.0;

  return { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE };
};

export const { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } =
  generateSentryConfig();
