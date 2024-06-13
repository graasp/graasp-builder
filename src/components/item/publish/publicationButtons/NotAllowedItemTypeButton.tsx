import { Alert } from '@mui/material';

import { PublishableItemTypeChecker } from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

export const NotAllowedItemTypeButton = (): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { t: translateEnum } = useEnumsTranslation();

  const allowedTypes = PublishableItemTypeChecker.getAllowedTypes();
  const translatedAllowedTypes = allowedTypes
    .map((e) => translateEnum(e))
    .join(', ');

  return (
    <Alert severity="info">
      {t(BUILDER.LIBRARY_SETTINGS_TYPE_NOT_ALLOWED_STATUS, {
        allowedItemTypes: translatedAllowedTypes,
        count: allowedTypes.length,
      })}
    </Alert>
  );
};

export default NotAllowedItemTypeButton;
