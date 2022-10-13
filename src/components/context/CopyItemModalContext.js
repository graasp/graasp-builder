import PropTypes from 'prop-types';
import { validate } from 'uuid';

import { createContext, useMemo, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { useMutation } from '../../config/queryClient';
import TreeModal from '../main/TreeModal';

const CopyItemModalContext = createContext();

const CopyItemModalProvider = ({ children }) => {
  const { t } = useBuilderTranslation();
  const { mutate: copyItems } = useMutation(MUTATION_KEYS.COPY_ITEMS);
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
    copyItems(newPayload);
    onClose();
  };

  const renderModal = () => {
    if (!itemIds || !itemIds.length) {
      return null;
    }

    return (
      <TreeModal
        onClose={onClose}
        open={open}
        itemIds={itemIds}
        onConfirm={onConfirm}
        title={t(BUILDER.COPY_ITEM_MODAL_TITLE)}
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
