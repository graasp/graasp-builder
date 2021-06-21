import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { Map } from 'immutable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { useTranslation } from 'react-i18next';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import CloseIcon from '@material-ui/icons/Close';
import TableRow from '@material-ui/core/TableRow';
import { IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import { formatDate } from '../../utils/date';
import { getFileExtra, getS3FileExtra } from '../../utils/itemExtra';
import ItemSettings from './settings/ItemSettings';
import { hooks } from '../../config/queryClient';

const { useMember } = hooks;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: RIGHT_MENU_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: RIGHT_MENU_WIDTH,
    padding: theme.spacing(2),
  },
  extra: {
    wordBreak: 'break-all',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    width: 50,
  },
  name: {
    wordBreak: 'break-word',
  },
}));

const ItemPanel = ({ item, open }) => {
  const { t } = useTranslation();

  const classes = useStyles();

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
      <IconButton className={classes.closeButton}>
        <CloseIcon />
      </IconButton>
      <Typography id={ITEM_PANEL_NAME_ID} variant="h5" className={classes.name}>
        {item.get('name')}
      </Typography>
      <TableContainer>
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
      <ItemSettings />
    </Drawer>
  );
};

ItemPanel.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  open: PropTypes.bool.isRequired,
};

export default ItemPanel;
