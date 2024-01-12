import { useEffect, useState } from 'react';

import { IconButtonProps } from '@mui/material/IconButton';

import {
  ActionButton,
  ActionButtonVariant,
  MoveButton as GraaspMoveButton,
} from '@graasp/ui';

import { hooks, mutations } from '@/config/queryClient';
import { applyEllipsisOnLength, getDirectParentId } from '@/utils/item';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MOVE_BUTTON_CLASS,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { NavigationElement } from '../main/itemSelectionModal/Breadcrumbs';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../main/itemSelectionModal/ItemSelectionModal';

const TITLE_MAX_NAME_LENGTH = 15;

type MoveButtonProps = {
  itemIds: string[];
  color?: IconButtonProps['color'];
  id?: string;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const MoveButton = ({
  itemIds: defaultItemsIds,
  color = 'default',
  id,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: MoveButtonProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: moveItems } = mutations.useMoveItems();

  const [open, setOpen] = useState(false);
  const [itemIds, setItemIds] = useState<string[]>(defaultItemsIds || []);

  const { data: items } = hooks.useItems(itemIds);

  const openMoveModal = (newItemIds: string[]) => {
    setOpen(true);
    setItemIds(newItemIds);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (payload) => {
    // change item's root id to null
    const newPayload = {
      ids: itemIds,
      to: payload,
    };
    moveItems(newPayload);
    onClose();
  };
  useEffect(() => {
    // necessary to sync prop with a state because move-many-items' targets are updated dynamically with the table
    setItemIds(defaultItemsIds);
  }, [defaultItemsIds]);

  const handleMove = () => {
    openMoveModal(itemIds);
    onClick?.();
  };

  const isDisabled = (item: NavigationElement, homeId: string) => {
    // cannot move inside self
    const moveInSelf = itemIds.includes(item.id);

    // cannot move in same direct parent
    // todo: not opti because we only have the ids from the table
    const directParentIds = Object.values(items?.data ?? {})?.map((i) =>
      getDirectParentId(i.path),
    );
    const moveInDirectParent = directParentIds?.includes(item.id);

    // cannot move to home if was already on home
    let moveToHome = false;

    if (items?.data) {
      moveToHome =
        item.id === homeId &&
        !getDirectParentId(Object.values(items.data)[0].path);
    }
    return moveInSelf || moveInDirectParent || moveToHome;
  };

  const title = items
    ? translateBuilder(BUILDER.MOVE_ITEM_MODAL_TITLE, {
        name: applyEllipsisOnLength(
          Object.values(items.data)[0].name,
          TITLE_MAX_NAME_LENGTH,
        ),
        count: itemIds.length,
      })
    : translateBuilder(BUILDER.MOVE_ITEM_MODAL_TITLE);

  const buttonText = (name?: string) =>
    translateBuilder(BUILDER.MOVE_BUTTON, { name, count: name ? 1 : 0 });

  return (
    <>
      <GraaspMoveButton
        color={color}
        type={type}
        id={id}
        onClick={handleMove}
        text={translateBuilder(BUILDER.MOVE_BUTTON)}
        menuItemClassName={ITEM_MENU_MOVE_BUTTON_CLASS}
        iconClassName={ITEM_MOVE_BUTTON_CLASS}
      />

      {items?.data && open && (
        <ItemSelectionModal
          title={title}
          isDisabled={isDisabled}
          buttonText={buttonText}
          onClose={onClose}
          open={open}
          onConfirm={onConfirm}
          items={Object.values(items.data)}
        />
      )}
    </>
  );
};

export default MoveButton;
