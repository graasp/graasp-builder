import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const ForbiddenText = ({ id }) => {
  const { t } = useTranslation();

  return (
    <Typography id={id} variant="h3" align="center">
      {t('You cannot access this item')}
    </Typography>
  );
};

ForbiddenText.propTypes = {
  id: PropTypes.string,
};

ForbiddenText.defaultProps = {
  id: null,
};

export default ForbiddenText;
