import { LoadingButton } from '@mui/lab';
import { Alert } from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { CheckIcon } from 'lucide-react';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { buildItemPublicationButton } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { PublicationStatus } from '@/types/publication';

import PublicVisibilityModal from '../PublicVisibilityModal';
import PublicationButton from './PublicationButton';

type Props = {
  item: PackedItem;
  isLoading: boolean;
  notifyCoEditors: boolean;
};

const { usePublishItem } = mutations;

export const ReadyToPublishButton = ({
  item,
  isLoading,
  notifyCoEditors,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { id: itemId, public: isPublic } = item;
  const { isOpen, openModal, closeModal } = useModalStatus();

  const { mutate: publish, isLoading: isPublishing } = usePublishItem();

  const publishItem = () =>
    publish({ id: itemId, notification: notifyCoEditors });

  const handlePublishItem = () => {
    if (isPublic) {
      publishItem();
    } else {
      openModal();
    }
  };

  const handleModalValidate = () => {
    publishItem();
    closeModal();
  };

  const description = (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity="info">
      {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_READY_TO_PUBLISH)}
    </Alert>
  );
  const elements = (
    <LoadingButton
      variant="contained"
      loading={isPublishing}
      onClick={handlePublishItem}
      data-cy={buildItemPublicationButton(PublicationStatus.ReadyToPublish)}
    >
      {t(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON)}
    </LoadingButton>
  );

  return (
    <>
      {!isPublic && (
        <PublicVisibilityModal
          item={item}
          isOpen={isOpen}
          onClose={closeModal}
          onValidate={handleModalValidate}
        />
      )}
      <PublicationButton
        isLoading={isLoading}
        description={description}
        elements={elements}
      />
    </>
  );
};

export default ReadyToPublishButton;
