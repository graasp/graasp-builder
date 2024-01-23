import { useEffect } from 'react';

import { redirectToSavedUrl } from '@graasp/sdk';
import { RedirectionContent } from '@graasp/ui';

import { HOME_PATH } from '../../config/paths';

const Redirect = (): JSX.Element => {
  useEffect(() => {
    redirectToSavedUrl(window, HOME_PATH);
  }, []);

  return <RedirectionContent link={HOME_PATH} />;
};

export default Redirect;
