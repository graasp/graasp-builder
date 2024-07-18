import { ReactNode } from 'react';

import { PackedItem, PublicationStatus } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

import InvalidButton from './InvalidButton';
import NotAllowedItemTypeButton from './NotAllowedItemTypeButton';
import NotPublicButton from './NotPublicButton';
import OutdatedButton from './OutdatedButton';
import PendingButton from './PendingButton';
import PublishedButton from './PublishedButton';
import PublishedChildrenButton from './PublishedChildrenButton';
import ReadyToPublishButton from './ReadyToPublishButton';
import UnpublishedButton from './UnpublishedButton';

type Props = {
  item: PackedItem;
  notifyCoEditors: boolean;
};

const { usePublicationStatus } = hooks;

export const PublicationButtonSelector = ({
  item,
  notifyCoEditors,
}: Props): ReactNode | undefined => {
  const { data: status, isInitialLoading: isStatusFirstLoading } =
    usePublicationStatus(item.id);

  switch (status) {
    case PublicationStatus.Unpublished:
      return <UnpublishedButton item={item} isLoading={isStatusFirstLoading} />;
    case PublicationStatus.Pending:
      return <PendingButton />;
    case PublicationStatus.ReadyToPublish:
      return (
        <ReadyToPublishButton
          item={item}
          isLoading={isStatusFirstLoading}
          notifyCoEditors={notifyCoEditors}
        />
      );
    case PublicationStatus.NotPublic:
      return <NotPublicButton item={item} />;
    case PublicationStatus.Published:
      return <PublishedButton item={item} isLoading={isStatusFirstLoading} />;
    case PublicationStatus.PublishedChildren:
      return <PublishedChildrenButton />;
    case PublicationStatus.Invalid:
      return <InvalidButton item={item} isLoading={isStatusFirstLoading} />;
    case PublicationStatus.Outdated:
      return <OutdatedButton item={item} isLoading={isStatusFirstLoading} />;
    case PublicationStatus.ItemTypeNotAllowed:
      return <NotAllowedItemTypeButton />;
    default:
      console.error(`The status "${status}" is unknown.`);
      return undefined;
  }
};

export default PublicationButtonSelector;
