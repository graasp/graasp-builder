import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import BaseItemForm from './BaseItemForm';
import { buildAppExtra, getAppExtra } from '../../../utils/itemExtra';
import { ITEM_FORM_APP_URL_ID } from '../../../config/selectors';

const AppForm = ({ onChange, item }) => {
  const { t } = useTranslation();

  const handleAppUrlInput = (event) => {
    onChange({ ...item, extra: buildAppExtra({ url: event?.target?.value }) });
  };

  const url = getAppExtra(item?.extra)?.url;

  return (
    <>
      <Typography variant="h6">{t('Create an App')}</Typography>
      <BaseItemForm onChange={onChange} item={item} />
      <TextField
        id={ITEM_FORM_APP_URL_ID}
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
