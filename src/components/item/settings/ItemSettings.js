import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
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
  SETTINGS_CHATBOX_TOGGLE,
  SETTINGS_PINNED_TOGGLE,
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
}));

const ItemSettings = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const editItem = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const settings = item.get('settings');

  const handleChatbox = (event) => {
    settings.showChatbox = event.target.checked;

    editItem.mutate({
      id: item.get('id'),
      name: item.get('name'),
      settings,
    });
  };

  const handlePinned = (event) => {
    settings.isPinned = event.target.checked;

    editItem.mutate({
      id: item.get('id'),
      name: item.get('name'),
      settings,
    });
  };

  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        {t('Settings')}
      </Typography>

      <FormGroup>
        <FormControlLabel
          label={t('Pin')}
          control={(
            <Switch
              id={SETTINGS_PINNED_TOGGLE}
              onChange={handlePinned}
              checked={settings.isPinned}
              color="primary"
            />
          )}
        />
        <FormControlLabel
          label={t('Show Chat')}
          control={(
            <Switch
              id={SETTINGS_CHATBOX_TOGGLE}
              onChange={handleChatbox}
              checked={settings.showChatbox}
              color="primary"
            />
          )}
        />
      </FormGroup>
    </Container>
  );
};

ItemSettings.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default ItemSettings;
