import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Stack } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import ThumbnailCrop from '../../thumbnails/ThumbnailCrop';
import DescriptionForm from './DescriptionForm';
import { ItemNameField } from './ItemNameField';

export type FolderFormProps = {
  item?: DiscriminatedItem;
  setChanges: (
    payload: Partial<DiscriminatedItem> & { thumbnail?: Blob },
  ) => void;
  showThumbnail?: boolean;
};

type Inputs = {
  name: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

const FolderForm = ({
  item,
  setChanges,
  showThumbnail = false,
}: FolderFormProps): JSX.Element => {
  const methods = useForm<Inputs>({ defaultValues: { name: item?.name } });
  const { setValue, watch } = methods;
  const description = watch('description');
  const descriptionPlacement = watch('descriptionPlacement');
  const name = watch('name');

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
    <Stack direction="column" gap={2}>
      <FormProvider {...methods}>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
          gap={3}
        >
          {showThumbnail && <ThumbnailCrop setChanges={setChanges} />}
          <ItemNameField required />
        </Stack>
        <DescriptionForm
          id={FOLDER_FORM_DESCRIPTION_ID}
          description={description ?? item?.description}
          onPlacementChange={(newValue) =>
            setValue('descriptionPlacement', newValue)
          }
          onDescriptionChange={(newValue) => {
            setValue('description', newValue);
          }}
          showPlacement={false}
          descriptionPlacement={
            descriptionPlacement ?? item?.settings?.descriptionPlacement
          }
        />
      </FormProvider>
    </Stack>
  );
};

export default FolderForm;
