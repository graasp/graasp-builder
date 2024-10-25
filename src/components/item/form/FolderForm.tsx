import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Stack } from '@mui/material';

import { DescriptionPlacementType, DiscriminatedItem } from '@graasp/sdk';

import { FOLDER_FORM_DESCRIPTION_ID } from '../../../config/selectors';
import ThumbnailCrop from '../../thumbnails/ThumbnailCrop';
import DescriptionForm from './DescriptionForm';
import NameForm from './NameForm';

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
  const { register, setValue, watch } = useForm<Inputs>();
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
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        gap={3}
      >
        {showThumbnail && <ThumbnailCrop setChanges={setChanges} />}
        <NameForm required nameForm={register('name', { value: item?.name })} />
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
    </Stack>
  );
};

export default FolderForm;
