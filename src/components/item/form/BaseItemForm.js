import React from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  ITEM_FORM_DESCRIPTION_INPUT_ID,
  ITEM_FORM_NAME_INPUT_ID,
} from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';

const useStyles = makeStyles(() => ({
  shortInputField: {
    width: '50%',
  },
}));

const BaseForm = ({ onChange, item, updatedProperties }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleNameInput = (event) => {
    onChange({ ...updatedProperties, name: event.target.value });
  };

  const handleDescriptionInput = (event) => {
    onChange({ ...updatedProperties, description: event.target.value });
  };

  return (
    <>
      <TextField
        autoFocus
        margin="dense"
        id={ITEM_FORM_NAME_INPUT_ID}
        label={t('Name')}
        value={updatedProperties?.name || item?.name}
        onChange={handleNameInput}
        className={classes.shortInputField}
      />
      <TextField
        id={ITEM_FORM_DESCRIPTION_INPUT_ID}
        margin="dense"
        label={t('Description')}
        value={updatedProperties?.description || item?.description}
        onChange={handleDescriptionInput}
        rows={4}
        rowsMax={4}
        fullWidth
      />
    </>
  );
};

BaseForm.propTypes = {
  updatedProperties: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  onChange: PropTypes.string.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    extra: PropTypes.shape({
      [ITEM_TYPES.LINK]: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};

BaseForm.defaultProps = {
  updatedProperties: {},
};

export default BaseForm;
