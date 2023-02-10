import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { PermissionLevel } from '@graasp/sdk';
import { ChatMessage, ItemRecord, MessageBodyType } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks, useMutation } from '../../config/queryClient';
import { CHATBOX_ID, CHATBOX_INPUT_BOX_ID } from '../../config/selectors';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const { useItemChat, useMembers, useAvatar, useItemMemberships } = hooks;

type Props = {
  item: ItemRecord;
};

const Chatbox = ({ item }: Props): JSX.Element => {
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const { data: members, isLoading: isMembersLoading } = useMembers(
    itemPermissions?.map((m) => m.memberId)?.toArray() || [],
  );
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentUserContext();
  const { mutate: sendMessage } = useMutation<
    unknown,
    unknown,
    Pick<ChatMessage, 'chatId'> & { body: MessageBodyType }
  >(MUTATION_KEYS.POST_ITEM_CHAT_MESSAGE);
  const { mutate: editMessage } = useMutation<
    unknown,
    unknown,
    Pick<ChatMessage, 'chatId' | 'id'> & { body: MessageBodyType }
  >(MUTATION_KEYS.PATCH_ITEM_CHAT_MESSAGE);
  const { mutate: deleteMessage } = useMutation<
    unknown,
    unknown,
    Pick<ChatMessage, 'chatId' | 'id'>
  >(MUTATION_KEYS.DELETE_ITEM_CHAT_MESSAGE);

  if (
    isChatLoading ||
    isMembersLoading ||
    isLoadingItemPermissions ||
    isLoadingCurrentMember
  ) {
    return <Loader />;
  }

  // only show export chat when user has admin right on the item
  const isAdmin =
    itemPermissions?.find((perms) => perms.memberId === currentMember.id)
      ?.permission === PermissionLevel.Admin;

  return (
    <GraaspChatbox
      id={CHATBOX_ID}
      lang={currentMember.extra?.lang}
      members={members}
      sendMessageBoxId={CHATBOX_INPUT_BOX_ID}
      currentMember={currentMember}
      chatId={item.id}
      messages={chat?.messages}
      showAdminTools={isAdmin}
      sendMessageFunction={sendMessage}
      deleteMessageFunction={deleteMessage}
      editMessageFunction={editMessage}
      useAvatarHook={useAvatar}
    />
  );
};

export default Chatbox;
