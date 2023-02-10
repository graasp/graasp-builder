import { GetApp } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography, styled } from '@mui/material';

import { useState } from 'react';
import { CSVLink as CsvLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { normalizeMentions } from '@graasp/chatbox';
import { Button } from '@graasp/ui';

import { EXPORT_CSV_HEADERS } from '../../../config/constants';
import { hooks } from '../../../config/queryClient';
import { DOWNLOAD_CHAT_BUTTON_ID } from '../../../config/selectors';
import { ButtonVariants } from '../../../enums/chatbox';

const StyledCSVLink = styled(CsvLink)({
  textDecoration: 'none',
  width: 'fit-content',
});

type Props = {
  chatId: string;
  variant?: ButtonVariants;
  showInfo?: boolean;
};

// todo: convert this into a backend call
const DownloadChatButton = ({
  chatId,
  variant = ButtonVariants.ICON,
  showInfo = true,
}: Props): JSX.Element => {
  const [filename, setFilename] = useState('');
  const { t } = useTranslation();

  const { data: exportedChat, isLoading } = hooks.useExportItemChat(chatId);

  if (!chatId || isLoading || !exportedChat) {
    return null;
  }

  // generate file name when user clicks on the button
  const onClick = () => {
    // get only YYYY-MM-DD date format
    const currentDate = new Date().toISOString().split('T')[0];
    setFilename(`${currentDate}_chat_${chatId}.csv`);
  };
  const csvMessages = exportedChat.messages
    ?.map((message) => ({
      ...message.toJS(),
      body: normalizeMentions(message.body),
    }))
    .toArray();
  // render nothing if there is no data
  if (!csvMessages || !csvMessages.length) {
    return null;
  }

  const getContent = (contentVariant) => {
    const contentText = t('Download Chat');
    switch (contentVariant) {
      case ButtonVariants.ICON:
        return (
          <Tooltip title={contentText}>
            <IconButton>
              <GetApp color="primary" />
            </IconButton>
          </Tooltip>
        );
      case ButtonVariants.BUTTON:
        return (
          <Button variant="outlined" startIcon={<GetApp />}>
            {contentText}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <StyledCSVLink
        id={DOWNLOAD_CHAT_BUTTON_ID}
        // add a property to pass the fileName
        // this property will have a value after clicking the button
        data-cy-filename={filename}
        headers={EXPORT_CSV_HEADERS}
        data={csvMessages}
        filename={filename}
        asyncOnClick
        onClick={onClick}
        // this removes the BOM for better parsing
        uFEFF={false}
      >
        {getContent(variant)}
      </StyledCSVLink>
      {showInfo && (
        <Typography variant="body1">
          {t('Download the chat to CSV format.')}
        </Typography>
      )}
    </Stack>
  );
};

export default DownloadChatButton;
