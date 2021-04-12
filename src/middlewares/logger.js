import { setLogger } from 'react-query';

// Custom logger
setLogger({
  log: (e) => {
    // eslint-disable-next-line no-console
    console.log(e);
  },
  warn: (e) => {
    // eslint-disable-next-line no-console
    console.warn(e);
  },
  error: (e) => {
    console.error(e);
  },
});

// Sentry logger
// setLogger({
//   log: (message) => {
//     Sentry.captureMessage(message);
//   },
//   warn: (message) => {
//     Sentry.captureMessage(message);
//   },
//   error: (error) => {
//     Sentry.captureException(error);
//   },
// });
