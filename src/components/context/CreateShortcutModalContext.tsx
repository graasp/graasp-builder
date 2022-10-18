import { RecordOf } from 'immutable';

import { FC, createContext, useMemo, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item, ItemType } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { TREE_MODAL_MY_ITEMS_ID } from '../../config/selectors';
import { buildShortcutExtra } from '../../utils/itemExtra';
import TreeModal from '../main/TreeModal';

const CreateShortcutModalContext = createContext({
  openModal: () => {
    // do nothing
  },
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

const CreateShortcutModalProvider: FC<Props> = ({ children }) => {
  const { t } = useBuilderTranslation();
  const { mutate: createShortcut } = useMutation<any, any, any>(
    MUTATION_KEYS.POST_ITEM,
  );
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<RecordOf<Item>>();

  const openModal = (newItem) => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
  };

  const onConfirm = ({ id: target, to }) => {
    const shortcut = {
      name: t(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, { name: item.name }),
      extra: buildShortcutExtra(target[0]),
      type: ItemType.SHORTCUT,
    };
    // set parent id if not root
    if (to !== TREE_MODAL_MY_ITEMS_ID) {
      shortcut.parentId = to;
    }
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
        title={t(BUILDER.CREATE_SHORTCUT_MODAL_TITLE)}
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
