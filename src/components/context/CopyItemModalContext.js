import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import TreeModal from '../main/TreeModal';
import { COPY_ITEM_MUTATION_KEY } from '../../config/keys';

const CopyItemModalContext = React.createContext();

const CopyItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const { mutate: copyItem } = useMutation(COPY_ITEM_MUTATION_KEY);
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
    copyItem(payload);
    onClose();
  };

  const renderModal = () => {
    if (!itemId) {
      return null;
    }

    return (
      <TreeModal
        onClose={onClose}
        open={open}
        itemId={itemId}
        onConfirm={onConfirm}
        title={t('Where do you want to copy this item?')}
      />
    );
  };

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
