import { TextField } from '@mui/material';

import { FileItemProperties, ItemType, MimeTypes } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_IMAGE_ALT_TEXT_EDIT_FIELD_ID } from '@/config/selectors';
import { getExtraFromPartial } from '@/utils/itemExtra';

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
    const itemExtra = getExtraFromPartial(item);
    const { mimetype, altText } = itemExtra;
    const updatedExtra = updatedProperties.extra
      ? getExtraFromPartial(updatedProperties)
      : {};
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
