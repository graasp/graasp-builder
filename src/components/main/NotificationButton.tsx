import { MentionButton } from '@graasp/chatbox';

import { hooks, mutations } from '../../config/queryClient';

export const NotificationButton = (): JSX.Element | null => {
  const { data: currentMember } = hooks.useCurrentMember();
  const memberId = currentMember?.get('id');

  // mutations to handle the mentions
  const { mutate: patchMentionMutate } = mutations.usePatchMention();
  const { mutate: deleteMentionMutate } = mutations.useDeleteMention();
  const { mutate: clearAllMentionsMutate } = mutations.useClearMentions();

  if (!memberId) {
    return null;
  }

  const patchMentionFunction = ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }) => patchMentionMutate({ memberId, id, status });
  const deleteMentionFunction = (mentionId: string) =>
    deleteMentionMutate(mentionId);
  const clearAllMentionsFunction = () => clearAllMentionsMutate();

  return (
    <MentionButton
      color="secondary"
      badgeColor="primary"
      useMentions={hooks.useMentions}
      patchMentionFunction={patchMentionFunction}
      deleteMentionFunction={deleteMentionFunction}
      clearAllMentionsFunction={clearAllMentionsFunction}
    />
  );
};

export default NotificationButton;
