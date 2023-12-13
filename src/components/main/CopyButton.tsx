import { MouseEventHandler, useEffect, useState } from 'react';

import { IconButtonProps } from '@mui/material';

import {
  ActionButtonVariant,
  CopyButton as GraaspCopyButton,
} from '@graasp/ui';

import { validate } from 'uuid';

import { mutations } from '@/config/queryClient';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_COPY_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import TreeModal, { TreeModalProps } from './TreeModal';

export type Props = {
  color?: IconButtonProps['color'];
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLLIElement>;
  type?: ActionButtonVariant;
  itemIds: string[];
};

const CopyButton = ({
  itemIds: defaultItemsIds,
  color,
  id,
  type,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: copyItems } = mutations.useCopyItems();
  const [open, setOpen] = useState<boolean>(false);
  const [itemIds, setItemIds] = useState<string[]>(defaultItemsIds || []);

  const openCopyModal = (newItemIds: string[]) => {
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
      to: payload.to && validate(payload.to) ? payload.to : undefined,
    };
    copyItems(newPayload);
    onClose();
  };

  const handleCopy: MouseEventHandler<HTMLButtonElement | HTMLLIElement> = (
    e,
  ) => {
    openCopyModal(itemIds);
    onClick?.(e);
  };

  useEffect(() => {
    setItemIds(defaultItemsIds);
  }, [defaultItemsIds]);

  return (
    <>
      <GraaspCopyButton
        type={type}
        id={id}
        text={translateBuilder(BUILDER.ITEM_COPY_BUTTON)}
        color={color}
        iconClassName={ITEM_COPY_BUTTON_CLASS}
        menuItemClassName={ITEM_MENU_COPY_BUTTON_CLASS}
        onClick={handleCopy}
      />

      <TreeModal
        onClose={onClose}
        open={open}
        itemIds={itemIds}
        onConfirm={onConfirm}
        title={translateBuilder(BUILDER.COPY_ITEM_MODAL_TITLE)}
        actionTitle={translateBuilder(BUILDER.ITEM_COPY_BUTTON)}
      />
    </>
  );
};

export default CopyButton;
