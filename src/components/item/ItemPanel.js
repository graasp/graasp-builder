import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { Map } from 'immutable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withTranslation } from 'react-i18next';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import CloseIcon from '@material-ui/icons/Close';
import TableRow from '@material-ui/core/TableRow';
import { IconButton, Toolbar, Typography, withStyles } from '@material-ui/core';
import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import { formatDate } from '../../utils/date';
import {
  ITEM_PANEL_ID,
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
} from '../../config/selectors';
import { getFileExtra, getS3FileExtra } from '../../utils/itemExtra';
import ItemSettings from './settings/ItemSettings';

const styles = (theme) => ({
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
});

class ItemPanel extends Component {
  static propTypes = {
    item: PropTypes.instanceOf(Map).isRequired,
    classes: PropTypes.shape({
      extra: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      closeButton: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    selectedChild: PropTypes.shape({}),
    open: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    selectedChild: null,
  };

  renderItemContent = (item) => {
    const { t, classes } = this.props;

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
      <>
        <Typography
          id={ITEM_PANEL_NAME_ID}
          variant="h5"
          className={classes.name}
        >
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
                <TableCell align="right">{item.get('creator')}</TableCell>
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
      </>
    );
  };

  render() {
    const { classes, selectedChild, item, open } = this.props;

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
        {!selectedChild && this.renderItemContent(item)}
        {selectedChild && this.renderItemContent(selectedChild)}

        <ItemSettings />
      </Drawer>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(ItemPanel);
const TranslatedComponent = withTranslation()(StyledComponent);
export default TranslatedComponent;
