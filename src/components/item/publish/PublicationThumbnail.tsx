import { useState } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { title } from 'process';

import ThumbnailUploader, {
  EventChanges,
} from '@/components/thumbnails/ThumbnailUploader';
import { WARNING_COLOR } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { buildPublishWarningIcon } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

const THUMBNAIL_SIZE = 150;
const SYNC_STATUS_KEY = 'PublicationThumbnail';

type Props = {
  item: PackedItem;
  thumbnailSize?: number;
  fullWidth?: boolean;
};
export const PublicationThumbnail = ({
  item,
  thumbnailSize = THUMBNAIL_SIZE,
  fullWidth = false,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e: EventChanges) => {
    switch (e) {
      case EventChanges.ON_UPLOADING:
      case EventChanges.ON_HAS_THUMBNAIL:
        setShowWarning(false);
        break;
      case EventChanges.ON_NO_THUMBNAIL:
        setShowWarning(true);
        break;
      default:
      // nothing to do
    }
  };

  const warningTooltip = showWarning ? (
    <Tooltip title={t(BUILDER.LIBRARY_SETTINGS_THUMBNAIL_MISSING_WARNING)}>
      <WarningIcon
        htmlColor={WARNING_COLOR}
        data-cy={buildPublishWarningIcon(title)}
      />
    </Tooltip>
  ) : undefined;

  return (
    <ThumbnailUploader
      item={item}
      thumbnailSize={thumbnailSize}
      fullWidth={fullWidth}
      syncStatusKey={SYNC_STATUS_KEY}
      topCornerElement={warningTooltip}
      onChange={handleChange}
    />
  );
};

export default PublicationThumbnail;
