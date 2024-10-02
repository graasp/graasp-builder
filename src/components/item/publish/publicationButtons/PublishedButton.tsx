import LinkIcon from '@mui/icons-material/Link';
import { LoadingButton } from '@mui/lab';
import { Alert, Button } from '@mui/material';

import {
  ClientHostManager,
  Context,
  PackedItem,
  PublicationStatus,
} from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { buildItemPublicationButton } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import PublicationButton from './PublicationButton';

type Props = {
  item: PackedItem;
  isLoading: boolean;
};

const { useUnpublishItem } = mutations;

export const PublishedButton = ({ item, isLoading }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { id: itemId } = item;

  const { mutate: unpublish, isPending: isUnPublishing } = useUnpublishItem();

  const handleUnPublishItem = () => unpublish({ id: itemId });

  const getLibraryLink = () => {
    const clientHostManager = ClientHostManager.getInstance();
    return clientHostManager.getItemLink(Context.Library, itemId);
  };

  const description = (
    <Alert>{t(BUILDER.LIBRARY_SETTINGS_PUBLISHED_STATUS)}</Alert>
  );

  return (
    <PublicationButton isLoading={isLoading} description={description}>
      <LoadingButton
        key={BUILDER.LIBRARY_SETTINGS_UNPUBLISH_BUTTON}
        variant="outlined"
        loading={isUnPublishing}
        onClick={handleUnPublishItem}
        data-cy={buildItemPublicationButton(PublicationStatus.Published)}
      >
        {t(BUILDER.LIBRARY_SETTINGS_UNPUBLISH_BUTTON)}
      </LoadingButton>
      <Button
        key={BUILDER.LIBRARY_SETTINGS_VIEW_LIBRARY_BUTTON}
        variant="contained"
        startIcon={<LinkIcon />}
        href={getLibraryLink()}
        target="_blank"
      >
        {t(BUILDER.LIBRARY_SETTINGS_VIEW_LIBRARY_BUTTON)}
      </Button>
    </PublicationButton>
  );
};

export default PublishedButton;
