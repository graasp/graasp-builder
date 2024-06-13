import { Alert } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

export const PublishedChildrenButton = (): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Alert severity="success">
      {t(BUILDER.LIBRARY_SETTINGS_CHILD_PUBLISHED_STATUS)}
    </Alert>
  );
};

export default PublishedChildrenButton;
