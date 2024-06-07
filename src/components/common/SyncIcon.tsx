import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ErrorIcon from '@mui/icons-material/Error';
import { Chip } from '@mui/material';

import { theme } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { SyncStatus } from '../context/DataSyncContext';

type Props = {
  syncStatus: SyncStatus;
};

const ICON_COLOR = '#BBB';

const SyncIcon = ({ syncStatus }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();

  const buildStatus = () => {
    switch (syncStatus) {
      case SyncStatus.SYNCHRONIZING:
        return {
          color: 'default' as const,
          icon: <CloudSyncIcon htmlColor={ICON_COLOR} />,
          text: t(BUILDER.ITEM_STATUS_SYNCHRONIZING),
        };
      case SyncStatus.ERROR:
        return {
          color: 'error' as const,
          icon: <ErrorIcon color="error" />,
          text: t(BUILDER.ITEM_STATUS_ERROR),
        };
      default: {
        return {
          color: 'success' as const,
          icon: <CheckCircleIcon htmlColor={theme.palette.success.light} />,
          text: t(BUILDER.ITEM_STATUS_SYNCHRONIZED),
        };
      }
    }
  };

  const { icon, text, color } = buildStatus();

  return (
    <Chip
      size="small"
      variant="outlined"
      icon={icon}
      label={text}
      color={color}
    />
  );
};

export default SyncIcon;
