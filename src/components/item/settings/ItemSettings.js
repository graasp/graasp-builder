import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import {
  FormControlLabel,
  FormGroup,
  makeStyles,
  Switch,
} from '@material-ui/core';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import {
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
} from '../../../config/selectors';
import ThumbnailSetting from './ThumbnailSetting';

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
}));

const ItemSettings = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const editItem = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const settings = item.get('settings');

  const handleChatbox = (event) => {
    editItem.mutate({
      id: item.get('id'),
      name: item.get('name'),
      settings: {
        showChatbox: event.target.checked,
      },
    });
  };

  const handlePinned = (event) => {
    editItem.mutate({
      id: item.get('id'),
      name: item.get('name'),
      settings: {
        isPinned: event.target.checked,
      },
    });
  };

  const renderPinSetting = () => {
    const control = (
      <Switch
        id={SETTINGS_PINNED_TOGGLE_ID}
        onChange={handlePinned}
        checked={settings?.isPinned}
        color="primary"
      />
    );
    return <FormControlLabel label={t('Pin')} control={control} />;
  };

  const renderChatSetting = () => {
    const control = (
      <Switch
        id={SETTINGS_CHATBOX_TOGGLE_ID}
        onChange={handleChatbox}
        checked={settings?.showChatbox}
        color="primary"
      />
    );
    return <FormControlLabel label={t('Show Chat')} control={control} />;
  };

  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        {t('Settings')}
      </Typography>

      <FormGroup>
        {renderPinSetting()}
        {renderChatSetting()}
      </FormGroup>
      <ThumbnailSetting item={item} />
    </Container>
  );
};

ItemSettings.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default ItemSettings;
