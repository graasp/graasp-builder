import Alert from '@mui/material/Alert';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';

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
