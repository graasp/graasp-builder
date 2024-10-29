import { useForm } from 'react-hook-form';

import { Box, DialogActions, DialogContent, Stack } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import CancelButton from '@/components/common/CancelButton';
import { useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';

import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  FOLDER_FORM_DESCRIPTION_ID,
} from '../../../../config/selectors';
import { ItemNameField } from '../ItemNameField';
import DescriptionForm from '../description/DescriptionForm';

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
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>();
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="column" gap={2}>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-end"
            gap={3}
          >
            <ItemNameField required />
          </Stack>
          <DescriptionForm
            id={FOLDER_FORM_DESCRIPTION_ID}
            value={description ?? item?.description}
            onChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <CancelButton id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID} onClick={onClose} />
        <Button type="submit" disabled={!isValid}>
          {translateCommon(COMMON.SAVE_BUTTON)}
        </Button>
      </DialogActions>
    </Box>
  );
}
