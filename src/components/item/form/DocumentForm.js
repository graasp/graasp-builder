import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BUILDER } from '@graasp/translations';
import { TextEditor } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';
import { buildDocumentExtra, getDocumentExtra } from '../../../utils/itemExtra';
import BaseForm from './BaseItemForm';

const DocumentForm = ({ onChange, item, updatedProperties }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleOnChange = (content) => {
    onChange({
      ...updatedProperties,
      extra: buildDocumentExtra({ content }),
    });
  };

  const value =
    getDocumentExtra(updatedProperties?.extra)?.content ||
    getDocumentExtra(item?.extra)?.content;

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

DocumentForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    extra: PropTypes.shape({}),
  }).isRequired,
  updatedProperties: PropTypes.shape({
    extra: PropTypes.shape({}),
  }).isRequired,
};

export default DocumentForm;
