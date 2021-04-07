import Alert from '@material-ui/lab/Alert';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ErrorAlert = ({ id }) => {
  const { t } = useTranslation();
  return (
    <Alert id={id} severity="error">
      {t('An error occured.')}
    </Alert>
  );
};

ErrorAlert.propTypes = {
  id: PropTypes.string,
};
ErrorAlert.defaultProps = {
  id: null,
};

export default ErrorAlert;
