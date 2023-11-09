import { createContext, useMemo, useState } from 'react';

import { routines } from '@graasp/query-client';
import { FlagType } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { ItemFlagDialog } from '@graasp/ui';

import { BUILDER } from '@/langs/constants';

import { useBuilderTranslation, useCommonTranslation } from '../../config/i18n';
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
  const { t: translateCommon } = useCommonTranslation();
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
        descriptionText={translateBuilder(BUILDER.FLAG_REASON_DESCRIPTION)}
        title={translateBuilder(BUILDER.FLAG_MODAL_TITLE)}
        cancelButtonText={translateCommon(COMMON.CANCEL_BUTTON)}
        confirmButtonText={translateBuilder(BUILDER.FLAG_MODAL_CONFIRM)}
      />
      {children}
    </FlagItemModalContext.Provider>
  );
};

export { FlagItemModalProvider, FlagItemModalContext };
