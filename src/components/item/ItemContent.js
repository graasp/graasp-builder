import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
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
import {
  buildFileItemId,
  buildItemsTableId,
  buildS3FileItemId,
  buildSaveButtonId,
  DOCUMENT_ITEM_TEXT_EDITOR_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
} from '../../config/selectors';
import { ITEM_KEYS, ITEM_TYPES, APP_MODES } from '../../enums';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';
import { API_HOST, ITEM_DEFAULT_HEIGHT } from '../../config/constants';
import { LayoutContext } from '../context/LayoutContext';
import FileUploader from '../main/FileUploader';
import Items from '../main/Items';
import { buildDocumentExtra, getDocumentExtra } from '../../utils/itemExtra';
import NewItemButton from '../main/NewItemButton';
import { CurrentUserContext } from '../context/CurrentUserContext';

const { useChildren, useFileContent, useS3FileContent } = hooks;

const useStyles = makeStyles(() => ({
  fileWrapper: {
    textAlign: 'center',
    height: '80vh',
    flexGrow: 1,
  },
}));

const ItemContent = ({ item, enableEdition }) => {
  const classes = useStyles();
  const itemId = item.get(ITEM_KEYS.ID);
  const itemType = item?.get(ITEM_KEYS.TYPE);
  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const { editingItemId, setEditingItemId } = useContext(LayoutContext);

  // provide user to app
  const { data: user, isLoading: isLoadingUser } = useContext(
    CurrentUserContext,
  );

  // display children
  const { data: children, isLoading: isLoadingChildren } = useChildren(itemId, {
    ordered: true,
  });
  const id = item?.get(ITEM_KEYS.ID);

  const { data: content, isLoading: isLoadingFileContent } = useFileContent(
    id,
    {
      enabled: item && itemType === ITEM_TYPES.FILE,
    },
  );
  const {
    data: s3Content,
    isLoading: isLoadingS3FileContent,
  } = useS3FileContent(id, {
    enabled: itemType === ITEM_TYPES.S3_FILE,
  });
  const isEditing = enableEdition && editingItemId === itemId;

  if (
    isLoadingFileContent ||
    isLoadingS3FileContent ||
    isLoadingUser ||
    isLoadingChildren
  ) {
    return <Loader />;
  }

  if (!item || !itemId) {
    return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }

  const onSaveCaption = (caption) => {
    // edit item only when description has changed
    if (caption !== item.get('description')) {
      editItem({ id: itemId, description: caption });
    }
    setEditingItemId(null);
  };

  const onSaveDocument = (text) => {
    // edit item only when description has changed
    if (text !== getDocumentExtra(item?.get('extra')).content) {
      editItem({ id: itemId, extra: buildDocumentExtra({ content: text }) });
    }
    setEditingItemId(null);
  };

  const saveButtonId = buildSaveButtonId(itemId);

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
            editCaption={isEditing}
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
            height={ITEM_DEFAULT_HEIGHT}
          />
        </div>
      );
    case ITEM_TYPES.DOCUMENT:
      return (
        <div className={classes.fileWrapper}>
          <DocumentItem
            id={DOCUMENT_ITEM_TEXT_EDITOR_ID}
            item={item}
            edit={isEditing}
            onSave={onSaveDocument}
            saveButtonId={saveButtonId}
          />
        </div>
      );
    case ITEM_TYPES.APP:
      return (
        <AppItem
          item={item}
          apiHost={API_HOST} // todo: to change
          editCaption={isEditing}
          onSaveCaption={onSaveCaption}
          saveButtonId={saveButtonId}
          user={user}
          height={ITEM_DEFAULT_HEIGHT}
          mode={enableEdition ? APP_MODES.TEACHER : APP_MODES.STUDENT}
        />
      );
    case ITEM_TYPES.FOLDER:
      return (
        <>
          <FileUploader />
          <Items
            id={buildItemsTableId(itemId)}
            title={item.get('name')}
            items={children}
            isEditing={isEditing}
            onSaveCaption={onSaveCaption}
            headerElements={
              enableEdition ? [<NewItemButton fontSize="small" />] : undefined
            }
          />
        </>
      );

    default:
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
  }
};

ItemContent.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  enableEdition: PropTypes.bool,
};

ItemContent.defaultProps = {
  enableEdition: false,
};

export default ItemContent;
