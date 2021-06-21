import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { REDIRECTION_CONTENT_ID } from '../../config/selectors';

const RedirectionContent = ({ link }) => {
  const { t } = useTranslation();
  return (
    <Link to={link}>
      <Typography id={REDIRECTION_CONTENT_ID}>
        {t('Click here if you are not automatically redirected')}
      </Typography>
    </Link>
  );
};

RedirectionContent.propTypes = {
  link: PropTypes.string.isRequired,
};

export default RedirectionContent;
