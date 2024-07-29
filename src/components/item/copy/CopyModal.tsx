import { DiscriminatedItem } from '@graasp/sdk';

import { mutations } from '@/config/queryClient';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../../config/i18n';
import { BUILDER } from '../../../langs/constants';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../main/itemSelectionModal/ItemSelectionModal';

export const CopyModal = ({
  itemIds,
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  itemIds: DiscriminatedItem['id'][];
}): JSX.Element | null => {
  const { mutate: copyItems } = mutations.useCopyItems();
  const { t: translateBuilder } = useBuilderTranslation();

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    copyItems({
      ids: itemIds,
      to: destination,
    });
    onClose();
  };

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder,
      translateKey: BUILDER.COPY_BUTTON,
      name,
    });

  // prevent loading if not opened
  if (!open) {
    return null;
  }

  return (
    <ItemSelectionModal
      titleKey={BUILDER.COPY_ITEM_MODAL_TITLE}
      buttonText={buttonText}
      onClose={onClose}
      open={open}
      onConfirm={onConfirm}
      itemIds={itemIds}
    />
  );
};
