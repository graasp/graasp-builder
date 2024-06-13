import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ErrorIcon from '@mui/icons-material/Error';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import InfoIcon from '@mui/icons-material/Info';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import { Chip, ChipProps, CircularProgress } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { buildPublicationStatus } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { PublicationStatus, PublicationStatusMap } from '@/types/publication';

import usePublicationStatus from '../../hooks/usePublicationStatus';

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type PublicationComponentMap = PublicationStatusMap<{
  icon: JSX.Element;
  label: string;
  color: ChipProps['color'] | undefined;
}>;

type Props = {
  item: PackedItem;
};

export const PublicationStatusComponent = ({ item }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { t: translateEnum } = useEnumsTranslation();
  const { status, isinitialLoading } = usePublicationStatus({ item });
  const translatedType = capitalizeFirstLetter(translateEnum(item.type));

  if (isinitialLoading) {
    return (
      <Chip
        icon={<CircularProgress size={15} />}
        label={t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_LOADING)}
        variant="outlined"
        color="info"
      />
    );
  }

  const chipMap: PublicationComponentMap = {
    [PublicationStatus.Published]: {
      icon: <CloudDoneIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_PUBLISHED),
      color: 'success',
    },
    [PublicationStatus.PublishedChildren]: {
      icon: <CloudDoneIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_PUBLISHED_CHILDREN),
      color: 'success',
    },
    [PublicationStatus.Pending]: {
      icon: <PendingActionsIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_PENDING),
      color: 'info',
    },
    [PublicationStatus.ReadyToPublish]: {
      icon: <CloudUploadIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_READY_TO_PUBLISH),
      color: 'success',
    },
    [PublicationStatus.NotPublic]: {
      icon: <PublicOffIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_NOT_PUBLIC),
      color: 'error',
    },
    [PublicationStatus.Invalid]: {
      icon: <ErrorIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_INVALID),
      color: 'error',
    },
    [PublicationStatus.Outdated]: {
      icon: <EventBusyIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_OUTDATED),
      color: 'warning',
    },
    [PublicationStatus.Unpublished]: {
      icon: <CloudOffIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_UNPUBLISHED),
      color: undefined,
    },
    [PublicationStatus.ItemTypeNotAllowed]: {
      icon: <InfoIcon />,
      label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_TYPE_NOT_ALLOWED, {
        itemType: translatedType,
      }),
      color: 'info',
    },
  } as const;

  const { icon, label, color } = chipMap[status];

  return (
    <Chip
      data-cy={buildPublicationStatus(status)}
      icon={icon}
      label={label}
      color={color}
      variant="outlined"
    />
  );
};

export default PublicationStatusComponent;
