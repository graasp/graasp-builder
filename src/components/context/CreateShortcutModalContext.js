import PropTypes from 'prop-types';

import { createContext, useMemo, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { ROOT_ID } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { ITEM_TYPES } from '../../enums';
import { buildShortcutExtra } from '../../utils/itemExtra';
import TreeModal from '../main/TreeModal';

const CreateShortcutModalContext = createContext();

const CreateShortcutModalProvider = ({ children }) => {
  const { t } = useBuilderTranslation();
  const { mutate: createShortcut } = useMutation(MUTATION_KEYS.POST_ITEM);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(false);

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
      type: ITEM_TYPES.SHORTCUT,
    };
    // set parent id if not root
    if (to !== ROOT_ID) {
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

CreateShortcutModalProvider.propTypes = {
  children: PropTypes.node,
};

CreateShortcutModalProvider.defaultProps = {
  children: null,
};

export { CreateShortcutModalProvider, CreateShortcutModalContext };
