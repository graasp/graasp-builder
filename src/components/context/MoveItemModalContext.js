import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MUTATION_KEYS } from '@graasp/query-client';
import { TREE_PREVENT_SELECTION } from '../../enums';
import { useMutation } from '../../config/queryClient';
import TreeModal from '../main/TreeModal';
import { ROOT_ID } from '../../config/constants';

const MoveItemModalContext = React.createContext();

const MoveItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const { mutate: moveItem } = useMutation(MUTATION_KEYS.MOVE_ITEM);

  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(false);

  const openModal = (newItemId) => {
    setOpen(true);
    setItemId(newItemId);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const onConfirm = (payload) => {
    // change item's root id to null
    const newPayload = {
      ...payload,
      to: payload.to === ROOT_ID ? null : payload.to,
    };
    moveItem(newPayload);
    onClose();
  };

  const renderModal = () => {
    if (!itemId) {
      return null;
    }

    return (
      <TreeModal
        prevent={TREE_PREVENT_SELECTION.SELF_AND_CHILDREN}
        onClose={onClose}
        open={open}
        itemId={itemId}
        onConfirm={onConfirm}
        title={t('Where do you want to copy this item?')}
      />
    );
  };

  return (
    <MoveItemModalContext.Provider value={{ openModal }}>
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
