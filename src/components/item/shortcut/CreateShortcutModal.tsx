import { useState } from 'react';

import {
  DiscriminatedItem,
  ItemType,
  ShortcutItemType,
  buildShortcutExtra,
} from '@graasp/sdk';

import { mutations } from '@/config/queryClient';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../../config/i18n';
import { BUILDER } from '../../../langs/constants';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../main/itemSelectionModal/ItemSelectionModal';

export type Props = {
  item: DiscriminatedItem;
  onClose: () => void;
  open: boolean;
};

const CreateShortcutModal = ({
  item: defaultItem,
  onClose,
  open,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: createShortcut } = mutations.usePostItem();
  const [item] = useState<DiscriminatedItem>(defaultItem);

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (destination) => {
    const target = item.id; // id of the item where the shortcut is pointing

    const shortcut: Partial<ShortcutItemType> &
      Pick<DiscriminatedItem, 'name' | 'type'> & {
        parentId?: string;
      } = {
      name: translateBuilder(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, {
        name: item?.name,
      }),
      extra: buildShortcutExtra(target),
      type: ItemType.SHORTCUT,
      parentId: destination,
    };

    createShortcut(shortcut);
    onClose();
  };

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder,
      translateKey: BUILDER.CREATE_SHORTCUT_BUTTON,
      name,
    });

  if (item && open) {
    return (
      <ItemSelectionModal
        titleKey={BUILDER.CREATE_SHORTCUT_MODAL_TITLE}
        buttonText={buttonText}
        onClose={onClose}
        open={open}
        onConfirm={onConfirm}
        itemIds={[item.id]}
      />
    );
  }

  return null;
};

export default CreateShortcutModal;
