import { PackedItem } from '@graasp/sdk';

import { usePublicationStatus } from '@/components/hooks/usePublicationStatus';
import { PublicationStatus, PublicationStatusMap } from '@/types/publication';

import InvalidButton from './InvalidButton';
import NotPublicButton from './NotPublicButton';
import OutdatedButton from './OutdatedButton';
import PendingButton from './PendingButton';
import PublishedButton from './PublishedButton';
import PublishedChildrenButton from './PublishedChildrenButton';
import ReadyToPublishButton from './ReadyToPublishButton';
import UnpublishedButton from './UnpublishedButton';

type PublicationButtonMap = PublicationStatusMap<JSX.Element>;

type Props = {
  item: PackedItem;
  notifyCoEditors: boolean;
};

type UsePublicationButton = {
  publicationButton: JSX.Element;
};

export const usePublicationButton = ({
  item,
  notifyCoEditors,
}: Props): UsePublicationButton => {
  const { status, isinitialLoading: isStatusFirstLoading } =
    usePublicationStatus({ item });

  const publicationButtonMap: PublicationButtonMap = {
    [PublicationStatus.Unpublished]: (
      <UnpublishedButton item={item} isLoading={isStatusFirstLoading} />
    ),
    [PublicationStatus.Pending]: <PendingButton />,
    [PublicationStatus.ReadyToPublish]: (
      <ReadyToPublishButton
        item={item}
        isLoading={isStatusFirstLoading}
        notifyCoEditors={notifyCoEditors}
      />
    ),
    [PublicationStatus.NotPublic]: <NotPublicButton item={item} />,
    [PublicationStatus.Published]: (
      <PublishedButton item={item} isLoading={isStatusFirstLoading} />
    ),
    [PublicationStatus.PublishedChildren]: <PublishedChildrenButton />,
    [PublicationStatus.Invalid]: (
      <InvalidButton item={item} isLoading={isStatusFirstLoading} />
    ),
    [PublicationStatus.Outdated]: (
      <OutdatedButton item={item} isLoading={isStatusFirstLoading} />
    ),
  };

  return { publicationButton: publicationButtonMap[status] };
};

export default usePublicationButton;
