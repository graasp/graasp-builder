import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Map, List } from 'immutable';
import { Loader } from '@graasp/ui';
import { hooks, useMutation } from '../../config/queryClient';
import { HEADER_HEIGHT } from '../../config/constants';
import { CHATBOX_INPUT_BOX_ID, CHATBOX_ID } from '../../config/selectors';
import { CurrentUserContext } from '../context/CurrentUserContext';

const { useItemChat, useMembers, useAvatar } = hooks;

const Chatbox = ({ item }) => {
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.get('id'));
  const { data: members, isLoading: isMembersLoading } = useMembers([
    ...new Set(chat?.get('messages')?.map(({ creator }) => creator)),
  ]);
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

  if (isChatLoading || isLoadingCurrentMember || isMembersLoading) {
    return <Loader />;
  }

  return (
    <GraaspChatbox
      id={CHATBOX_ID}
      members={members}
      sendMessageBoxId={CHATBOX_INPUT_BOX_ID}
      currentMember={currentMember}
      chatId={item.get('id')}
      messages={List(chat?.get('messages'))}
      height={window.innerHeight - HEADER_HEIGHT * 2}
      sendMessageFunction={sendMessage}
      deleteMessageFunction={deleteMessage}
      editMessageFunction={editMessage}
      useAvatarHook={useAvatar}
    />
  );
};

Chatbox.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default Chatbox;
