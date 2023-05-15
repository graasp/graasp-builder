import { validate } from 'uuid';

import { createContext, useContext, useMemo, useState } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import TreeModal from '../main/TreeModal';

type CopyItemModalContextType = {
  openModal: (newItemIds: string[]) => void;
};

const CopyItemModalContext = createContext<CopyItemModalContextType>({
  openModal: () => null,
});

type Props = {
  children: JSX.Element;
};

export const CopyItemModalProvider = ({ children }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: copyItems } = mutations.useCopyItems();
  const [open, setOpen] = useState<boolean>(false);
  const [itemIds, setItemIds] = useState<string[]>([]);

  const openModal = (newItemIds: string[]) => {
    setOpen(true);
    setItemIds(newItemIds);
  };

  const onClose = () => {
    setOpen(false);
    setItemIds([]);
  };

  const onConfirm = (payload: { ids: string[]; to: string }) => {
    // change item's root id to null
    const newPayload = {
      ...payload,
      to: !validate(payload.to) ? undefined : payload.to,
    };
    copyItems(newPayload);
    onClose();
  };

  const renderModal = () => {
    if (!itemIds.length) {
      return null;
    }

    return (
      <TreeModal
        onClose={onClose}
        open={open}
        itemIds={itemIds}
        onConfirm={onConfirm}
        title={translateBuilder(BUILDER.COPY_ITEM_MODAL_TITLE)}
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

export const useCopyItemModalContext = (): CopyItemModalContextType =>
  useContext(CopyItemModalContext);
