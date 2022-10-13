import { FC } from 'react';

import { COOKIE_KEYS } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { CookiesBanner } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';

const Component: FC = () => {
  const { t } = useBuilderTranslation();

  return (
    <CookiesBanner
      acceptText={t(COMMON.COOKIE_BANNER_ACCEPT_BUTTON)}
      declineButtonText={t(COMMON.COOKIE_BANNER_DECLINE_BUTTON)}
      cookieName={COOKIE_KEYS.ACCEPT_COOKIES_KEY}
      text={t(COMMON.COOKIE_BANNER_TEXT)}
    />
  );
};

export default Component;
