import { FormProvider, useForm } from 'react-hook-form';

import { Box, DialogActions, DialogContent } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

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
  const { mutateAsync: editItem } = mutations.useEditItem();
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
      <DialogContent>
        <FormProvider {...methods}>
          <ItemNameField required />

          <DescriptionAndPlacementForm
            onDescriptionChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <CancelButton id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID} onClick={onClose} />
        <Button
          id={ITEM_FORM_CONFIRM_BUTTON_ID}
          type="submit"
          disabled={!isValid}
        >
          {translateCommon(COMMON.SAVE_BUTTON)}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default BaseItemForm;
