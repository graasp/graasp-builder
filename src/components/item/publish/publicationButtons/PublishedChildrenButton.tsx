import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import PublicationButton from './PublicationButton';

export const PublishedChildrenButton = (): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <PublicationButton
      isLoading={false}
      description={t(BUILDER.LIBRARY_SETTINGS_CHILD_PUBLISHED_STATUS)}
    />
  );
};

export default PublishedChildrenButton;
