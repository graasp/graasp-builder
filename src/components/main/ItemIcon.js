import React from 'react';
import PropTypes from 'prop-types';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { makeStyles } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import LinkIcon from '@material-ui/icons/Link';
import MovieIcon from '@material-ui/icons/Movie';
import ImageIcon from '@material-ui/icons/Image';
import {
  ITEM_TYPES,
  ITEMS_TABLE_ROW_ICON_COLOR,
  MIME_TYPES,
  ITEM_ICON_MAX_SIZE,
} from '../../config/constants';
import {
  getEmbeddedLinkExtra,
  getFileExtra,
  getS3FileExtra,
} from '../../utils/itemExtra';

const useStyles = makeStyles({
  imageIcon: {
    maxHeight: ITEM_ICON_MAX_SIZE,
    maxWidth: ITEM_ICON_MAX_SIZE,
  },
});

const ItemIcon = ({ name, type, extra }) => {
  const classes = useStyles();

  const mimetype =
    getFileExtra(extra)?.mimetype || getS3FileExtra(extra)?.contenttype;
  const icon = getEmbeddedLinkExtra(extra)?.icons?.[0];

  if (icon) {
    return <img className={classes.imageIcon} alt={name} src={icon} />;
  }

  let Icon = InsertDriveFileIcon;
  switch (type) {
    case ITEM_TYPES.FOLDER:
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
    case ITEM_TYPES.LINK: {
      Icon = LinkIcon;
      break;
    }
    default:
      break;
  }

  return <Icon style={{ color: ITEMS_TABLE_ROW_ICON_COLOR }} />;
};

ItemIcon.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  extra: PropTypes.oneOf([
    PropTypes.shape({
      file: PropTypes.shape({
        mimetype: PropTypes.string.isRequired,
      }),
    }),
    PropTypes.shape({
      s3File: PropTypes.shape({
        contenttype: PropTypes.string.isRequired,
      }),
    }),
    PropTypes.shape({
      embeddedLink: PropTypes.shape({
        icons: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  ]).isRequired,
};

export default ItemIcon;
