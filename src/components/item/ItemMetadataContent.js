import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { useTranslation } from 'react-i18next';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { formatDate } from '../../utils/date';
import { hooks } from '../../config/queryClient';
import { getFileExtra, getS3FileExtra } from '../../utils/itemExtra';
import { LayoutContext } from '../context/LayoutContext';
import {
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
} from '../../config/selectors';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import ItemMemberships from './ItemMemberships';

const { useMember } = hooks;

const useStyles = makeStyles((theme) => ({
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

const ItemMetadataContent = ({ item }) => {
  const { t } = useTranslation();

  const classes = useStyles();
  const { setIsItemSharingOpen } = useContext(LayoutContext);
  const { data: creator } = useMember(item.get('creator'));

  const onClick = () => {
    setIsItemSharingOpen(true);
  };

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
      <Typography variant="h5" id={ITEM_PANEL_NAME_ID}>
        {item.get(ITEM_KEYS.NAME)}
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
      <ItemMemberships id={item.get('id')} maxAvatar={5} onClick={onClick} />
    </>
  );
};

ItemMetadataContent.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default ItemMetadataContent;
