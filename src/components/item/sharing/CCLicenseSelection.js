import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader, CCLicenseIcon } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Button,
  Radio,
  Tooltip,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { MUTATION_KEYS } from '@graasp/query-client';
import { redirect } from '@graasp/utils';
import { useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import {
  CC_LICENSE_ADAPTION_OPTIONS,
  SUBMIT_BUTTON_WIDTH,
} from '../../../config/constants';

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
  const [optionValue, setOptionValue] = useState(null);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // itemId
  const itemId = item?.get('id');
  const settings = item?.get('settings');
  const itemName = item?.get('name');

  useEffect(() => {
    if (settings) {
      setOptionValue(settings.ccLicenseAdaption);
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
      settings: { ccLicenseAdaption: optionValue },
    });
  };

  const handleClick = () => {
    const url = 'https://creativecommons.org/about/cclicenses/';
    redirect(url, { OpenInNewTab: true });
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
          disabled={
            !edit ||
            settings?.ccLicenseAdaption === CC_LICENSE_ADAPTION_OPTIONS.ALLOW
          } // if choose 'yes', cannot change back
        >
          <Typography variant="body1">
            {t(
              'All content published on Graasp Explorer does not allow commercial use.',
            )}
          </Typography>
          <Typography variant="body1">
            {t('Allow adaptations of your work to be shared?')}
          </Typography>
          <RadioGroup
            aria-label="CC License"
            name={t('CC License')}
            value={optionValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value={CC_LICENSE_ADAPTION_OPTIONS.ALLOW}
              control={<Radio color="primary" />}
              label={t('Yes')}
            />
            <FormControlLabel
              value={CC_LICENSE_ADAPTION_OPTIONS.ALIKE}
              control={<Radio color="primary" />}
              label={t('Only if others share alike')}
            />
          </RadioGroup>
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
      <CCLicenseIcon adaption={optionValue} className={classes.icon} />
    </>
  );
};

CCLicenseSelection.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CCLicenseSelection;
