import React from 'react';
import PropTypes from 'prop-types';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import MovieIcon from '@material-ui/icons/Movie';
import ImageIcon from '@material-ui/icons/Image';
import {
  ITEM_TYPES,
  ITEMS_TABLE_ROW_ICON_COLOR,
  MIME_TYPES,
} from '../../config/constants';

const ItemIcon = ({ type, mimetype }) => {
  let Icon = InsertDriveFileIcon;
  switch (type) {
    case ITEM_TYPES.SPACE:
      Icon = FolderIcon;
      break;
    case ITEM_TYPES.FILE:
    case ITEM_TYPES.S3_FILE: {
      if (MIME_TYPES.IMAGE.includes(mimetype)) {
        Icon = ImageIcon;
        break;
      }
      if (MIME_TYPES.VIDEO.includes(mimetype)) {
        Icon = MovieIcon;
        break;
      }
      if (MIME_TYPES.AUDIO.includes(mimetype)) {
        Icon = MusicNoteIcon;
        break;
      }
      if (MIME_TYPES.PDF.includes(mimetype)) {
        Icon = PictureAsPdfIcon;
        break;
      }

      Icon = InsertDriveFileIcon;
      break;
    }
    default:
      break;
  }

  return <Icon style={{ color: ITEMS_TABLE_ROW_ICON_COLOR }} />;
};

ItemIcon.propTypes = {
  type: PropTypes.string.isRequired,
  mimetype: PropTypes.string.isRequired,
};

export default ItemIcon;
