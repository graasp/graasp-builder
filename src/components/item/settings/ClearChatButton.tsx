import { DeleteForever } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { useState } from 'react';

import buildI18n, { CHATBOX, namespaces } from '@graasp/translations';
import { Button } from '@graasp/ui';

import {
  CLEAR_CHAT_CANCEL_BUTTON_ID,
  CLEAR_CHAT_CONFIRM_BUTTON_ID,
  CLEAR_CHAT_DIALOG_ID,
  CLEAR_CHAT_SETTING_ID,
} from '../../../config/selectors';
import { ButtonVariants } from '../../../enums/chatbox';
import DownloadChatButton from './DownloadChatButton';

type Props = {
  chatId: string;
  clearChat?: (chatId: string) => void;
  variant: ButtonVariants;
};

const ClearChatButton = ({
  chatId,
  clearChat,
  variant = ButtonVariants.BUTTON,
}: Props): JSX.Element => {
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
      case ButtonVariants.ICON:
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
      case ButtonVariants.BUTTON:
      default:
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
            <DownloadChatButton
              variant={ButtonVariants.BUTTON}
              chatId={chatId}
            />
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

export default ClearChatButton;
