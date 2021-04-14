import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { moveItem } from '../../actions/item';
import { TREE_PREVENT_SELECTION } from '../../config/constants';
import TreeModal from '../main/TreeModal';

const MoveItemModalContext = React.createContext();

const MoveItemModalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    dispatch(moveItem(payload));
    onClose();
  };

  const renderModal = () => (
    <TreeModal
      prevent={TREE_PREVENT_SELECTION.SELF_AND_CHILDREN}
      onClose={onClose}
      open={open}
      itemId={itemId}
      onConfirm={onConfirm}
      title={t('Where do you want to copy this item?')}
    />
  );

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
