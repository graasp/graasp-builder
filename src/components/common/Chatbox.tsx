import GraaspChatbox from '@graasp/chatbox';
import { PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { Loader } from '@graasp/ui';

import { hooks, mutations } from '../../config/queryClient';
import { CHATBOX_ID, CHATBOX_INPUT_BOX_ID } from '../../config/selectors';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const { useItemChat, useAvatar, useItemMemberships } = hooks;
const {
  usePostItemChatMessage,
  usePatchItemChatMessage,
  useDeleteItemChatMessage,
} = mutations;

type Props = {
  item: ItemRecord;
};

const Chatbox = ({ item }: Props): JSX.Element => {
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const members = itemPermissions?.map(({ member }) => member);
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentUserContext();
  const { mutate: sendMessage } = usePostItemChatMessage();
  const { mutate: editMessage } = usePatchItemChatMessage();
  const { mutate: deleteMessage } = useDeleteItemChatMessage();

  if (isChatLoading || isLoadingItemPermissions || isLoadingCurrentMember) {
    return <Loader />;
  }

  // only show export chat when user has admin right on the item
  const isAdmin =
    itemPermissions?.find((perms) => perms.member.id === currentMember.id)
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
