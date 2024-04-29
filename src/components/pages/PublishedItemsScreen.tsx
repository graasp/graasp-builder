import { Helmet } from 'react-helmet';

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
import { useFilterItemsContext } from '../context/FilterItemsContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';

const PublishedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: member } = useCurrentUserContext();
  const {
    data: publishedItems,
    isLoading,
    isError,
  } = hooks.usePublishedItemsForMember(member?.id);
  const { shouldDisplayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const filteredData = publishedItems?.filter((d) => shouldDisplayItem(d.type));

  if (filteredData) {
    return (
      <>
        <Helmet>
          <title>{translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}</title>
        </Helmet>
        <Box m={2}>
          <ItemHeader showNavigation={false} />
          <Items
            id={PUBLISHED_ITEMS_ID}
            title={translateBuilder(BUILDER.PUBLISHED_ITEMS_TITLE)}
            items={filteredData ?? []}
          />
        </Box>
      </>
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
  <PublishedItemsLoadableContent />
);

export default PublishedItemsScreen;
