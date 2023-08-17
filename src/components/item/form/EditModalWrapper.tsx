import { ComponentType as CT, Dispatch, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { routines } from '@graasp/query-client';
import { DiscriminatedItem } from '@graasp/sdk';
import { BUILDER, COMMON, FAILURE_MESSAGES } from '@graasp/translations';

import CancelButton from '@/components/common/CancelButton';
import { DOUBLE_CLICK_DELAY_MS } from '@/config/constants';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import notifier from '@/config/notifier';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  EDIT_MODAL_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';
import { isItemValid } from '@/utils/item';

const { editItemRoutine } = routines;

export interface EditModalContentPropType {
  item?: DiscriminatedItem;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
  updatedProperties: Partial<DiscriminatedItem>;
}

export type EditModalContentType = CT<EditModalContentPropType>;

type Props = {
  ComponentType: EditModalContentType;
  open: boolean;

  item: DiscriminatedItem;
  setOpen: Dispatch<boolean>;
};

const EditModalWrapper = ({
  item,
  setOpen,
  ComponentType,
  open,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();

  const { mutate: editItem } = mutations.useEditItem();

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedProperties, setUpdatedItem] = useState<
    Partial<DiscriminatedItem>
  >({});
  const [isConfirmButtonDisabled, setConfirmButtonDisabled] = useState(false);

  const submit = () => {
    if (isConfirmButtonDisabled) {
      return;
    }
    if (
      !isItemValid({
        ...item,
        ...updatedProperties,
      } as DiscriminatedItem)
    ) {
      toast.error<string>(translateBuilder(BUILDER.EDIT_ITEM_ERROR_MESSAGE));
      return;
    }

    setConfirmButtonDisabled(true);
    // add id to changed properties

    if (!item?.id) {
      notifier({
        type: editItemRoutine.FAILURE,
        payload: { error: new Error(FAILURE_MESSAGES.UNEXPECTED_ERROR) },
      });
    } else {
      editItem({ id: item.id, ...updatedProperties });
    }

    setOpen(false);
  };

  const setChanges = (payload: Partial<DiscriminatedItem>) => {
    setUpdatedItem({ ...updatedProperties, ...payload } as DiscriminatedItem);
  };

  const onClose = () => {
    setOpen(false);
    setUpdatedItem({});
    // schedule button disable state reset AFTER end of click event handling
    // todo: factor out this logic to graasp-ui
    setTimeout(() => setConfirmButtonDisabled(false), DOUBLE_CLICK_DELAY_MS);
  };

  return (
    <Dialog
      id={EDIT_MODAL_ID}
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id={item?.id}>
        {translateBuilder(BUILDER.EDIT_ITEM_MODAL_TITLE, { name: item.name })}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ComponentType
          updatedProperties={updatedProperties}
          setChanges={setChanges}
          item={item}
        />
      </DialogContent>
      <DialogActions>
        <CancelButton id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID} onClick={onClose} />
        <Button
          // should not allow users to save if the item is not valid
          disabled={
            // maybe we do not need the state variable and can just check the item
            isConfirmButtonDisabled ||
            // isItem Valid checks a full item, so we add the updated properties to the item to check
            !isItemValid({
              ...item,
              ...updatedProperties,
            } as DiscriminatedItem)
          }
          onClick={submit}
          id={ITEM_FORM_CONFIRM_BUTTON_ID}
        >
          {translateCommon(COMMON.SAVE_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditModalWrapper;
