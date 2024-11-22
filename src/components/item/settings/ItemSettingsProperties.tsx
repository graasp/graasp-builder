import { Stack } from '@mui/material';

import { ItemType, PackedItem } from '@graasp/sdk';
import { ActionButton, PinButton } from '@graasp/ui';

import { BarChart3, MessageSquareOff, MessageSquareText } from 'lucide-react';

import CollapseButton from '@/components/common/CollapseButton';
import {
  DEFAULT_RESIZE_SETTING,
  DEFAULT_SAVE_ACTIONS_SETTING,
} from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  SETTINGS_CHATBOX_TOGGLE_ID,
  SETTINGS_PINNED_TOGGLE_ID,
  SETTINGS_RESIZE_TOGGLE_ID,
  SETTINGS_SAVE_ACTIONS_TOGGLE_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import HideSettingCheckbox from '../sharing/HideSettingCheckbox';
import ItemSettingCheckBoxProperty from './ItemSettingCheckBoxProperty';
import LinkSettings from './LinkSettings';
import FileAlignmentSetting from './file/FileAlignmentSetting';
import FileMaxWidthSetting from './file/FileMaxWidthSetting';
import { SettingVariant } from './settingTypes';

type Props = {
  item: PackedItem;
};

type ItemSetting = PackedItem['settings'];

const ItemSettingsProperties = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editItem } = mutations.useEditItem();

  const { settings } = item;

  // TODO: remove | string in settingKey when enableAnalytics is added to settings in SDK...
  const handleSettingChanged = <K extends keyof ItemSetting>(
    settingKey: K | string,
    newValue: unknown,
  ) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        [settingKey]: newValue,
      },
    });
  };

  const handleOnToggle = <K extends keyof ItemSetting>(
    event: { target: { checked: boolean } },
    settingKey: K | string,
  ): void => {
    handleSettingChanged(settingKey, event.target.checked);
  };

  const renderSettingsPerType = () => {
    switch (item.type) {
      case ItemType.LINK:
        return <LinkSettings item={item} />;
      case ItemType.S3_FILE:
      case ItemType.LOCAL_FILE:
        return (
          <>
            <FileMaxWidthSetting item={item} variant={SettingVariant.List} />
            <FileAlignmentSetting item={item} variant={SettingVariant.List} />
          </>
        );

      case ItemType.APP:
        return (
          <ItemSettingCheckBoxProperty
            id={SETTINGS_RESIZE_TOGGLE_ID}
            title={translateBuilder(
              BUILDER.ITEM_SETTINGS_RESIZABLE_ENABLED_TEXT,
            )}
            checked={Boolean(settings?.isResizable || DEFAULT_RESIZE_SETTING)}
            onClick={(checked: boolean): void => {
              handleOnToggle({ target: { checked } }, 'isResizable');
            }}
            valueText={
              settings?.isResizable
                ? translateBuilder(BUILDER.ITEM_SETTINGS_RESIZABLE_ENABLED_TEXT)
                : translateBuilder(
                    BUILDER.ITEM_SETTINGS_RESIZABLE_DISABLED_TEXT,
                  )
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack direction="column" gap={2}>
      <ItemSettingCheckBoxProperty
        title={translateBuilder(BUILDER.ITEM_SETTINGS_IS_COLLAPSED_TITLE)}
        icon={<CollapseButton type={ActionButton.ICON} item={item} />}
        checked={Boolean(settings.isCollapsible)}
        disabled={item.type === ItemType.FOLDER}
        onClick={(checked: boolean): void => {
          handleOnToggle({ target: { checked } }, 'isCollapsible');
        }}
        valueText={(() => {
          if (item.type === ItemType.FOLDER) {
            return translateBuilder(
              BUILDER.SETTINGS_COLLAPSE_FOLDER_INFORMATION,
            );
          }
          return settings.isCollapsible
            ? translateBuilder(BUILDER.ITEM_SETTINGS_IS_COLLAPSED_ENABLED_TEXT)
            : translateBuilder(
                BUILDER.ITEM_SETTINGS_IS_COLLAPSED_DISABLED_TEXT,
              );
        })()}
      />

      <ItemSettingCheckBoxProperty
        id={SETTINGS_PINNED_TOGGLE_ID}
        icon={
          <PinButton
            isPinned={Boolean(settings.isPinned)}
            type={ActionButton.ICON}
          />
        }
        title={translateBuilder(BUILDER.ITEM_SETTINGS_IS_PINNED_TITLE)}
        checked={Boolean(settings.isPinned)}
        onClick={(checked: boolean): void => {
          handleOnToggle({ target: { checked } }, 'isPinned');
        }}
        valueText={
          settings.isPinned
            ? translateBuilder(BUILDER.ITEM_SETTINGS_IS_PINNED_ENABLED_TEXT)
            : translateBuilder(BUILDER.ITEM_SETTINGS_IS_PINNED_DISABLED_TEXT)
        }
      />

      <HideSettingCheckbox item={item} />

      <ItemSettingCheckBoxProperty
        id={SETTINGS_CHATBOX_TOGGLE_ID}
        title={translateBuilder(BUILDER.ITEM_SETTINGS_SHOW_CHAT_TITLE)}
        icon={
          settings.showChatbox ? <MessageSquareText /> : <MessageSquareOff />
        }
        checked={Boolean(settings.showChatbox)}
        onClick={(checked: boolean): void => {
          handleOnToggle({ target: { checked } }, 'showChatbox');
        }}
        valueText={
          settings.showChatbox
            ? translateBuilder(BUILDER.ITEM_SETTINGS_SHOW_CHAT_ENABLED_TEXT)
            : translateBuilder(BUILDER.ITEM_SETTINGS_SHOW_CHAT_DISABLED_TEXT)
        }
      />
      <ItemSettingCheckBoxProperty
        id={SETTINGS_SAVE_ACTIONS_TOGGLE_ID}
        title={translateBuilder(BUILDER.SETTINGS_SAVE_ACTIONS)}
        icon={<BarChart3 />}
        checked={Boolean(
          settings?.enableSaveActions ?? DEFAULT_SAVE_ACTIONS_SETTING,
        )}
        onClick={(checked: boolean): void => {
          // TODO: add enableAnalytics in the ItemSettings type
          handleOnToggle({ target: { checked } }, 'enableAnalytics');
        }}
        valueText="Coming soon"
        disabled
      />

      {renderSettingsPerType()}
    </Stack>
  );
};

export default ItemSettingsProperties;
