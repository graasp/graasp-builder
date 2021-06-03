import PropTypes from 'prop-types';
import { ITEM_TYPES } from '../enums';
import { getItemLoginTag } from './itemTag';

export const getFileExtra = (extra) => extra?.[ITEM_TYPES.FILE];

export const buildFileExtra = (file) => ({ [ITEM_TYPES.FILE]: file });

export const getS3FileExtra = (extra) => extra?.[ITEM_TYPES.S3_FILE];

export const buildS3FileExtra = (s3File) => ({ [ITEM_TYPES.S3_FILE]: s3File });

export const getEmbeddedLinkExtra = (extra) => extra?.[ITEM_TYPES.LINK];

export const buildEmbeddedLinkExtra = (embeddedLink) => ({
  [ITEM_TYPES.LINK]: embeddedLink,
});

export const buildShortcutExtra = (target) => ({
  [ITEM_TYPES.SHORTCUT]: { target },
});

export const getShortcutTarget = (extra) =>
  extra?.[ITEM_TYPES.SHORTCUT]?.target;

export const fileExtraPropTypes = PropTypes.shape({
  mimetype: PropTypes.string.isRequired,
});

export const s3FileExtraPropTypes = PropTypes.shape({
  contenttype: PropTypes.string.isRequired,
});

export const linkExtraPropTypes = PropTypes.shape({
  icons: PropTypes.arrayOf(PropTypes.string),
});

export const buildItemLoginSchemaExtra = (schema) => {
  if (schema) {
    return {
      itemLogin: { loginSchema: schema },
    };
  }

  // remove setting
  return {
    itemLogin: {},
  };
};

export const getItemLoginExtra = (extra) => extra?.itemLogin;

export const getItemLoginSchema = (extra) =>
  getItemLoginExtra(extra)?.loginSchema;

export const getItemLoginTagFromItem = ({ tags, itemTags }) => {
  const itemLoginTagId = getItemLoginTag(tags)?.id;

  // the tag setting does not exist
  if (!itemLoginTagId) {
    return null;
  }

  return itemTags?.find(({ tagId }) => tagId === itemLoginTagId);
};

export const buildDocumentExtra = (text) => ({
  [ITEM_TYPES.DOCUMENT]: text,
});

export const getDocumentExtra = (extra) => extra?.[ITEM_TYPES.DOCUMENT];

export const buildAppExtra = ({ url, settings = {} }) => ({
  [ITEM_TYPES.APP]: { url, settings },
});

export const getAppExtra = (extra) => extra?.[ITEM_TYPES.APP];
