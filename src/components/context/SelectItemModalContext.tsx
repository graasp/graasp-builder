import { createContext, useMemo, useState } from 'react';

import { validate } from 'uuid';

import { useBuilderTranslation } from '../../config/i18n';
import { TreePreventSelection } from '../../enums';
import { BUILDER } from '../../langs/constants';
import type { TreeModalProps } from '../main/TreeModal';
import TreeModal from '../main/TreeModal';

type Value = {
  openModal?: (ids: string[]) => void;
  selId?: string;
  cleanItemSel?: () => void;
};
const SelectItemModalContext = createContext<Value>({});

const SelectItemModalProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const [open, setOpen] = useState(false);
  const [itemIds, setItemIds] = useState<string[] | null>(null);
  const [selId, setItemId] = useState<string>('');

  const openModal = (newItemIds: string[]) => {
    setOpen(true);
    setItemIds(newItemIds);
  };

  const cleanItemSel = () => {
    setItemId('');
  };

  const onClose = () => {
    setOpen(false);
    setItemIds(null);
  };

  const onConfirm: TreeModalProps['onConfirm'] = (payload) => {
    // change item's root id to null
    const newPayload = {
      ...payload,
      to: payload.to && validate(payload.to) ? payload.to : undefined,
    };

    if (newPayload.to) {
      setItemId(newPayload.to);
    } else {
      setItemId('');
    }
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
        title={translateBuilder(BUILDER.SELECT_TEMPLATE_TITLE)}
      />
    );
  };

  const value = useMemo<Value>(
    () => ({ openModal, selId, cleanItemSel }),
    [selId],
  );

  return (
    <SelectItemModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </SelectItemModalContext.Provider>
  );
};

export { SelectItemModalProvider, SelectItemModalContext };
