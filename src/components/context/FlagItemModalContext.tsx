import { List } from 'immutable';

import { createContext, useMemo, useState } from 'react';

import { FlagType } from '@graasp/sdk';
import { ItemFlagDialog } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';

const FlagItemModalContext = createContext<{
  openModal?: (id: string) => void;
}>({});

const FlagItemModalProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: postItemFlag } = mutations.usePostItemFlag();
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);

  const openModal = (newItemId) => {
    setOpen(true);
    setItemId(newItemId);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const onFlag = (newFlag?: FlagType) => {
    postItemFlag({
      type: newFlag,
      itemId,
    });
    onClose();
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <FlagItemModalContext.Provider value={value}>
      <ItemFlagDialog
        flags={List(Object.values(FlagType))}
        onFlag={onFlag}
        open={open}
        onClose={onClose}
        descriptionText={translateBuilder(
          'Select reason for flagging this item',
        )}
        title={translateBuilder('Flag Item')}
        cancelButtonText={translateBuilder('Cancel')}
        confirmButtonText={translateBuilder('Flag')}
      />
      {children}
    </FlagItemModalContext.Provider>
  );
};

export { FlagItemModalProvider, FlagItemModalContext };
