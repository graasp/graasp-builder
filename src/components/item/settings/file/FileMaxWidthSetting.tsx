import { SelectChangeEvent } from '@mui/material';

import { LocalFileItemType, MaxWidth, S3FileItemType } from '@graasp/sdk';
import { Select } from '@graasp/ui';

import { ExpandIcon } from 'lucide-react';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { FILE_SETTING_MAX_WIDTH_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemSettingProperty from '../ItemSettingProperty';
import { SettingVariant, SettingVariantType } from '../settingTypes';

const maxWidthDefault = 'default';

export const FileMaxWidthSetting = ({
  variant = SettingVariant.List,
  item,
}: {
  variant: SettingVariantType;
  item: S3FileItemType | LocalFileItemType;
}): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { t: translateEnum } = useEnumsTranslation();

  const { mutate: editItem } = mutations.useEditItem();

  const { maxWidth = maxWidthDefault } = item.settings;

  const onChangeMaxWidth = (e: SelectChangeEvent<string>) => {
    editItem({
      id: item.id,
      settings: { maxWidth: e.target.value as MaxWidth },
    });
  };

  const control = (
    <Select
      id={FILE_SETTING_MAX_WIDTH_ID}
      onChange={onChangeMaxWidth}
      value={maxWidth as string}
      values={[
        {
          value: maxWidthDefault,
          text: translateEnum(maxWidthDefault),
          disabled: true,
        },
        ...Object.values(MaxWidth).map((s) => ({
          value: s,
          text: translateEnum(s),
        })),
      ]}
      size="small"
      sx={{
        // this ensure the select stretches to be the same height as the buttons
        height: '100%',
      }}
    />
  );

  switch (variant) {
    case SettingVariant.List:
      return (
        <ItemSettingProperty
          title={t(BUILDER.SETTINGS_MAX_WIDTH_LABEL)}
          valueText={t(BUILDER.SETTINGS_MAX_WIDTH_LABEL)}
          icon={<ExpandIcon />}
          inputSetting={control}
        />
      );
    case SettingVariant.Button:
    default:
      return control;
  }
};
export default FileMaxWidthSetting;
