import React, { useMemo, useState } from 'react';
import { validate } from 'uuid';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MUTATION_KEYS } from '@graasp/query-client';
import { TREE_PREVENT_SELECTION } from '../../enums';
import { useMutation } from '../../config/queryClient';
import TreeModal from '../main/TreeModal';

const MoveItemModalContext = React.createContext();

const MoveItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
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
        title={t('Where do you want to move this item?')}
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
