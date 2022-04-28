import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Map, List } from 'immutable';
import { Loader } from '@graasp/ui';
import { hooks, useMutation } from '../../config/queryClient';
import { CHATBOX_INPUT_BOX_ID, CHATBOX_ID } from '../../config/selectors';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { PERMISSION_LEVELS } from '../../enums';
import { HEADER_HEIGHT } from '../../config/constants';

const { useItemChat, useMembers, useAvatar, useItemMemberships } = hooks;

const Chatbox = ({ item }) => {
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.get('id'));
  const { data: members, isLoading: isMembersLoading } = useMembers([
    ...new Set(chat?.get('messages')?.map(({ creator }) => creator)),
  ]);
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    useItemMemberships([item.get('id')]);
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
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(
    () => {
      const handleResize = () => {
        setWindowHeight(window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // cleanup eventListener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    // run on first render only
    [],
  );

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
    itemPermissions
      .get(0)
      ?.find((perms) => perms.memberId === currentMember.get('id'))
      ?.permission === PERMISSION_LEVELS.ADMIN;
  return (
    <GraaspChatbox
      id={CHATBOX_ID}
      members={members}
      sendMessageBoxId={CHATBOX_INPUT_BOX_ID}
      currentMember={currentMember}
      chatId={item.get('id')}
      messages={List(chat?.get('messages'))}
      height={windowHeight - HEADER_HEIGHT * 2}
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
  item: PropTypes.instanceOf(Map).isRequired,
};

export default Chatbox;
