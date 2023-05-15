import { validate } from 'uuid';

import { createContext, useMemo, useState } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { TreePreventSelection } from '../../enums';
import type { TreeModalProps } from '../main/TreeModal';
import TreeModal from '../main/TreeModal';

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
      to: !validate(payload.to) ? undefined : payload.to,
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
        prevent={TreePreventSelection.SELF_AND_CHILDREN}
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
