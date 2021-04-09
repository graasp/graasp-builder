import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { copyItem } from '../../actions/item';
import TreeModal from '../main/TreeModal';

const CopyItemModalContext = React.createContext();

const CopyItemModalProvider = ({ children }) => {
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
    dispatch(copyItem(payload));
    onClose();
  };

  const renderModal = () => (
    <TreeModal
      onClose={onClose}
      open={open}
      itemId={itemId}
      onConfirm={onConfirm}
      title={t('Where do you want to copy this item?')}
    />
  );

  return (
    <CopyItemModalContext.Provider value={{ openModal }}>
      {renderModal()}
      {children}
    </CopyItemModalContext.Provider>
  );
};

CopyItemModalProvider.propTypes = {
  children: PropTypes.node,
};

CopyItemModalProvider.defaultProps = {
  children: null,
};

export { CopyItemModalProvider, CopyItemModalContext };
