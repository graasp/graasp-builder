import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { hooks } from '../../config/queryClient';
import { isItemUpdateAllowedForUser } from '../../utils/membership';
import ErrorAlert from '../common/ErrorAlert';
import { LayoutContext } from '../context/LayoutContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemSettings from '../item/settings/ItemSettings';

const { useItem, useCurrentMember, useItemMemberships } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isError } = useItem(itemId);

  const {
    isItemSettingsOpen,
    setEditingItemId,
    setIsItemSettingsOpen,
  } = useContext(LayoutContext);
  const { data: currentMember } = useCurrentMember();
  const { data: memberships } = useItemMemberships(itemId);
  const enableEdition = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.get('id'),
  });

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
    <>
      <ItemMain item={item}>
        {enableEdition && isItemSettingsOpen ? (
          <ItemSettings item={item} />
        ) : (
          <ItemContent item={item} enableEdition={enableEdition} />
        )}
      </ItemMain>
    </>
  );
};

export default ItemScreen;
