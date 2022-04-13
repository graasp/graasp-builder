import React from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';
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

  return (
    <TextField
      autoFocus
      margin="dense"
      id={ITEM_FORM_NAME_INPUT_ID}
      label={t('Name')}
      // add empty string to avoid that label overlaps
      value={updatedProperties?.name || item?.name || ''}
      onChange={handleNameInput}
      className={classes.shortInputField}
    />
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
