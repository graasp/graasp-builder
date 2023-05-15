import { createContext, useMemo, useState } from 'react';

import {
  DiscriminatedItem,
  Item,
  ItemType,
  ShortcutItemType,
} from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { TREE_MODAL_MY_ITEMS_ID } from '../../config/selectors';
import { buildShortcutExtra } from '../../utils/itemExtra';
import TreeModal from '../main/TreeModal';

const CreateShortcutModalContext = createContext({
  openModal: (_newItem: Item) => {
    // do nothing
  },
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

const CreateShortcutModalProvider = ({ children }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: createShortcut } = mutations.usePostItem();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<Item>();

  const openModal = (newItem: Item) => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
  };

  const onConfirm = ({ ids: [target], to }: { ids: string[]; to: string }) => {
    const shortcut: Partial<ShortcutItemType> &
      Pick<DiscriminatedItem, 'name' | 'type'> & {
        parentId?: string;
      } = {
      name: translateBuilder(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, {
        name: item.name,
      }),
      extra: buildShortcutExtra(target),
      type: ItemType.SHORTCUT,
      // set parent id if not root
      parentId: to !== TREE_MODAL_MY_ITEMS_ID ? to : undefined,
    };
    createShortcut(shortcut);

    onClose();
  };

  const renderModal = () => {
    if (!item) {
      return null;
    }

    return (
      <TreeModal
        onClose={onClose}
        open={open}
        itemIds={[item.id]}
        onConfirm={onConfirm}
        title={translateBuilder(BUILDER.CREATE_SHORTCUT_MODAL_TITLE)}
      />
    );
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <CreateShortcutModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </CreateShortcutModalContext.Provider>
  );
};

export { CreateShortcutModalProvider, CreateShortcutModalContext };
