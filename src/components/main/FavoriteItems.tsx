import Box from '@mui/material/Box';

import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  FAVORITE_ITEMS_ID,
} from '../../config/selectors';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import Main from './Main';

const FavoriteItems = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { isLoading: isMemberLoading, isError: isMemberError } =
    useCurrentUserContext();
  const {
    data = List(),
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = hooks.useFavoriteItems();

  const renderContent = () => {
    if (isMemberError || isItemsError) {
      return <ErrorAlert id={FAVORITE_ITEMS_ERROR_ALERT_ID} />;
    }

    if (isMemberLoading || isItemsLoading) {
      return <Loader />;
    }
    return (
      <Items
        id={FAVORITE_ITEMS_ID}
        title={translateBuilder(BUILDER.FAVORITE_ITEMS_TITLE)}
        items={data.map((d) => d.item)}
      />
    );
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
