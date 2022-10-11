import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'react-i18next';

import { TextEditor } from '@graasp/ui';

import { ITEM_FORM_DOCUMENT_TEXT_ID } from '../../../config/selectors';
import { buildDocumentExtra, getDocumentExtra } from '../../../utils/itemExtra';
import BaseForm from './BaseItemForm';

const DocumentForm = ({ onChange, item, updatedProperties }) => {
  const { t } = useTranslation();

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
      <Typography variant="h6">{t('Create a Document')}</Typography>
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
          placeholderText={t('Write something...')}
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
