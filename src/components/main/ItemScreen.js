import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import {
  FileItem,
  S3FileItem,
  DocumentItem,
  LinkItem,
  AppItem,
} from '@graasp/ui';
import { MUTATION_KEYS } from '@graasp/query-client';
import { hooks, useMutation } from '../../config/queryClient';
import Items from './Items';
import {
  buildFileItemId,
  buildS3FileItemId,
  buildSaveButtonId,
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
} from '../../config/selectors';
import { ITEM_KEYS, ITEM_TYPES } from '../../enums';
import FileUploader from './FileUploader';
import ItemMain from '../item/ItemMain';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import { API_HOST } from '../../config/constants';
import { ItemLayoutModeContext } from '../context/ItemLayoutModeContext';

const { useChildren, useItem, useFileContent, useS3FileContent } = hooks;

const useStyles = makeStyles(() => ({
  fileWrapper: {
    textAlign: 'center',
    height: '80vh',
    flexGrow: 1,
  },
}));

const ItemScreen = () => {
  const classes = useStyles();
  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const { itemId } = useParams();
  const { editingItemId, setEditingItemId } = useContext(ItemLayoutModeContext);

  const { data: item, isLoading, isError } = useItem(itemId);
  const itemType = item?.get(ITEM_KEYS.TYPE);

  // display children
  const { data: children, isLoading: isChildrenLoading } = useChildren(itemId);
  const id = item?.get(ITEM_KEYS.ID);

  const { data: content } = useFileContent(id, {
    enabled: item && itemType === ITEM_TYPES.FILE,
  });
  const { data: s3Content } = useS3FileContent(id, {
    enabled: itemType === ITEM_TYPES.S3_FILE,
  });
  const isEditing = editingItemId === itemId;

  const onSaveCaption = (caption) => {
    // edit item only when description has changed
    if (caption !== item.get('description')) {
      editItem({ id: itemId, description: caption });
    }
    setEditingItemId(null);
  };

  const saveButtonId = buildSaveButtonId(itemId);

  const renderContent = () => {
    switch (itemType) {
      case ITEM_TYPES.FILE:
        return (
          <div className={classes.fileWrapper}>
            <FileItem
              id={buildFileItemId(itemId)}
              editCaption={isEditing}
              item={item}
              content={content}
              onSaveCaption={onSaveCaption}
              saveButtonId={saveButtonId}
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
              onSaveCaption={onSaveCaption}
              saveButtonId={saveButtonId}
            />
          </div>
        );
      case ITEM_TYPES.LINK:
        return (
          <div className={classes.fileWrapper}>
            <LinkItem
              item={item}
              editCaption={isEditing}
              onSaveCaption={onSaveCaption}
              saveButtonId={saveButtonId}
            />
          </div>
        );
      case ITEM_TYPES.DOCUMENT:
        return <DocumentItem id={DOCUMENT_ITEM_TEXT_EDITOR_ID} item={item} />;
      case ITEM_TYPES.APP:
        return (
          <AppItem
            item={item}
            apiHost={API_HOST} // todo: to change
            editCaption={isEditing}
            onSaveCaption={onSaveCaption}
            saveButtonId={saveButtonId}
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

  if (!item || !itemId || isError) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  return <ItemMain item={item}>{renderContent()}</ItemMain>;
};

export default ItemScreen;
