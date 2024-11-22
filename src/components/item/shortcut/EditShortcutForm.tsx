import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Box, Button, DialogActions, DialogContent } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';

import CancelButton from '@/components/common/CancelButton';
import { useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';

import { ItemNameField } from '../form/ItemNameField';

type Inputs = {
  name: string;
};

function EditShortcutForm({
  item,
  onClose,
}: {
  item: DiscriminatedItem;
  onClose: () => void;
}): ReactNode {
  const { t: translateCommon } = useCommonTranslation();
  const methods = useForm<Inputs>({
    defaultValues: { name: item.name },
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { mutateAsync: editItem } = mutations.useEditItem();
  async function onSubmit(data: Inputs) {
    try {
      await editItem({
        id: item.id,
        name: data.name,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <ItemNameField required />
        </DialogContent>
        <DialogActions>
          <CancelButton
            id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}
            onClick={onClose}
          />
          <Button
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            type="submit"
            disabled={!isValid}
          >
            {translateCommon(COMMON.SAVE_BUTTON)}
          </Button>
        </DialogActions>
      </Box>
    </FormProvider>
  );
}

export default EditShortcutForm;
