import { ChangeEvent } from 'react';

import { styled } from '@mui/material';

import {
  DEFAULT_FILE_MAX_WIDTH_SETTING,
  LocalFileItemType,
  MaxWidth,
  S3FileItemType,
} from '@graasp/sdk';

import { ExpandIcon } from 'lucide-react';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { FILE_SETTING_MAX_WIDTH_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemSettingProperty from '../ItemSettingProperty';
import { SettingVariant, SettingVariantType } from '../settingTypes';

const StyledSelect = styled('select')(({ theme }) => ({
  // A reset of styles, including removing the default dropdown arrow
  // appearance: 'none',
  // Additional resets for further consistency
  backgroundColor: 'white',
  margin: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',

  // width: '100%',
  minWidth: '15ch',
  maxWidth: 'min-content',
  height: theme.spacing(6),
  cursor: 'pointer',
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0.5, 1),
}));

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

  const maxWidth = item.settings.maxWidth ?? DEFAULT_FILE_MAX_WIDTH_SETTING;

  const onChangeMaxWidth = (e: ChangeEvent<HTMLSelectElement>) => {
    editItem({
      id: item.id,
      settings: { maxWidth: e.target.value as MaxWidth },
    });
  };

  const control = (
    <StyledSelect
      id={FILE_SETTING_MAX_WIDTH_ID}
      onChange={onChangeMaxWidth}
      value={maxWidth}
    >
      {Object.values(MaxWidth).map((s) => (
        <option value={s}>{translateEnum(s)}</option>
      ))}
    </StyledSelect>
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
