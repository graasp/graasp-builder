import { List } from 'immutable';

import Box from '@mui/material/Box';

import { useEffect } from 'react';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, mutations } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  FAVORITE_ITEMS_ID,
} from '../../config/selectors';
import { getFavoriteItems } from '../../utils/member';
import ErrorAlert from '../common/ErrorAlert';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import Main from './Main';

const FavoriteItems = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const {
    data: member,
    isLoading: isMemberLoading,
    isError: isMemberError,
  } = useCurrentUserContext();
  const {
    data,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = hooks.useItems([...new Set(getFavoriteItems(member).toArray())]);
  const { mutate: editMember } = mutations.useEditMember();
  // if we get an error while fetching the favorite items
  // we replace the favorite item table with the fetched items
  // bug: this might fail for time out
  useEffect(() => {
    if (data?.errors?.size && data?.data) {
      editMember({
        id: member.id,
        extra: {
          favoriteItems: Object.values(data.data.toJS()).map(({ id }) => id),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
        items={data?.data?.toSeq()?.toList() as List<ItemRecord>}
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
