import PropTypes from 'prop-types';
import { validate } from 'uuid';

import { createContext, useMemo, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import { TREE_PREVENT_SELECTION } from '../../enums';
import TreeModal from '../main/TreeModal';

const MoveItemModalContext = createContext();

const MoveItemModalProvider = ({ children }) => {
  const { t } = useBuilderTranslation();
  const { mutate: moveItems } = useMutation(MUTATION_KEYS.MOVE_ITEMS);

  const [open, setOpen] = useState(false);
  const [itemIds, setItemIds] = useState(false);

  const openModal = (newItemIds) => {
    setOpen(true);
    setItemIds(newItemIds);
  };

  const onClose = () => {
    setOpen(false);
    setItemIds(null);
  };

  const onConfirm = (payload) => {
    // change item's root id to null
    const newPayload = {
      ...payload,
      to: !validate(payload.to) ? null : payload.to,
    };
    moveItems(newPayload);
    onClose();
  };

  const renderModal = () => {
    if (!itemIds || !itemIds.length) {
      return null;
    }

    return (
      <TreeModal
        prevent={TREE_PREVENT_SELECTION.SELF_AND_CHILDREN}
        onClose={onClose}
        open={open}
        itemIds={itemIds}
        onConfirm={onConfirm}
        title={t(BUILDER.MOVE_ITEM_MODAL_TITLE)}
      />
    );
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <MoveItemModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </MoveItemModalContext.Provider>
  );
};

MoveItemModalProvider.propTypes = {
  children: PropTypes.node,
};

MoveItemModalProvider.defaultProps = {
  children: null,
};

export { MoveItemModalProvider, MoveItemModalContext };
