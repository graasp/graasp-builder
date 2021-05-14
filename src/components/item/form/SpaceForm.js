import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { ITEM_FORM_IMAGE_INPUT_ID } from '../../../config/selectors';
import BaseItemForm from './BaseItemForm';

const ItemForm = ({ onChange, item }) => {
  const { t } = useTranslation();

  const handleImageUrlInput = (event) => {
    onChange({ ...item, extra: { image: event.target.value } });
  };

  return (
    <>
      <BaseItemForm onChange={onChange} item={item} />

      <TextField
        id={ITEM_FORM_IMAGE_INPUT_ID}
        margin="dense"
        label={t('Image (URL)')}
        value={item?.extra?.image}
        onChange={handleImageUrlInput}
        fullWidth
      />
    </>
  );
};

ItemForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    shortInputField: PropTypes.string.isRequired,
    dialogContent: PropTypes.string.isRequired,
    addedMargin: PropTypes.string.isRequired,
  }).isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    extra: PropTypes.shape({
      image: PropTypes.string,
    }),
  }),
};

ItemForm.defaultProps = {
  item: {},
};

const TranslatedComponent = withTranslation()(ItemForm);
export default TranslatedComponent;
