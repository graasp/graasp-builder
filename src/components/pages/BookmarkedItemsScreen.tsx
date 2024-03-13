import { Box } from '@mui/material';

import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  BOOKMARKED_ITEMS_ID,
  FAVORITE_ITEMS_ERROR_ALERT_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';

const BookmarkedItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    data,
    isLoading: isItemsLoading,
    isError,
  } = hooks.useBookmarkedItems();
  const { shouldDisplayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const filteredData = data?.filter((d) => shouldDisplayItem(d.item.type));

  if (filteredData) {
    return (
      <Box m={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={BOOKMARKED_ITEMS_ID}
          title={translateBuilder(BUILDER.BOOKMARKED_ITEMS_TITLE)}
          items={filteredData.map((d) => d.item)}
        />
      </Box>
    );
  }

  if (isItemsLoading) {
    return <Loader />;
  }
  if (isError) {
    return <ErrorAlert id={FAVORITE_ITEMS_ERROR_ALERT_ID} />;
  }
  return null;
};

const BookmarkedItemsScreen = (): JSX.Element => (
  <BookmarkedItemsLoadableContent />
);

export default BookmarkedItemsScreen;
