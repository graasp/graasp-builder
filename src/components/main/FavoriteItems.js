import { List } from 'immutable';

import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Loader } from '@graasp/ui';

import { hooks, useMutation } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  FAVORITE_ITEMS_ID,
} from '../../config/selectors';
import {
  containsNonExistingItems,
  getErrorItemIds,
  getExistingItems,
} from '../../utils/item';
import { getFavoriteItems } from '../../utils/member';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import Main from './Main';

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
  } = hooks.useItems(getFavoriteItems(member.extra).toJS());
  const mutation = useMutation(MUTATION_KEYS.EDIT_MEMBER);

  // Whenever we have a change in the favorite items, we check for any deleted items and remove them
  // this effect does not take effect if there is only one (deleted) item
  useEffect(() => {
    if (!favoriteItems.isEmpty() && containsNonExistingItems(favoriteItems)) {
      const errorIds = getErrorItemIds(favoriteItems);
      mutation.mutate({
        id: member.id,
        extra: {
          favoriteItems: member.extra.favoriteItems?.filter(
            (id) => !errorIds.includes(id),
          ),
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
      <ItemHeader showNavigation={false} />
      {renderContent()}
    </Main>
  );
};

export default FavoriteItems;
