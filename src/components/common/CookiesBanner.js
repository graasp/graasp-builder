import React from 'react';
import { CookiesBanner } from '@graasp/ui';
import { COOKIE_KEYS } from '@graasp/sdk';
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();

  return (
    <CookiesBanner
      acceptText={t('Accept all')}
      declineButtonText={t('Reject non-essential')}
      cookieName={COOKIE_KEYS.ACCEPT_COOKIES_KEY}
      text={t(
        `We use cookies and other tracking technologies to improve your browsing experience on our website, to analyze our website traffic, and to understand where our visitors are coming from. By browsing our website, you consent to our use of cookies and other tracking technologies.`,
      )}
    />
  );
};

export default Component;
