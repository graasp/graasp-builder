import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { ITEM_FORM_IMAGE_INPUT_ID } from '../../../config/selectors';
import BaseItemForm from './BaseItemForm';

const FolderForm = ({ onChange, item, updatedProperties }) => {
  const { t } = useTranslation();

  const handleImageUrlInput = (event) => {
    onChange({ ...updatedProperties, extra: { image: event.target.value } });
  };

  return (
    <>
      <BaseItemForm
        onChange={onChange}
        item={item}
        updatedProperties={updatedProperties}
      />

      <TextField
        id={ITEM_FORM_IMAGE_INPUT_ID}
        margin="dense"
        label={t('Image (URL)')}
        value={updatedProperties?.extra?.image || item?.extra?.image}
        onChange={handleImageUrlInput}
        fullWidth
      />
    </>
  );
};

FolderForm.propTypes = {
  updatedProperties: PropTypes.shape({
    extra: PropTypes.shape({
      image: PropTypes.string,
    }),
  }),
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    extra: PropTypes.shape({
      image: PropTypes.string,
    }),
  }),
};

FolderForm.defaultProps = {
  item: {},
  updatedProperties: {},
};

export default FolderForm;
