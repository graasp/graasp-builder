import { useState } from 'react';

import { DeleteForever } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { CHATBOX } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useChatboxTranslation } from '../../../config/i18n';
import {
  CLEAR_CHAT_CANCEL_BUTTON_ID,
  CLEAR_CHAT_CONFIRM_BUTTON_ID,
  CLEAR_CHAT_DIALOG_ID,
  CLEAR_CHAT_SETTING_ID,
} from '../../../config/selectors';
import { ButtonVariants } from '../../../enums';

type Props = {
  chatId: string;
  clearChat?: (chatId: string) => void;
  variant: ButtonVariants;
};

const ClearChatButton = ({
  chatId,
  clearChat,
  variant = ButtonVariants.Button,
}: Props): JSX.Element | null => {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { t } = useChatboxTranslation();

  if (!clearChat) {
    return null;
  }

  const handleClearChat = () => {
    clearChat(chatId);
  };

  const getContent = (contentType: ButtonVariants) => {
    const text = t(CHATBOX.CLEAR_ALL_CHAT);

    switch (contentType) {
      case ButtonVariants.IconButton:
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
      case ButtonVariants.Button:
      default:
        return (
          <Button
            id={CLEAR_CHAT_SETTING_ID}
            startIcon={<DeleteForever />}
            variant="outlined"
            color="error"
            onClick={() => setOpenConfirmation(true)}
          >
            {text}
          </Button>
        );
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box width="max-content">{getContent(variant)}</Box>
        <Typography variant="body1" textAlign="center">
          {t(
            'Careful, this will delete all the messages in this item. Make sure you have a backup. You can download a backup from export from Graasp Analytics.',
          )}
        </Typography>
      </Stack>
      <Dialog open={openConfirmation} id={CLEAR_CHAT_DIALOG_ID}>
        <DialogTitle>{t(CHATBOX.CLEAR_ALL_CHAT_TITLE)}</DialogTitle>
        <DialogContent>
          <Stack flexDirection="column" alignItems="center" spacing={1}>
            <Typography textAlign="justify">
              {t(CHATBOX.CLEAR_ALL_CHAT_CONTENT)}
            </Typography>
            <Typography>
              {t(
                'You can download a backup from export from Graasp Analytics.',
              )}
            </Typography>
          </Stack>
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
            color="error"
            onClick={() => {
              setOpenConfirmation(false);
              handleClearChat();
            }}
          >
            {t(CHATBOX.CLEAR_ALL_CHAT)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClearChatButton;
