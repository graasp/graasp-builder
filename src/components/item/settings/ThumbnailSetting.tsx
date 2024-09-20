import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import ThumbnailUploader, {
  EventChanges,
} from '@/components/thumbnails/ThumbnailUploader';

import { useBuilderTranslation } from '../../../config/i18n';
import { BUILDER } from '../../../langs/constants';

const THUMBNAIL_SIZE = 120;
const SYNC_STATUS_KEY = 'ThumbnailSetting';

type Props = { item: PackedItem };

const ThumbnailSetting = ({ item }: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();
  const [hasThumbnail, setHasThumbnail] = useState(Boolean(item.thumbnails));

  const handleChange = (e: EventChanges) => {
    switch (e) {
      case EventChanges.ON_UPLOADING:
      case EventChanges.ON_HAS_THUMBNAIL:
        setHasThumbnail(true);
        break;
      case EventChanges.ON_NO_THUMBNAIL:
        setHasThumbnail(false);
        break;
      default:
      // nothing to do
    }
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <ThumbnailUploader
        item={item}
        thumbnailSize={THUMBNAIL_SIZE}
        syncStatusKey={SYNC_STATUS_KEY}
        onChange={handleChange}
      />
      {!hasThumbnail && (
        <Typography variant="caption">
          {t(BUILDER.SETTINGS_THUMBNAIL_SETTINGS_INFORMATIONS)}
        </Typography>
      )}
    </Stack>
  );
};

export default ThumbnailSetting;
