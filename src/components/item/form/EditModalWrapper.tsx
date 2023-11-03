import { ComponentType as CT, Dispatch, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { routines } from '@graasp/query-client';
import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON, FAILURE_MESSAGES } from '@graasp/translations';

import isEqual from 'lodash.isequal';

import CancelButton from '@/components/common/CancelButton';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import notifier from '@/config/notifier';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';
import { isItemValid } from '@/utils/item';

import { BUILDER } from '../../../langs/constants';

const { editItemRoutine } = routines;

export interface EditModalContentPropType {
  item?: DiscriminatedItem;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
  updatedProperties: Partial<DiscriminatedItem>;
}
export type EditModalContentType = CT<EditModalContentPropType>;

type Props = {
  ComponentType: EditModalContentType;

  item: DiscriminatedItem;
  setOpen: Dispatch<boolean>;
};

const EditModalWrapper = ({
  item,
  setOpen,
  ComponentType,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();

  const { mutate: editItem } = mutations.useEditItem();

  // updated properties are separated from the original item
  // so only necessary properties are sent when editing
  const [updatedItem, setUpdatedItem] = useState<DiscriminatedItem>(item);

  const onClose = () => {
    setOpen(false);
  };

  const submit = () => {
    if (
      !isItemValid({
        ...item,
        ...updatedItem,
      } as DiscriminatedItem)
    ) {
      toast.error<string>(translateBuilder(BUILDER.EDIT_ITEM_ERROR_MESSAGE));
      return;
    }

    // add id to changed properties
    if (!item?.id) {
      notifier({
        type: editItemRoutine.FAILURE,
        payload: { error: new Error(FAILURE_MESSAGES.UNEXPECTED_ERROR) },
      });
    } else {
      editItem({
        id: updatedItem.id,
        name: updatedItem.name,
        description: updatedItem.description,
        // only post extra if it has been changed
        // todo: fix type
        extra: !isEqual(item.extra, updatedItem.extra)
          ? (updatedItem.extra as any)
          : undefined,
      });
    }

    onClose();
  };

  const setChanges = (payload: Partial<DiscriminatedItem>) => {
    setUpdatedItem({ ...updatedItem, ...payload } as DiscriminatedItem);
  };

  return (
    <>
      <DialogTitle id={item?.id}>
        {translateBuilder(BUILDER.EDIT_ITEM_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ComponentType
          updatedProperties={updatedItem}
          setChanges={setChanges}
          item={item}
        />
      </DialogContent>
      <DialogActions>
        <CancelButton id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID} onClick={onClose} />
        <Button
          // should not allow users to save if the item is not valid
          disabled={
            // // maybe we do not need the state variable and can just check the item
            // isConfirmButtonDisabled ||
            // isItem Valid checks a full item, so we add the updated properties to the item to check
            !isItemValid({
              ...item,
              ...updatedItem,
            })
          }
          onClick={submit}
          id={ITEM_FORM_CONFIRM_BUTTON_ID}
        >
          {translateCommon(COMMON.SAVE_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );
};
export default EditModalWrapper;
