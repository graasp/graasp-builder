import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import BaseItemForm from './BaseItemForm';
import { buildAppExtra, getAppExtra } from '../../../utils/itemExtra';

const AppForm = ({ onChange, item }) => {
  const { t } = useTranslation();

  const handleAppUrlInput = (event) => {
    onChange({ ...item, extra: buildAppExtra({ url: event?.target?.value }) });
  };

  const url = getAppExtra(item?.extra)?.url;

  return (
    <>
      <BaseItemForm onChange={onChange} item={item} />
      <TextField
        margin="dense"
        label={t('App url')}
        value={url}
        onChange={handleAppUrlInput}
        fullWidth
      />
    </>
  );
};

AppForm.propTypes = {
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

AppForm.defaultProps = {
  item: {},
};

export default AppForm;
