import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import BaseItemForm from './BaseItemForm';
import { buildAppExtra, getAppExtra } from '../../../utils/itemExtra';
import { hooks } from '../../../config/queryClient';
import {
  ITEM_FORM_APP_URL_ID,
  buildItemFormAppOptionId,
} from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  img: {
    verticalAlign: 'middle',
    margin: theme.spacing(1),
    height: '30px',
  },
}));

const AppForm = ({ onChange, item }) => {
  const { t } = useTranslation();

  const handleAppUrlInput = (event, newValue) => {
    const url = newValue?.url ?? newValue;
    onChange({ ...item, extra: buildAppExtra({ url }) });
  };

  const classes = useStyles();
  const { useApps } = hooks;
  const { data } = useApps();

  const url = getAppExtra(item?.extra)?.url;

  return (
    <div>
      <Typography variant="h6">{t('Create an App')}</Typography>
      <BaseItemForm onChange={onChange} item={item} />

      <Autocomplete
        id={ITEM_FORM_APP_URL_ID}
        freeSolo
        options={data?.toArray()}
        getOptionLabel={(option) => option.name ?? option}
        value={url}
        onChange={handleAppUrlInput}
        onInputChange={handleAppUrlInput}
        renderOption={(option) => (
          <div id={buildItemFormAppOptionId(option.name)}>
            <img
              className={classes.img}
              src={option.extra.image}
              alt={option.name}
            />
            {option.name}
          </div>
        )}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label={t('App url')} />}
      />
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
