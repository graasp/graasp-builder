import { Alert } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

export const PendingButton = (): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Alert severity="info">
      {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_AUTOMATIC)}
    </Alert>
  );
};

export default PendingButton;
