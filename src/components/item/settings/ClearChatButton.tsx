import { useState } from 'react';

import { DeleteForever } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import { CHATBOX } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import {
  useBuilderTranslation,
  useChatboxTranslation,
} from '../../../config/i18n';
import {
  CLEAR_CHAT_CANCEL_BUTTON_ID,
  CLEAR_CHAT_CONFIRM_BUTTON_ID,
  CLEAR_CHAT_DIALOG_ID,
  CLEAR_CHAT_SETTING_ID,
} from '../../../config/selectors';

type Props = {
  chatId: string;
};

const ClearChatButton = ({ chatId }: Props): JSX.Element | null => {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { t } = useChatboxTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: clearChat } = mutations.useClearItemChat();

  const handleClearChat = () => {
    clearChat(chatId);
  };

  return (
    <>
      <Stack direction="column" spacing={2}>
        <Box width="max-content">
          <Button
            id={CLEAR_CHAT_SETTING_ID}
            startIcon={<DeleteForever />}
            variant="outlined"
            color="error"
            onClick={() => setOpenConfirmation(true)}
          >
            <Typography noWrap>{t(CHATBOX.CLEAR_ALL_CHAT)}</Typography>
          </Button>
        </Box>
      </Stack>
      <Dialog open={openConfirmation} id={CLEAR_CHAT_DIALOG_ID}>
        <DialogTitle>{t(CHATBOX.CLEAR_ALL_CHAT_TITLE)}</DialogTitle>
        <DialogContent>
          <Stack flexDirection="column" alignItems="center" spacing={1}>
            <Typography textAlign="justify">
              {t(CHATBOX.CLEAR_ALL_CHAT_CONTENT)}
            </Typography>
            <Typography>
              {translateBuilder(BUILDER.ITEM_SETTINGS_CLEAR_CHAT_BACKUP_TEXT)}
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
