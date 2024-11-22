import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';

import {
  DescriptionPlacementType,
  ItemType,
  LocalFileItemExtra,
  LocalFileItemType,
  MimeTypes,
  S3FileItemExtra,
  S3FileItemType,
} from '@graasp/sdk';
import { COMMON } from '@graasp/translations';

import CancelButton from '@/components/common/CancelButton';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  EDIT_ITEM_MODAL_CANCEL_BUTTON_ID,
  ITEM_FORM_CONFIRM_BUTTON_ID,
  ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID,
} from '@/config/selectors';
import { getExtraFromPartial } from '@/utils/itemExtra';

import { BUILDER } from '../../../../langs/constants';
import { ItemNameField } from '../ItemNameField';
import { DescriptionAndPlacementForm } from '../description/DescriptionAndPlacementForm';

type Inputs = {
  name: string;
  altText: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

const FileForm = ({
  item,
  onClose,
}: {
  item: LocalFileItemType | S3FileItemType;
  onClose: () => void;
}): ReactNode => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const methods = useForm<Inputs>({ defaultValues: { name: item.name } });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = methods;

  const altText = watch('altText');
  const description = watch('description');
  const descriptionPlacement = watch('descriptionPlacement');

  const { mimetype, altText: previousAltText } = getExtraFromPartial(item);

  const { mutateAsync: editItem } = mutations.useEditItem();

  function buildFileExtra() {
    if (altText) {
      if (item.type === ItemType.S3_FILE) {
        return {
          [ItemType.S3_FILE]: {
            altText,
          },
        } as S3FileItemExtra;
      }
      if (item.type === ItemType.LOCAL_FILE) {
        return {
          [ItemType.LOCAL_FILE]: {
            altText,
          },
        } as LocalFileItemExtra;
      }
    }
    console.error(`item type ${item.type} is not handled`);
    return undefined;
  }

  async function onSubmit(data: Inputs) {
    try {
      await editItem({
        id: item.id,
        name: data.name,
        description: data.description,
        // only post extra if it has been changed
        extra: altText !== previousAltText ? buildFileExtra() : undefined,
        // only patch settings it it has been changed
        settings:
          descriptionPlacement !== item.settings.descriptionPlacement
            ? { descriptionPlacement }
            : undefined,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ItemNameField required showClearButton={Boolean(watch('name'))} />
          {mimetype && MimeTypes.isImage(mimetype) && (
            <TextField
              variant="standard"
              id={ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID}
              label={translateBuilder(BUILDER.EDIT_ITEM_IMAGE_ALT_TEXT_LABEL)}
              // always shrink because setting name from defined app does not shrink automatically
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ width: '50%', my: 1 }}
              multiline
              {...register('altText', { value: previousAltText })}
            />
          )}
          <DescriptionAndPlacementForm
            onDescriptionChange={(newValue) => {
              setValue('description', newValue);
            }}
            description={description ?? item?.description ?? ''}
          />
        </DialogContent>
        <DialogActions>
          <CancelButton
            id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID}
            onClick={onClose}
          />
          <Button
            variant="contained"
            type="submit"
            id={ITEM_FORM_CONFIRM_BUTTON_ID}
            disabled={isSubmitted && !isValid}
          >
            {translateCommon(COMMON.SAVE_BUTTON)}
          </Button>
        </DialogActions>
      </Box>
    </FormProvider>
  );
};

export default FileForm;
