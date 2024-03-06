import { Typography } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { ActionButton, ChatboxButton, PinButton } from '@graasp/ui';

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

import DescriptionPlacementForm from '../form/DescriptionPlacementForm';
import FileSettings from './FileSettings';
import ItemSettingCheckBoxProperty from './ItemSettingCheckBoxProperty';
import LinkSettings from './LinkSettings';

type Props = {
  item: DiscriminatedItem;
};

type ItemSetting = DiscriminatedItem['settings'];

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
        return <FileSettings item={item} />;
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
    <>
      <Typography variant="h6" mt={3}>
        {translateBuilder(BUILDER.SETTINGS_TITLE)}
      </Typography>
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

      <ItemSettingCheckBoxProperty
        icon={
          <ChatboxButton
            showChat={Boolean(settings.showChatbox)}
            type={ActionButton.ICON}
          />
        }
        id={SETTINGS_CHATBOX_TOGGLE_ID}
        title={translateBuilder(BUILDER.ITEM_SETTINGS_SHOW_CHAT_TITLE)}
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

      {item.type !== ItemType.FOLDER && (
        <DescriptionPlacementForm
          updatedProperties={item}
          onPlacementChanged={(newPlacement) =>
            handleSettingChanged('descriptionPlacement', newPlacement)
          }
        />
      )}
    </>
  );
};

export default ItemSettingsProperties;
