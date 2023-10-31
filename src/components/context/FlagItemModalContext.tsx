import { createContext, useMemo, useState } from 'react';

import { routines } from '@graasp/query-client';
import { FlagType } from '@graasp/sdk';
import { ItemFlagDialog } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import notifier from '../../config/notifier';
import { mutations } from '../../config/queryClient';

const { postItemFlagRoutine } = routines;

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

  const openModal = (newItemId: string) => {
    setOpen(true);
    setItemId(newItemId);
  };

  const onClose = () => {
    setOpen(false);
    setItemId(null);
  };

  const onFlag = (newFlag?: FlagType) => {
    if (!itemId || !newFlag) {
      notifier({
        type: postItemFlagRoutine.FAILURE,
        payload: { error: new Error('item id or flag type is not defined') },
      });
    } else {
      postItemFlag({
        type: newFlag,
        itemId,
      });
    }
    onClose();
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <FlagItemModalContext.Provider value={value}>
      <ItemFlagDialog
        flags={Object.values(FlagType)}
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
