import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Box } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import DescriptionForm from './DescriptionForm';
import NameForm from './NameForm';

type Inputs = {
  name: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

const BaseItemForm = ({
  item,
  setChanges,
}: {
  item?: DiscriminatedItem;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
}): JSX.Element => {
  const { register, watch, setValue } = useForm<Inputs>();

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
      <NameForm nameForm={register('name', { value: item?.name })} required />

      <Box sx={{ mt: 2 }}>
        <DescriptionForm
          id={FOLDER_FORM_DESCRIPTION_ID}
          description={description ?? item?.description}
          descriptionPlacement={
            descriptionPlacement ?? item?.settings?.descriptionPlacement
          }
          setChanges={(v) => {
            if (v.description) {
              setValue('description', v.description);
            }
            if (v.settings?.descriptionPlacement) {
              setValue(
                'descriptionPlacement',
                v.settings?.descriptionPlacement,
              );
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default BaseItemForm;
