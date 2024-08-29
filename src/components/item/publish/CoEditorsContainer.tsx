import { useEffect, useState } from 'react';

import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { PackedItem, PublicationStatus } from '@graasp/sdk';

import { useDataSyncContext } from '@/components/context/DataSyncContext';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import {
  CO_EDITOR_SETTINGS_CHECKBOX_ID,
  EMAIL_NOTIFICATION_CHECKBOX,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

const SYNC_STATUS_KEY = 'PublishCoEditors';

type Props = {
  item: PackedItem;
  notifyCoEditors: boolean;
  onNotificationChanged: (enabled: boolean) => void;
};

const { usePublicationStatus } = hooks;

export const CoEditorsContainer = ({
  item,
  notifyCoEditors,
  onNotificationChanged,
}: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();
  const { computeStatusFor } = useDataSyncContext();
  const { data: status } = usePublicationStatus(item.id);
  const { settings, id: itemId, name: itemName } = item;
  const [displayCoEditors, setDisplayCoEditors] = useState(
    settings.displayCoEditors ?? false,
  );

  const hiddenStatus = [
    PublicationStatus.PublishedChildren,
    PublicationStatus.ItemTypeNotAllowed,
  ];

  const {
    mutate: updateDisplayCoEditors,
    isPending: isLoading,
    isSuccess,
    isError,
  } = mutations.useEditItem({
    enableNotifications: false,
  });

  useEffect(
    () => computeStatusFor(SYNC_STATUS_KEY, { isLoading, isSuccess, isError }),
    [isLoading, isSuccess, isError, computeStatusFor],
  );

  useEffect(() => {
    if (settings.displayCoEditors) {
      setDisplayCoEditors(settings.displayCoEditors);
    }
  }, [settings]);

  const handleDisplayCoEditorsChange = (isChecked: boolean): void => {
    setDisplayCoEditors(isChecked);
    updateDisplayCoEditors({
      id: itemId,
      name: itemName,
      settings: { displayCoEditors: isChecked },
    });
  };

  const handleNotifyCoEditorsChange = (isChecked: boolean): void =>
    onNotificationChanged(isChecked);

  if (!status || hiddenStatus.includes(status)) {
    return null;
  }

  return (
    <Stack>
      <Typography variant="h4">
        {t(BUILDER.ITEM_SETTINGS_CO_EDITORS_TITLE)}
      </Typography>
      <FormControlLabel
        data-cy={CO_EDITOR_SETTINGS_CHECKBOX_ID}
        onChange={(_e, checked) => handleDisplayCoEditorsChange(checked)}
        control={<Checkbox size="small" checked={displayCoEditors} />}
        label={t(BUILDER.ITEM_SETTINGS_CO_EDITORS_INFORMATIONS)}
        sx={{ maxWidth: 'max-content' }}
      />
      <FormControlLabel
        data-cy={EMAIL_NOTIFICATION_CHECKBOX}
        onChange={(_e, checked) => handleNotifyCoEditorsChange(checked)}
        control={<Checkbox size="small" checked={notifyCoEditors} />}
        label={t(BUILDER.LIBRARY_SETTINGS_PUBLISH_NOTIFICATIONS_LABEL)}
        sx={{ maxWidth: 'max-content' }}
      />
    </Stack>
  );
};

export default CoEditorsContainer;
