import { createContext, useMemo, useState } from 'react';

import { validate } from 'uuid';

import { TREE_MODAL_MY_ITEMS_ID } from '@/config/selectors';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { BUILDER } from '../../langs/constants';
import TreeModal from '../main/MoveTreeModal';
import type { TreeModalProps } from '../main/TreeModal';

type Value = {
  openModal?: (ids: string[]) => void;
};

const MoveItemModalContext = createContext<Value>({});

const MoveItemModalProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: moveItems } = mutations.useMoveItems();

  const [open, setOpen] = useState(false);
  const [itemIds, setItemIds] = useState<string[] | null>(null);

  const openModal = (newItemIds: string[]) => {
    setOpen(true);
    setItemIds(newItemIds);
  };

  const onClose = () => {
    setOpen(false);
    setItemIds(null);
  };

  const onConfirm: TreeModalProps['onConfirm'] = (payload) => {
    // change item's root id to null
    const newPayload = {
      ...payload,
      to:
        payload.to &&
        payload.to !== TREE_MODAL_MY_ITEMS_ID &&
        validate(payload.to)
          ? payload.to
          : undefined,
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
        onClose={onClose}
        open={open}
        itemIds={itemIds}
        onConfirm={onConfirm}
        title={translateBuilder(BUILDER.MOVE_ITEM_MODAL_TITLE)}
      />
    );
  };

  const value = useMemo<Value>(() => ({ openModal }), []);

  return (
    <MoveItemModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </MoveItemModalContext.Provider>
  );
};

export { MoveItemModalProvider, MoveItemModalContext };
