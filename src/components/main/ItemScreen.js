import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { Map, List } from 'immutable';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { useChildren, useItem } from '../../hooks';
import Items from './Items';
import { ITEM_SCREEN_ERROR_ALERT_ID } from '../../config/selectors';
import { ITEM_TYPES } from '../../config/constants';
import FileItem from '../item/FileItem';
import FileUploader from './FileUploader';
import S3FileItem from '../item/S3FileItem';
import ItemMain from '../item/ItemMain';
import LinkItem from '../item/LinkItem';

const useStyles = makeStyles(() => ({
  fileWrapper: {
    textAlign: 'center',
    background: 'lightgrey',
    height: '80vh',
    flexGrow: 1,
  },
}));

const ItemScreen = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { itemId } = useParams();

  const { data, isLoading } = useItem(itemId);
  const item = Map(data);

  // display children
  const { data: childrenRaw } = useChildren(itemId);
  const children = List(childrenRaw);

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
      case ITEM_TYPES.FOLDER:
        // display children
        return (
          <>
            <FileUploader />
            <Items title={item.get('name')} items={children} />
          </>
        );

      default:
        return (
          <Alert id={ITEM_SCREEN_ERROR_ALERT_ID} severity="error">
            {t('An error occured.')}
          </Alert>
        );
    }
  };

  // wait until all children are available
  if (isLoading) {
    return <CircularProgress color="primary" />;
  }

  if (!item || !item.get('id')) {
    return (
      <Alert id={ITEM_SCREEN_ERROR_ALERT_ID} severity="error">
        {t('An error occured.')}
      </Alert>
    );
  }

  return <ItemMain item={item}>{renderContent()}</ItemMain>;
};

export default ItemScreen;
