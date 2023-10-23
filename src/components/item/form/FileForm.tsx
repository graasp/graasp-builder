import { TextField } from '@mui/material';

import {
  DiscriminatedItem,
  FileItemProperties,
  ItemType,
  MimeTypes,
  getFileExtra,
  getS3FileExtra,
} from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID } from '@/config/selectors';

import { BUILDER } from '../../../langs/constants';
import DescriptionForm from './DescriptionForm';
import { EditModalContentPropType } from './EditModalWrapper';
import NameForm from './NameForm';

const FileForm = (props: EditModalContentPropType): JSX.Element | null => {
  const { item, setChanges, updatedProperties } = props;

  const { t: translateBuilder } = useBuilderTranslation();

  if (!item) {
    return null;
  }

  if (
    item &&
    (item.type === ItemType.LOCAL_FILE || item.type === ItemType.S3_FILE) &&
    (updatedProperties.type === ItemType.LOCAL_FILE ||
      updatedProperties.type === ItemType.S3_FILE)
  ) {
    const getExtra = (
      testItem: Partial<DiscriminatedItem>,
    ): Partial<FileItemProperties> => {
      const localFileExtra =
        testItem.type === ItemType.LOCAL_FILE
          ? getFileExtra(testItem.extra)
          : undefined;
      const s3FileExtra =
        testItem.type === ItemType.S3_FILE
          ? getS3FileExtra(testItem.extra)
          : undefined;
      const extra = {
        ...s3FileExtra,
        ...localFileExtra,
      };
      return extra;
    };

    const itemExtra = getExtra(item);
    const { mimetype, altText } = itemExtra;
    const updatedExtra = getExtra(updatedProperties);
    return (
      <>
        <NameForm
          setChanges={setChanges}
          item={item}
          updatedProperties={updatedProperties}
        />
        {mimetype && MimeTypes.isImage(mimetype) && (
          <TextField
            variant="standard"
            id={ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID}
            label={translateBuilder(BUILDER.EDIT_ITEM_IMAGE_ALT_TEXT_LABEL)}
            value={updatedExtra?.altText ?? altText}
            onChange={(e) => {
              const newExtra = {
                ...itemExtra,
                ...updatedExtra,
                altText: e.target.value,
              } as FileItemProperties;

              setChanges(
                item.type === ItemType.S3_FILE
                  ? {
                      extra: {
                        [ItemType.S3_FILE]: newExtra,
                      },
                    }
                  : {
                      extra: { [ItemType.LOCAL_FILE]: newExtra },
                    },
              );
            }}
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
  }
  return null;
};

export default FileForm;
