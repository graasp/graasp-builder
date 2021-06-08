import React from 'react';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { HOME_PATH } from '../../config/paths';
import { REDIRECT_URL_LOCAL_STORAGE_KEY } from '../../config/constants';

const Redirect = () => {
  const { push } = useHistory();
  const { t } = useTranslation();

  const nextPath =
    localStorage.getItem(REDIRECT_URL_LOCAL_STORAGE_KEY) ?? HOME_PATH;

  push(nextPath);

  return (
    <div>
      <Link to={nextPath}>
        <Typography>
          {t('Click here if you are not automatically redirected')}
        </Typography>
      </Link>
    </div>
  );
};

export default Redirect;
