import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { Container, Stack, Typography, useMediaQuery } from '@mui/material';

import { PublicationStatus } from '@graasp/sdk';
import { Loader, theme } from '@graasp/ui';

import SyncIcon from '@/components/common/SyncIcon';
import {
  DataSyncContextProvider,
  useDataSyncContext,
} from '@/components/context/DataSyncContext';
import CoEditorsContainer from '@/components/item/publish/CoEditorsContainer';
import EditItemDescription from '@/components/item/publish/EditItemDescription';
import { LanguageContainer } from '@/components/item/publish/LanguageContainer';
import LicenseContainer from '@/components/item/publish/LicenseContainer';
import PublicationStatusComponent from '@/components/item/publish/PublicationStatusComponent';
import PublicationThumbnail from '@/components/item/publish/PublicationThumbnail';
import { OutletType } from '@/components/pages/item/type';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';
import { SomeBreakPoints } from '@/types/breakpoint';

import EditItemName from './EditItemName';
import { PublishCustomizedTags } from './customizedTags/PublishCustomizedTags';
import PublicationButtonSelector from './publicationButtons/PublicationButtonSelector';

type StackOrder = { order?: number | SomeBreakPoints<number> };

const { usePublicationStatus } = hooks;

const ItemPublishTab = (): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { item, canAdmin } = useOutletContext<OutletType>();
  const { isLoading: isMemberLoading } = hooks.useCurrentMember();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { status } = useDataSyncContext();
  const { data: publicationStatus, isLoading: isPublicationStatusLoading } =
    usePublicationStatus(item.id);

  const [notifyCoEditors, setNotifyCoEditors] = useState<boolean>(false);

  if (isMemberLoading || isPublicationStatusLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="70vh"
      >
        <Loader />
      </Stack>
    );
  }

  if (!canAdmin) {
    return (
      <Typography mt={3} variant="h3" textAlign="center">
        {t(BUILDER.LIBRARY_SETTINGS_UNAUTHORIZED)}
      </Typography>
    );
  }

  const buildPreviewHeader = (): JSX.Element => (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <PublicationThumbnail item={item} fullWidth={isMobile} />
        <Stack justifyContent="space-between">
          <EditItemName item={item} />
        </Stack>
      </Stack>
      <EditItemDescription item={item} />
    </Stack>
  );

  const buildPreviewContent = (): JSX.Element => (
    <Stack spacing={1}>
      <PublishCustomizedTags item={item} />
      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
        <LanguageContainer item={item} />
        <LicenseContainer item={item} />
      </Stack>
    </Stack>
  );

  const buildPreviewSection = ({ order }: StackOrder): JSX.Element => (
    <Stack spacing={1} flexBasis="100%" order={order}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h3" fontWeight={650}>
          {t(BUILDER.LIBRARY_SETTINGS_PREVIEW_TITLE)}
        </Typography>
        <SyncIcon syncStatus={status} />
      </Stack>
      <Typography>{t(BUILDER.LIBRARY_SETTINGS_PREVIEW_DESCRIPTION)}</Typography>

      {buildPreviewHeader()}
      {buildPreviewContent()}
    </Stack>
  );

  const buildPublicationHeader = ({ order }: StackOrder = {}): JSX.Element => (
    <Stack spacing={1} order={order}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h3" fontWeight={650}>
          {t(BUILDER.LIBRARY_SETTINGS_TITLE)}
        </Typography>
        <PublicationStatusComponent item={item} />
      </Stack>
      <Typography>{t(BUILDER.LIBRARY_SETTINGS_INFORMATION)}</Typography>
    </Stack>
  );

  const buildPublicationSection = ({ order }: StackOrder = {}): JSX.Element => (
    <Stack spacing={3} flexBasis="100%" order={order}>
      <CoEditorsContainer
        item={item}
        notifyCoEditors={notifyCoEditors}
        onNotificationChanged={(enabled) => setNotifyCoEditors(enabled)}
      />
      <PublicationButtonSelector
        item={item}
        notifyCoEditors={notifyCoEditors}
      />
    </Stack>
  );

  const buildPublicationStack = (): JSX.Element => (
    <Stack flexBasis="100%" spacing={2}>
      {buildPublicationHeader()}
      {buildPublicationSection()}
    </Stack>
  );

  const buildView = () => {
    if (
      !publicationStatus ||
      publicationStatus === PublicationStatus.ItemTypeNotAllowed
    ) {
      return buildPublicationStack();
    }

    return (
      <Stack direction={{ xs: 'column', md: 'row' }} gap={6}>
        {buildPreviewSection({ order: { xs: 1, md: 0 } })}
        {isMobile ? (
          <>
            {buildPublicationHeader({ order: { xs: 0 } })}
            {buildPublicationSection({ order: { xs: 2 } })}
          </>
        ) : (
          buildPublicationStack()
        )}
      </Stack>
    );
  };

  return (
    <Container disableGutters sx={{ mt: 2 }}>
      {buildView()}
    </Container>
  );
};

const ItemPublishWithContext = (): JSX.Element => (
  <DataSyncContextProvider>
    <ItemPublishTab />
  </DataSyncContextProvider>
);

export default ItemPublishWithContext;
