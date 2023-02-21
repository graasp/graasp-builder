import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DocumentItemType, ItemType } from '@graasp/sdk';
import { DocumentItemTypeRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { TextEditor } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';
import { buildDocumentExtra } from '../../../utils/itemExtra';
import BaseForm from './BaseItemForm';

type Props = {
  onChange: (item: Partial<DocumentItemType>) => void;
  item: Partial<DocumentItemTypeRecord>;
  updatedProperties: Partial<DocumentItemType>;
};

const DocumentForm = ({
  onChange,
  item,
  updatedProperties,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleOnChange = (content) => {
    onChange({
      ...updatedProperties,
      extra: buildDocumentExtra({ content }),
    });
  };

  const value =
    updatedProperties?.extra?.[ItemType.DOCUMENT]?.content ||
    item?.extra?.[ItemType.DOCUMENT]?.content ||
    '';

  return (
    <>
      <Typography variant="h6">
        {translateBuilder(BUILDER.CREATE_NEW_ITEM_DOCUMENT_TITLE)}
      </Typography>
      <BaseForm
        onChange={onChange}
        item={item}
        updatedProperties={updatedProperties}
      />
      <Box sx={{ mt: 2 }}>
        <TextEditor
          id={ITEM_FORM_DOCUMENT_TEXT_ID}
          value={value}
          onChange={handleOnChange}
          edit
          placeholderText={translateBuilder(BUILDER.TEXT_EDITOR_PLACEHOLDER)}
          showActions={false}
        />
      </Box>
    </>
  );
};

export default DocumentForm;
