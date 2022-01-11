import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { HOME_PATH } from '../../config/paths';
import { REDIRECT_URL_LOCAL_STORAGE_KEY } from '../../config/constants';
import RedirectionContent from '../common/RedirectionContent';

const Redirect = () => {
  const navigate = useNavigate();

  const nextPath =
    localStorage.getItem(REDIRECT_URL_LOCAL_STORAGE_KEY) ?? HOME_PATH;

  useEffect(() => {
    navigate(nextPath);
  });

  return <RedirectionContent link={nextPath} />;
};

export default Redirect;
