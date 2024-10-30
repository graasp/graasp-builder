import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Box } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import DescriptionForm from './DescriptionForm';
import { ItemNameField } from './ItemNameField';

type Inputs = {
  name: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

const BaseItemForm = ({
  item,
  setChanges,
}: {
  item: DiscriminatedItem;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
}): JSX.Element => {
  const methods = useForm<Inputs>({ defaultValues: { name: item.name } });
  const { watch, setValue } = methods;
  const name = watch('name');
  const descriptionPlacement = watch('descriptionPlacement');
  const description = watch('description');

  // synchronize upper state after async local state change
  useEffect(() => {
    setChanges({
      name,
      description,
      settings: { descriptionPlacement },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, descriptionPlacement, name]);

  return (
    <Box overflow="auto">
      <FormProvider {...methods}>
        <ItemNameField required />

        <Box sx={{ mt: 2 }}>
          <DescriptionForm
            id={FOLDER_FORM_DESCRIPTION_ID}
            description={description ?? item?.description}
            descriptionPlacement={
              descriptionPlacement ?? item?.settings?.descriptionPlacement
            }
            onPlacementChange={(newValue) =>
              setValue('descriptionPlacement', newValue)
            }
            onDescriptionChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
        </Box>
      </FormProvider>
    </Box>
  );
};

export default BaseItemForm;
