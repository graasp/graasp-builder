import InfoIcon from '@mui/icons-material/Info';
import { FormControlLabel, FormGroup, Switch, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { FC, useEffect, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import {
  ItemSettings as ItemSettingsType,
  ItemType,
  convertJs,
} from '@graasp/sdk';
import { ImmutableCast, ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';

import {
  DEFAULT_COLLAPSIBLE_SETTING,
  DEFAULT_PINNED_SETTING,
  DEFAULT_RESIZE_SETTING,
  DEFAULT_SAVE_ACTIONS_SETTING,
  DEFAULT_SHOW_CHATBOX_SETTING,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_COLLAPSE_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
  SETTINGS_RESIZE_TOGGLE_ID,
  SETTINGS_SAVE_ACTIONS_TOGGLE_ID,
} from '../../../config/selectors';
import AdminChatSettings from './AdminChatSettings';
import LinkSettings from './LinkSettings';
import ThumbnailSetting from './ThumbnailSetting';

type Props = {
  item: ItemRecord;
};

const ItemSettings: FC<Props> = ({ item }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = useMutation<
    unknown,
    unknown,
    { id: string; name: string; settings: ItemSettingsType }
  >(MUTATION_KEYS.EDIT_ITEM);

  const { settings } = item;

  const [settingLocal, setSettingLocal] =
    useState<ImmutableCast<ItemSettingsType>>(settings);

  useEffect(
    () => {
      if (settings) {
        // this is used because we get a response where the setting only contains the modified setting
        // so it make the toggles flicker.
        // by only overriding keys that changes we are able to remove the flicker effect

        setSettingLocal((previousSettings) =>
          convertJs({ ...previousSettings?.toJS(), ...settings.toJS() }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings],
  );

  const handleOnToggle = (
    event: { target: { checked: boolean } },
    settingKey: string,
  ): void => {
    const newValue = event.target.checked;
    setSettingLocal(
      convertJs({
        ...settingLocal?.toJS(),
        [settingKey]: newValue,
      }),
    );
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        [settingKey]: newValue,
      },
    });
  };

  const renderPinSetting = () => {
    const control = (
      <Switch
        id={SETTINGS_PINNED_TOGGLE_ID}
        onChange={(e) => handleOnToggle(e, 'isPinned')}
        checked={settingLocal?.isPinned || DEFAULT_PINNED_SETTING}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_PIN_ITEM_LABEL)}
        control={control}
      />
    );
  };

  const renderChatSetting = () => {
    const control = (
      <Switch
        id={SETTINGS_CHATBOX_TOGGLE_ID}
        onChange={(e) => handleOnToggle(e, 'showChatbox')}
        checked={settingLocal?.showChatbox || DEFAULT_SHOW_CHATBOX_SETTING}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_SHOW_CHAT_LABEL)}
        control={control}
      />
    );
  };

  const renderResizeSetting = () => {
    const control = (
      <Switch
        id={SETTINGS_RESIZE_TOGGLE_ID}
        onChange={(e) => handleOnToggle(e, 'isResizable')}
        checked={settingLocal?.isResizable || DEFAULT_RESIZE_SETTING}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_RESIZE_LABEL)}
        control={control}
      />
    );
  };

  const renderCollapseSetting = () => {
    const disabled = item.type === ItemType.FOLDER;
    const control = (
      <Switch
        id={SETTINGS_COLLAPSE_TOGGLE_ID}
        onChange={(e) => handleOnToggle(e, 'isCollapsible')}
        checked={settingLocal?.isCollapsible || DEFAULT_COLLAPSIBLE_SETTING}
        color="primary"
        disabled={disabled}
      />
    );
    const formLabel = (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_COLLAPSE_LABEL)}
        control={control}
      />
    );
    const tooltip = disabled ? (
      <Tooltip
        title={translateBuilder(BUILDER.SETTINGS_COLLAPSE_FOLDER_INFORMATION)}
        placement="right"
        sx={{ m: 0, p: 0 }}
      >
        <span>
          <InfoIcon htmlColor="gray" sx={{ mb: -0.5 }} fontSize="small" />
        </span>
      </Tooltip>
    ) : null;
    return (
      <div>
        {formLabel}
        {tooltip}
      </div>
    );
  };

  const renderSaveActionsSetting = () => {
    const control = (
      <Tooltip title="Coming soon!">
        <span>
          <Switch
            id={SETTINGS_SAVE_ACTIONS_TOGGLE_ID}
            onChange={(e) => handleOnToggle(e, 'enableSaveActions')}
            checked={
              settingLocal?.enableSaveActions || DEFAULT_SAVE_ACTIONS_SETTING
            }
            color="primary"
            disabled
          />
        </span>
      </Tooltip>
    );
    return (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_SAVE_ACTIONS)}
        control={control}
      />
    );
  };

  return (
    <Container disableGutters sx={{ mt: 2 }}>
      <Typography variant="h4">
        {translateBuilder(BUILDER.SETTINGS_TITLE)}
      </Typography>

      <FormGroup>
        {renderPinSetting()}
        {renderCollapseSetting()}
        {item.type === ItemType.APP && renderResizeSetting()}
        {renderChatSetting()}
        {renderSaveActionsSetting()}
      </FormGroup>
      {item.type === ItemType.LINK && <LinkSettings item={item} />}
      <ThumbnailSetting item={item} />
      <AdminChatSettings item={item} />
    </Container>
  );
};

export default ItemSettings;
