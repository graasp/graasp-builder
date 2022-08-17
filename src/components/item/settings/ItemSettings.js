import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import { Record } from 'immutable';
import { useTranslation } from 'react-i18next';
import {
  FormControlLabel,
  FormGroup,
  makeStyles,
  Switch,
  Tooltip,
} from '@material-ui/core';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import {
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
  SETTINGS_COLLAPSE_TOGGLE_ID,
} from '../../../config/selectors';
import ThumbnailSetting from './ThumbnailSetting';
import CCLicenseSelection from '../publish/CCLicenseSelection';
import { ITEM_TYPES } from '../../../enums';

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

const ItemSettings = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const { settings } = item;

  const handleChatbox = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        showChatbox: event.target.checked,
      },
    });
  };

  const handlePinned = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        isPinned: event.target.checked,
      },
    });
  };

  const handleCollapse = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        isCollapsible: event.target.checked,
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

  const renderCollapseSetting = () => {
    const disabled = item.type === ITEM_TYPES.FOLDER;
    const control = (
      <Switch
        id={SETTINGS_COLLAPSE_TOGGLE_ID}
        onChange={handleCollapse}
        checked={settings?.isCollapsible}
        color="primary"
        disabled={disabled}
      />
    );
    const formLabel = (
      <FormControlLabel
        className={classes.collapse}
        label={t('Collapse item')}
        control={control}
      />
    );
    const tooltip = disabled ? (
      <Tooltip title={t('A folder cannot be collapsed')} placement="right">
        <InfoIcon className={classes.collapseTooltip} fontSize="small" />
      </Tooltip>
    ) : null;
    return (
      <div>
        {formLabel}
        {tooltip}
      </div>
    );
  };

  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        {t('Settings')}
      </Typography>

      <FormGroup>
        {renderPinSetting()}
        {renderChatSetting()}
        {renderCollapseSetting()}
      </FormGroup>
      <ThumbnailSetting item={item} />
      <CCLicenseSelection item={item} />
    </Container>
  );
};

ItemSettings.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default ItemSettings;
