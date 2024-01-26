import { Box } from '@mui/material';

import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  PUBLISHED_ITEMS_ERROR_ALERT_ID,
  PUBLISHED_ITEMS_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';
import Main from '../main/Main';

const PublishedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = useCurrentUserContext();
  const {
    data: sharedItems,
    isLoading,
    isError,
  } = hooks.usePublishedItemsForMember(member?.id);

  if (sharedItems) {
    return (
      <Box m={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={PUBLISHED_ITEMS_ID}
          title={translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}
          items={sharedItems ?? []}
        />
      </Box>
    );
  }

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorAlert id={PUBLISHED_ITEMS_ERROR_ALERT_ID} />;
  }
  return null;
};

const PublishedItemsScreen = (): JSX.Element => (
  <Main>
    <PublishedItemsLoadableContent />
  </Main>
);

export default PublishedItemsScreen;
