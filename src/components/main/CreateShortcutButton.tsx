import { useState } from 'react';

import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { ListItemIcon, MenuItem } from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  ShortcutItemType,
  buildShortcutExtra,
} from '@graasp/sdk';

import { mutations } from '@/config/queryClient';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../config/i18n';
import { ITEM_MENU_SHORTCUT_BUTTON_CLASS } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { NavigationElement } from './itemSelectionModal/Breadcrumbs';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from './itemSelectionModal/ItemSelectionModal';

export type Props = {
  item: DiscriminatedItem;
  onClick?: () => void;
};

const CreateShortcutButton = ({
  item: defaultItem,
  onClick,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: createShortcut } = mutations.usePostItem();
  const [open, setOpen] = useState<boolean>(false);
  const [item, setItem] = useState<DiscriminatedItem>(defaultItem);

  const openShortcutModal = (newItem: DiscriminatedItem) => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (payload) => {
    const to = payload; // place where to save the shortcut
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
      parentId: to,
    };

    createShortcut(shortcut);
    onClose();
  };

  const handleShortcut = () => {
    openShortcutModal(item);
    onClick?.();
  };

  // The shortcut button is never disabled
  const isDisabled = (
    _items: DiscriminatedItem[],
    _item: NavigationElement,
    _homeId: string,
  ) => false;

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder,
      translateKey: BUILDER.CREATE_SHORTCUT_BUTTON,
      name,
    });

  return (
    <>
      <MenuItem
        onClick={handleShortcut}
        className={ITEM_MENU_SHORTCUT_BUTTON_CLASS}
      >
        <ListItemIcon>
          <LabelImportantIcon />
        </ListItemIcon>
        {translateBuilder(BUILDER.ITEM_MENU_CREATE_SHORTCUT_MENU_ITEM)}
      </MenuItem>

      {item && open && (
        <ItemSelectionModal
          titleKey={BUILDER.CREATE_SHORTCUT_MODAL_TITLE}
          isDisabled={isDisabled}
          buttonText={buttonText}
          onClose={onClose}
          open={open}
          onConfirm={onConfirm}
          itemIds={[item.id]}
        />
      )}
    </>
  );
};

export default CreateShortcutButton;
