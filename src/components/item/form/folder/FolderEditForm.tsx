import { FormProvider, useForm } from 'react-hook-form';

import { Box, DialogActions, DialogContent } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import CancelButton from '@/components/common/CancelButton';
import { useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  FOLDER_FORM_DESCRIPTION_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '../../../../config/selectors';
import { ItemNameField } from '../ItemNameField';
import { DescriptionForm } from '../description/DescriptionForm';

type FolderEditFormProps = {
  item: DiscriminatedItem;
  onClose: () => void;
};

type Inputs = {
  name: string;
  description: string;
};

export function FolderEditForm({
  item,
  onClose,
}: FolderEditFormProps): JSX.Element {
  const { t: translateCommon } = useCommonTranslation();
  const methods = useForm<Inputs>({
    defaultValues: {
      name: item.name,
      description: item.description ?? '',
    },
  });
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = methods;
  const description = watch('description');

  const { mutateAsync: editItem } = mutations.useEditItem();

  async function onSubmit(data: Inputs) {
    try {
      await editItem({
        id: item.id,
        name: data.name,
        description: data.description,
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
          <DescriptionForm
            id={FOLDER_FORM_DESCRIPTION_ID}
            value={description ?? item?.description}
            onChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
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
