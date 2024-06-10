import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import PublicationButton from './PublicationButton';

export const PendingButton = (): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <PublicationButton
      isLoading={false}
      description={t(
        BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_AUTOMATIC,
      )}
    />
  );
};

export default PendingButton;
