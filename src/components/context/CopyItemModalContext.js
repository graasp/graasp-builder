import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import PropTypes from 'prop-types';
import { useMutation } from '../../config/queryClient';
import TreeModal from '../main/TreeModal';
import { ROOT_ID } from '../../config/constants';

const CopyItemModalContext = React.createContext();

const CopyItemModalProvider = ({ children }) => {
  const { t } = useTranslation();
  const { mutate: copyItems } = useMutation(MUTATION_KEYS.COPY_ITEMS);
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
    copyItems(newPayload);
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
        itemIds={itemId}
        onConfirm={onConfirm}
        title={t('Where do you want to copy this item?')}
      />
    );
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <CopyItemModalContext.Provider value={value}>
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
