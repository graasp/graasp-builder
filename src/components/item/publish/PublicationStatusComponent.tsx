import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Chip, ChipProps, CircularProgress } from '@mui/material';

import { PackedItem, PublicationStatus } from '@graasp/sdk';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { buildPublicationStatus } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type PublicationChip = {
  icon: JSX.Element;
  label: string;
  color: ChipProps['color'] | undefined;
};

type Props = {
  item: PackedItem;
};
const { usePublicationStatus } = hooks;
export const PublicationStatusComponent = ({ item }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { t: translateEnum } = useEnumsTranslation();
  const { data: status, isLoading } = usePublicationStatus(item.id);
  const translatedType = capitalizeFirstLetter(translateEnum(item.type));

  if (isLoading) {
    return (
      <Chip
        icon={<CircularProgress size={15} />}
        label={t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_LOADING)}
        variant="outlined"
        color="info"
      />
    );
  }

  if (!status) {
    return (
      <Chip
        icon={<ErrorIcon />}
        label={t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_UNKOWN)}
        variant="outlined"
        color="error"
      />
    );
  }

  const getChip = (publicationStatus: PublicationStatus): PublicationChip => {
    switch (publicationStatus) {
      case PublicationStatus.Unpublished:
        return {
          icon: <CloudOffIcon />,
          label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_UNPUBLISHED),
          color: undefined,
        };
      // For now, outdated is not implemented correctly in backend or library,
      // so we are just ignorign this state for the moment.
      case PublicationStatus.Published:
      case PublicationStatus.Outdated:
        return {
          icon: <CloudDoneIcon />,
          label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_PUBLISHED),
          color: 'success' as const,
        };
      case PublicationStatus.PublishedChildren:
        return {
          icon: <CloudDoneIcon />,
          label: t(
            BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_PUBLISHED_CHILDREN,
          ),
          color: 'success' as const,
        };
      case PublicationStatus.ReadyToPublish:
        return {
          icon: <CloudOffIcon />,
          label: t(
            BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_READY_TO_PUBLISH,
          ),
          color: undefined,
        };
      case PublicationStatus.Pending:
        return {
          icon: <PendingActionsIcon />,
          label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_PENDING),
          color: 'info' as const,
        };
      case PublicationStatus.Invalid:
        return {
          icon: <ErrorIcon />,
          label: t(BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_INVALID),
          color: 'error' as const,
        };
      case PublicationStatus.ItemTypeNotAllowed:
      default:
        return {
          icon: <InfoIcon />,
          label: t(
            BUILDER.LIBRARY_SETTINGS_PUBLICATION_STATUS_TYPE_NOT_ALLOWED,
            {
              itemType: translatedType,
            },
          ),
          color: 'info' as const,
        };
    }
  };

  const { icon, label, color } = getChip(status);

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
