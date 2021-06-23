import React from 'react';
import { useHistory } from 'react-router';
import { HOME_PATH } from '../../config/paths';
import { REDIRECT_URL_LOCAL_STORAGE_KEY } from '../../config/constants';
import RedirectionContent from '../common/RedirectionContent';

const Redirect = () => {
  const { push } = useHistory();

  const nextPath =
    localStorage.getItem(REDIRECT_URL_LOCAL_STORAGE_KEY) ?? HOME_PATH;

  push(nextPath);

  return <RedirectionContent link={nextPath} />;
};

export default Redirect;
