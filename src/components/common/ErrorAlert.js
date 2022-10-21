import PropTypes from 'prop-types';

import Alert from '@mui/material/Alert';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';

const ErrorAlert = ({ id }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Alert id={id} severity="error">
      {translateBuilder(BUILDER.ERROR_MESSAGE)}
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
