import { Record } from 'immutable';
import PropTypes from 'prop-types';

import InfoIcon from '@mui/icons-material/Info';
import { FormControlLabel, FormGroup, Switch, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_COLLAPSE_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
} from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';
import CCLicenseSelection from '../publish/CCLicenseSelection';
import LinkSettings from './LinkSettings';
import ThumbnailSetting from './ThumbnailSetting';

const ItemSettings = ({ item }) => {
  const { t } = useBuilderTranslation();

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
    return (
      <FormControlLabel
        label={t(BUILDER.SETTINGS_PIN_ITEM_LABEL)}
        control={control}
      />
    );
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
    return (
      <FormControlLabel
        label={t(BUILDER.SETTINGS_SHOW_CHAT_LABEL)}
        control={control}
      />
    );
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
        label={t(BUILDER.SETTINGS_COLLAPSE_LABEL)}
        control={control}
      />
    );
    const tooltip = disabled ? (
      <Tooltip
        title={t(BUILDER.SETTINGS_COLLAPSE_FOLDER_INFORMATION)}
        placement="right"
        m={0}
        p={0}
      >
        <InfoIcon color="lightgrey" mb={-0.5} fontSize="small" />
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
    <Container disableGutters mt={2}>
      <Typography variant="h4">{t(BUILDER.SETTINGS_TITLE)}</Typography>

      <FormGroup>
        {renderPinSetting()}
        {renderChatSetting()}
        {renderCollapseSetting()}
      </FormGroup>
      {item.type === ITEM_TYPES.LINK && <LinkSettings item={item} />}
      <ThumbnailSetting item={item} />
      <CCLicenseSelection item={item} />
    </Container>
  );
};

ItemSettings.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default ItemSettings;
