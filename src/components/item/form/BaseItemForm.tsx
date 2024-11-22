import { FormProvider, useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Box, DialogActions, DialogContent } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';

import CancelButton from '@/components/common/CancelButton';
import { useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '@/config/selectors';

import { ItemNameField } from './ItemNameField';
import { DescriptionAndPlacementForm } from './description/DescriptionAndPlacementForm';

type Inputs = {
  name: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

const BaseItemForm = ({
  item,
  onClose,
}: {
  item: DiscriminatedItem;
  onClose: () => void;
}): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();
  const methods = useForm<Inputs>({ defaultValues: { name: item.name } });
  const { mutateAsync: editItem, isPending } = mutations.useEditItem();
  const {
    setValue,
    handleSubmit,
    formState: { isValid },
  } = methods;

  async function onSubmit(data: Inputs) {
    try {
      await editItem({
        id: item.id,
        name: data.name,
        description: data.description,
        settings: { descriptionPlacement: data.descriptionPlacement },
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <DialogContent>
          <ItemNameField required />
          <DescriptionAndPlacementForm
            onDescriptionChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <CancelButton
            id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}
            onClick={onClose}
          />
          <LoadingButton
            loading={isPending}
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            type="submit"
            disabled={!isValid}
            variant="contained"
          >
            {translateCommon(COMMON.SAVE_BUTTON)}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Box>
  );
};

export default BaseItemForm;
