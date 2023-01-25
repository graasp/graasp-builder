import { List } from 'immutable';

import Box from '@mui/material/Box';

import { FC, useContext, useEffect } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ItemRecord } from '@graasp/query-client/dist/types';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { hooks, useMutation } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_ERROR_ALERT_ID,
  FAVORITE_ITEMS_ID,
} from '../../config/selectors';
import { getFavoriteItems } from '../../utils/member';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import ItemHeader from '../item/header/ItemHeader';
import Items from './Items';
import Main from './Main';

// todo: find other possible solutions
// todo: improve types with refactor
export const getExistingItems = (
  items: List<ItemRecord & { statusCode?: number }>,
): List<ItemRecord> => items.filter((item) => !item.statusCode);

// todo: improve types with refactor
export const containsNonExistingItems = (
  items: List<Item & { statusCode?: number }>,
): boolean => items.some((item) => Boolean(item.statusCode));

// todo: improve types with refactor
export const getErrorItemIds = (
  items: List<Item & { data?: Error; statusCode?: number }>,
): List<Error> =>
  items.filter((item) => item.statusCode).map((item) => item.data);

const FavoriteItems: FC = () => {
  const { t: translateBuilder } = useBuilderTranslation();
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
  const mutation = useMutation<
    unknown,
    unknown,
    {
      id: string;
      extra: {
        favoriteItems: string[];
      };
    }
  >(MUTATION_KEYS.EDIT_MEMBER);

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
        title={translateBuilder(BUILDER.FAVORITE_ITEMS_TITLE)}
        items={getExistingItems(favoriteItems)}
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
