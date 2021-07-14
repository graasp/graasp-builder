import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { hooks } from '../../config/queryClient';
import ErrorAlert from '../common/ErrorAlert';
import { LayoutContext } from '../context/LayoutContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemSettings from '../item/settings/ItemSettings';
import Main from './Main';

const { useItem } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isError } = useItem(itemId);

  const {
    isItemSettingsOpen,
    setEditingItemId,
    setIsItemSettingsOpen,
  } = useContext(LayoutContext);

  useEffect(
    () => {
      setEditingItemId(null);
      setIsItemSettingsOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemId],
  );

  if (!itemId || !item || isError) {
    return <ErrorAlert />;
  }

  return (
    <Main>
      <ItemMain item={item}>
        {isItemSettingsOpen ? (
          <ItemSettings item={item} />
        ) : (
          <ItemContent item={item} />
        )}
      </ItemMain>
    </Main>
  );
};

export default ItemScreen;
