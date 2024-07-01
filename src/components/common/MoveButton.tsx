import { useState } from 'react';

import { DiscriminatedItem, PackedItem } from '@graasp/sdk';
import {
  ActionButton,
  ActionButtonVariant,
  ColorVariants,
  MoveButton as GraaspMoveButton,
  type NavigationElement,
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
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../main/itemSelectionModal/ItemSelectionModal';

type MoveButtonProps = {
  items: PackedItem[];
  color?: ColorVariants;
  id?: string;
  type?: ActionButtonVariant;
  onClick?: () => void;
};

const MoveButton = ({
  items,
  color = 'primary',
  id,
  type = ActionButton.ICON_BUTTON,
  onClick,
}: MoveButtonProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: moveItems } = mutations.useMoveItems();

  const [open, setOpen] = useState(false);

  const openMoveModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    moveItems({
      items,
      to: destination,
    });
    onClose();
  };

  const handleMove = () => {
    openMoveModal();
    onClick?.();
  };

  const isDisabled = (
    itemsArray: DiscriminatedItem[],
    item: NavigationElement,
    homeId: string,
  ) => {
    if (itemsArray?.length) {
      // cannot move inside self and below
      const moveInSelf = itemsArray.some((i) => item.path.includes(i.path));

      // cannot move in same direct parent
      // todo: not opti because we only have the ids from the table
      const directParentIds = itemsArray.map((i) => getDirectParentId(i.path));
      const moveInDirectParent = directParentIds.includes(item.id);

      // cannot move to home if was already on home
      let moveToHome = false;

      moveToHome = item.id === homeId && !getDirectParentId(itemsArray[0].path);

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
      {items.length && open && (
        <ItemSelectionModal
          titleKey={BUILDER.MOVE_ITEM_MODAL_TITLE}
          isDisabled={isDisabled}
          buttonText={buttonText}
          onClose={onClose}
          open={open}
          onConfirm={onConfirm}
          itemIds={items.map((i) => i.id)}
        />
      )}
    </>
  );
};

export default MoveButton;
