import { useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { TextDisplay } from '@graasp/ui';

import { useDataSyncContext } from '@/components/context/DataSyncContext';
import useModalStatus from '@/components/hooks/useModalStatus';
import DebouncedTextEditor from '@/components/input/DebouncedTextEditor';
import { WARNING_COLOR } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import PublicationModal from './PublicationModal';

const SYNC_STATUS_KEY = 'PublishItemDescription';

type Props = {
  item: DiscriminatedItem;
};

export const EditItemDescription = ({ item }: Props): JSX.Element => {
  const { description, id: itemId } = item;
  const { t } = useBuilderTranslation();
  const { computeStatusFor } = useDataSyncContext();
  const { isOpen, openModal, closeModal } = useModalStatus();

  const {
    mutate: updateItem,
    isSuccess,
    isPending: isLoading,
    isError,
  } = mutations.useEditItem({
    enableNotifications: false,
  });

  useEffect(
    () => computeStatusFor(SYNC_STATUS_KEY, { isError, isLoading, isSuccess }),
    [computeStatusFor, isError, isLoading, isSuccess],
  );

  const handleDescriptionUpdated = (newDescription?: string) => {
    updateItem({
      id: itemId,
      description: newDescription ?? '',
    });
  };

  const modal = (
    <PublicationModal
      isOpen={isOpen}
      title={t(BUILDER.DESCRIPTION_LABEL)}
      modalContent={
        <DebouncedTextEditor
          initialValue={description ?? undefined}
          onUpdate={handleDescriptionUpdated}
          showActions={false}
        />
      }
      handleOnClose={closeModal}
    />
  );

  const noDescriptionToolTip = !description ? (
    <Tooltip
      title={t(BUILDER.LIBRARY_SETTINGS_ITEM_DESCRIPTION_MISSING_WARNING)}
    >
      <WarningIcon htmlColor={WARNING_COLOR} />
    </Tooltip>
  ) : null;

  const descriptionHeader = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="h5">{t(BUILDER.DESCRIPTION_LABEL)}</Typography>
      <IconButton onClick={openModal}>
        <EditIcon />
      </IconButton>
    </Stack>
  );

  const descriptionContent = (
    <Stack direction="row" alignItems="center" spacing={1} pb={1}>
      <TextDisplay
        content={description || t(BUILDER.LIBRARY_SETTINGS_ITEM_NO_DESCRIPTION)}
      />
      {noDescriptionToolTip}
    </Stack>
  );

  return (
    <>
      {modal}
      <Stack>
        {descriptionHeader}
        {descriptionContent}
      </Stack>
    </>
  );
};

export default EditItemDescription;
