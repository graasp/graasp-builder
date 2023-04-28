import { differenceInDays, intlFormat, intlFormatDistance } from 'date-fns';

import { DEFAULT_LOCALE } from '../config/constants';

// todo: move to sdk
// eslint-disable-next-line import/prefer-default-export
export const formatDate = (
  datetime: Date,
  args: { locale?: string; defaultValue?: string } = {
    locale: DEFAULT_LOCALE,
    defaultValue: 'Unknown',
  },
): string => {
  const { locale, defaultValue } = args;
  if (!datetime) {
    return defaultValue;
  }
  try {
    const now = new Date();

    // return human readable date if less than a month ago
    if (differenceInDays(now, datetime) < 7) {
      return intlFormatDistance(datetime, now, { locale });
    }

    // compute best intl date
    return intlFormat(
      datetime,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
      { locale },
    );
  } catch (e) {
    console.error(e);
    return defaultValue;
  }
};
