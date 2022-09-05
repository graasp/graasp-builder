import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { DeleteForever } from '@material-ui/icons';

import buildI18n, { CHATBOX, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';
import {
  CLEAR_CHAT_SETTING_ID,
  CLEAR_CHAT_CANCEL_BUTTON_ID,
  CLEAR_CHAT_CONFIRM_BUTTON_ID,
  CLEAR_CHAT_DIALOG_ID,
} from '../../../config/selectors';

import DownloadChatButton from './DownloadChatButton';
import { BUTTON_VARIANTS } from '../../../enums';

const ClearChatButton = ({ chatId, clearChat, variant }) => {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { t } = buildI18n(namespaces.chatbox);

  if (!clearChat) {
    return null;
  }

  const handleClearChat = () => {
    clearChat(chatId);
  };

  const getContent = (contentType) => {
    const text = t(CHATBOX.CLEAR_ALL_CHAT);

    switch (contentType) {
      case BUTTON_VARIANTS.ICON:
        return (
          <Tooltip title={text}>
            <IconButton
              id={CLEAR_CHAT_SETTING_ID}
              onClick={() => setOpenConfirmation(true)}
            >
              <DeleteForever color="primary" />
            </IconButton>
          </Tooltip>
        );
      default:
      case BUTTON_VARIANTS.BUTTON:
        return (
          <Button
            id={CLEAR_CHAT_SETTING_ID}
            startIcon={<DeleteForever color="secondary" />}
            variant="contained"
            color="primary"
            onClick={() => setOpenConfirmation(true)}
          >
            {text}
          </Button>
        );
    }
  };

  return (
    <div>
      {getContent(variant)}
      <Dialog open={openConfirmation} id={CLEAR_CHAT_DIALOG_ID}>
        <DialogTitle>{t(CHATBOX.CLEAR_ALL_CHAT_TITLE)}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography>{t(CHATBOX.CLEAR_ALL_CHAT_CONTENT)}</Typography>
            <DownloadChatButton variant="button" chatId={chatId} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            id={CLEAR_CHAT_CANCEL_BUTTON_ID}
            variant="contained"
            onClick={() => {
              setOpenConfirmation(false);
            }}
          >
            {t(CHATBOX.CANCEL_BUTTON)}
          </Button>
          <Button
            id={CLEAR_CHAT_CONFIRM_BUTTON_ID}
            variant="outlined"
            onClick={() => {
              setOpenConfirmation(false);
              handleClearChat();
            }}
          >
            {t(CHATBOX.CLEAR_ALL_CHAT)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ClearChatButton.propTypes = {
  chatId: PropTypes.string.isRequired,
  clearChat: PropTypes.func.isRequired,
  // exportChat: PropTypes.func.isRequired,
  variant: PropTypes.oneOf([BUTTON_VARIANTS.ICON, BUTTON_VARIANTS.BUTTON]),
};

ClearChatButton.defaultProps = {
  variant: BUTTON_VARIANTS.BUTTON,
};

export default ClearChatButton;
