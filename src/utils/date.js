import { DEFAULT_LOCALE } from '../config/constants';

// eslint-disable-next-line import/prefer-default-export
export const formatDate = (d) => {
  const datetime = new Date(d);
  const time = datetime.toLocaleTimeString(DEFAULT_LOCALE);
  const date = datetime.toLocaleDateString(DEFAULT_LOCALE);
  return `${date} ${time}`;
};
