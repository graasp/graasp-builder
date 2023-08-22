import { TextField } from '@mui/material';

import {
  FileItemProperties,
  ItemType,
  LocalFileItemType,
  MimeTypes,
  S3FileItemType,
  getFileExtra,
  getS3FileExtra,
} from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID } from '@/config/selectors';

import DescriptionForm from './DescriptionForm';
import { EditModalContentPropType } from './EditModalWrapper';
import BaseItemForm from './NameForm';

const FileForm = (props: EditModalContentPropType): JSX.Element | null => {
  const { item, setChanges, updatedProperties } = props;

  const { t: translateBuilder } = useBuilderTranslation();

  if (!item) {
    return null;
  }

  const localFileExtra =
    item.type === ItemType.LOCAL_FILE ? getFileExtra(item.extra) : undefined;
  const s3FileExtra =
    item.type === ItemType.S3_FILE ? getS3FileExtra(item.extra) : undefined;
  const { mimetype, altText } = {
    ...s3FileExtra,
    ...localFileExtra,
  };

  return (
    <>
      <BaseItemForm
        setChanges={setChanges}
        item={item}
        updatedProperties={updatedProperties}
      />
      {mimetype && MimeTypes.isImage(mimetype) && (
        <TextField
          variant="standard"
          id={ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID}
          label={translateBuilder(BUILDER.EDIT_ITEM_IMAGE_ALT_TEXT_LABEL)}
          value={
            (
              updatedProperties?.extra?.[item.type] as
                | FileItemProperties
                | undefined
            )?.altText ?? altText
          }
          onChange={(e) =>
            setChanges({
              extra: {
                [item.type]: { ...updatedProperties, altText: e.target.value },
              },
            } as Partial<S3FileItemType | LocalFileItemType>)
          }
          // always shrink because setting name from defined app does not shrink automatically
          InputLabelProps={{ shrink: true }}
          sx={{ width: '50%', my: 1 }}
          multiline
        />
      )}
      <DescriptionForm
        setChanges={setChanges}
        updatedProperties={updatedProperties}
        item={item}
      />
    </>
  );
};

export default FileForm;
