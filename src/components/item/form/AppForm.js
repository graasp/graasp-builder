import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Skeleton from '@material-ui/lab/Skeleton';
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

const AppForm = ({ onChange, item, updatedProperties }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState(item?.name);

  const handleAppUrlInput = (event, newValue) => {
    const url = newValue?.url ?? newValue;
    const name = newValue?.name ?? item.name;
    const props = { ...item, extra: buildAppExtra({ url }) };
    if (name) {
      setNewName(name);
      props.name = name;
    }
    onChange(props);
  };

  const classes = useStyles();
  const { useApps } = hooks;
  const { data, isLoading: isAppsLoading } = useApps();

  const url = getAppExtra(item?.extra)?.url;

  return (
    <div>
      <Typography variant="h6">{t('Create an App')}</Typography>
      <BaseItemForm
        onChange={onChange}
        item={{ ...item, name: newName }}
        updatedProperties={updatedProperties}
      />

      {isAppsLoading ? (
        <Skeleton height={60} />
      ) : (
        <Autocomplete
          id={ITEM_FORM_APP_URL_ID}
          options={data?.toArray() ?? []}
          getOptionLabel={(option) => option.url ?? option}
          value={url}
          clearOnBlur={false}
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
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label={t('App url')}
            />
          )}
        />
      )}
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
  updatedProperties: PropTypes.shape({
    name: PropTypes.string,
    extra: PropTypes.shape({
      app: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }),
};

AppForm.defaultProps = {
  item: {},
  updatedProperties: {},
};

export default AppForm;
