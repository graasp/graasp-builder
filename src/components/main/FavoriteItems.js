import React, { useContext, useEffect } from 'react';
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
import { getFavoriteItems } from '../../utils/member';
import { CurrentUserContext } from '../context/CurrentUserContext';
import Authorization from '../common/Authorization';

const FavoriteItems = () => {
  const { t } = useTranslation();
  const {
    data: member,
    isLoading: isMemberLoading,
    isError: isMemberError,
  } = useContext(CurrentUserContext);
  const {
    data: favoriteItems = List(),
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = hooks.useItems(getFavoriteItems(member.get('extra')));

  const mutation = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  // Whenever we have a change in the favorite items, we check for any deleted items and remove them
  // this effect does not take effect if there is only one (deleted) item
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
        title={t('Favorite Items')}
        items={getExistingItems(favoriteItems)}
      />
    );
  };

  return (
    <Main>
      <ItemHeader />
      {renderContent()}
    </Main>
  );
};

export default Authorization()(FavoriteItems);
