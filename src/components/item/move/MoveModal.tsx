import { DiscriminatedItem, PackedItem } from '@graasp/sdk';
import { type NavigationElement } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { getDirectParentId } from '@/utils/item';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../../config/i18n';
import { BUILDER } from '../../../langs/constants';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../main/itemSelectionModal/ItemSelectionModal';

type MoveButtonProps = {
  items?: PackedItem[];
  open: boolean;
  onClose: () => void;
};

export const MoveModal = ({
  onClose,
  items,
  open,
}: MoveButtonProps): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: moveItems } = mutations.useMoveItems();

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    if (items) {
      moveItems({
        items,
        to: destination,
      });
    }
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

  // prevent loading if not opened
  if (!open) {
    return null;
  }

  return items ? (
    <ItemSelectionModal
      titleKey={BUILDER.MOVE_ITEM_MODAL_TITLE}
      isDisabled={isDisabled}
      buttonText={buttonText}
      onClose={onClose}
      open={open}
      onConfirm={onConfirm}
      itemIds={items.map((i) => i.id)}
    />
  ) : null;
};
