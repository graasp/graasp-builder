import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Record } from 'immutable';
import { Loader } from '@graasp/ui';
import { hooks, useMutation } from '../../config/queryClient';
import { CHATBOX_INPUT_BOX_ID, CHATBOX_ID } from '../../config/selectors';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { PERMISSION_LEVELS } from '../../enums';

const { useItemChat, useMembers, useAvatar, useItemMemberships } = hooks;

const Chatbox = ({ item }) => {
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.id);
  const { data: memberships } = useItemMemberships(item.id);
  const { data: members, isLoading: isMembersLoading } = useMembers(
    memberships?.map((m) => m.memberId)?.toArray() || [],
  );
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships(item.id);
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentUserContext);
  const { mutate: sendMessage } = useMutation(
    MUTATION_KEYS.POST_ITEM_CHAT_MESSAGE,
  );
  const { mutate: editMessage } = useMutation(
    MUTATION_KEYS.PATCH_ITEM_CHAT_MESSAGE,
  );
  const { mutate: deleteMessage } = useMutation(
    MUTATION_KEYS.DELETE_ITEM_CHAT_MESSAGE,
  );
  const { mutate: clearChat } = useMutation(MUTATION_KEYS.CLEAR_ITEM_CHAT);

  if (
    isChatLoading ||
    isLoadingCurrentMember ||
    isMembersLoading ||
    isLoadingItemPermissions
  ) {
    return <Loader />;
  }

  // only show export chat when user has admin right on the item
  const isAdmin =
    itemPermissions?.find((perms) => perms.memberId === currentMember.id)
      ?.permission === PERMISSION_LEVELS.ADMIN;
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
      clearChatFunction={clearChat}
      useAvatarHook={useAvatar}
    />
  );
};

Chatbox.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default Chatbox;
