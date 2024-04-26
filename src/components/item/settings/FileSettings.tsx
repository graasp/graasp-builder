import { SelectChangeEvent } from '@mui/material';

import { LocalFileItemType, MaxWidth, S3FileItemType } from '@graasp/sdk';
import { Select } from '@graasp/ui';

import { Expand as ExpandIcon } from 'lucide-react';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { FILE_SETTING_MAX_WIDTH_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemSettingProperty from './ItemSettingProperty';

const FileSettings = ({
  item,
}: {
  item: S3FileItemType | LocalFileItemType;
}): JSX.Element => {
  const { t: translateEnum } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editItem } = mutations.useEditItem();

  const onChange = (e: SelectChangeEvent<MaxWidth>) => {
    editItem({
      id: item.id,
      settings: { maxWidth: e.target.value as MaxWidth },
    });
  };

  return (
    <ItemSettingProperty
      title={translateBuilder(BUILDER.SETTINGS_MAX_WIDTH_LABEL)}
      valueText={translateBuilder(BUILDER.SETTINGS_MAX_WIDTH_LABEL)}
      icon={<ExpandIcon />}
      inputSetting={
        <Select
          id={FILE_SETTING_MAX_WIDTH_ID}
          size="small"
          values={Object.values(MaxWidth).map((s) => ({
            text: translateEnum(s),
            value: s,
          }))}
          onChange={onChange}
          defaultValue={item.settings.maxWidth || MaxWidth.ExtraLarge}
        />
      }
    />
  );
};

export default FileSettings;
