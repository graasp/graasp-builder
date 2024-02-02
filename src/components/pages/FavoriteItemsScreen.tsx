import Box from '@mui/material/Box';

import { DiscriminatedItem } from '@graasp/sdk';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  FAVORITE_ITEMS_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useFilterItemsContext } from '../context/FilterItemsContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';

const FavoriteItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data, isLoading: isItemsLoading, isError } = hooks.useFavoriteItems();
  const { displayItem } = useFilterItemsContext();
  // TODO: implement filter in the hooks directly ?
  const filteredData = data?.filter((d) => displayItem(d.item.type));

  if (filteredData) {
    return (
      <Box m={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={FAVORITE_ITEMS_ID}
          title={translateBuilder(BUILDER.FAVORITE_ITEMS_TITLE)}
          items={filteredData.map((d) => d.item as DiscriminatedItem)}
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

const FavoriteItemsScreen = (): JSX.Element => <FavoriteItemsLoadableContent />;

export default FavoriteItemsScreen;
