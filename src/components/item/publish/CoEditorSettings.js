import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { DISPLAY_CO_EDITORS_OPTIONS } from '../../../config/constants';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
}));

const { EDIT_ITEM } = MUTATION_KEYS;

const CoEditorSettings = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: updateDisplayCoEditors } = useMutation(EDIT_ITEM);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const itemId = item?.get('id');
  const settings = item?.get('settings');
  const itemName = item?.get('name');

  // by default, co editors will not be displayed
  const [optionValue, setOptionValue] = useState(
    DISPLAY_CO_EDITORS_OPTIONS.NO.value,
  );

  useEffect(() => {
    if (settings?.displayCoEditors) {
      setOptionValue(settings.displayCoEditors);
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const handleChange = (event) => {
    const newValue = event.target.value;
    setOptionValue(newValue);
    updateDisplayCoEditors({
      id: itemId,
      name: itemName,
      settings: { displayCoEditors: newValue },
    });
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        {t('Co-Editors')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Do you want to display co-editors on the publication page? All users with edit or admin permissions will be displayed.',
        )}
      </Typography>
      <RadioGroup
        aria-label="Co-Editors"
        name={t('Display co-editors?')}
        value={optionValue}
        onChange={handleChange}
      >
        {
          Object.values(DISPLAY_CO_EDITORS_OPTIONS).map((option) => (
            <FormControlLabel
              value={option.value}
              control={<Radio color="primary" />}
              label={t(option.label)}
            />
          ))
        }
      </RadioGroup>
    </>
  );
};

CoEditorSettings.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default CoEditorSettings;
