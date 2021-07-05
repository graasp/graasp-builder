import React, { useEffect } from 'react';
import { List } from 'immutable';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import {
  FAVORITE_ITEMS_ID,
  FAVORITE_ITEMS_ERROR_ALERT_ID,
} from '../../config/selectors';
import { hooks, useMutation } from '../../config/queryClient';
import ErrorAlert from '../common/ErrorAlert';
import Loader from '../common/Loader';
import Main from './Main';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import {
  containsNonExistingItems,
  getErrorItemIds,
  getExistingItems,
} from '../../utils/item';

const FavoriteItems = () => {
  const { t } = useTranslation();
  const {
    data: member,
    isLoading: isMemberLoading,
    isError: isMemberError,
  } = hooks.useCurrentMember();
  const {
    data: favoriteItems = List(),
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = hooks.useItems(member.get('extra').favoriteItems);

  const mutation = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  useEffect(() => {
    if (!favoriteItems.isEmpty() && containsNonExistingItems(favoriteItems)) {
      const errorIds = getErrorItemIds(favoriteItems);
      mutation.mutate({
        id: member.get('id'),
        extra: {
          favoriteItems: member
            .get('extra')
            .favoriteItems?.filter((id) => !errorIds.includes(id)),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteItems]);

  if (isMemberError || isItemsError) {
    return <ErrorAlert id={FAVORITE_ITEMS_ERROR_ALERT_ID} />;
  }

  if (isMemberLoading || isItemsLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <ItemHeader />
      <Items
        id={FAVORITE_ITEMS_ID}
        title={t('Favorite Items')}
        items={getExistingItems(favoriteItems)}
      />
    </Main>
  );
};

export default FavoriteItems;
