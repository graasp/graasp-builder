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
