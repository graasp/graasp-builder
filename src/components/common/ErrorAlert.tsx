import { Alert } from '@mui/material';

import { useBuilderTranslation } from '../../config/i18n';
import { BUILDER } from '../../langs/constants';

type Props = {
  id?: string;
};

const ErrorAlert = ({ id }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Alert id={id} severity="error">
      {translateBuilder(BUILDER.ERROR_MESSAGE)}
    </Alert>
  );
};

export default ErrorAlert;
