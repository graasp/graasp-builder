import React from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { useTranslation } from 'react-i18next';
import {
  FormControlLabel,
  Switch,
  makeStyles,
  FormGroup,
} from '@material-ui/core';
import { MUTATION_KEYS } from '@graasp/query-client';
import Typography from '@material-ui/core/Typography';
import { useMutation } from '../../../config/queryClient';
import {
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
} from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 0,
    padding: 0,
  },
  wrapper: {
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  collapseTooltip: {
    color: 'lightgrey',
    marginBottom: -theme.spacing(0.5),
  },
}));
const LinkSettings = ({ item }) => {
  const { t } = useTranslation();

  const classes = useStyles();
  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const { settings } = item;

  const handleIframeSetting = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        showLinkIframe: event.target.checked,
      },
    });
  };

  const handleButtonSetting = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        showLinkButton: event.target.checked,
      },
    });
  };

  const renderIframeToggle = () => {
    const control = (
      <Switch
        id={SETTINGS_PINNED_TOGGLE_ID}
        onChange={handleIframeSetting}
        checked={settings?.showLinkIframe ?? true}
        color="primary"
      />
    );
    return <FormControlLabel label={t('Show Link Iframe')} control={control} />;
  };

  const renderButtonToggle = () => {
    const control = (
      <Switch
        id={SETTINGS_CHATBOX_TOGGLE_ID}
        onChange={handleButtonSetting}
        checked={settings?.showLinkButton ?? false}
        color="primary"
      />
    );
    return <FormControlLabel label={t('Show Link Button')} control={control} />;
  };

  return (
    <>
      <Typography variant="h5" className={classes.title}>
        {t('Link Settings')}
      </Typography>
      <Typography variant="body">
        {t(
          'If both setting are disabled, a button will be displayed by default.',
        )}
      </Typography>
      <FormGroup>
        {renderIframeToggle()}
        {renderButtonToggle()}
      </FormGroup>
    </>
  );
};

LinkSettings.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default LinkSettings;
