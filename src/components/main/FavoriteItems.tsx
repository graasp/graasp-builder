import { List } from 'immutable';

import Box from '@mui/material/Box';

import { useEffect } from 'react';

import { GraaspError } from '@graasp/sdk';
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
  // Whenever we have a change in the favorite items, we check for any deleted items and remove them
  // this effect does not take effect if there is only one (deleted) item
  useEffect(() => {
    if (data?.errors) {
      // remove errors from array
      const errorIds = data.errors
        .toJS()
        .map((e: GraaspError) => (e?.data as any)?.id);
      editMember({
        id: member.id,
        extra: {
          favoriteItems: member.extra.favoriteItems
            ?.filter((id) => !errorIds.includes(id))
            .toArray(),
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
