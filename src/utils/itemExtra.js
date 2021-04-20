import PropTypes from 'prop-types';
import { ITEM_TYPES } from '../config/constants';

export const getFileExtra = (extra) => extra?.[ITEM_TYPES.FILE];

export const buildFileExtra = (file) => ({ [ITEM_TYPES.FILE]: file });

export const getS3FileExtra = (extra) => extra?.[ITEM_TYPES.S3_FILE];

export const buildS3FileExtra = (s3File) => ({ [ITEM_TYPES.S3_FILE]: s3File });

export const getEmbeddedLinkExtra = (extra) => extra?.[ITEM_TYPES.LINK];

export const buildEmbeddedLinkExtra = (embeddedLink) => ({
  [ITEM_TYPES.LINK]: embeddedLink,
});

export const fileExtraPropTypes = PropTypes.shape({
  mimetype: PropTypes.string.isRequired,
});

export const s3FileExtraPropTypes = PropTypes.shape({
  contenttype: PropTypes.string.isRequired,
});

export const linkExtraPropTypes = PropTypes.shape({
  icons: PropTypes.arrayOf(PropTypes.string),
});
