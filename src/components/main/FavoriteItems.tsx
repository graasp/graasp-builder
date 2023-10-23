import Box from '@mui/material/Box';

import { ItemRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  FAVORITE_ITEMS_ID,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import Main from './Main';

const FavoriteItems = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { isLoading: isMemberLoading } = useCurrentUserContext();
  const { data, isLoading: isItemsLoading } = hooks.useFavoriteItems();
  const renderContent = () => {
    if (data) {
      return (
        <Items
          id={FAVORITE_ITEMS_ID}
          title={translateBuilder(BUILDER.FAVORITE_ITEMS_TITLE)}
          items={data.map((d) => d.item) as List<ItemRecord>}
        />
      );
    }

    if (isMemberLoading || isItemsLoading) {
      return <Loader />;
    }
    return <ErrorAlert id={FAVORITE_ITEMS_ERROR_ALERT_ID} />;
  };

  return (
    <Main>
      <Box mx={2}>
        <ItemHeader showNavigation={false} />
        {renderContent()}
      </Box>
    </Main>
  );
};

export default FavoriteItems;
