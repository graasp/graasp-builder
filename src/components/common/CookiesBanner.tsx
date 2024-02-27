import { CookieKeys } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { CookiesBanner } from '@graasp/ui';

import { DOMAIN } from '@/config/env';

import { useCommonTranslation } from '../../config/i18n';

const Component = (): JSX.Element => {
  const { t } = useCommonTranslation();

  return (
    <CookiesBanner
      acceptText={t(COMMON.COOKIE_BANNER_ACCEPT_BUTTON)}
      declineButtonText={t(COMMON.COOKIE_BANNER_DECLINE_BUTTON)}
      cookieName={CookieKeys.AcceptCookies}
      text={t(COMMON.COOKIE_BANNER_TEXT)}
      domain={DOMAIN}
    />
  );
};

export default Component;
