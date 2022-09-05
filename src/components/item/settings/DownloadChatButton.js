import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { CSVLink as CsvLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GetApp } from '@material-ui/icons';

import { Button } from '@graasp/ui';
import { normalizeMentions } from '@graasp/chatbox';

import { hooks } from '../../../config/queryClient';

import { EXPORT_CSV_HEADERS } from '../../../config/constants';
import { DOWNLOAD_CHAT_BUTTON_ID } from '../../../config/selectors';

import { BUTTON_VARIANTS } from '../../../enums';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    width: 'fit-content',
  },
});

// todo: convert this into a backend call
const DownloadChatButton = ({ chatId, variant }) => {
  const [filename, setFilename] = useState('');
  const { t } = useTranslation();
  const classes = useStyles();

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
      case BUTTON_VARIANTS.ICON:
        return (
          <Tooltip title={contentText}>
            <IconButton>
              <GetApp color="primary" />
            </IconButton>
          </Tooltip>
        );
      case BUTTON_VARIANTS.BUTTON:
        return <Button variant="outlined">{contentText}</Button>;
      default:
        return null;
    }
  };

  return (
    <CsvLink
      id={DOWNLOAD_CHAT_BUTTON_ID}
      // add a property to pass the fileName
      // this property will have a value after clicking the button
      data-cy-filename={filename}
      className={classes.link}
      headers={EXPORT_CSV_HEADERS}
      data={csvMessages}
      filename={filename}
      asyncOnClick
      onClick={onClick}
      // this removes the BOM for better parsing
      uFEFF={false}
    >
      {getContent(variant)}
    </CsvLink>
  );
};

DownloadChatButton.propTypes = {
  chatId: PropTypes.string.isRequired,
  variant: PropTypes.oneOf([BUTTON_VARIANTS.BUTTON, BUTTON_VARIANTS.ICON]),
};

DownloadChatButton.defaultProps = {
  variant: BUTTON_VARIANTS.ICON,
};

export default DownloadChatButton;
