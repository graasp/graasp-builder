import React from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import {
  FileItem,
  S3FileItem,
  DocumentItem,
  LinkItem,
  AppItem,
} from '@graasp/ui';
import { hooks } from '../../config/queryClient';
import Items from './Items';
import {
  buildFileItemId,
  buildS3FileItemId,
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
} from '../../config/selectors';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import FileUploader from './FileUploader';
import ItemMain from '../item/ItemMain';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import { API_HOST } from '../../config/constants';

const { useChildren, useItem, useFileContent, useS3FileContent } = hooks;

const useStyles = makeStyles(() => ({
  fileWrapper: {
    textAlign: 'center',
    background: 'lightgrey',
    height: '80vh',
    flexGrow: 1,
  },
}));

const ItemScreen = () => {
  const classes = useStyles();

  const { itemId } = useParams();

  const { data: item, isLoading } = useItem(itemId);

  // display children
  const { data: children, isLoading: isChildrenLoading } = useChildren(itemId);
  const itemType = item.get(ITEM_KEYS.TYPE);
  const id = item?.get(ITEM_KEYS.ID);

  const { data: content } = useFileContent(id, {
    enabled: item && itemType === ITEM_TYPES.FILE,
  });
  const { data: s3Content } = useS3FileContent(id, {
    enabled: itemType === ITEM_TYPES.S3_FILE,
  });

  const renderContent = () => {
    switch (itemType) {
      case ITEM_TYPES.FILE:
        return (
          <div className={classes.fileWrapper}>
            <FileItem
              id={buildFileItemId(itemId)}
              item={item}
              content={content}
            />
          </div>
        );
      case ITEM_TYPES.S3_FILE:
        return (
          <div className={classes.fileWrapper}>
            <S3FileItem
              id={buildS3FileItemId(itemId)}
              item={item}
              content={s3Content}
            />
          </div>
        );
      case ITEM_TYPES.LINK:
        return (
          <div className={classes.fileWrapper}>
            <LinkItem item={item} />
          </div>
        );
      case ITEM_TYPES.DOCUMENT:
        return <DocumentItem id={DOCUMENT_ITEM_TEXT_EDITOR_ID} item={item} />;
      case ITEM_TYPES.APP:
        return (
          <AppItem
            item={item}
            apiHost={API_HOST.substr('http://'.length)} // todo: to change
          />
        );
      case ITEM_TYPES.FOLDER:
        // wait until all children are available
        if (isChildrenLoading) {
          return <Loader />;
        }

        // display children
        return (
          <>
            <FileUploader />
            <Items title={item.get('name')} items={children} />
          </>
        );

      default:
        return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!item || !id) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return <ItemMain item={item}>{renderContent()}</ItemMain>;
};

export default ItemScreen;
