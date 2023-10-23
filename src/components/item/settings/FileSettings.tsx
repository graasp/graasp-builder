import { Box, SelectChangeEvent, Stack, Typography } from '@mui/material';

import { MaxWidth } from '@graasp/sdk';
import {
  LocalFileItemTypeRecord,
  S3FileItemTypeRecord,
} from '@graasp/sdk/frontend';
import { Select } from '@graasp/ui';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { FILE_SETTING_MAX_WIDTH_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

const FileSettings = ({
  item,
}: {
  item: S3FileItemTypeRecord | LocalFileItemTypeRecord;
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
    <Box mt={4} my={4}>
      <Typography variant="h5" m={0} p={0}>
        {translateBuilder(BUILDER.SETTINGS_FILE_SETTINGS_TITLE)}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack>
          <Typography variant="body1">
            {translateBuilder('Maximum width')}
          </Typography>
        </Stack>
        <Stack>
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
        </Stack>
      </Stack>
    </Box>
  );
};

export default FileSettings;
