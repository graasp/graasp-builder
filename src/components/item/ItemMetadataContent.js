import { Record } from 'immutable';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { hooks } from '../../config/queryClient';
import {
  ITEM_PANEL_NAME_ID,
  ITEM_PANEL_TABLE_ID,
} from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import { formatDate } from '../../utils/date';
import { getFileExtra, getS3FileExtra } from '../../utils/itemExtra';
import { LayoutContext } from '../context/LayoutContext';
import ItemMemberships from './ItemMemberships';

const { useMember } = hooks;

const ItemMetadataContent = ({ item }) => {
  const { t } = useTranslation();

  const { setIsItemSharingOpen } = useContext(LayoutContext);
  const { data: creator } = useMember(item.creator);

  const onClick = () => {
    setIsItemSharingOpen(true);
  };

  let { type } = item;
  let size = null;
  if (type === ITEM_TYPES.S3_FILE) {
    const extra = getS3FileExtra(item.extra);
    ({ mimetype: type, size } = extra);
  } else if (type === ITEM_TYPES.FILE) {
    const extra = getFileExtra(item.extra);
    ({ mimetype: type, size } = extra);
  }

  const renderLink = () => {
    const buildTableRow = (link) => (
      <TableRow>
        <TableCell align="left">{t('Link')}</TableCell>
        <TableCell align="right">{link}</TableCell>
      </TableRow>
    );
    if (type === ITEM_TYPES.APP) {
      return buildTableRow(item.extra[ITEM_TYPES.APP].url);
    }
    if (type === ITEM_TYPES.LINK) {
      return buildTableRow(item.extra[ITEM_TYPES.LINK].url);
    }
    return null;
  };

  return (
    <>
      <TableContainer sx={{ p: 2 }}>
        <Typography variant="h5" id={ITEM_PANEL_NAME_ID} noWrap>
          {item.name}
        </Typography>
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
              <TableCell align="right">{creator?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">{t('Created At')}</TableCell>
              <TableCell align="right">{formatDate(item.createdAt)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">{t('Updated At')}</TableCell>
              <TableCell align="right">{formatDate(item.updatedAt)}</TableCell>
            </TableRow>
            {renderLink()}
          </TableBody>
        </Table>
      </TableContainer>
      <ItemMemberships id={item.id} maxAvatar={5} onClick={onClick} />
    </>
  );
};

ItemMetadataContent.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default ItemMetadataContent;
