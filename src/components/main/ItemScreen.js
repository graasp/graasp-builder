import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { hooks } from '../../config/queryClient';
import {
  getMembership,
  isItemUpdateAllowedForUser,
} from '../../utils/membership';
import ErrorAlert from '../common/ErrorAlert';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { LayoutContext } from '../context/LayoutContext';
import ItemContent from '../item/ItemContent';
import ItemMain from '../item/ItemMain';
import ItemSettings from '../item/settings/ItemSettings';
import ItemSharingTab from '../item/sharing/ItemSharingTab';
import Main from './Main';

const { useItem, useItemMemberships } = hooks;

const ItemScreen = () => {
  const { itemId } = useParams();
  const { data: item, isError } = useItem(itemId);

  const {
    isItemSettingsOpen,
    setEditingItemId,
    setIsItemSettingsOpen,
    setIsItemSharingOpen,
    isItemSharingOpen,
  } = useContext(LayoutContext);
  const { data: currentMember } = useContext(CurrentUserContext);
  const { data: memberships } = useItemMemberships([itemId]);

  useEffect(() => {
    setEditingItemId(null);
    setIsItemSettingsOpen(false);
    setIsItemSharingOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!itemId || !item || isError) {
    return <ErrorAlert />;
  }

  const enableEdition = isItemUpdateAllowedForUser({
    memberships: getMembership(memberships),
    memberId: currentMember?.get('id'),
  });

  const content = (() => {
    if (enableEdition && isItemSettingsOpen) {
      return <ItemSettings item={item} />;
    }
    if (isItemSharingOpen) {
      return (
        <ItemSharingTab item={item} memberships={getMembership(memberships)} />
      );
    }
    return <ItemContent item={item} enableEdition={enableEdition} />;
  })();

  return (
    <Main>
      <ItemMain item={item}>{content}</ItemMain>
    </Main>
  );
};

export default ItemScreen;
