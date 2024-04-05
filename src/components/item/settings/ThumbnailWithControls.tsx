import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { DiscriminatedItem, getMimetype } from '@graasp/sdk';
import { ItemIcon, Thumbnail } from '@graasp/ui';

import { PenIcon, Trash2 } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_THUMBNAIL_DELETE_BTN_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../../config/constants';

type Props = {
  item: DiscriminatedItem;
  isLoading: boolean;
  url?: string;
  alt: string;
  onDelete: () => void;
  onEdit: () => void;
  hasThumbnail?: boolean;
};

const ThumbnailWithDeleteButton = ({
  item,
  isLoading,
  url,
  alt,
  onDelete,
  onEdit,
  hasThumbnail,
}: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useBuilderTranslation();
  return (
    <Stack direction="column" alignItems="center" gap={1}>
      <Box onClick={onEdit}>
        <Thumbnail
          id={item.id}
          isLoading={isLoading}
          defaultComponent={
            <ItemIcon
              alt={alt}
              type={item.type}
              mimetype={getMimetype(item.extra)}
            />
          }
          url={url}
          alt={alt}
          maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
          maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
          sx={{ borderRadius: 2 }}
        />
      </Box>
      {!hasThumbnail && (
        <Typography variant="caption">
          {t(BUILDER.SETTINGS_THUMBNAIL_SETTINGS_INFORMATIONS)}
        </Typography>
      )}
      <Stack direction="row" gap={2}>
        <IconButton color="primary" onClick={onEdit}>
          <PenIcon color={theme.palette.primary.main} />
        </IconButton>
        {hasThumbnail && (
          <IconButton id={ITEM_THUMBNAIL_DELETE_BTN_ID} onClick={onDelete}>
            <Trash2 color={theme.palette.error.main} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
};

export default ThumbnailWithDeleteButton;
