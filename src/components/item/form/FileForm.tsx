import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { TextField } from '@mui/material';

import {
  DescriptionPlacementType,
  DiscriminatedItem,
  ItemType,
  LocalFileItemExtra,
  LocalFileItemType,
  MimeTypes,
  S3FileItemExtra,
  S3FileItemType,
} from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID } from '@/config/selectors';
import { getExtraFromPartial } from '@/utils/itemExtra';

import { BUILDER } from '../../../langs/constants';
import type { EditModalContentPropType } from '../edit/EditModal';
import DescriptionForm from './DescriptionForm';
import NameForm from './NameForm';

type Inputs = {
  name: string;
  altText: string;
  description: string;
  descriptionPlacement: DescriptionPlacementType;
};

const FileForm = ({
  item,
  setChanges,
}: {
  item: DiscriminatedItem;
  setChanges: EditModalContentPropType['setChanges'];
}): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { register, watch, setValue } = useForm<Inputs>();
  const altText = watch('altText');
  const description = watch('description');
  const descriptionPlacement = watch('descriptionPlacement');
  const name = watch('name');

  useEffect(() => {
    let newExtra: S3FileItemExtra | LocalFileItemExtra | undefined;

    if (item.type === ItemType.S3_FILE) {
      newExtra = {
        [ItemType.S3_FILE]: {
          ...item.extra[ItemType.S3_FILE],
          altText,
        },
      };
    } else if (item.type === ItemType.LOCAL_FILE) {
      newExtra = {
        [ItemType.LOCAL_FILE]: {
          ...item.extra[ItemType.LOCAL_FILE],
          altText,
        },
      };
    }

    setChanges({
      name,
      description,
      settings: { descriptionPlacement },
      extra: newExtra,
    } as S3FileItemType | LocalFileItemType);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [altText, description, descriptionPlacement, name, setChanges]);

  if (item) {
    const itemExtra = getExtraFromPartial(item);
    const { mimetype, altText: previousAltText } = itemExtra;
    return (
      <>
        <NameForm nameForm={register('name', { value: item.name })} />
        {mimetype && MimeTypes.isImage(mimetype) && (
          <TextField
            variant="standard"
            id={ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID}
            label={translateBuilder(BUILDER.EDIT_ITEM_IMAGE_ALT_TEXT_LABEL)}
            // always shrink because setting name from defined app does not shrink automatically
            InputLabelProps={{ shrink: true }}
            sx={{ width: '50%', my: 1 }}
            multiline
            {...register('altText', { value: previousAltText })}
          />
        )}
        <DescriptionForm
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
          description={description ?? item?.description ?? ''}
          descriptionPlacement={
            descriptionPlacement ?? item?.settings?.descriptionPlacement
          }
        />
      </>
    );
  }
  return null;
};

export default FileForm;
