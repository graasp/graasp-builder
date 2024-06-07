import { Stack, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import CustomizedTags from '../publish/customizedTags/CustomizedTags';

type Props = {
  item: DiscriminatedItem;
};

export const CustomizedTagsSettings = ({ item }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();

  return (
    <Stack spacing={1}>
      <Typography variant="h4">{t(BUILDER.ITEM_TAGS_TITLE)}</Typography>
      <Typography>{t(BUILDER.ITEM_TAGS_PLACEHOLDER)}</Typography>
      <CustomizedTags item={item} />
    </Stack>
  );
};

export default CustomizedTagsSettings;
