import { useEffect, useState } from 'react';

import { IconButtonProps } from '@mui/material/IconButton';

import { DiscriminatedItem } from '@graasp/sdk';
import {
  ActionButton,
  ActionButtonVariant,
  MoveButton as GraaspMoveButton,
} from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { getDirectParentId } from '@/utils/item';
import { computeButtonText } from '@/utils/itemSelection';

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

  const isDisabled = (
    items: DiscriminatedItem[],
    item: NavigationElement,
    homeId: string,
  ) => {
    if (items) {
      // cannot move inside self and below
      const moveInSelf = items.some((i) => item.path.includes(i.path));

      // cannot move in same direct parent
      // todo: not opti because we only have the ids from the table
      const directParentIds = items.map((i) => getDirectParentId(i.path));
      const moveInDirectParent = directParentIds.includes(item.id);

      // cannot move to home if was already on home
      let moveToHome = false;

      if (items) {
        moveToHome = item.id === homeId && !getDirectParentId(items[0].path);
      }
      return moveInSelf || moveInDirectParent || moveToHome;
    }
    return false;
  };

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder,
      translateKey: BUILDER.MOVE_BUTTON,
      name,
    });

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
      {itemIds && open && (
        <ItemSelectionModal
          titleKey={BUILDER.MOVE_ITEM_MODAL_TITLE}
          isDisabled={isDisabled}
          buttonText={buttonText}
          onClose={onClose}
          open={open}
          onConfirm={onConfirm}
          itemIds={itemIds}
        />
      )}
    </>
  );
};

export default MoveButton;
