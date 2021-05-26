import React from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { hooks } from '../../config/queryClient';
import Items from './Items';
import { ITEM_SCREEN_ERROR_ALERT_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../enums';
import FileItem from '../item/FileItem';
import FileUploader from './FileUploader';
import S3FileItem from '../item/S3FileItem';
import ItemMain from '../item/ItemMain';
import LinkItem from '../item/LinkItem';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import DocumentItem from '../item/DocumentItem';
import AppItem from '../item/AppItem';

const { useChildren, useItem } = hooks;

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

  const renderContent = () => {
    switch (item.get('type')) {
      case ITEM_TYPES.FILE:
        return (
          <div className={classes.fileWrapper}>
            <FileItem item={item} />
          </div>
        );
      case ITEM_TYPES.S3_FILE:
        return (
          <div className={classes.fileWrapper}>
            <S3FileItem item={item} />
          </div>
        );
      case ITEM_TYPES.LINK:
        return (
          <div className={classes.fileWrapper}>
            <LinkItem item={item} />
          </div>
        );
      case ITEM_TYPES.DOCUMENT:
        return <DocumentItem item={item} />;
      case ITEM_TYPES.APP:
        return <AppItem item={item} />;
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

  if (!item || !item.get('id')) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return <ItemMain item={item}>{renderContent()}</ItemMain>;
};

export default ItemScreen;
