import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import GraaspChatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Map } from 'immutable';
import { Loader } from '@graasp/ui';
import { hooks, useMutation } from '../../config/queryClient';
import { HEADER_HEIGHT } from '../../config/constants';

const { useItemChat, useCurrentMember } = hooks;

const Chatbox = ({ item }) => {
  const { t } = useTranslation();
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.get('id'));
  const { data: currentMember, isLoadingCurrentMember } = useCurrentMember();
  const { mutate: sendMessage } = useMutation(
    MUTATION_KEYS.POST_ITEM_CHAT_MESSAGE,
  );

  const renderChatbox = () => {
    if (isChatLoading || isLoadingCurrentMember) {
      return <Loader />;
    }

    return (
      <GraaspChatbox
        currentMember={currentMember}
        chatId={item.get('id')}
        messages={chat?.get('messages')}
        height={window.innerHeight - HEADER_HEIGHT * 2}
        sendMessageFunction={sendMessage}
      />
    );
  };

  return (
    <>
      <Typography variant="h5">{t('Comments')}</Typography>
      {renderChatbox()}
    </>
  );
};

Chatbox.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default Chatbox;
