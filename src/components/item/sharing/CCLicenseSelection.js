import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  FormHelperText,
  Button,
  Radio,
  Tooltip,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { SUBMIT_BUTTON_WIDTH } from '../../../config/constants';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    maxWidth: SUBMIT_BUTTON_WIDTH,
  },
  icon: {
    marginTop: theme.spacing(1),
    borderWidth: 0,
  },
}));

const { EDIT_ITEM } = MUTATION_KEYS;

const CCLicenseSelection = ({ item, edit }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: updateCCLicense } = useMutation(EDIT_ITEM);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  const settings = item?.get('settings');
  const itemName = item?.get('name');

  const [optionValue, setOptionValue] = useState(null);

  useEffect(() => {
    if (settings) {
      setOptionValue(settings.ccLicense);
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const handleChange = (event) => {
    setOptionValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCCLicense({
      id: itemId,
      name: itemName,
      settings: { ccLicense: optionValue },
    });
  };

  const handleClick = () => {
    window.open('https://creativecommons.org/about/cclicenses/', '_blank');
  };

  const displayIcon = () => {
    if (optionValue === 'yes') {
      return (
        <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
          <img
            alt="Creative Commons License"
            className={classes.icon}
            src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
          />
        </a>
      );
    }
    if (optionValue === 'conditional') {
      return (
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          <img
            alt="Creative Commons License"
            className={classes.icon}
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
          />
        </a>
      );
    }
    return <></>;
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        {t('Creative Commons License')}
        <Tooltip
          title={t('Need more info about CC License? Click here!')}
          arrow
        >
          <IconButton aria-label="info" onClick={handleClick}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl
          component="fieldset"
          className={classes.formControl}
          disabled={!edit || settings?.ccLicense === 'yes'} // if choose 'yes', cannot change back
        >
          <Typography variant="body1">
            {t(
              'All content published on Graasp-Explorer does not allow commercial use.',
            )}
          </Typography>
          <Typography variant="body1">
            {t('Allow adaptations of your work to be shared?')}
          </Typography>
          <RadioGroup
            aria-label="CC License"
            name="CC License"
            value={optionValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="yes"
              control={<Radio color="primary" />}
              label={t('Yes')}
            />
            <FormControlLabel
              value="conditional"
              control={<Radio color="primary" />}
              label={t('Only if others share alike')}
            />
          </RadioGroup>
          <FormHelperText>{}</FormHelperText>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className={classes.button}
          >
            {t('Submit')}
          </Button>
        </FormControl>
      </form>
      <Typography variant="subtitle1">{t('Icon Preview')}</Typography>
      {displayIcon()}
    </>
  );
};

CCLicenseSelection.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CCLicenseSelection;
