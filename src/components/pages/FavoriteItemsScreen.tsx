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
import ItemHeader from '../item/header/ItemHeader';
import Items from '../main/Items';
import Main from '../main/Main';

const FavoriteItemsLoadableContent = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data, isLoading: isItemsLoading, isError } = hooks.useFavoriteItems();

  if (data) {
    return (
      <Box m={2}>
        <ItemHeader showNavigation={false} />
        <Items
          id={FAVORITE_ITEMS_ID}
          title={translateBuilder(BUILDER.FAVORITE_ITEMS_TITLE)}
          items={data.map((d) => d.item as DiscriminatedItem)}
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

const FavoriteItemsScreen = (): JSX.Element => (
  <Main>
    <FavoriteItemsLoadableContent />
  </Main>
);

export default FavoriteItemsScreen;
