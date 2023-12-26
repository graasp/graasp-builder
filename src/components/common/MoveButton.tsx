import { useEffect, useState } from 'react';

import { IconButtonProps } from '@mui/material/IconButton';

import {
  ActionButton,
  ActionButtonVariant,
  MoveButton as GraaspMoveButton,
} from '@graasp/ui';

import { validate } from 'uuid';

import { mutations } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import {
  HOME_MODAL_ITEM_ID,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  ITEM_MOVE_BUTTON_CLASS,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import TreeModal, { TreeModalProps } from '../main/MoveTreeModal';

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
    setItemIds([]);
  };

  const onConfirm: TreeModalProps['onConfirm'] = (payload) => {
    // change item's root id to null
    const newPayload = {
      ...payload,
      to:
        payload.to && payload.to !== HOME_MODAL_ITEM_ID && validate(payload.to)
          ? payload.to
          : undefined,
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

      {itemIds.length && open && (
        <TreeModal
          onClose={onClose}
          open={open}
          itemIds={itemIds}
          onConfirm={onConfirm}
          title={BUILDER.MOVE_ITEM_MODAL_TITLE}
        />
      )}
    </>
  );
};

export default MoveButton;
