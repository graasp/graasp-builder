import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { InputLabel, Select, MenuItem, FormControl, makeStyles } from '@material-ui/core';
import BaseItemForm from './BaseItemForm';
import { buildAppExtra, getAppExtra } from '../../../utils/itemExtra';
import { hooks } from '../../../config/queryClient';
import { ITEM_FORM_APP_URL_ID } from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  img: {
    verticalAlign: 'middle',
    margin: theme.spacing(1),
    height: '30px'
  },
}));

const AppForm = ({ onChange, item }) => {
  const { t } = useTranslation();

  const handleAppUrlInput = (event) => {
    onChange({ ...item, extra: buildAppExtra({ url: event?.target?.value }) });
  };

  const classes = useStyles()
  const { useApps } = hooks;
  const { data } = useApps();

  const entries = data ?
  data?.map(elt => (
    <MenuItem value={elt.url}>
      <img className={classes.img} src={elt.extra.image} alt={elt.name} />
      {elt.name}
    </MenuItem>
  ))
  :
  <MenuItem />;


  const url = getAppExtra(item?.extra)?.url;

  return (
    <div>
      <Typography variant="h6">{t('Create an App')}</Typography>
      <BaseItemForm onChange={onChange} item={item} />
     
      <FormControl fullWidth>
        <InputLabel>{t('App url')}</InputLabel>
        <Select
          id={ITEM_FORM_APP_URL_ID}
          margin="dense"
          label={t('App url')}
          value={url}
          onChange={handleAppUrlInput}
          fullWidth
        >
          {entries}
        </Select>
      </FormControl>
    </div>
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
