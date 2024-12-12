import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';

import { DiscriminatedItem, ItemGeolocation, ItemType } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import CancelButton from '@/components/common/CancelButton';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import {
  FOLDER_FORM_DESCRIPTION_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
} from '../../../../config/selectors';
import ThumbnailCrop from '../../../thumbnails/ThumbnailCrop';
import { ItemNameField } from '../ItemNameField';
import { DescriptionForm } from '../description/DescriptionForm';

type Inputs = {
  name: string;
  description: string;
};

type FolderCreateFormProps = {
  onClose: () => void;
  parentId?: DiscriminatedItem['id'];
  geolocation?: Pick<ItemGeolocation, 'lat' | 'lng'>;
  previousItemId?: DiscriminatedItem['id'];
};

export function FolderCreateForm({
  onClose,
  geolocation,
  previousItemId,
}: FolderCreateFormProps): JSX.Element {
  const { itemId: parentId } = useParams();
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const methods = useForm<Inputs>();
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  const description = watch('description');
  const [thumbnail, setThumbnail] = useState<Blob>();

  const { mutateAsync: createItem } = mutations.usePostItem();

  async function onSubmit(data: Inputs) {
    try {
      await createItem({
        name: data.name,
        type: ItemType.FOLDER,
        description: data.description,
        thumbnail,
        parentId,
        geolocation,
        previousItemId,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {translateBuilder(BUILDER.CREATE_ITEM_NEW_FOLDER_TITLE)}
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={2}
          >
            <ThumbnailCrop
              setChanges={({ thumbnail: image }) => {
                setThumbnail(image);
              }}
            />
            <ItemNameField required />
          </Stack>
          <DescriptionForm
            id={FOLDER_FORM_DESCRIPTION_ID}
            value={description}
            onChange={(newValue) => {
              setValue('description', newValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose} />
          <Button
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            type="submit"
            disabled={isSubmitted && !isValid}
          >
            {translateCommon(COMMON.SAVE_BUTTON)}
          </Button>
        </DialogActions>
      </Box>
    </FormProvider>
  );
}
