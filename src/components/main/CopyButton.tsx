import { useState } from 'react';

import {
  ActionButtonVariant,
  ColorVariants,
  CopyButton as GraaspCopyButton,
} from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEM_COPY_BUTTON_CLASS,
  ITEM_MENU_COPY_BUTTON_CLASS,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from './itemSelectionModal/ItemSelectionModal';

export type Props = {
  color?: ColorVariants;
  id?: string;
  onClick?: () => void;
  type?: ActionButtonVariant;
  itemIds: string[];
};

const CopyButton = ({
  itemIds,
  color,
  id,
  type,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: copyItems } = mutations.useCopyItems();
  const [open, setOpen] = useState<boolean>(false);

  const openCopyModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    copyItems({
      ids: itemIds,
      to: destination,
    });
    onClose();
  };

  const handleCopy = () => {
    openCopyModal();
    onClick?.();
  };

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder,
      translateKey: BUILDER.COPY_BUTTON,
      name,
    });

  return (
    <>
      <GraaspCopyButton
        type={type}
        id={id}
        text={translateBuilder(BUILDER.COPY_BUTTON)}
        color={color}
        iconClassName={ITEM_COPY_BUTTON_CLASS}
        menuItemClassName={ITEM_MENU_COPY_BUTTON_CLASS}
        onClick={handleCopy}
      />

      {itemIds && open && (
        <ItemSelectionModal
          titleKey={BUILDER.COPY_ITEM_MODAL_TITLE}
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

export default CopyButton;
