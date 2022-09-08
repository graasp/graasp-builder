import React, { useEffect } from 'react';
import { redirectToSavedUrl } from '@graasp/sdk';
import { RedirectionContent } from '@graasp/ui';
import { HOME_PATH } from '../../config/paths';

const Redirect = () => {
  useEffect(() => {
    redirectToSavedUrl(HOME_PATH);
  }, []);

  return <RedirectionContent link={HOME_PATH} />;
};

export default Redirect;
