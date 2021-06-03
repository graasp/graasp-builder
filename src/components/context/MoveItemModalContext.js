import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { TREE_PREVENT_SELECTION } from '../../enums';
import TreeModal from '../main/TreeModal';
import { MOVE_ITEM_MUTATION_KEY } from '../../config/keys';

const MoveItemModalContext = React.createContext();

const MoveItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const { mutate: moveItem } = useMutation(MOVE_ITEM_MUTATION_KEY);

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
    moveItem(payload);
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
