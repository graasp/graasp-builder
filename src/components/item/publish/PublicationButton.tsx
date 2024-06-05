import { useState } from 'react';

import LinkIcon from '@mui/icons-material/Link';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { ClientHostManager, PackedItem, ShortLinkPlatform } from '@graasp/sdk';

import { CheckIcon } from 'lucide-react';

import { ADMIN_CONTACT } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { buildItemPublicationButton } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { PublicationStatus, PublicationStatusMap } from '@/types/publication';

import ContentLoader from '../../common/ContentLoader';
import useModalStatus from '../../hooks/useModalStatus';
import usePublicationStatus from '../../hooks/usePublicationStatus';
import PublicVisibilityModal from './PublicVisibilityModal';

type Props = {
  item: PackedItem;
  notifyCoEditors: boolean;
};

type PublicationButtonMap = PublicationStatusMap<{
  description: JSX.Element | string;
  elements: JSX.Element | JSX.Element[];
}>;

enum ActionOnValidate {
  PUBLISH,
  VALIDATE,
}

type ActionOnValidateMap = { name: ActionOnValidate; action: () => void };

const { useUnpublishItem, usePublishItem, usePostItemValidation } = mutations;

export const PublicationButton = ({
  item,
  notifyCoEditors,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { id: itemId, public: isPublic } = item;
  const { status, isinitialLoading: isStatusFirstLoading } =
    usePublicationStatus({ item });
  const { isOpen, openModal, closeModal } = useModalStatus();

  const { mutate: validateItem, isLoading: isValidating } =
    usePostItemValidation();
  const { mutate: unpublish, isLoading: isUnPublishing } = useUnpublishItem();
  const { mutate: publish, isLoading: isPublishing } = usePublishItem();

  const [actionOnValidate, setActionOnValidate] =
    useState<ActionOnValidateMap>();

  const publishItem = () =>
    publish({ id: itemId, notification: notifyCoEditors });

  const handleActionOrOpenModal = (actionMap: ActionOnValidateMap) => {
    if (isPublic) {
      actionMap.action();
    } else {
      setActionOnValidate(actionMap);
      openModal();
    }
  };

  const handlePublishItem = () => {
    const action = () => publishItem();
    handleActionOrOpenModal({ name: ActionOnValidate.PUBLISH, action });
  };

  const handleValidateItem = () => {
    const action = () => validateItem({ itemId });
    handleActionOrOpenModal({ name: ActionOnValidate.VALIDATE, action });
  };

  const handleUnPublishItem = () => unpublish({ id: itemId });

  const handleModalValidate = () => {
    actionOnValidate?.action();
    setActionOnValidate(undefined);
    closeModal();
  };

  const getLibraryLink = () => {
    const clientHostManager = ClientHostManager.getInstance();
    return clientHostManager.getItemLink(ShortLinkPlatform.library, itemId);
  };

  const publicationButtonMap: PublicationButtonMap = {
    [PublicationStatus.Unpublished]: {
      description: t(BUILDER.LIBRARY_SETTINGS_VALIDATION_INFORMATIONS),
      elements: (
        <LoadingButton
          variant="contained"
          onClick={handleValidateItem}
          loading={isValidating}
          data-cy={buildItemPublicationButton(PublicationStatus.Unpublished)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_VALIDATE_BUTTON)}
        </LoadingButton>
      ),
    },
    [PublicationStatus.Pending]: {
      description: t(
        BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_AUTOMATIC,
      ),
      elements: [],
    },
    [PublicationStatus.ReadyToPublish]: {
      description: (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="info">
          {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_READY_TO_PUBLISH)}
        </Alert>
      ),
      elements: (
        <LoadingButton
          variant="contained"
          loading={isPublishing}
          onClick={handlePublishItem}
          data-cy={buildItemPublicationButton(PublicationStatus.ReadyToPublish)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON)}
        </LoadingButton>
      ),
    },
    [PublicationStatus.NotPublic]: {
      description: t(BUILDER.LIBRARY_SETTINGS_VISIBILITY_INFORMATIONS),
      elements: (
        <LoadingButton
          variant="contained"
          onClick={handlePublishItem}
          loading={isValidating}
          data-cy={buildItemPublicationButton(PublicationStatus.NotPublic)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_VISIBILITY_CHANGE_BUTTON)}
        </LoadingButton>
      ),
    },
    [PublicationStatus.Published]: {
      description: t(BUILDER.LIBRARY_SETTINGS_PUBLISHED_STATUS),
      elements: [
        <LoadingButton
          key={BUILDER.LIBRARY_SETTINGS_UNPUBLISH_BUTTON}
          variant="outlined"
          loading={isUnPublishing}
          onClick={handleUnPublishItem}
          data-cy={buildItemPublicationButton(PublicationStatus.Published)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_UNPUBLISH_BUTTON)}
        </LoadingButton>,
        <Button
          key={BUILDER.LIBRARY_SETTINGS_VIEW_LIBRARY_BUTTON}
          variant="contained"
          startIcon={<LinkIcon />}
          href={getLibraryLink()}
          target="_blank"
        >
          {t(BUILDER.LIBRARY_SETTINGS_VIEW_LIBRARY_BUTTON)}
        </Button>,
      ],
    },
    [PublicationStatus.PublishedChildren]: {
      description: t(BUILDER.LIBRARY_SETTINGS_CHILD_PUBLISHED_STATUS),
      elements: [],
    },
    [PublicationStatus.Invalid]: {
      description: t(BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_FAILURE, {
        contact: ADMIN_CONTACT,
      }),
      elements: (
        <LoadingButton
          variant="contained"
          onClick={handleValidateItem}
          loading={isValidating}
          data-cy={buildItemPublicationButton(PublicationStatus.Invalid)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_RETRY_BUTTON)}
        </LoadingButton>
      ),
    },
    [PublicationStatus.Outdated]: {
      description: t(BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_OUTDATED),
      elements: (
        <LoadingButton
          variant="contained"
          onClick={handleValidateItem}
          loading={isValidating}
          data-cy={buildItemPublicationButton(PublicationStatus.Outdated)}
        >
          {t(BUILDER.LIBRARY_SETTINGS_VALIDATION_VALIDATE_BUTTON)}
        </LoadingButton>
      ),
    },
  };

  const getDescriptionElement = (
    description: string | JSX.Element,
  ): JSX.Element => {
    if (typeof description === 'string') {
      return <Typography>{description}</Typography>;
    }

    return description;
  };

  const { description, elements } = publicationButtonMap[status];

  return (
    <>
      {!isPublic && (
        <PublicVisibilityModal
          item={item}
          isOpen={isOpen}
          enableUpdateVisibility={
            actionOnValidate?.name === ActionOnValidate.PUBLISH
          }
          onClose={closeModal}
          onValidate={handleModalValidate}
        />
      )}
      <ContentLoader isLoading={isStatusFirstLoading}>
        <Stack spacing={4}>
          {getDescriptionElement(description)}

          <Stack justifyContent="center" direction="row" spacing={2}>
            {elements}
          </Stack>
        </Stack>
      </ContentLoader>
    </>
  );
};

export default PublicationButton;
