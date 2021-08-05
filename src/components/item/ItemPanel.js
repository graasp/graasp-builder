/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Chatbox from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import Drawer from '@material-ui/core/Drawer';
import { Map } from 'immutable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useTranslation } from 'react-i18next';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import { formatDate } from '../../utils/date';
import {
  ITEM_PANEL_ID,
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
} from '../../config/selectors';
import { getFileExtra, getS3FileExtra } from '../../utils/itemExtra';
import { hooks, useMutation, ws } from '../../config/queryClient';

const { useMember, useItemChat } = hooks;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: RIGHT_MENU_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: RIGHT_MENU_WIDTH,
  },
  table: {
    padding: theme.spacing(2),
  },
  extra: {
    wordBreak: 'break-all',
  },
  name: {
    wordBreak: 'break-word',
  },
}));

const ItemPanel = ({ item, open }) => {
  const { t } = useTranslation();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { data: creator } = useMember(item.get('creator'));

  let type = null;
  let size = null;
  if (item.get(ITEM_KEYS.TYPE) === ITEM_TYPES.S3_FILE) {
    const extra = getS3FileExtra(item.get('extra'));
    ({ contenttype: type, size } = extra);
  } else if (item.get(ITEM_KEYS.TYPE) === ITEM_TYPES.FILE) {
    const extra = getFileExtra(item.get('extra'));
    ({ mimetype: type, size } = extra);
  } else {
    type = item.get(ITEM_KEYS.TYPE);
  }
  const { data: chat, isLoading: isChatLoading } = useItemChat(item.get('id'));
  ws.hooks.useItemChatUpdates(item.get('id'));

  const { mutate: sendMessage } = useMutation(
    MUTATION_KEYS.POST_ITEM_CHAT_MESSAGE,
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Drawer
      id={ITEM_PANEL_ID}
      anchor="right"
      variant="persistent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={open}
    >
      <Toolbar />
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab label="Data" {...a11yProps(0)} />
        <Tab label="Chat" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography
          id={ITEM_PANEL_NAME_ID}
          variant="h5"
          className={classes.name}
        >
          {item.get('name')}
        </Typography>
        <TableContainer className={classes.table}>
          <Table
            id={ITEM_PANEL_TABLE_ID}
            size="small"
            aria-label="item panel table"
          >
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  {t('Type')}
                </TableCell>
                <TableCell align="right">{type}</TableCell>
              </TableRow>
              {size && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {t('Size')}
                  </TableCell>
                  <TableCell align="right">{size}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell align="left">{t('Creator')}</TableCell>
                <TableCell align="right">{creator?.get('name')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t('Created At')}</TableCell>
                <TableCell align="right">
                  {formatDate(item.get('createdAt'))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">{t('Updated At')}</TableCell>
                <TableCell align="right">
                  {formatDate(item.get('updatedAt'))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {!isChatLoading && (
          <Chatbox
            chatId={item.get('id')}
            messages={chat?.get('messages')}
            height={window.innerHeight - 250}
            sendMessageFunction={sendMessage}
          />
        )}
      </TabPanel>
    </Drawer>
  );
};

ItemPanel.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  open: PropTypes.bool.isRequired,
};

export default ItemPanel;
